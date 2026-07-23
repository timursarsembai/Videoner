import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { join, basename, resolve } from 'path';
import * as fs from 'fs';
import { createReadStream, statSync } from 'fs';
import { PrismaService } from '../prisma/prisma.service';
import { Response } from 'express';
import { VideoDownload } from '../../classes/VideoDownload';
import {
  DownloadStatus,
  Downloaders,
  DownloadSource,
  ErrorCategory,
} from '@prisma/client';
import {
  DownloadFormatOptions,
  DownloadQualityOptions,
  ProgressType,
  VideoFormat,
} from 'src/types';
import { Observable, Subject } from 'rxjs';
import { FacebookVideoQuality } from 'src/types/facebook';
import { YtdlpProcessService } from '../ytdlp/ytdlp-process.service';
import { YtdlpFormatService } from '../ytdlp/ytdlp-format.service';
import { getFileName } from 'src/lib/utils';
import { getVideoFormats } from 'src/lib/helper';
import { BotUserService } from '../analytics/bot-user.service';
import { categorizeError } from 'src/lib/error-category';
import { DAILY_FREE_DOWNLOAD_LIMIT } from 'src/lib/config';
import { isPaidVideoQuality } from './paid-quality';

export interface DownloadRequestMeta {
  telegramId?: number;
  telegramUsername?: string;
  telegramLanguageCode?: string;
  source?: DownloadSource;
  isPaid?: boolean;
  starsAmount?: number;
}

@Injectable()
export class DownloadService {
  private readonly downloadPath: string;

  // TOCTOU-защита для enforceWebLimits: без неё несколько параллельных вкладок
  // одного пользователя читают ОДИН И ТОТ ЖЕ freeUsed (запись Download ещё не
  // создана ни для одного из запросов), все проходят проверку лимита и создают
  // записи одновременно — дневной лимит можно пробить числом параллельных
  // вкладок. Единственный процесс Node на инстанс — простой promise-based
  // мьютекс по telegramId достаточен, распределённая блокировка не нужна.
  private webLimitLocks = new Map<number, Promise<unknown>>();

  private async withWebLimitLock<T>(telegramId: number, fn: () => Promise<T>): Promise<T> {
    const prior = this.webLimitLocks.get(telegramId) ?? Promise.resolve();
    const chained = prior.then(fn, fn);
    // marker — тот же объект промиса и в Map, и в сравнении ниже: если за
    // время выполнения fn() никто не встал в очередь следом за нами, запись
    // в Map всё ещё указывает ровно на marker, и её можно безопасно убрать.
    const marker = chained.catch(() => undefined);
    this.webLimitLocks.set(telegramId, marker);
    try {
      return await chained;
    } finally {
      if (this.webLimitLocks.get(telegramId) === marker) {
        this.webLimitLocks.delete(telegramId);
      }
    }
  }

  constructor(
    private prisma: PrismaService,
    private ytdlp: YtdlpProcessService,
    private ytdlpFormat: YtdlpFormatService,
    private botUser: BotUserService,
  ) {
    this.downloadPath = join(__dirname, '..', '..', '..', 'downloads');
    // Ensure downloads directory exists
    if (!fs.existsSync(this.downloadPath)) {
      fs.mkdirSync(this.downloadPath, { recursive: true });
    }
  }

  private async checkDurationLimit(url: string, req: Request) {
    const apiKey = (req as any).apiKey;
    const info = await this.ytdlpFormat.getYtdlpVideoInfo(url);

    if (info.duration > apiKey.maxDuration) {
      throw new BadRequestException(
        `Video duration (${Math.round(info.duration / 60)} minutes) exceeds the allowed limit (${Math.round(apiKey.maxDuration / 60)} minutes)`,
      );
    }

    return info;
  }

