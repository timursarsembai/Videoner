import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { join } from 'path';
import * as fs from 'fs';
import { promisify } from 'util';
import { PrismaService } from '../prisma/prisma.service';
import { DownloadStatus } from '@prisma/client';

const stat = promisify(fs.stat);
const unlink = promisify(fs.unlink);
const readdir = promisify(fs.readdir);

@Injectable()
export class CleanupService {
  private readonly logger = new Logger(CleanupService.name);
  private readonly downloadPath: string;

  constructor(private prisma: PrismaService) {
    this.downloadPath = join(__dirname, '..', '..', '..', 'downloads');
  }

  @Cron(CronExpression.EVERY_30_MINUTES)
  async cleanupOldFiles() {
    this.logger.log('Starting cleanup of old downloaded files...');

    try {
      // Раньше файлы удалялись по одному mtime, без сверки со статусом в БД.
      // Промежуточный файл конвертации (tempFileName) хранится на диске под
      // ИНЫМ именем, чем то, что записано в Download.filename (там всегда
      // finalFileName) — сопоставить конкретный файл на диске с конкретной
      // записью тут нельзя надёжно. Поэтому вместо точечной проверки просто
      // не трогаем ВООБЩЕ НИЧЕГО, пока идёт хоть одно активное скачивание —
      // при лимите длительности видео 4ч и cron каждые 30 мин это дёшево:
      // максимум один цикл очистки чуть отложится, зато конвертация больше
      // не может потерять свой входной файл посреди работы ffmpeg (см.
      // код-ревью 2026-07-23 — именно так необработанный ENOENT ронял
      // весь процесс до фикса в download.service.ts).
      const activeDownloads = await this.prisma.download.count({
        where: { status: { in: [DownloadStatus.DOWNLOADING, DownloadStatus.CONVERTING] } },
      });
      if (activeDownloads > 0) {
        this.logger.log(
          `Skipping cleanup — ${activeDownloads} download(s) still in progress.`,
        );
        return;
      }

      const files = await readdir(this.downloadPath);
      let deletedCount = 0;

      for (const file of files) {
        const filePath = join(this.downloadPath, file);
        try {
          const stats = await stat(filePath);
          const fileAge = Date.now() - stats.mtime.getTime();
          const isOlder = fileAge > 1 * 60 * 60 * 1000; // 1 hour in milliseconds

          if (isOlder) {
            await unlink(filePath);
            deletedCount++;
            this.logger.debug(`Deleted old file: ${file}`);

            // Update database record if exists
            await this.prisma.download.updateMany({
              where: {
                filename: file,
                status: {
                  in: [DownloadStatus.COMPLETED, DownloadStatus.FAILED],
                },
              },
              data: {
                status: DownloadStatus.EXPIRED,
              },
            });
          }
        } catch (error) {
          this.logger.error(`Error processing file ${file}:`, error);
        }
      }

      this.logger.log(`Cleanup completed. Deleted ${deletedCount} files.`);
    } catch (error) {
      this.logger.error('Error during cleanup:', error);
    }
  }
}
