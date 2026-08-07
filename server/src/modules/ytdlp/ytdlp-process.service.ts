import { Injectable, OnModuleInit } from '@nestjs/common';
import { exec, spawn } from 'child_process';
import * as cliProgress from 'cli-progress';
import * as extract from 'extract-zip';
import { https } from 'follow-redirects';
import * as fsSync from 'fs';
import * as fs from 'fs/promises';
import * as os from 'os';
import * as path from 'path';
import { Observable, Subject } from 'rxjs';
import { promisify } from 'util';
import { parseDownloadOptions, stringToProgress } from '../../lib/helper';
import { PROGRESS_STRING } from '../../lib/utils';
import { getPlatform } from '../../validate/url';
import {
  BinPathType,
  DownloadKeyWord,
  DownloadOptions,
  Platform,
  ProgressType,
} from '../../types';
import { DownloadOptionsValidate, parseAndValidateUrl } from '../../validate';
import { OutputTypeSchema } from '../../validate/schema';

const execAsync = promisify(exec);

// Ограничивает число одновременных запросов к YouTube и добавляет случайную
// паузу перед каждым — при наплыве пользователей все запросы идут через один
// и тот же аккаунт/IP, и если бить YouTube пачкой параллельных запросов без
// пауз, это выглядит как бот-трафик и ускоряет блокировку сильнее, чем при
// естественном, растянутом по времени использовании.
class Semaphore {
  private available: number;
  private readonly queue: Array<() => void> = [];

  constructor(limit: number) {
    this.available = limit;
  }

  acquire(): Promise<() => void> {
    if (this.available > 0) {
      this.available--;
      return Promise.resolve(() => this.release());
    }
    return new Promise((resolve) => {
      this.queue.push(() => {
        this.available--;
        resolve(() => this.release());
      });
    });
  }

  private release() {
    this.available++;
    this.queue.shift()?.();
  }
}

const YOUTUBE_MAX_CONCURRENT = 2;
const YOUTUBE_DELAY_MIN_MS = 500;
const YOUTUBE_DELAY_MAX_MS = 2000;

// Общий лимит одновременных СКАЧИВАНИЙ по ВСЕМ платформам сразу — защищает
// диск/CPU/сеть VPS от перегрузки при наплыве пользователей (проще и
// достаточно вместо полноценной очереди с видимой позицией — см. память
// bot-monetization). Отдельно от youtubeSemaphore выше: тот решает другую
// задачу (не выглядеть ботом для самого YouTube), а не общую нагрузку сервера.
const GLOBAL_MAX_CONCURRENT_DOWNLOADS =
  Number(process.env.MAX_CONCURRENT_DOWNLOADS) || 6;

const BINARY_URLS = {
  ytdlpWin64:
    'https://github.com/yt-dlp/yt-dlp/releases/latest/download/yt-dlp.exe',
  ytdlpWin32:
    'https://github.com/yt-dlp/yt-dlp/releases/latest/download/yt-dlp_x86.exe',
  ytdlpMacos:
    'https://github.com/yt-dlp/yt-dlp/releases/latest/download/yt-dlp_macos',
  ytdlpLinux:
    'https://github.com/yt-dlp/yt-dlp/releases/latest/download/yt-dlp',
  ffmpegWin64:
    'https://github.com/iqbal-rashed/ytdlp-nodejs/releases/download/ffmpeg-release/ffmpeg-win64.zip',
  ffmpegWin32:
    'https://github.com/iqbal-rashed/ytdlp-nodejs/releases/download/ffmpeg-release/ffmpeg-win32.zip',
  ffmpegLinux:
    'https://github.com/iqbal-rashed/ytdlp-nodejs/releases/download/ffmpeg-release/ffmpeg-linux64.zip',
  ffmpegMacos:
    'https://github.com/iqbal-rashed/ytdlp-nodejs/releases/download/ffmpeg-release/ffmpeg-macos.zip',
};