  // Тот же список качеств, что видит пользователь на /info (getPlatformFormats
  // в info.service.ts) — пересчитываем из уже полученного info, а не доверяем
  // клиенту, чтобы нельзя было обмануть исключение "720p бесплатен, если ниже
  // качеств нет вообще" (см. isPaidVideoQuality) поддельным списком.
  private getAvailableVideoQualities(info: any, platform: string): string[] {
    if (platform === 'facebook') {
      return [FacebookVideoQuality.hd, FacebookVideoQuality.sd];
    }
    return getVideoFormats(info);
  }

  // Те же ограничения для неподписанных, что и в боте (дневной лимит бесплатных
  // скачиваний + платное HD), но только для запросов с сайта (meta.source ===
  // WEB) — бот управляет своим гейтом сам (в т.ч. разовой оплатой HD за Stars,
  // о которой сервер ничего не знает), его трогать нельзя. telegramId для WEB
  // приходит уже проверенным из сессии (см. web/app/api/[...path]/route.ts),
  // а не как есть от браузера.
  private async enforceWebLimits(
    meta: DownloadRequestMeta,
    quality: string | undefined,
    info: any,
    platform: string,
    isVideo: boolean,
  ) {
    if (meta.source !== DownloadSource.WEB) return;

    if (!meta.telegramId) {
      throw new UnauthorizedException('Login required to download on the website');
    }

    const unlimited = await this.botUser.isUnlimited(meta.telegramId);
    if (unlimited) return;

    if (isVideo && quality) {
      const availableQualities = this.getAvailableVideoQualities(info, platform);
      if (isPaidVideoQuality(quality, availableQualities)) {
        throw new ForbiddenException('This quality requires an active subscription');
      }
    }

    const freeUsed = await this.botUser.countFreeDownloadsToday(meta.telegramId);
    if (freeUsed >= DAILY_FREE_DOWNLOAD_LIMIT) {
      throw new ForbiddenException('Daily free download limit reached');
    }
  }

  // filename приходит от клиента (публичный, без API-ключа) роутом — нельзя
  // доверять ему напрямую: `../../../etc/passwd` и т.п. дают чтение произвольных
  // файлов через path.join. basename() отбрасывает любые directory-компоненты,
  // resolve()-проверка — второй рубеж на случай экзотичных обходов basename.
  private resolveDownloadPath(filename: string): string {
    const safeName = basename(filename);
    const filePath = resolve(this.downloadPath, safeName);

    if (
      filePath !== this.downloadPath &&
      !filePath.startsWith(this.downloadPath + '/')
    ) {
      throw new BadRequestException('Invalid filename');
    }

    return filePath;
  }

  async getFile(
    filename: string,
    range?: string,
  ): Promise<{ stream: fs.ReadStream; headers: any }> {
    const filePath = this.resolveDownloadPath(filename);

    if (!fs.existsSync(filePath)) {
      throw new NotFoundException('File not found');
    }

    const stat = statSync(filePath);
    const fileSize = stat.size;
    // RFC 5987: filename* даёт браузеру корректное не-ASCII имя (кириллица,
    // эмодзи в заголовках видео), filename — запасной вариант для старых клиентов.
    const contentDisposition = `attachment; filename="download"; filename*=UTF-8''${encodeURIComponent(filename)}`;

    if (range) {
      const parts = range.replace(/bytes=/, '').split('-');
      const start = parseInt(parts[0], 10);
      const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;
      const chunkSize = end - start + 1;

      const stream = createReadStream(filePath, { start, end });
      const headers = {
        'Content-Range': `bytes ${start}-${end}/${fileSize}`,
        'Accept-Ranges': 'bytes',
        'Content-Length': chunkSize,
        'Content-Type': 'application/octet-stream',
        'Content-Disposition': contentDisposition,
      };

      return { stream, headers };
    }

    const stream = createReadStream(filePath);
    const headers = {
      'Content-Length': fileSize,
      'Content-Type': 'application/octet-stream',
      'Accept-Ranges': 'bytes',
      'Content-Disposition': contentDisposition,
    };

    return { stream, headers };
  }

