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

  // Антибот-заглушки: площадка отдала не страницу видео, а проверку, и
  // экстрактору не из чего достать данные. От блокировки по IP отличается тем,
  // что адрес тут ни при чём — тот же запрос через несколько секунд обычно
  // проходит. Чаще всего это TikTok ("universal data for rehydration"), но
  // формулировки у него со временем меняются, поэтому список по признаку
  // «экстрактор не нашёл данные на странице», а не по имени площадки.
  //
  // Список намеренно узкий: сюда НЕ входят таймауты и сетевые обрывы. Повторять
  // скачивание, которое отвалилось на середине большого файла, — это удвоенный
  // трафик и минуты ожидания, а причина там обычно не разовая.
  private static readonly TRANSIENT_PATTERNS: RegExp[] = [
    /unable to extract universal data for rehydration/i,
    /unable to extract sigi state/i,
    /unable to extract webpage video data/i,
    /unable to extract initial state/i,
    // Rutube периодически отвечает 401 на служебный JSON видео, хотя ролик
    // публичный и метаданные за секунду до этого прочитались нормально
    // (пойман 07.08.2026 на публичном мультфильме; повтор проходит).
    // Шаблон намеренно привязан к download video JSON, а не к «401» вообще:
    // 401 на других шагах вполне может означать, что вход и правда нужен, и
    // повторять такое бессмысленно.
    /unable to download video json.*401/i,
  ];

  private isTransientError(message: string): boolean {
    return YtdlpProcessService.TRANSIENT_PATTERNS.some((re) => re.test(message));
  }

  // Протухшая сессия в cookies/<платформа>.txt. Площадка отвечает отказом
  // авторизации именно ПОТОМУ, что мы пришли с недействительными куками —
  // анонимный запрос при этом проходит нормально. Такой откат уже был для
  // метаданных (info.service), но не для самой загрузки: пользователь видел
  // название ролика и кнопки качества, а после нажатия получал ошибку
  // (поймано на Rutube 07.08.2026, куки от 31.07 протухли).
  //
  // "Sign in to confirm you're not a bot" сюда НЕ входит намеренно: это
  // антибот-проверка YouTube по адресу, лечится прокси, а не отказом от кук.
  private static readonly AUTH_PATTERNS: RegExp[] = [
    /http error 401/i,
    /401:?\s*unauthorized/i,
    /login required/i,
    /requires authentication/i,
    /only available for registered users/i,
  ];

  private isAuthError(message: string): boolean {
    return YtdlpProcessService.AUTH_PATTERNS.some((re) => re.test(message));
  }

  // Пауза растёт между попытками: если площадка сейчас показывает всем
  // антибот-страницу, долбиться в неё каждые полсекунды бессмысленно.
  private transientRetryDelay(attempt: number): number {
    return [1500, 4000][attempt] ?? 4000;
  }

  private delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  private readonly MAX_TRANSIENT_RETRIES = 2;

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

  // Прокси не помог — снимаем отметку, иначе площадка осталась бы ходить
  // длинным путём шесть часов без всякой пользы.
  private forgetProxyNeeded(platform: string | null): void {
    if (!platform || this.alwaysProxyPlatforms.has(platform)) {
      return;
    }
    if (this.proxyUntil.delete(platform)) {
      console.log(`[proxy] ${platform}: прокси не помог, отметку снял`);
    }
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
      }
      let useCookies = disposableCookies !== null;
      let cookiesDropped = false;

      // Цикл покрывает два РАЗНЫХ сценария повтора, и их важно не смешивать:
      //   блокировка по адресу -> переключаемся на прокси и пробуем сразу;
      //   антибот-заглушка     -> тот же путь, но после паузы.
      // Первый повтор адреса не тратит попытки второго: смена маршрута и
      // ожидание, пока площадка «отпустит», — разные вещи.
      let useProxy = this.needsProxy(platform);
      let switchedToProxy = false;
      let transientAttempt = 0;

      for (;;) {
        const attemptArgs = [...finalArgs];
        if (useCookies && disposableCookies) {
          attemptArgs.push('--cookies', disposableCookies);
        }
        if (useProxy) {
          attemptArgs.push('--proxy', this.youtubeProxyUrl as string);
        }
        console.log(attemptArgs);

        try {
          const result = await this.runProcess(this.ytdlpPath, attemptArgs);
          // Запоминаем только после УСПЕШНОГО повтора через прокси: если и
          // через него не вышло, дело не в адресе, и гонять туда следующие
          // запросы незачем.
          if (switchedToProxy) {
            this.rememberProxyNeeded(platform);
          }
          return result;
        } catch (attemptError: any) {
          const message = attemptError?.message ?? '';

          // Блокировка по адресу — уходим на прокси, если ещё не там.
          if (!useProxy && this.youtubeProxyUrl && this.isBlockError(message)) {
            console.warn(
              `[proxy] ${platform ?? 'unknown'}: прямой запрос упёрся в блокировку, повторяю через прокси`,
            );
            useProxy = true;
            switchedToProxy = true;
            continue;
          }

          // Протухшие куки — пробуем анонимно тем же маршрутом.
          if (
            useCookies &&
            !cookiesDropped &&
            disposableCookies &&
            this.isAuthError(message)
          ) {
            console.warn(
              `[cookies] ${platform ?? 'unknown'}: отказ авторизации, повторяю без кук`,
            );
            useCookies = false;
            cookiesDropped = true;
            continue;
          }

          // Антибот-заглушка — тот же маршрут, но с паузой.
          if (
            this.isTransientError(message) &&
            transientAttempt < this.MAX_TRANSIENT_RETRIES
          ) {
            const wait = this.transientRetryDelay(transientAttempt);
            transientAttempt++;
            console.warn(
              `[retry] ${platform ?? 'unknown'}: антибот-заглушка, попытка ${transientAttempt + 1} из ${this.MAX_TRANSIENT_RETRIES + 1} через ${wait} мс`,
            );
            await this.delay(wait);
            continue;
          }

          throw attemptError;
        }
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
    // В аргументы НЕ вшивается: от кук может понадобиться отказаться на
    // повторной попытке (протухшая сессия), поэтому флаг добавляется в
    // startAttempt(). Удаляется в finalize() ниже.
    const disposableCookies = this.makeDisposableCookies(platform);

    // Общий слот — до YouTube-специфичного: если сервер и так забит другими
    // площадками, лишний смысл сначала ждать YouTube-слот, а потом ещё общий.
    const releaseGlobalSlot = await this.globalDownloadSemaphore.acquire();

    const isYoutube = platform === 'youtube';
    let releaseYoutubeSlot: (() => void) | null = null;
    if (isYoutube) {
      releaseYoutubeSlot = await this.youtubeSemaphore.acquire();
      await this.youtubeThrottleDelay();
    }

    // Слоты семафоров и одноразовые куки живут на ВСЕ попытки сразу, поэтому
    // освобождать их можно только один раз и только когда стало окончательно
    // ясно, что повторов больше не будет.
    let finished = false;
    const finalize = () => {
      if (finished) {
        return;
      }
      finished = true;
      this.dropDisposableCookies(disposableCookies);
      releaseYoutubeSlot?.();
      releaseGlobalSlot();
    };

    // Повторяем ТОЛЬКО пока подписчику не ушло ни одного байта прогресса.
    // После этого перезапуск означал бы, что счётчик у пользователя прыгнул
    // назад, а трафик потрачен дважды.
    let progressEmitted = false;
    let transientAttempt = 0;
    let proxySwitchTried = false;
    // Живёт между попытками: пометку ставит одна попытка, а снимать её при
    // неудаче приходится уже следующей.
    let proxyMarkedByUs = false;
    let useCookies = disposableCookies !== null;
    let cookiesDropped = false;

    const startAttempt = () => {
      // Решение о прокси перечитываем на каждой попытке: предыдущая могла
      // наткнуться на блокировку и пометить площадку.
      const useProxyNow = this.needsProxy(platform);
      const attemptArgs = [...processArgs];
      if (useCookies && disposableCookies) {
        attemptArgs.push('--cookies', disposableCookies);
      }
      if (useProxyNow) {
        attemptArgs.push('--proxy', this.youtubeProxyUrl as string);
      }

      // cwd=/tmp — см. комментарий в runProcess() выше: контейнер не от root,
      // /app не writable, а yt-dlp может писать служебные файлы относительно cwd.
      const childProcess = spawn(this.ytdlpPath, attemptArgs, {
        cwd: os.tmpdir(),
      });

      let hasError = false;
      let errorMessage = '';
      // null — повторов не будет, ошибка окончательная.
      let pendingRetry: 'transient' | 'proxy' | 'nocookies' | null = null;

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
          progressEmitted = true;
          subject.next(result);
        }
      });

      childProcess.stderr.on('data', (data) => {
        const dataStr = Buffer.from(data).toString();
        // yt-dlp пишет в stderr и предупреждения — фатальными считаем только строки с ERROR
        if (dataStr.includes('ERROR')) {
          errorMessage = dataStr.trim();

          // Блокировка по адресу вскрылась уже на загрузке (страница открылась,
          // а CDN отдал 403): уходим на прокси и пробуем ещё раз. Площадку
          // пометим только если через прокси действительно получилось — иначе
          // следующие запросы зря пошли бы в обход.
          if (
            !useProxyNow &&
            !proxySwitchTried &&
            !progressEmitted &&
            this.youtubeProxyUrl &&
            this.isBlockError(errorMessage)
          ) {
            proxySwitchTried = true;
            pendingRetry = 'proxy';
            return;
          }

          // Протухшая сессия в куках — повторяем анонимно. Именно этого не
          // хватало на пути загрузки: метаданные откатывались на анонимный
          // запрос и показывали кнопки качества, а само скачивание падало.
          if (
            useCookies &&
            !cookiesDropped &&
            disposableCookies &&
            !progressEmitted &&
            this.isAuthError(errorMessage)
          ) {
            pendingRetry = 'nocookies';
            return;
          }

          // Антибот-заглушка — повторяем тем же маршрутом после паузы.
          if (
            !progressEmitted &&
            this.isTransientError(errorMessage) &&
            transientAttempt < this.MAX_TRANSIENT_RETRIES
          ) {
            pendingRetry = 'transient';
            return;
          }

          hasError = true;
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
        finalize();
        if (!hasError) {
          hasError = true;
          subject.error(err);
        }
      });

      childProcess.on('exit', (code) => {
        if (code !== 0 && pendingRetry) {
          if (pendingRetry === 'proxy') {
            // Пометка нужна прямо сейчас: следующая попытка читает решение
            // через needsProxy(). Если она провалится, отметку снимаем ниже.
            this.rememberProxyNeeded(platform);
            proxyMarkedByUs = true;
            console.warn(
              `[proxy] ${platform}: блокировка на этапе загрузки, повторяю через прокси`,
            );
            startAttempt();
            return;
          }
          if (pendingRetry === 'nocookies') {
            useCookies = false;
            cookiesDropped = true;
            console.warn(
              `[cookies] ${platform}: отказ авторизации на загрузке, повторяю без кук`,
            );
            startAttempt();
            return;
          }
          const wait = this.transientRetryDelay(transientAttempt);
          transientAttempt++;
          console.warn(
            `[retry] ${platform}: антибот-заглушка на загрузке, попытка ${transientAttempt + 1} из ${this.MAX_TRANSIENT_RETRIES + 1} через ${wait} мс`,
          );
          setTimeout(startAttempt, wait);
          return;
        }

        // Через прокси тоже не вышло — значит адрес был ни при чём, снимаем
        // отметку, чтобы следующие запросы снова шли коротким путём.
        if (code !== 0 && useProxyNow && proxyMarkedByUs) {
          this.forgetProxyNeeded(platform);
        }

        finalize();
        if (code !== 0 && !hasError) {
          subject.error(
            new Error(errorMessage || `Process exited with code ${code}`),
          );
        } else if (!hasError) {
          subject.complete();
        }
      });
    };

    startAttempt();

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
