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

  @Cron(CronExpression.EVERY_HOUR)
  async cleanupOldFiles() {
    this.logger.log('Starting cleanup of old downloaded files...');

    try {
      const files = await readdir(this.downloadPath);
      let deletedCount = 0;

      for (const file of files) {
        const filePath = join(this.downloadPath, file);
        try {
          const stats = await stat(filePath);
          const fileAge = Date.now() - stats.mtime.getTime();
          const isOlder = fileAge > 12 * 60 * 60 * 1000; // 12 hours in milliseconds

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
