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
  VideoFormat,
} from 'src/types';
import { FacebookVideoQuality } from 'src/types/facebook';
import { YtdlpService } from '../ytdlp/ytdlp.service';
import { getFileName } from 'src/lib/utils';
import { getVideoFormats } from 'src/lib/helper';
import { BotUserService } from '../analytics/bot-user.service';
import { categorizeError } from 'src/lib/error-category';
import {
  DAILY_FREE_DOWNLOAD_LIMIT,
  PAID_QUALITY_MIN_HEIGHT,
} from 'src/lib/config';

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

  constructor(
    private prisma: PrismaService,
    private ytdlp: YtdlpService,
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
    const info = await this.ytdlp.getYtdlpVideoInfo(url);

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

  // Зеркалит isPaidQuality() из bot/src/bot.ts — держать оба места в синхроне
  // при изменении правила. НЕ числовые качества (Facebook 'hd'/'sd') всегда
  // бесплатны (parseInt даёт NaN), как и в боте.
  private isPaidVideoQuality(quality: string, availableQualities: string[]): boolean {
    const height = parseInt(quality, 10);
    if (!Number.isFinite(height) || height < PAID_QUALITY_MIN_HEIGHT) return false;

    if (height === PAID_QUALITY_MIN_HEIGHT) {
      const heights = availableQualities
        .map((q) => parseInt(q, 10))
        .filter((h) => Number.isFinite(h));
      const minHeight = heights.length ? Math.min(...heights) : height;
      if (minHeight >= PAID_QUALITY_MIN_HEIGHT) return false;
    }

    return true;
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
      if (this.isPaidVideoQuality(quality, availableQualities)) {
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
  private resolveDownloader(platform: string): Downloaders {
    return Downloaders[platform.toUpperCase() as keyof typeof Downloaders];
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
      await this.enforceWebLimits(meta, quality, info, (req as any).platform, true);

      const downloadDir = this.ensureDownloadDirectory();

      const initialExtension =
        extension && extension !== 'mp4' ? 'mp4' : extension;
      const tempFileName = getFileName(info.title, quality, initialExtension);
      const finalFileName = getFileName(info.title, quality, extension);

      const botUserId = await this.resolveBotUserId(meta);

      // Create download record in database
      const download = await this.createDownload({
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
          progress$.subscribe({
            next: async (progress) => {
              if (progress instanceof Error) {
                console.error('Error:', progress);
                await this.updateDownloadStatus(download.id, {
                  status: DownloadStatus.FAILED,
                  downloadUrl: null,
                  errorCategory: categorizeError(progress.message),
                });
                progressSubject.error(progress);
              } else {
                console.log(
                  'Progress percentage string:',
                  progress.percentage_str,
                );
                progressSubject.next(progress);
              }
            },
            error: async (err) => {
              console.error('Error:', err);
              await this.updateDownloadStatus(download.id, {
                status: DownloadStatus.FAILED,
                downloadUrl: null,
                errorCategory: categorizeError(err?.message ?? String(err)),
              });
              progressSubject.error(err);
            },
            complete: async () => {
              console.log('Download complete');

              if (extension && extension !== 'mp4') {
                console.log('Converting video to', extension);
                const inputPath = join(downloadDir, tempFileName);
                const outputPath = join(downloadDir, finalFileName);

                await this.updateDownloadStatus(download.id, {
                  status: DownloadStatus.CONVERTING,
                });

                try {
                  const convertProgress$ = await this.ytdlp.convertVideo(
                    inputPath,
                    extension,
                    outputPath,
                  );

                  convertProgress$.subscribe({
                    next: (progress) => {
                      if (!(progress instanceof Error)) {
                        console.log(
                          'Conversion progress:',
                          progress.percentage_str,
                        );
                        progressSubject.next({
                          ...progress,
                          status: 'converting',
                        });
                      }
                    },
                    error: async (err) => {
                      console.error('Conversion error:', err);
                      await this.updateDownloadStatus(download.id, {
                        status: DownloadStatus.FAILED,
                        downloadUrl: null,
                        errorCategory: categorizeError(
                          err?.message ?? String(err),
                        ),
                      });
                      progressSubject.error(err);
                    },
                    complete: async () => {
                      console.log('Conversion complete');
                      try {
                        fs.unlinkSync(inputPath);
                        await this.updateDownloadStatus(download.id, {
                          status: DownloadStatus.COMPLETED,
                          downloadUrl: `/downloads/${finalFileName}`,
                          fileSize: BigInt(statSync(outputPath).size),
                        });
                        progressSubject.complete();
                      } catch (error) {
                        // Реальный триггер: CleanupService мог удалить inputPath
                        // как "старый файл" по mtime, пока конвертация ещё шла —
                        // fs.unlinkSync/statSync бросают ENOENT. Без этого catch
                        // необработанный reject падал в глобальный обработчик
                        // (main.ts) и роняя только логирование — запись в БД
                        // навсегда оставалась в CONVERTING, а SSE-подписчик
                        // никогда не получал ни complete, ни error.
                        console.error('Failed to finalize converted download:', error);
                        await this.updateDownloadStatus(download.id, {
                          status: DownloadStatus.FAILED,
                          downloadUrl: null,
                          errorCategory: categorizeError(error?.message ?? String(error)),
                        }).catch((e) =>
                          console.error('Failed to mark download as FAILED after finalize error:', e),
                        );
                        progressSubject.error(error);
                      }
                    },
                  });
                } catch (error) {
                  console.error('Conversion error:', error);
                  await this.updateDownloadStatus(download.id, {
                    status: DownloadStatus.FAILED,
                    downloadUrl: null,
                    errorCategory: categorizeError(
                      error?.message ?? String(error),
                    ),
                  });
                  progressSubject.error(error);
                }
              } else {
                try {
                  await this.updateDownloadStatus(download.id, {
                    status: DownloadStatus.COMPLETED,
                    downloadUrl: `/downloads/${tempFileName}`,
                    fileSize: BigInt(
                      statSync(join(downloadDir, tempFileName)).size,
                    ),
                  });
                  progressSubject.complete();
                } catch (error) {
                  console.error('Failed to finalize download:', error);
                  await this.updateDownloadStatus(download.id, {
                    status: DownloadStatus.FAILED,
                    downloadUrl: null,
                    errorCategory: categorizeError(error?.message ?? String(error)),
                  }).catch((e) =>
                    console.error('Failed to mark download as FAILED after finalize error:', e),
                  );
                  progressSubject.error(error);
                }
              }
            },
          });
        })
        .catch(async (error) => {
          console.error('Failed to start download:', error);
          await this.updateDownloadStatus(download.id, {
            status: DownloadStatus.FAILED,
            downloadUrl: null,
            errorCategory: categorizeError(error?.message ?? String(error)),
          });
          progressSubject.error(error);
        });

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
      await this.enforceWebLimits(meta, undefined, info, (req as any).platform, false);

      const downloadDir = this.ensureDownloadDirectory();
      const fileName = getFileName(info.title, quality, extension);

      const botUserId = await this.resolveBotUserId(meta);

      // Create download record in database
      const download = await this.createDownload({
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

      progress$.subscribe({
        next: async (progress) => {
          if (progress instanceof Error) {
            console.error('Error:', progress);
            await this.updateDownloadStatus(download.id, {
              status: DownloadStatus.FAILED,
              downloadUrl: null,
              errorCategory: categorizeError(progress.message),
            });
            progressSubject.error(progress);
          } else {
            console.log('Progress percentage string:', progress.percentage_str);
            progressSubject.next(progress);
          }
        },
        error: async (err) => {
          console.error('Error:', err);
          await this.updateDownloadStatus(download.id, {
            status: DownloadStatus.FAILED,
            downloadUrl: null,
            errorCategory: categorizeError(err?.message ?? String(err)),
          });
          progressSubject.error(err);
        },
        complete: async () => {
          console.log('Download complete');
          try {
            await this.updateDownloadStatus(download.id, {
              status: DownloadStatus.COMPLETED,
              downloadUrl: `/downloads/${fileName}`,
              fileSize: BigInt(statSync(join(downloadDir, fileName)).size),
            });
            progressSubject.complete();
          } catch (error) {
            console.error('Failed to finalize audio download:', error);
            await this.updateDownloadStatus(download.id, {
              status: DownloadStatus.FAILED,
              downloadUrl: null,
              errorCategory: categorizeError(error?.message ?? String(error)),
            }).catch((e) =>
              console.error('Failed to mark download as FAILED after finalize error:', e),
            );
            progressSubject.error(error);
          }
        },
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