// Раньше это был один класс YtdlpService (815 строк, 4-5 разных зон
// ответственности: конкурентность/spawn процессов/загрузка и установка
// бинарников/парсинг форматов). Здесь остаётся всё, что связано с ЗАПУСКОМ
// процессов — семафоры, throttling, spawn, установка/пути бинарников,
// конвертация. Метаданные (info/playlist) — в соседнем YtdlpFormatService,
// который использует этот сервис через DI (см. ytdlp-format.service.ts).
//
// ВАЖНО: этот сервис должен быть ОДНИМ на всё приложение — семафоры внутри
// имеют смысл только как глобальный лимит. До разделения на два сервиса
// DownloadModule и InfoModule каждый объявляли `YtdlpService` в своих
// СОБСТВЕННЫХ providers (а не импортировали YtdlpModule) — из-за этого Nest
// создавал ТРИ независимых инстанса (плюс ещё один в самом YtdlpModule,
// никем не используемый), и youtubeSemaphore/globalDownloadSemaphore
// работали независимо в DownloadModule и InfoModule, а не как единый лимит
// на всё приложение; setupBinaries() в onModuleInit() к тому же выполнялся
// трижды при каждом старте. Исправлено 2026-07-23 вместе с этим разделением
// — см. ytdlp.module.ts и импорты в download.module.ts/info.module.ts.
@Injectable()
export class YtdlpProcessService implements OnModuleInit {
  private ytdlpPath: string;
  private ffmpegPath: string;
  private readonly binariesDir: string;
  private readonly cookiesDir: string;
  private readonly cookiesFilePath: string;
  // Статический ISP-прокси (IPRoyal) — только для YouTube: датацентр-IP VPS
  // заблокирован антибот-защитой YouTube, остальные площадки прокси не требуют.
  private readonly youtubeProxyUrl?: string;
  private readonly youtubeSemaphore = new Semaphore(YOUTUBE_MAX_CONCURRENT);
  private readonly globalDownloadSemaphore = new Semaphore(
    GLOBAL_MAX_CONCURRENT_DOWNLOADS,
  );

  constructor() {
    this.binariesDir = path.join(process.cwd(), 'bin');
    // Файл лежит внутри КАТАЛОГА cookies/, и монтируется в compose именно
    // каталог, а не сам файл. Раньше монтировался файл (./server/cookies.txt),
    // и это тихо ломалось: yt-dlp при ротации сессионных токенов не дописывает
    // cookies.txt, а подменяет его новым файлом — inode меняется, а bind-mount
    // одиночного файла привязан именно к inode. Связь с хостом рвалась, дальше
    // контейнер работал с отсоединённой копией: ротированные куки терялись при
    // каждом рестарте, а правки на хосте до контейнера не доходили.
    // Каталог монтируется по пути, поэтому подмена файла внутри него безопасна.
    //
    // Внутри каталога куки разложены по платформам: cookies/youtube.txt,
    // cookies/tiktok.txt и т.д., а cookies/cookies.txt — общий запасной вариант
    // для платформ без своего файла (см. resolveCookiesSource). Раньше всё
    // лежало одной кучей в cookies.txt, и это было неудобно и опасно:
    // переэкспорт кук одной площадки затирал куки всех остальных, а выяснить,
    // чья именно сессия протухла, можно было только разбором файла по доменам.
    this.cookiesDir = path.resolve(process.cwd(), 'cookies');
    this.cookiesFilePath = path.join(this.cookiesDir, 'cookies.txt');
    this.youtubeProxyUrl = process.env.YOUTUBE_PROXY_URL || undefined;
  }

  private isYoutubeUrl(url: string): boolean {
    return /(^|\.)youtube\.com|youtu\.be/i.test(url);
  }

  // --- Автоматическое включение прокси ------------------------------------
  //
  // Прокси — платный статический ISP-адрес, и гонять через него всё подряд
  // незачем: большинство площадок прекрасно отдаёт видео с IP самого VPS.
  // Поэтому правило такое: сначала пробуем напрямую, а прокси включаем только
  // тогда, когда площадка ответила именно блокировкой.
  //
  // Отдельная предварительная проверка не нужна — она уже есть в потоке:
  // перед каждым скачиванием выполняется --dump-json за метаданными, и
  // блокировка по IP вскрывается именно там (так TikTok и отвечает:
  // "Your IP address is blocked from accessing this post"). Решение,
  // принятое на этом шаге, наследует и само скачивание.
  //
  // YouTube — исключение: с IP дата-центра он требует антибот-проверку
  // практически всегда, и пробовать напрямую значит добавлять заведомо
  // провальную попытку к каждому запросу.
  private readonly alwaysProxyPlatforms: ReadonlySet<string> = new Set([
    'youtube',
  ]);

  // Площадка -> до какого момента ходим через прокси сразу, без пробы напрямую.
  // Память намеренно с истечением, а не навсегда: блокировки снимают, и через
  // несколько часов имеет смысл снова проверить прямой путь, иначе прокси
  // останется включённым по следу давно исчезнувшей проблемы.
  private readonly proxyUntil = new Map<string, number>();
  private readonly PROXY_MEMORY_MS = 6 * 60 * 60 * 1000;