  async getFileMetadata(filename: string) {
    const filePath = this.resolveDownloadPath(filename);

    if (!fs.existsSync(filePath)) {
      throw new NotFoundException('File not found');
    }

    const stat = statSync(filePath);
    return {
      size: stat.size,
      created: stat.birthtime,
      modified: stat.mtime,
      isFile: stat.isFile(),
      isDirectory: stat.isDirectory(),
    };
  }

  async createDownload(data: {
    originalUrl: string;
    downloader: Downloaders;
    filename: string;
    apiKeyId?: string;
    botUserId?: string;
    source?: DownloadSource;
    videoTitle?: string;
    videoDuration?: number;
    isPaid?: boolean;
    starsAmount?: number;
  }) {
    return this.prisma.download.create({
      data: {
        originalUrl: data.originalUrl,
        status: DownloadStatus.PENDING,
        downloader: data.downloader,
        filename: data.filename,
        apiKeyId: data.apiKeyId,
        botUserId: data.botUserId,
        source: data.source ?? DownloadSource.API,
        videoTitle: data.videoTitle,
        videoDuration: data.videoDuration,
        isPaid: data.isPaid ?? false,
        starsAmount: data.starsAmount,
      },
    });
  }

  async updateDownloadStatus(
    id: string,
    data: {
      status: DownloadStatus;
      downloadUrl?: string | null;
      fileSize?: bigint;
      errorCategory?: ErrorCategory;
    },
  ) {
    return this.prisma.download.update({
      where: { id },
      data,
    });
  }

  // Гвард ValidUrlGuard кладёт платформу строкой в нижнем регистре
  // ('youtube'|'facebook'|...), а в Prisma она хранится как enum в верхнем.
  // Раньше при несовпадении platform молча возвращал undefined — Prisma
  // трактует undefined как "поле не передано" и применяет
  // @default(YOUTUBE) из схемы, тихо искажая аналитику по платформам
  // без единой ошибки. Теперь падает явно — если это когда-нибудь
  // произойдёт (новая платформа в getPlatform() без соответствующего
  // значения в enum Downloaders), проблема будет видна сразу, а не через
  // недели в перекошенной статистике.
  private resolveDownloader(platform: string): Downloaders {
    const key = platform?.toUpperCase() as keyof typeof Downloaders;
    const downloader = Downloaders[key];
    if (!downloader) {
      throw new BadRequestException(`Unsupported platform: ${platform}`);
    }
    return downloader;
  }

  private async resolveBotUserId(
    meta?: DownloadRequestMeta,
  ): Promise<string | undefined> {
    if (!meta?.telegramId) return undefined;
    const botUser = await this.botUser.upsertBotUser({
      telegramId: meta.telegramId,
      username: meta.telegramUsername,
      languageCode: meta.telegramLanguageCode,
    });
    return botUser.id;
  }

  async getQuota(telegramId: number) {
    const [unlimited, freeUsed] = await Promise.all([
      this.botUser.isUnlimited(telegramId),
      this.botUser.countFreeDownloadsToday(telegramId),
    ]);
    return {
      unlimited,
      freeUsed,
      freeLimit: DAILY_FREE_DOWNLOAD_LIMIT,
      remaining: unlimited
        ? DAILY_FREE_DOWNLOAD_LIMIT
        : Math.max(0, DAILY_FREE_DOWNLOAD_LIMIT - freeUsed),
    };
  }

  async getDownloadStatus(downloadId: string) {
    try {
      const download = await this.prisma.download.findUnique({
        where: { id: downloadId },
      });

      if (!download) {
        throw new BadRequestException('Download not found');
      }

      return {
        status: download.status,
        downloadUrl: download.downloadUrl,
      };
    } catch (error) {
      console.error(error);
      throw new BadRequestException('Failed to get download status');
    }
  }

