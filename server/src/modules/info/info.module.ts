import { Module } from '@nestjs/common';
import { InfoService } from './info.service';
import { InfoController } from './info.controller';
import { PrismaService } from '../prisma/prisma.service';
import { YtdlpService } from '../ytdlp/ytdlp.service';
import { DownloadModule } from '../download/download.module';
import { AnalyticsModule } from '../analytics/analytics.module';

@Module({
  imports: [DownloadModule, AnalyticsModule],
  providers: [InfoService, PrismaService, YtdlpService],
  controllers: [InfoController],
})
export class InfoModule {}