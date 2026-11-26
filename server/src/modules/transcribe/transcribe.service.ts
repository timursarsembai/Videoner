import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { execFile } from 'child_process';
import { randomUUID } from 'crypto';
import * as fs from 'fs';
import * as os from 'os';
import * as path from 'path';
import { lastValueFrom } from 'rxjs';
import { promisify } from 'util';
import { transcriptText, type WhisperSegment } from '../../lib/transcript';
import type { Platform } from '../../types';
import { getPlatform } from '../../validate/url';
import { YtdlpProcessService } from '../ytdlp/ytdlp-process.service';

const execFileAsync = promisify(execFile);

// «Текст из видео» (владелец 26.11.2026). Пока только для владельца (бот,
// ADMIN_TELEGRAM_ID): звук ролика → WAV 16 кГц → контейнер whisper (whisper.cpp
// на процессоре) → текст. Распознаём по одному ролику за раз: на 8 ядрах
// параллельные распознавания мешали бы скачиваниям. Задания живут в памяти:
// после перезапуска сервера незаконченное теряется, бот скажет об ошибке.

const MAX_SECONDS = 3 * 60 * 60;
const KEEP_DONE_MS = 60 * 60 * 1000;
const MAX_JOBS = 50;

type JobStatus = 'queued' | 'downloading' | 'transcribing' | 'done' | 'failed';
interface Job {
  status: JobStatus;
  telegramId: number;
  text?: string;
  language?: string;
  error?: string;
  finishedAt?: number;
}

@Injectable()
export class TranscribeService {
  private readonly jobs = new Map<string, Job>();
  private queue: Promise<unknown> = Promise.resolve();
  private readonly whisperUrl = (process.env.WHISPER_URL ?? '').replace(/\/+$/, '');

  constructor(private readonly ytdlp: YtdlpProcessService) {}

  allowed(telegramId: number): boolean {
    return !!this.whisperUrl && !!process.env.ADMIN_TELEGRAM_ID && String(telegramId) === process.env.ADMIN_TELEGRAM_ID;
  }

  start(url: string, telegramId: number): { jobId: string } {
    const platform = getPlatform(url);
    if (!platform) throw new BadRequestException('Unsupported URL');
    this.prune();
    if (this.jobs.size >= MAX_JOBS) throw new BadRequestException('Too many transcription jobs');
    const jobId = randomUUID();
    const job: Job = { status: 'queued', telegramId };
    this.jobs.set(jobId, job);
    this.queue = this.queue
      .then(() => this.run(job, url, platform as Platform))
      .catch((error) => {
        job.status = 'failed';
        job.error = String(error?.message ?? error).slice(0, 300);
        job.finishedAt = Date.now();
        console.error('[transcribe] не удалось:', job.error);
      });
    return { jobId };
  }

  status(jobId: string, telegramId: number) {
    const job = this.jobs.get(jobId);
    if (!job || job.telegramId !== telegramId) throw new NotFoundException('Job not found');
    const { status, text, language, error } = job;
    return { status, text, language, error };
  }

  private prune() {
    const now = Date.now();
    for (const [id, job] of this.jobs) {
      if (job.finishedAt && now - job.finishedAt > KEEP_DONE_MS) this.jobs.delete(id);
    }
  }

  private async run(job: Job, url: string, platform: Platform) {
    const dir = await fs.promises.mkdtemp(path.join(os.tmpdir(), 'transcribe-'));
    try {
      job.status = 'downloading';
      const progress$ = await this.ytdlp.download(url, platform, {
        filter: 'audioonly',
        quality: '128Kbps',
        format: 'wav',
        output: { outDir: dir, fileName: 'audio.wav' },
      } as any);
      await lastValueFrom(progress$, { defaultValue: null });
      const source = path.join(dir, 'audio.wav');
      if (!fs.existsSync(source)) throw new Error('Audio was not downloaded');
      const wav = path.join(dir, 'speech.wav');
      await execFileAsync(
        'ffmpeg',
        ['-v', 'error', '-y', '-i', source, '-t', String(MAX_SECONDS), '-ar', '16000', '-ac', '1', '-c:a', 'pcm_s16le', wav],
        { timeout: 10 * 60 * 1000 },
      );
      await fs.promises.unlink(source).catch(() => {});

      job.status = 'transcribing';
      const started = Date.now();
      const form = new FormData();
      form.append('file', new Blob([await fs.promises.readFile(wav)], { type: 'audio/wav' }), 'speech.wav');
      form.append('response_format', 'verbose_json');
      form.append('temperature', '0');
      const response = await fetch(`${this.whisperUrl}/inference`, {
        method: 'POST',
        body: form,
        signal: AbortSignal.timeout(6 * 60 * 60 * 1000),
      });
      if (!response.ok) throw new Error(`Whisper HTTP ${response.status}`);
      const body = (await response.json()) as { language?: string; segments?: WhisperSegment[]; text?: string; error?: string };
      if (body.error) throw new Error(`Whisper: ${body.error}`);
      job.text = body.segments?.length ? transcriptText(body.segments) : (body.text ?? '').trim();
      job.language = body.language;
      job.status = 'done';
      job.finishedAt = Date.now();
      console.log(`[transcribe] готово за ${Math.round((Date.now() - started) / 1000)} с, ${job.text.length} знаков`);
    } finally {
      await fs.promises.rm(dir, { recursive: true, force: true }).catch(() => {});
    }
  }
}
