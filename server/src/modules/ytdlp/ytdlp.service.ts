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
import {
  BinPathType,
  DownloadKeyWord,
  DownloadOptions,
  Platform,
  ProgressType,
} from '../../types';
import { PlaylistVideoInfo, YtdlpVideoInfo } from '../../types/youtube';
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

@Injectable()
export class YtdlpService implements OnModuleInit {
  private ytdlpPath: string;
  private ffmpegPath: string;
  private readonly binariesDir: string;
  private readonly cookiesFilePath: string;
  // Статический ISP-прокси (IPRoyal) — только для YouTube: датацентр-IP VPS
  // заблокирован антибот-защитой YouTube, остальные площадки прокси не требуют.
  private readonly youtubeProxyUrl?: string;
  private readonly youtubeSemaphore = new Semaphore(YOUTUBE_MAX_CONCURRENT);

  constructor() {
    this.binariesDir = path.join(process.cwd(), 'bin');
    this.cookiesFilePath = path.resolve(process.cwd(), 'cookies.txt');
    this.youtubeProxyUrl = process.env.YOUTUBE_PROXY_URL || undefined;
  }

  private isYoutubeUrl(url: string): boolean {
    return /(^|\.)youtube\.com|youtu\.be/i.test(url);
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

  async ytdlp(args: string[]): Promise<{ stdout: string; stderr: string }> {
    const isYoutube = args.some((a) => this.isYoutubeUrl(a));
    const releaseSlot = isYoutube ? await this.youtubeSemaphore.acquire() : null;
    try {
      if (isYoutube) {
        await this.youtubeThrottleDelay();
      }
      const argsWithQuotes = this.addQuotesToCommand(args);
      if (this.hasCookies()) {
        argsWithQuotes.push('--cookies', this.cookiesFilePath);
      }
      if (this.youtubeProxyUrl && isYoutube) {
        argsWithQuotes.push('--proxy', this.youtubeProxyUrl);
      }
      console.log(argsWithQuotes);
      const command = `"${this.ytdlpPath}" ${argsWithQuotes.join(' ')}`;
      return await execAsync(command);
    } catch (error) {
      throw new Error(`Failed to run yt-dlp command: ${error.message}`);
    } finally {
      releaseSlot?.();
    }
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

  private addQuotesToCommand(args: string[]): string[] {
    return args.map((arg) => (arg.startsWith('-') ? arg : `"${arg}"`));
  }

  // Считаем cookies заданными только если файл существует и непустой —
  // так пустышку-заглушку (удобно монтировать в Docker) yt-dlp не получит.
  private hasCookies(): boolean {
    try {
      return (
        fsSync.existsSync(this.cookiesFilePath) &&
        fsSync.statSync(this.cookiesFilePath).size > 0
      );
    } catch {
      return false;
    }
  }

  async getYtdlpVideoInfo(url: string): Promise<YtdlpVideoInfo> {
    const command = ['--dump-json', '--no-download', url];
    return this.ytdlp(command).then((result) => {
      return JSON.parse(result.stdout);
    });
  }

  async getYoutubePlaylistInfo(url: string): Promise<PlaylistVideoInfo[]> {
    const command = [
      '--dump-json',
      '--no-download',
      '--flat-playlist',
      '--playlist-reverse',
      url,
    ];
    return this.ytdlp(command).then((result) => {
      // Split output into lines and filter empty lines
      const jsonLines = result.stdout.split('\n').filter((line) => line.trim());
      // parse all json lines
      const json = jsonLines.map((line) => JSON.parse(line));

      return json;
    });
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

    let parseOptions = parseDownloadOptions(options);

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

    if (this.hasCookies()) {
      processArgs.push('--cookies', this.cookiesFilePath);
    }

    const isYoutube = platform === 'youtube';
    let releaseYoutubeSlot: (() => void) | null = null;
    if (isYoutube) {
      releaseYoutubeSlot = await this.youtubeSemaphore.acquire();
      await this.youtubeThrottleDelay();
    }

    if (this.youtubeProxyUrl && isYoutube) {
      processArgs.push('--proxy', this.youtubeProxyUrl);
    }

    const childProcess = spawn(this.ytdlpPath, processArgs);

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

    childProcess.on('exit', (code) => {
      releaseYoutubeSlot?.();
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

      // Get input format info
      const { stdout } = await execAsync(
        `"${this.ffmpegPath}" -i "${inputPath}" 2>&1`,
      ).catch((err) => ({ stdout: err.message }));
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

      const process = spawn(this.ffmpegPath, ffmpegArgs);

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
