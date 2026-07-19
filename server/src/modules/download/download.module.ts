import { Module } from '@nestjs/common';
import { DownloadController } from './download.controller';
import { DownloadService } from './download.service';
import { PrismaService } from '../prisma/prisma.service';
import { YtdlpService } from '../ytdlp/ytdlp.service';

@Module({
  controllers: [DownloadController],
  providers: [DownloadService, PrismaService, YtdlpService],
  exports: [DownloadService],
})
export class DownloadModule {}