  async subscribeToProgress(downloadId: string, res: Response) {
    // Check download status first
    const download = await this.prisma.download.findUnique({
      where: { id: downloadId },
    });

    if (!download) {
      res.write(
        `data: ${JSON.stringify({ type: 'error', message: 'Download not found' })}\n\n`,
      );
      res.end();
      return;
    }

    // If download is already completed or failed, send the final status and end connection
    if (
      download.status === DownloadStatus.COMPLETED ||
      download.status === DownloadStatus.FAILED
    ) {
      const data = {
        type:
          download.status === DownloadStatus.COMPLETED ? 'complete' : 'error',
        ...(download.status === DownloadStatus.COMPLETED
          ? { downloadUrl: download.downloadUrl }
          : { message: 'Download failed' }),
      };
      res.write(`data: ${JSON.stringify(data)}\n\n`);
      res.end();
      return;
    }

    // For in-progress downloads, set up SSE connection
    VideoDownload.subscribeToProgress(downloadId, res);
  }

  createProgressSubject(
    downloadId: string,
    extension: string,
    filename: string,
  ) {
    return VideoDownload.createProgressSubject(downloadId, extension, filename);
  }

  ensureDownloadDirectory() {
    if (!fs.existsSync(this.downloadPath)) {
      fs.mkdirSync(this.downloadPath, { recursive: true });
    }
    return this.downloadPath;
  }

  // Общий обработчик отказа: раньше был продублирован (с мелкими различиями
  // в тексте лога) в 5+ местах внутри downloadVideo()/downloadAudio() — в
  // каждом RxJS error-хендлере, в catch вокруг convertVideo(), и в catch
  // после финального fs.unlinkSync/statSync (см. критический фикс 2026-07-23:
  // именно рассинхрон одной из этих копий с try/catch и был причиной
  // необработанного reject, ронявшего весь процесс). Один источник истины —
  // один способ сломать все места сразу заметно, а не тихо в одном из пяти.
  private async markDownloadFailed(
    downloadId: string,
    error: unknown,
    progressSubject: Subject<ProgressType | Error>,
  ) {
    console.error('Download failed:', error);
    const message = (error as any)?.message ?? String(error);
    await this.updateDownloadStatus(downloadId, {
      status: DownloadStatus.FAILED,
      downloadUrl: null,
      errorCategory: categorizeError(message),
    }).catch((e) => console.error('Failed to mark download as FAILED:', e));
    progressSubject.error(error);
  }

  // Общий "успешный финал" — статус COMPLETED + размер файла + завершение
  // SSE-подписки. Бросает при ошибке (например ENOENT, если CleanupService
  // успел удалить файл) — вызывающий код обязан обернуть в try/catch и
  // передать ошибку в markDownloadFailed, сам этот метод такую логику не
  // содержит, чтобы вызывающий мог сначала сделать что-то ещё (например,
  // удалить промежуточный файл конвертации) в рамках того же try.
  private async completeDownload(
    downloadId: string,
    downloadUrl: string,
    filePath: string,
    progressSubject: Subject<ProgressType | Error>,
  ) {
    await this.updateDownloadStatus(downloadId, {
      status: DownloadStatus.COMPLETED,
      downloadUrl,
      fileSize: BigInt(statSync(filePath).size),
    });
    progressSubject.complete();
  }

  // Общая подписка на прогресс скачивания (первый этап — до конвертации,
  // если она вообще нужна) — этот кусок был у downloadVideo() и
  // downloadAudio() идентичным, различался только тем, что происходит на
  // complete. onComplete решает, что делать дальше (конвертировать или сразу
  // финализировать), сам метод отвечает только за next/error.
  private subscribeToDownloadProgress(
    progress$: Observable<ProgressType | Error>,
    downloadId: string,
    progressSubject: Subject<ProgressType | Error>,
    onComplete: () => void | Promise<void>,
  ) {
    progress$.subscribe({
      next: async (progress) => {
        if (progress instanceof Error) {
          await this.markDownloadFailed(downloadId, progress, progressSubject);
        } else {
          progressSubject.next(progress);
        }
      },
      error: async (err) => {
        await this.markDownloadFailed(downloadId, err, progressSubject);
      },
      complete: () => {
        void onComplete();
      },
    });
  }

