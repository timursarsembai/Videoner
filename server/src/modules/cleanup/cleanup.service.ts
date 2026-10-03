import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
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
export class CleanupService implements OnModuleInit {
  private readonly logger = new Logger(CleanupService.name);
  private readonly downloadPath: string;

  constructor(private prisma: PrismaService) {
    this.downloadPath = join(__dirname, '..', '..', '..', 'downloads');
  }

  // Скачивание живёт в процессе yt-dlp, порождённом этим сервером, и
  // перезапуск (каждая выкатка) убивает его без следа. Запись в БД при этом
  // навсегда оставалась «качается» — и очистка ниже, которая ждёт, пока не
  // останется ни одного активного скачивания, больше не запускалась никогда:
  // диск только копил файлы. Сразу после старта активных скачиваний быть не
  // может, поэтому всё незавершённое помечаем неудачным — оно и правда не
  // завершилось.
  async onModuleInit() {
    try {
      const { count } = await this.prisma.download.updateMany({
        where: {
          status: {
            in: [
              DownloadStatus.PENDING,
              DownloadStatus.DOWNLOADING,
              DownloadStatus.CONVERTING,
            ],
          },
        },
        data: { status: DownloadStatus.FAILED },
      });
      if (count > 0) {
        this.logger.warn(
          `Marked ${count} download(s) interrupted by the restart as failed.`,
        );
      }
    } catch (error) {
      this.logger.error('Failed to mark interrupted downloads:', error);
    }
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
          // Полчаса, а не час: пост из карусели занимает на диске столько же
          // места, сколько раньше занимал десяток скачиваний, и держать всё это
          // лишний час незачем. Цикл идёт каждые 30 минут, так что файл живёт
          // от 30 до 60 минут — боту это безразлично (он отдаёт файл сразу),
          // а на сайте у человека остаётся полчаса гарантированно.
          const isOlder = fileAge > 30 * 60 * 1000;

          if (isOlder) {
            await unlink(filePath);
            deletedCount++;
            this.logger.debug(`Deleted old file: ${file}`);

            // Update database record if exists.
            // У поста из нескольких файлов Download.filename — только первый,
            // поэтому ищем и по items: удалили любой файл поста — весь пост
            // больше не выдать целиком, и он считается устаревшим.
            await this.prisma.download.updateMany({
              where: {
                OR: [{ filename: file }, { items: { some: { filename: file } } }],
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
