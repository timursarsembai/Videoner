import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { join, basename, resolve } from 'path';
import { execFile } from 'child_process';
import { promisify } from 'util';
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
import { YtdlpProcessService } from '../ytdlp/ytdlp-process.service';
import { YtdlpFormatService } from '../ytdlp/ytdlp-format.service';
import { getFileName } from 'src/lib/utils';
import { BotUserService } from '../analytics/bot-user.service';
import { categorizeError } from 'src/lib/error-category';
import { DAILY_DOWNLOAD_LIMIT } from 'src/lib/config';
import {
  entryKind,
  hasVideoEntries,
  isPlaylist,
  longestDuration,
  PHOTO_PLATFORMS,
  photoTargets,
  playlistEntries,
} from 'src/lib/playlist';

export interface DownloadRequestMeta {
  telegramId?: number;
  telegramUsername?: string;
  telegramLanguageCode?: string;
  source?: DownloadSource;
}

const execFileAsync = promisify(execFile);

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
    const info = await this.ytdlpFormat.getYtdlpVideoInfo(url, {
      allowPhotos: PHOTO_PLATFORMS.includes((req as any).platform),
    });

    // У карусели собственной длительности нет. Складывать элементы неверно:
    // ограничение задумано на один ролик, а не на суммарный вес поста.
    const duration = info.duration ?? longestDuration(info);

    if (duration > apiKey.maxDuration) {
      throw new BadRequestException(
        `Video duration (${Math.round(duration / 60)} minutes) exceeds the allowed limit (${Math.round(apiKey.maxDuration / 60)} minutes)`,
      );
    }

    return info;
  }

  // Ограничения для запросов с сайта (meta.source === WEB): обязательный вход
  // через Telegram и суточный лимит. Бот считает свой лимит сам.
  //
  // Раньше здесь же стоял гейт платного HD. Он снят вместе со всеми платными
  // функциями: сервис бесплатный, и качество больше ни от чего не зависит.
  // С гейтом ушли параметры quality/info/platform/isVideo — они были нужны
  // только ему, — и метод getAvailableVideoQualities, который их считал.
  //
  // telegramId для WEB приходит уже проверенным из сессии (см.
  // web/app/api/[...path]/route.ts), а не как есть от браузера.
  private async enforceWebLimits(meta: DownloadRequestMeta) {
    if (meta.source !== DownloadSource.WEB) return;

    if (!meta.telegramId) {
      throw new UnauthorizedException('Login required to download on the website');
    }

    // Безлимит выдаётся ТОЛЬКО вручную админом через /grant; купить его нельзя.
    const unlimited = await this.botUser.isUnlimited(meta.telegramId);
    if (unlimited) return;

    const usedToday = await this.botUser.countDownloadsToday(meta.telegramId);
    if (usedToday >= DAILY_DOWNLOAD_LIMIT) {
      throw new ForbiddenException('Daily download limit reached');
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

  // Размеры и длительность видео нужны боту, чтобы передать их в sendVideo.
  // Без width/height Telegram-клиент на iOS показывает вертикальное видео
  // сплющенным в квадрат (Desktop при этом читает поток сам и рисует верно).
  //
  // Вызывается один раз — в completeDownload(), результат ложится в БД. На
  // запросе метаданных ffprobe уже не гоняется (см. getFileMetadata): это и
  // быстрее, и не даёт заблокировать event loop, если метаданные вдруг начнут
  // запрашивать часто или параллельно.
  //
  // Ошибку глотаем: она не повод проваливать саму загрузку — бот просто
  // отправит видео без размеров, как делал до появления этой правки.
  private async probeVideoDimensions(filePath: string): Promise<{
    width?: number;
    height?: number;
    duration?: number;
  }> {
    try {
      const { stdout } = await execFileAsync(
        'ffprobe',
        [
          '-v',
          'error',
          '-select_streams',
          'v:0',
          '-show_entries',
          'stream=width,height:format=duration',
          '-of',
          'json',
          filePath,
        ],
        { encoding: 'utf-8', timeout: 10_000 },
      );
      const parsed = JSON.parse(stdout);
      const stream = parsed?.streams?.[0] ?? {};
      const duration = Number(parsed?.format?.duration);
      return {
        width: Number.isFinite(stream.width) ? stream.width : undefined,
        height: Number.isFinite(stream.height) ? stream.height : undefined,
        duration: Number.isFinite(duration) ? Math.round(duration) : undefined,
      };
    } catch {
      return {};
    }
  }

  async getFileMetadata(filename: string) {
    const filePath = this.resolveDownloadPath(filename);

    if (!fs.existsSync(filePath)) {
      throw new NotFoundException('File not found');
    }

    const stat = statSync(filePath);

    // Размеры берём из БД — их положил туда completeDownload(). Ищем по
    // downloadUrl, а не по filename: downloadUrl строится из фактического
    // имени файла на диске и верен всегда, тогда как у записей, созданных до
    // правки getFileName выше, поле filename могло разойтись с реальным
    // именем на миллисекунду.
    //
    // Записей может не быть у файлов, скачанных до этой правки, и у аудио;
    // тогда просто не отдаём эти поля — для бота они необязательны.
    const download = await this.prisma.download.findFirst({
      where: { downloadUrl: { endsWith: `/${filename}` } },
      orderBy: { createdAt: 'desc' },
      select: { videoWidth: true, videoHeight: true, videoDuration: true },
    });

    return {
      size: stat.size,
      created: stat.birthtime,
      modified: stat.mtime,
      isFile: stat.isFile(),
      isDirectory: stat.isDirectory(),
      ...(download?.videoWidth ? { width: download.videoWidth } : {}),
      ...(download?.videoHeight ? { height: download.videoHeight } : {}),
      ...(download?.videoDuration ? { duration: download.videoDuration } : {}),
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
      },
    });
  }

  async updateDownloadStatus(
    id: string,
    data: {
      status: DownloadStatus;
      // Имя файла обновляется только у карусели: до скачивания настоящих имён
      // нет, номер к ним подставляет yt-dlp.
      filename?: string;
      downloadUrl?: string | null;
      fileSize?: bigint;
      errorCategory?: ErrorCategory;
      videoWidth?: number;
      videoHeight?: number;
      videoDuration?: number;
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
    const [unlimited, usedToday] = await Promise.all([
      this.botUser.isUnlimited(telegramId),
      this.botUser.countDownloadsToday(telegramId),
    ]);
    return {
      unlimited,
      used: usedToday,
      limit: DAILY_DOWNLOAD_LIMIT,
      remaining: unlimited
        ? DAILY_DOWNLOAD_LIMIT
        : Math.max(0, DAILY_DOWNLOAD_LIMIT - usedToday),
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

      const items = await this.prisma.downloadItem.findMany({
        where: { downloadId },
        orderBy: { position: 'asc' },
      });

      return {
        status: download.status,
        downloadUrl: download.downloadUrl,
        // Пустой список — это обычное скачивание одним файлом: он уже описан
        // полями выше. Старые записи, сделанные до появления таблицы, тоже
        // попадают сюда, и потребители не должны считать их сломанными.
        items: items.map((item) => ({
          position: item.position,
          filename: item.filename,
          kind: item.kind,
          width: item.width,
          height: item.height,
          duration: item.duration,
          fileSize: item.fileSize ? Number(item.fileSize) : undefined,
          downloadUrl: `/downloads/${item.filename}`,
        })),
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
  // Шаблон имени для карусели: yt-dlp подставит порядковый номер вместо
  // %(playlist_index)02d и запишет столько файлов, сколько элементов в посте.
  // Без номера все элементы легли бы в ОДНО имя и затёрли друг друга —
  // пользователь получил бы последний ролик вместо всех.
  private playlistTemplate(fileName: string): string {
    const dot = fileName.lastIndexOf('.');
    const base = dot > 0 ? fileName.slice(0, dot) : fileName;
    const ext = dot > 0 ? fileName.slice(dot) : '.mp4';
    return `${base}-%(playlist_index)02d${ext}`;
  }

  // Файлы, которые реально появились на диске. Имя базы содержит метку
  // времени (см. getFileName), поэтому префикс уникален и чужие файлы под
  // выборку не попадут.
  private collectPlaylistFiles(
    downloadDir: string,
    fileName: string,
  ): { name: string; position: number; ext: string }[] {
    const dot = fileName.lastIndexOf('.');
    const base = dot > 0 ? fileName.slice(0, dot) : fileName;
    // Расширение не фиксируем: в одном посте рядом лежат и видео (.mp4), и
    // фотографии (.jpg). Маска строгая — «база-НОМЕР.расширение» и ничего
    // больше: простого startsWith(base + '-') мало, под него попадают
    // промежуточные файлы слияния вида «база-01.f137.mp4», которые yt-dlp
    // иногда оставляет, если элемент не докачался (в них после номера ещё
    // одна точка, поэтому под шаблон они не подходят).
    const pattern = new RegExp(
      `^${base.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}-(\\d+)\\.([A-Za-z0-9]+)$`,
    );
    return fs
      .readdirSync(downloadDir)
      .map((name) => ({ name, match: pattern.exec(name) }))
      .filter((entry) => entry.match)
      // Номер берём из имени, а не из порядка в массиве: если какой-то элемент
      // поста не скачался (--ignore-errors), на диске окажутся, например, 01 и
      // 03 — и позиции должны остаться теми же, что у площадки.
      .map((entry) => ({
        name: entry.name,
        position: Number(entry.match![1]),
        ext: entry.match![2].toLowerCase(),
      }))
      .sort((a, b) => a.position - b.position);
  }

  /**
   * Скачивание фотографий поста.
   *
   * Их не умеет yt-dlp: для него это элементы без единого формата, он на них
   * ругается и идёт дальше. Поэтому берём ссылку на полноразмерный снимок и
   * сохраняем сами, под тем же номером, что и место в посте — тогда порядок
   * файлов совпадает с тем, что человек видит на площадке.
   *
   * Сбой одного снимка не отменяет остальной пост: пять фотографий из шести
   * лучше, чем ошибка на весь пост.
   */
  private async downloadPhotos(
    targets: { position: number; url: string }[],
    downloadDir: string,
    fileName: string,
  ): Promise<number> {
    const dot = fileName.lastIndexOf('.');
    const base = dot > 0 ? fileName.slice(0, dot) : fileName;
    let saved = 0;

    for (const target of targets) {
      const name = `${base}-${String(target.position).padStart(2, '0')}.jpg`;
      try {
        const response = await fetch(target.url);
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}`);
        }
        const bytes = Buffer.from(await response.arrayBuffer());
        await fs.promises.writeFile(join(downloadDir, name), bytes);
        saved += 1;
      } catch (error) {
        console.error(`Не удалось скачать фото ${target.position}:`, error);
      }
    }

    return saved;
  }

  // Завершение скачивания карусели. Первый файл дублируется в поля самого
  // Download — на них рассчитан весь прежний код, который про несколько
  // файлов не знает.
  private async completePlaylistDownload(
    downloadId: string,
    downloadDir: string,
    fileName: string,
    progressSubject: Subject<ProgressType | Error>,
    kind: 'VIDEO' | 'AUDIO' = 'VIDEO',
  ) {
    const files = this.collectPlaylistFiles(downloadDir, fileName);
    if (!files.length) {
      throw new Error('Ни один файл поста не скачался');
    }

    const items = [];
    for (const file of files) {
      const filePath = join(downloadDir, file.name);
      const dims = await this.probeVideoDimensions(filePath);
      items.push({
        position: file.position,
        filename: file.name,
        // Фотография узнаётся по расширению: видео пишет yt-dlp, снимки
        // кладём мы сами, и всегда как .jpg.
        kind: file.ext === 'jpg' ? ('PHOTO' as const) : kind,
        width: dims.width ?? null,
        height: dims.height ?? null,
        duration: dims.duration ?? null,
        fileSize: BigInt(statSync(filePath).size),
      });
    }

    await this.prisma.downloadItem.createMany({
      data: items.map((item) => ({ ...item, downloadId })),
    });

    const first = items[0];
    // Событию complete нужно настоящее имя, а не шаблон (см. setFilename).
    VideoDownload.setFilename(downloadId, first.filename);
    await this.updateDownloadStatus(downloadId, {
      status: DownloadStatus.COMPLETED,
      filename: first.filename,
      downloadUrl: `/downloads/${first.filename}`,
      fileSize: first.fileSize,
      ...(first.width ? { videoWidth: first.width } : {}),
      ...(first.height ? { videoHeight: first.height } : {}),
      ...(first.duration ? { videoDuration: first.duration } : {}),
    });
    progressSubject.complete();
  }

  private async completeDownload(
    downloadId: string,
    downloadUrl: string,
    filePath: string,
    progressSubject: Subject<ProgressType | Error>,
  ) {
    // Размеры снимаем здесь, один раз на загрузку — дальше их отдаёт
    // getFileMetadata() из БД. У аудио видеопотока нет, ffprobe вернёт пусто.
    const dims = await this.probeVideoDimensions(filePath);

    await this.updateDownloadStatus(downloadId, {
      status: DownloadStatus.COMPLETED,
      downloadUrl,
      fileSize: BigInt(statSync(filePath).size),
      ...(dims.width ? { videoWidth: dims.width } : {}),
      ...(dims.height ? { videoHeight: dims.height } : {}),
      ...(dims.duration ? { videoDuration: dims.duration } : {}),
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

      // Пост из нескольких файлов (карусель) идёт отдельной веткой: имя
      // получает шаблон с номером, конвертация не делается.
      const photos = photoTargets(info);
      const hasVideo = hasVideoEntries(info);
      // Нумерованное имя нужно и одиночному фото: снимки мы сохраняем сами,
      // и делать для них отдельную схему именования — только плодить ветки.
      const multi = isPlaylist(info) || photos.length > 0;

      const downloadDir = this.ensureDownloadDirectory();

      // Карусель всегда отдаём в mp4. Конвертировать каждый файл отдельным
      // проходом ffmpeg — удвоить время ради выбора контейнера, которого для
      // поста из нескольких роликов на сайте всё равно не предлагают.
      const initialExtension =
        multi || (extension && extension !== 'mp4') ? 'mp4' : extension;
      const baseFileName = getFileName(info.title, quality, initialExtension);
      const tempFileName = multi
        ? this.playlistTemplate(baseFileName)
        : baseFileName;
      // Когда конвертация не нужна (запрошен mp4, он же и скачивается),
      // временный файл И ЕСТЬ финальный — второе имя генерировать нельзя.
      // getFileName() берёт текущее время в миллисекундах, и два вызова
      // подряд иногда попадают в разные миллисекунды: в БД уезжало имя
      // ...779.mp4, а на диске лежало ...778.mp4. Файл по такому имени не
      // находился никогда — запись Download.filename была фантомной.
      const finalFileName =
        !multi && extension && extension !== 'mp4'
          ? getFileName(info.title, quality, extension)
          : baseFileName;

      // Проверка дневного лимита и создание записи Download должны быть
      // атомарны относительно ДРУГИХ запросов того же telegramId — иначе
      // несколько параллельных вкладок читают один и тот же freeUsed (ни
      // одна запись ещё не создана) и все проходят проверку разом (TOCTOU).
      const createDownloadRecord = async () => {
        await this.enforceWebLimits(meta);
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
        });
      };
      const download = meta.telegramId
        ? await this.withWebLimitLock(meta.telegramId, createDownloadRecord)
        : await createDownloadRecord();

      // Create progress subject
      const progressSubject = this.createProgressSubject(
        download.id,
        multi ? 'mp4' : extension || 'mp4',
        // Не tempFileName: у карусели это шаблон с %(playlist_index)02d, и в
        // событиях прогресса он выглядел бы как мусор.
        !multi && extension && extension !== 'mp4' ? finalFileName : baseFileName,
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

      // Пост без единого видео (только фотографии) через yt-dlp не проходит
      // вовсе: там нет ни одного формата, и он честно скажет «нет видео».
      // Снимки забираем сами и сразу завершаем скачивание.
      if (!hasVideo) {
        void (async () => {
          try {
            const saved = await this.downloadPhotos(photos, downloadDir, baseFileName);
            if (!saved) {
              throw new Error('Ни одну фотографию поста скачать не удалось');
            }
            await this.completePlaylistDownload(
              download.id,
              downloadDir,
              baseFileName,
              progressSubject,
            );
          } catch (error) {
            await this.markDownloadFailed(download.id, error, progressSubject);
          }
        })();

        return {
          message: 'Download started',
          downloadId: download.id,
          fileName: baseFileName,
          itemCount: playlistEntries(info).length,
        };
      }

      // Start video download
      this.ytdlp
        .download(url, (req as any).platform, {
          filter: 'mergevideo',
          quality: quality,
          format: initialExtension as VideoFormat,
          playlist: multi,
          output: {
            outDir: downloadDir,
            fileName: tempFileName,
          },
        } as any)
        .then((progress$) => {
          this.subscribeToDownloadProgress(progress$, download.id, progressSubject, async () => {
            console.log('Download complete');
            if (multi) {
              try {
                // Фотографии добираем после видео — они лежат в том же посте
                // и должны попасть в ту же выдачу, с теми же номерами.
                if (photos.length) {
                  await this.downloadPhotos(photos, downloadDir, baseFileName);
                }
                await this.completePlaylistDownload(
                  download.id,
                  downloadDir,
                  baseFileName,
                  progressSubject,
                );
              } catch (error) {
                await this.markDownloadFailed(download.id, error, progressSubject);
              }
            } else if (extension && extension !== 'mp4') {
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
        // У карусели настоящие имена файлов известны только после скачивания
        // (номер подставляет yt-dlp) — потребитель берёт их из items в
        // /download/:id/status. Здесь отдаём базовое имя и число элементов.
        fileName:
          !multi && extension && extension !== 'mp4' ? finalFileName : baseFileName,
        itemCount: playlistEntries(info).length,
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
      // Пост из нескольких файлов и в аудио остаётся несколькими файлами.
      // Без шаблона с номером yt-dlp писал бы все дорожки в ОДНО имя, и от
      // карусели оставалась бы последняя — молча, без всякой ошибки.
      const multi = isPlaylist(info);
      const baseFileName = getFileName(info.title, quality, extension);
      const fileName = multi
        ? this.playlistTemplate(baseFileName)
        : baseFileName;

      // См. downloadVideo() — та же TOCTOU-защита дневного лимита.
      const createDownloadRecord = async () => {
        await this.enforceWebLimits(meta);
        const botUserId = await this.resolveBotUserId(meta);
        return this.createDownload({
          originalUrl: url,
          downloader: this.resolveDownloader((req as any).platform),
          filename: baseFileName,
          apiKeyId: (req as any).apiKey?.id,
          botUserId,
          source: meta.source,
          videoTitle: info.title,
          videoDuration: info.duration,
        });
      };
      const download = meta.telegramId
        ? await this.withWebLimitLock(meta.telegramId, createDownloadRecord)
        : await createDownloadRecord();

      // Create progress subject
      const progressSubject = this.createProgressSubject(
        download.id,
        extension || 'mp3',
        // Не fileName: у карусели это шаблон с %(playlist_index)02d.
        // Настоящее имя первого файла подставит completePlaylistDownload.
        baseFileName,
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
        playlist: multi,
        output: {
          outDir: downloadDir,
          fileName: fileName,
        },
      } as any);

      this.subscribeToDownloadProgress(progress$, download.id, progressSubject, async () => {
        console.log('Download complete');
        try {
          if (multi) {
            await this.completePlaylistDownload(
              download.id,
              downloadDir,
              baseFileName,
              progressSubject,
              'AUDIO',
            );
          } else {
            await this.completeDownload(
              download.id,
              `/downloads/${baseFileName}`,
              join(downloadDir, baseFileName),
              progressSubject,
            );
          }
        } catch (error) {
          await this.markDownloadFailed(download.id, error, progressSubject);
        }
      });

      return {
        message: 'Download started',
        downloadId: download.id,
        // Базовое имя, а не шаблон: настоящие имена файлов карусели
        // потребитель берёт из items в /download/:id/status.
        fileName: baseFileName,
        itemCount: playlistEntries(info).length,
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