  // Конвертация после основного скачивания — раньше жила третьим уровнем
  // вложенности прямо внутри downloadVideo(). Отдельный приватный метод, как
  // и предполагалось в плане рефакторинга (downloadVideo() ~200 строк с 3
  // уровнями вложенных callback-подписок).
  private async handleConversion(
    downloadId: string,
    downloadDir: string,
    tempFileName: string,
    finalFileName: string,
    extension: 'mp4' | 'mkv' | 'webm' | 'flv' | 'ogg',
    progressSubject: Subject<ProgressType | Error>,
  ) {
    console.log('Converting video to', extension);
    const inputPath = join(downloadDir, tempFileName);
    const outputPath = join(downloadDir, finalFileName);

    await this.updateDownloadStatus(downloadId, {
      status: DownloadStatus.CONVERTING,
    });

    try {
      const convertProgress$ = await this.ytdlp.convertVideo(inputPath, extension, outputPath);

      convertProgress$.subscribe({
        next: (progress) => {
          if (!(progress instanceof Error)) {
            console.log('Conversion progress:', progress.percentage_str);
            progressSubject.next({ ...progress, status: 'converting' } as ProgressType);
          }
        },
        error: async (err) => {
          await this.markDownloadFailed(downloadId, err, progressSubject);
        },
        complete: async () => {
          console.log('Conversion complete');
          try {
            // Реальный триггер: CleanupService мог удалить inputPath как
            // "старый файл" по mtime, пока конвертация ещё шла — fs.unlinkSync
            // бросает ENOENT (см. критический фикс 2026-07-23).
            fs.unlinkSync(inputPath);
            await this.completeDownload(
              downloadId,
              `/downloads/${finalFileName}`,
              outputPath,
              progressSubject,
            );
          } catch (error) {
            await this.markDownloadFailed(downloadId, error, progressSubject);
          }
        },
      });
    } catch (error) {
      await this.markDownloadFailed(downloadId, error, progressSubject);
    }
  }

  async downloadVideo(
    url: string,
    quality: DownloadQualityOptions['mergevideo'],
    extension?: DownloadFormatOptions['mergevideo'],
    req: Request = null,
    meta: DownloadRequestMeta = {},
  ) {
    try {
      // Check duration limit before proceeding
      const info = await this.checkDurationLimit(url, req);

      const downloadDir = this.ensureDownloadDirectory();

      const initialExtension =
        extension && extension !== 'mp4' ? 'mp4' : extension;
      const tempFileName = getFileName(info.title, quality, initialExtension);
      const finalFileName = getFileName(info.title, quality, extension);

      // Проверка дневного лимита и создание записи Download должны быть
      // атомарны относительно ДРУГИХ запросов того же telegramId — иначе
      // несколько параллельных вкладок читают один и тот же freeUsed (ни
      // одна запись ещё не создана) и все проходят проверку разом (TOCTOU).
      const createDownloadRecord = async () => {
        await this.enforceWebLimits(meta, quality, info, (req as any).platform, true);
        const botUserId = await this.resolveBotUserId(meta);
        return this.createDownload({
          originalUrl: url,
          downloader: this.resolveDownloader((req as any).platform),
          filename: finalFileName,
          apiKeyId: (req as any).apiKey?.id,
          botUserId,
          source: meta.source,
          videoTitle: info.title,
          videoDuration: info.duration,
          isPaid: meta.isPaid,
          starsAmount: meta.starsAmount,
        });
      };
      const download = meta.telegramId
        ? await this.withWebLimitLock(meta.telegramId, createDownloadRecord)
        : await createDownloadRecord();

      // Create progress subject
      const progressSubject = this.createProgressSubject(
        download.id,
        extension || 'mp4',
        extension && extension !== 'mp4' ? finalFileName : tempFileName,
      );

      console.log('start download', {
        quality,
        extension: initialExtension,
        fileName: tempFileName,
      });

      // Update status to DOWNLOADING
      await this.updateDownloadStatus(download.id, {
        status: DownloadStatus.DOWNLOADING,
      });

      // Start video download
      this.ytdlp
        .download(url, (req as any).platform, {
          filter: 'mergevideo',
          quality: quality,
          format: initialExtension as VideoFormat,
          output: {
            outDir: downloadDir,
            fileName: tempFileName,
          },
        })
        .then((progress$) => {
          this.subscribeToDownloadProgress(progress$, download.id, progressSubject, async () => {
            console.log('Download complete');
            if (extension && extension !== 'mp4') {
              await this.handleConversion(
                download.id,
                downloadDir,
                tempFileName,
                finalFileName,
                extension,
                progressSubject,
              );
            } else {
              try {
                await this.completeDownload(
                  download.id,
                  `/downloads/${tempFileName}`,
                  join(downloadDir, tempFileName),
                  progressSubject,
                );
              } catch (error) {
                await this.markDownloadFailed(download.id, error, progressSubject);
              }
            }
          });
        })
        .catch((error) => this.markDownloadFailed(download.id, error, progressSubject));

      return {
        message: 'Download started',
        downloadId: download.id,
        fileName:
          extension && extension !== 'mp4' ? finalFileName : tempFileName,
      };
    } catch (error) {
      if (
        error instanceof BadRequestException ||
        error instanceof ForbiddenException ||
        error instanceof UnauthorizedException
      ) {
        throw error;
      }
      throw new BadRequestException(
        error.message || 'Failed to start download',
      );
    }
  }