  // Признаки того, что нас блокируют ПО АДРЕСУ, а не что видео не существует.
  // Список намеренно узкий: перезапуск через прокси на удалённом или приватном
  // ролике — это лишние секунды ожидания и лишний трафик там, где повторная
  // попытка всё равно ничего не даст.
  private static readonly BLOCK_PATTERNS: RegExp[] = [
    /ip address is blocked/i,
    /blocked from accessing/i,
    /not available (from|in) your (location|country|region)/i,
    /geo[-\s]?restrict/i,
    /sign in to confirm you.?re not a bot/i,
    /http error 403/i,
    /403:?\s*forbidden/i,
    /access denied/i,
  ];

  private isBlockError(message: string): boolean {
    return YtdlpProcessService.BLOCK_PATTERNS.some((re) => re.test(message));
  }

  private needsProxy(platform: string | null): boolean {
    if (!this.youtubeProxyUrl || !platform) {
      return false;
    }
    if (this.alwaysProxyPlatforms.has(platform)) {
      return true;
    }
    return (this.proxyUntil.get(platform) ?? 0) > Date.now();
  }

  private rememberProxyNeeded(platform: string | null): void {
    if (!platform || this.alwaysProxyPlatforms.has(platform)) {
      return;
    }
    this.proxyUntil.set(platform, Date.now() + this.PROXY_MEMORY_MS);
    console.log(
      `[proxy] ${platform}: получена блокировка по IP, ближайшие 6 ч ходим через прокси`,
    );
  }