  async downloadAudio(
    url: string,
    quality: DownloadQualityOptions['audioonly'],
    extension?: DownloadFormatOptions['audioonly'],
    req: Request = null,
    meta: DownloadRequestMeta = {},
  ) {
    try {
      // Check duration limit before proceeding
      const info = await this.checkDurationLimit(url, req);

      const downloadDir = this.ensureDownloadDirectory();
      const fileName = getFileName(info.title, quality, extension);

      // См. downloadVideo() — та же TOCTOU-защита дневного лимита.
      const createDownloadRecord = async () => {
        await this.enforceWebLimits(meta, undefined, info, (req as any).platform, false);
        const botUserId = await this.resolveBotUserId(meta);
        return this.createDownload({
          originalUrl: url,
          downloader: this.resolveDownloader((req as any).platform),
          filename: fileName,
          apiKeyId: (req as any).apiKey?.id,
          botUserId,
          source: meta.source,
          videoTitle: info.title,
          videoDuration: info.duration,
          isPaid: meta.isPaid,
          starsAmount: meta.starsAmount,
        });
      };
      const download = meta.telegramId
        ? await this.withWebLimitLock(meta.telegramId, createDownloadRecord)
        : await createDownloadRecord();

      // Create progress subject
      const progressSubject = this.createProgressSubject(
        download.id,
        extension || 'mp3',
        fileName,
      );

      console.log('start download', {
        quality,
        extension,
        fileName,
      });

      // Update status to DOWNLOADING
      await this.updateDownloadStatus(download.id, {
        status: DownloadStatus.DOWNLOADING,
      });

      // Audio download
      const progress$ = await this.ytdlp.download(url, (req as any).platform, {
        filter: 'audioonly',
        quality: quality,
        format: extension,
        output: {
          outDir: downloadDir,
          fileName: fileName,
        },
      });

      this.subscribeToDownloadProgress(progress$, download.id, progressSubject, async () => {
        console.log('Download complete');
        try {
          await this.completeDownload(
            download.id,
            `/downloads/${fileName}`,
            join(downloadDir, fileName),
            progressSubject,
          );
        } catch (error) {
          await this.markDownloadFailed(download.id, error, progressSubject);
        }
      });

      return {
        message: 'Download started',
        downloadId: download.id,
        fileName: fileName,
      };
    } catch (error) {
      if (
        error instanceof BadRequestException ||
        error instanceof ForbiddenException ||
        error instanceof UnauthorizedException
      ) {
        throw error;
      }
      throw new BadRequestException('Failed to download audio');
    }
  }
}