  private async youtubeThrottleDelay(): Promise<void> {
    const ms =
      YOUTUBE_DELAY_MIN_MS +
      Math.random() * (YOUTUBE_DELAY_MAX_MS - YOUTUBE_DELAY_MIN_MS);
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  async onModuleInit() {
    await this.ensureBinariesDirectory();
    await this.setupBinaries();
  }

  private async ensureBinariesDirectory() {
    try {
      await fs.mkdir(this.binariesDir, { recursive: true });
    } catch (error) {
      throw new Error(`Failed to create binaries directory: ${error.message}`);
    }
  }

  private getUrlsByPlatform() {
    const platform = os.platform();
    const arch = os.arch();

    if (platform === 'win32') {
      if (arch === 'x64') {
        return {
          ffmpeg: BINARY_URLS.ffmpegWin64,
          ytdlp: BINARY_URLS.ytdlpWin64,
        };
      } else if (arch === 'ia32') {
        return {
          ffmpeg: BINARY_URLS.ffmpegWin32,
          ytdlp: BINARY_URLS.ytdlpWin32,
        };
      }
    } else if (platform === 'darwin') {
      return {
        ffmpeg: BINARY_URLS.ffmpegMacos,
        ytdlp: BINARY_URLS.ytdlpMacos,
      };
    } else if (platform === 'linux') {
      return {
        ffmpeg: BINARY_URLS.ffmpegLinux,
        ytdlp: BINARY_URLS.ytdlpLinux,
      };
    }

    throw new Error(`Unsupported platform: ${platform} ${arch}`);
  }

  private async downloadFile(fileUrl: string, savePath: string): Promise<void> {
    return new Promise((resolve, reject) => {
      const progressBar = new cliProgress.SingleBar(
        {
          format: `Downloading ${path.basename(savePath)} {bar} {percentage}% | {eta_formatted} remaining...`,
        },
        cliProgress.Presets.shades_classic,
      );

      const file = fsSync.createWriteStream(savePath);
      let receivedBytes = 0;

      https.get(fileUrl, (res) => {
        if (res.statusCode !== 200) {
          fsSync.unlinkSync(savePath);
          return reject(new Error(`Response status was ${res.statusCode}`));
        }

        const totalBytes = parseInt(res.headers['content-length'] || '0', 10);
        progressBar.start(totalBytes || 100, 0);

        res.on('data', (chunk) => {
          receivedBytes += chunk.length;
          progressBar.update(receivedBytes);
        });

        res.pipe(file);

        res.on('error', (err) => {
          fsSync.unlinkSync(savePath);
          progressBar.stop();
          reject(new Error(err.message));
        });

        file.on('finish', async () => {
          progressBar.stop();
          if (path.extname(savePath) === '.zip') {
            try {
              await extract(savePath, { dir: path.dirname(savePath) });
              fsSync.unlinkSync(savePath);
            } catch (error) {
              reject(error);
              return;
            }
          }
          file.close();
          resolve();
        });

        file.on('error', (err) => {
          fsSync.unlinkSync(savePath);
          progressBar.stop();
          reject(new Error(err.message));
        });
      });
    });
  }

  private async setupBinaries() {
    console.log('Checking binary files...');
    const platform = os.platform();
    const urls = this.getUrlsByPlatform();

    // Setup yt-dlp
    const ytdlpExt = platform === 'win32' ? '.exe' : '';
    const ytdlpFilename = `yt-dlp${ytdlpExt}`;
    this.ytdlpPath = path.join(this.binariesDir, ytdlpFilename);

    // Setup ffmpeg
    const ffmpegExt = platform === 'win32' ? '.exe' : '';
    const ffmpegFilename = `ffmpeg${ffmpegExt}`;
    this.ffmpegPath = path.join(this.binariesDir, ffmpegFilename);

    try {
      // Check if binaries exist
      await fs.access(this.ytdlpPath);

      // Try system ffmpeg first
      try {
        await execAsync('ffmpeg -version');
        this.ffmpegPath = 'ffmpeg'; // Use system ffmpeg
        console.log('Using system ffmpeg');
      } catch {
        await fs.access(this.ffmpegPath);
      }
    } catch {
      // Download missing binaries
      console.log('Binary files not found, starting download...');

      try {
        await this.downloadFile(urls.ytdlp, this.ytdlpPath);
        await fs.chmod(this.ytdlpPath, 0o755);

        if (this.ffmpegPath !== 'ffmpeg') {
          const ffmpegZip = path.join(this.binariesDir, 'ffmpeg.zip');
          await this.downloadFile(urls.ffmpeg, ffmpegZip);
          // The ZIP extraction is handled in downloadFile
          await fs.chmod(this.ffmpegPath, 0o755);
        }

        console.log('Binary files downloaded successfully');
      } catch (error) {
        throw new Error(`Failed to download binary files: ${error.message}`);
      }
    }
  }

  private getOutputPath(
    output?:
      | string
      | {
          outDir: string;
          fileName?: string | undefined;
        }
      | undefined,
  ): string {
    let outputStr: string = '';
    if (!output || output == 'default') {
      return '%(title)s %(height)sp .%(ext)s';
    }
    const check = OutputTypeSchema.safeParse({ output });
    if (!check.success) {
      const errorObj = check.error.issues[0];
      const errorText = `${errorObj.path} type error, ${errorObj.message}`;
      throw new Error(errorText);
    }

    const extReg =
      /(\.aac|\.flac|\.mp3|\.m4a|\.opus|\.vorbis|\.wav|\.mkv|\.mp4|\.ogg|\.webm|\.flv)$/g;

    if (typeof output === 'string') {
      output = path.resolve(output);
      if (fsSync.lstatSync(output).isDirectory()) {
        outputStr = path.join(output, '%(title)s %(height)sp .%(ext)s');
      } else if (extReg.test(output)) {
        if (!fsSync.existsSync(path.dirname(output))) {
          throw new Error('Output path not valid');
        }
      }
    }

    if (typeof output === 'object') {
      let newObj: { outDir: string; filename: string } = {
        outDir: '',
        filename: '',
      };
      let outDir = path.resolve(output.outDir);

      if (!fsSync.existsSync(outDir)) {
        throw new Error('Output directory not valid');
      } else {
        newObj.outDir = outDir;
      }

      if (output.fileName) {
        if (extReg.test(output.fileName)) {
          newObj.filename = output.fileName;
        } else {
          throw new Error('File name not valid');
        }
      }
      outputStr = path.join(
        newObj.outDir,
        newObj.filename ? newObj.filename : '%(title)s %(height)sp .%(ext)s',
      );
    }

    return outputStr ? outputStr : '%(title)s %(height)sp .%(ext)s';
  }

  // Публичный — YtdlpFormatService зовёт его через DI для получения
  // метаданных (--dump-json), сам процесс/семафоры/куки остаются здесь.
  async ytdlp(
    args: string[],
    options?: { skipCookies?: boolean },
  ): Promise<{ stdout: string; stderr: string }> {
    const isYoutube = args.some((a) => this.isYoutubeUrl(a));
    const releaseSlot = isYoutube ? await this.youtubeSemaphore.acquire() : null;
    let disposableCookies: string | null = null;
    try {
      if (isYoutube) {
        await this.youtubeThrottleDelay();
      }
      // Платформу определяем по url-аргументу — он единственный http(s)
      // элемент массива (остальное это флаги yt-dlp).
      const urlArg = args.find((a) => /^https?:\/\//i.test(a));
      const platform = urlArg ? getPlatform(urlArg) : null;

      const finalArgs = [...args];
      if (!options?.skipCookies) {
        disposableCookies = this.makeDisposableCookies(platform);
        if (disposableCookies) {
          finalArgs.push('--cookies', disposableCookies);
        }
      }

      const useProxy = this.needsProxy(platform);
      const attemptArgs = useProxy
        ? [...finalArgs, '--proxy', this.youtubeProxyUrl as string]
        : finalArgs;
      console.log(attemptArgs);

      try {
        return await this.runProcess(this.ytdlpPath, attemptArgs);
      } catch (directError: any) {
        // Вторая попытка — только на блокировке по адресу и только если
        // прямой путь ещё не пробовали через прокси. На «видео удалено» или
        // «приватный аккаунт» повтор ничего не изменит, а время съест.
        const message = directError?.message ?? '';
        if (
          useProxy ||
          !this.youtubeProxyUrl ||
          !this.isBlockError(message)
        ) {
          throw directError;
        }
        console.warn(
          `[proxy] ${platform ?? 'unknown'}: прямой запрос упёрся в блокировку, повторяю через прокси`,
        );
        const result = await this.runProcess(this.ytdlpPath, [
          ...finalArgs,
          '--proxy',
          this.youtubeProxyUrl,
        ]);
        // Запоминаем только после УСПЕШНОГО повтора: если и через прокси не
        // вышло, дело не в адресе, и гонять туда следующие запросы незачем.
        this.rememberProxyNeeded(platform);
        return result;
      }
    } catch (error) {
      throw new Error(`Failed to run yt-dlp command: ${error.message}`);
    } finally {
      this.dropDisposableCookies(disposableCookies);
      releaseSlot?.();
    }
  }

  // Запускает бинарник напрямую (execve, без /bin/sh) — args идут отдельными
  // элементами массива, поэтому пользовательский ввод (например url в /info)
  // не может вырваться из кавычек и инжектировать shell-команды, как это было
  // возможно при сборке команды строкой через exec()/execAsync (см. память
  // security-audit — было реальным RCE через "; touch ...; " в поле url).
  private runProcess(
    bin: string,
    args: string[],
  ): Promise<{ stdout: string; stderr: string }> {
    return new Promise((resolve, reject) => {
      // cwd=/tmp: yt-dlp иногда пишет служебные файлы (info.json и т.п.)
      // относительно cwd, а не в -o-путь. Контейнер работает не от root,
      // /app ему не принадлежит, /tmp — единственная writable-директория
      // без дополнительного chown (world-writable, sticky bit).
      const child = spawn(bin, args, { cwd: os.tmpdir() });
      let stdout = '';
      let stderr = '';
      child.stdout.on('data', (d) => (stdout += d));
      child.stderr.on('data', (d) => (stderr += d));
      child.on('error', reject);
      child.on('close', (code) => {
        if (code === 0) {
          resolve({ stdout, stderr });
        } else {
          reject(new Error(stderr || stdout || `exit code ${code}`));
        }
      });
    });
  }

  getYtdlpPath(): string {
    return this.ytdlpPath;
  }

  getFfmpegPath(): string {
    return this.ffmpegPath;
  }

  getBinPath(): BinPathType {
    return {
      ytdlpPath: this.ytdlpPath,
      ffmpegPath: this.ffmpegPath,
    };
  }

  // Считаем cookies заданными только если файл существует и непустой —
  // так пустышку-заглушку (удобно монтировать в Docker) yt-dlp не получит.
  private isUsableCookieFile(filePath: string): boolean {
    try {
      return fsSync.existsSync(filePath) && fsSync.statSync(filePath).size > 0;
    } catch {
      return false;
    }
  }

  // Куки конкретной площадки приоритетнее общего файла: cookies/youtube.txt
  // перекрывает cookies/cookies.txt. Так переэкспорт одной площадки не задевает
  // остальные, а отключить куки площадки можно просто удалив её файл.
  // Имя платформы приходит из getPlatform() и совпадает со слагом в типе
  // Platform ('youtube', 'instagram', 'tiktok', ...).
  private resolveCookiesSource(platform: string | null): string | null {
    if (platform) {
      // Страхуемся от подстановки пути: в имя файла попадает только то, что
      // вернул getPlatform(), но проверка дешёвая, а цена ошибки высокая.
      const safe = /^[a-z0-9_-]+$/i.test(platform) ? platform : null;
      if (safe) {
        const perPlatform = path.join(this.cookiesDir, `${safe}.txt`);
        if (this.isUsableCookieFile(perPlatform)) {
          return perPlatform;
        }
      }
    }
    return this.isUsableCookieFile(this.cookiesFilePath)
      ? this.cookiesFilePath
      : null;
  }

  // yt-dlp с флагом --cookies ВСЕГДА перезаписывает переданный файл своей
  // версией cookie jar после запроса. Для YouTube это разрушительно: сервер в
  // ответ присылает Set-Cookie, разлогинивающий первостороннюю сессию (доступ
  // идёт через ISP-прокси из дата-центра), и yt-dlp послушно сохраняет
  // результат — SID/HSID/SSID/APISID/SAPISID/LOGIN_INFO/__Secure-1P* исчезают
  // из файла. Замеряно 31.07.2026: за два запроса 22 куки YouTube превратились
  // в 12, все авторизационные пропали. То есть экспортированную сессию убивал
  // не YouTube «со временем», а собственный сервис — с первого же ответа.
  //
  // Поэтому эталонные файлы в cookies/ отдаются только на чтение: каждому
  // запуску подсовывается одноразовая копия во временном каталоге, её yt-dlp и
  // портит. Настоящая ротация токенов при этом не сохраняется — но сохранять
  // там, как показали замеры, нечего.
  private makeDisposableCookies(platform: string | null): string | null {
    const source = this.resolveCookiesSource(platform);
    if (!source) {
      return null;
    }
    try {
      const tmpPath = path.join(
        os.tmpdir(),
        `ytdlp-cookies-${process.pid}-${Date.now()}-${Math.random()
          .toString(36)
          .slice(2, 8)}.txt`,
      );
      fsSync.copyFileSync(source, tmpPath);
      return tmpPath;
    } catch {
      // Не смогли сделать копию — работаем анонимно, это лучше, чем отдать
      // yt-dlp эталонный файл на растерзание.
      return null;
    }
  }

  private dropDisposableCookies(tmpPath: string | null): void {
    if (!tmpPath) {
      return;
    }
    try {
      fsSync.unlinkSync(tmpPath);
    } catch {
      // Файл в /tmp, потеря не критична — не роняем запрос из-за неё.
    }
  }

  async download<T extends DownloadKeyWord>(
    url: string,
    platform: Platform,
    options?: DownloadOptions<T>,
  ): Promise<Observable<ProgressType | Error>> {
    const subject = new Subject<ProgressType | Error>();
    const parseUrl = parseAndValidateUrl(url, platform);

    if (!parseUrl) {
      subject.error(new Error('Url not valid'));
      return subject.asObservable();
    }

    if (!DownloadOptionsValidate(options).success) {
      subject.error(new Error('Options not validate'));
      return subject.asObservable();
    }

    let parseOptions = parseDownloadOptions(options, platform);

    try {
      const output = this.getOutputPath(options?.output);
      parseOptions = parseOptions.concat(['-o', output]);
    } catch (err: any) {
      subject.error(err);
      return subject.asObservable();
    }

    const processArgs = [
      parseUrl,
      ...parseOptions,
      '--progress-template',
      PROGRESS_STRING,
    ];

    // Одноразовая копия, а не эталонный файл — см. makeDisposableCookies().
    // Удаляется в обработчиках 'error'/'exit' ниже.
    const disposableCookies = this.makeDisposableCookies(platform);
    if (disposableCookies) {
      processArgs.push('--cookies', disposableCookies);
    }

    // Общий слот — до YouTube-специфичного: если сервер и так забит другими
    // площадками, лишний смысл сначала ждать YouTube-слот, а потом ещё общий.
    const releaseGlobalSlot = await this.globalDownloadSemaphore.acquire();

    const isYoutube = platform === 'youtube';
    let releaseYoutubeSlot: (() => void) | null = null;
    if (isYoutube) {
      releaseYoutubeSlot = await this.youtubeSemaphore.acquire();
      await this.youtubeThrottleDelay();
    }

    // Решение о прокси принято ещё на этапе метаданных (--dump-json идёт
    // перед каждым скачиванием) — здесь мы просто следуем ему.
    const usedProxy = this.needsProxy(platform);
    if (usedProxy) {
      processArgs.push('--proxy', this.youtubeProxyUrl as string);
    }

    // cwd=/tmp — см. комментарий в runProcess() выше: контейнер не от root,
    // /app не writable, а yt-dlp может писать служебные файлы относительно cwd.
    const childProcess = spawn(this.ytdlpPath, processArgs, {
      cwd: os.tmpdir(),
    });

    let hasError = false;
    let errorMessage = '';

    childProcess.stdout.on('data', (data) => {
      const dataStr = Buffer.from(data).toString();
      if (dataStr.includes('Requested format is not available.')) {
        hasError = true;
        errorMessage = 'Requested format is not available.';
        subject.error(new Error(errorMessage));
        return;
      }
      if (dataStr.includes('has already been downloaded')) {
        hasError = true;
        errorMessage = 'File already exists.';
        subject.error(new Error(errorMessage));
        return;
      }
      const result = stringToProgress(dataStr);
      if (result) {
        subject.next(result);
      }
    });

    childProcess.stderr.on('data', (data) => {
      const dataStr = Buffer.from(data).toString();
      // yt-dlp пишет в stderr и предупреждения — фатальными считаем только строки с ERROR
      if (dataStr.includes('ERROR')) {
        hasError = true;
        errorMessage = dataStr.trim();
        subject.error(new Error(errorMessage));
      } else {
        errorMessage = dataStr.trim();
        console.warn('yt-dlp stderr:', errorMessage);
      }
    });

    childProcess.stdout.on('error', (err) => {
      hasError = true;
      errorMessage = err.message;
      subject.error(err);
    });

    childProcess.stderr.on('error', (err) => {
      hasError = true;
      errorMessage = err.message;
      subject.error(err);
    });

    // Если spawn() не смог даже запустить процесс (бинарник недоступен и
    // т.п.), 'exit' не произойдёт вообще — без этого обработчика оба слота
    // (и youtube-, и общий) зависли бы навсегда. Было упущено до этой правки
    // и для youtubeSemaphore тоже — чиним заодно, раз уже трогаем этот путь.
    childProcess.on('error', (err) => {
      this.dropDisposableCookies(disposableCookies);
      releaseYoutubeSlot?.();
      releaseGlobalSlot();
      if (!hasError) {
        hasError = true;
        subject.error(err);
      }
    });

    childProcess.on('exit', (code) => {
      this.dropDisposableCookies(disposableCookies);
      releaseYoutubeSlot?.();
      releaseGlobalSlot();
      // Блокировка вскрылась не на метаданных, а уже на самой загрузке (CDN
      // может отдавать 403 там, где страница открылась): здесь не
      // перезапускаемся — часть файла могла уже уйти в прогресс подписчику, —
      // но помечаем площадку, чтобы следующая попытка сразу пошла через
      // прокси и пользователю хватило одного повторного нажатия.
      if (code !== 0 && !usedProxy && this.isBlockError(errorMessage)) {
        this.rememberProxyNeeded(platform);
      }
      if (code !== 0 && !hasError) {
        subject.error(
          new Error(errorMessage || `Process exited with code ${code}`),
        );
      } else if (!hasError) {
        subject.complete();
      }
    });

    return subject.asObservable();
  }

  async convertVideo(
    inputPath: string,
    outputFormat: 'mp4' | 'mkv' | 'webm' | 'flv' | 'ogg',
    outputPath?: string,
  ): Promise<Observable<ProgressType | Error>> {
    const subject = new Subject<ProgressType | Error>();

    try {
      // Validate input file exists
      if (!fsSync.existsSync(inputPath)) {
        subject.error(new Error('Input file does not exist'));
        return subject.asObservable();
      }

      // If no output path specified, create one in the same directory
      if (!outputPath) {
        const dir = path.dirname(inputPath);
        const filename = path.basename(inputPath, path.extname(inputPath));
        outputPath = path.join(dir, `${filename}.${outputFormat}`);
      }

      // Check if output directory exists
      const outputDir = path.dirname(outputPath);
      if (!fsSync.existsSync(outputDir)) {
        subject.error(new Error('Output directory does not exist'));
        return subject.asObservable();
      }

      // Get input format info (ffmpeg -i без выходного файла всегда "падает"
      // с ненулевым кодом — сама информация о формате идёт в stderr, это
      // ожидаемо и ловится в .catch, а не в успешном ветке промиса).
      const { stdout } = await this.runProcess(this.ffmpegPath, [
        '-i',
        inputPath,
      ]).catch((err) => ({ stdout: err.message }));
      const isAV1 = stdout.includes('av1') || stdout.includes('aom');

      // Base ffmpeg arguments
      const ffmpegArgs = [
        '-i',
        inputPath,
        '-y', // Overwrite output file if exists
      ];

      if (outputFormat === 'webm') {
        // For webm, we need specific settings based on input codec
        if (isAV1) {
          // If input is AV1, use VP9 for faster conversion
          ffmpegArgs.push(
            '-c:v',
            'libvpx-vp9',
            '-cpu-used',
            '4',
            '-row-mt',
            '1',
            '-threads',
            '0',
            '-deadline',
            'realtime',
            '-b:v',
            '0',
            '-crf',
            '30', // Adjust quality (0-63, lower is better)
            '-c:a',
            'libopus',
            '-b:a',
            '128k',
          );
        } else {
          // For other inputs, try to copy video if possible
          ffmpegArgs.push(
            '-c:v',
            'libvpx-vp9',
            '-cpu-used',
            '4',
            '-row-mt',
            '1',
            '-threads',
            '0',
            '-deadline',
            'realtime',
            '-b:v',
            '0',
            '-crf',
            '30',
            '-c:a',
            'libopus',
            '-b:a',
            '128k',
          );
        }
      } else if (outputFormat === 'ogg') {
        // For Ogg video (Theora), use specific settings
        ffmpegArgs.push(
          '-c:v',
          'libtheora', // Theora video codec
          '-qscale:v',
          '7', // Video quality (0-10, higher is better)
          '-c:a',
          'libvorbis', // Vorbis audio codec
          '-qscale:a',
          '5', // Audio quality (0-10, higher is better)
          '-threads',
          '0', // Use all available threads
        );
      } else if (outputFormat === 'flv') {
        // For FLV format, we need to use specific codecs
        ffmpegArgs.push(
          '-c:v',
          'h264', // Use H.264 for video
          '-b:v',
          '1500k', // Video bitrate
          '-maxrate',
          '1500k',
          '-bufsize',
          '3000k',
          '-c:a',
          'mp3', // Audio codec (FLV supports MP3)
          '-b:a',
          '128k', // Audio bitrate
          '-ar',
          '44100', // Audio sample rate
          '-threads',
          '0',
          '-f',
          'flv', // Force FLV format
        );
      } else {
        // For other formats, try to copy streams when possible
        ffmpegArgs.push(
          '-c:v',
          'copy',
          '-c:a',
          'copy',
          '-movflags',
          '+faststart',
        );
      }

      // Add progress monitoring and output
      ffmpegArgs.push('-progress', 'pipe:1', '-nostats', outputPath);

      const process = spawn(this.ffmpegPath, ffmpegArgs, { cwd: os.tmpdir() });

      let duration: number | null = null;
      let hasError = false;
      let errorMessage = '';

      process.stderr.on('data', (data) => {
        const dataStr = Buffer.from(data).toString();

        // Extract duration if not already found
        if (!duration) {
          const durationMatch = dataStr.match(
            /Duration: (\d{2}):(\d{2}):(\d{2})/,
          );
          if (durationMatch) {
            const [, hours, minutes, seconds] = durationMatch;
            duration =
              parseInt(hours) * 3600 +
              parseInt(minutes) * 60 +
              parseInt(seconds);
          }
        }

        // Check for errors but ignore certain warnings
        if (
          dataStr.toLowerCase().includes('error') &&
          !dataStr.includes('Error while decoding') &&
          !dataStr.includes(
            'Application provided invalid, non monotonically increasing dts',
          )
        ) {
          hasError = true;
          errorMessage = dataStr.trim();
          subject.error(new Error(errorMessage));
        }
      });

      process.stdout.on('data', (data) => {
        const dataStr = Buffer.from(data).toString();
        const timeMatch = dataStr.match(/time=(\d{2}):(\d{2}):(\d{2})/);

        if (timeMatch && duration) {
          const [, hours, minutes, seconds] = timeMatch;
          const currentTime =
            parseInt(hours) * 3600 + parseInt(minutes) * 60 + parseInt(seconds);
          const progress: ProgressType = {
            status: 'downloading',
            downloaded: currentTime,
            downloaded_str: `${currentTime}s`,
            total: duration,
            total_str: `${duration}s`,
            speed: 0,
            speed_str: '',
            eta: duration - currentTime,
            eta_str: `${duration - currentTime}s`,
            percentage: (currentTime / duration) * 100,
            percentage_str: `${((currentTime / duration) * 100).toFixed(2)}%`,
          };
          subject.next(progress);
        }
      });

      process.stdout.on('error', (err) => {
        hasError = true;
        errorMessage = err.message;
        subject.error(err);
      });

      process.stderr.on('error', (err) => {
        hasError = true;
        errorMessage = err.message;
        subject.error(err);
      });

      process.on('exit', (code) => {
        if (code !== 0 && !hasError) {
          subject.error(
            new Error(errorMessage || `Process exited with code ${code}`),
          );
        } else if (!hasError) {
          subject.complete();
        }
      });

      return subject.asObservable();
    } catch (err) {
      subject.error(err);
      return subject.asObservable();
    }
  }
}
