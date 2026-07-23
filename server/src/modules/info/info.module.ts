import { Module } from '@nestjs/common';
import { InfoService } from './info.service';
import { InfoController } from './info.controller';
import { PrismaService } from '../prisma/prisma.service';
import { YtdlpModule } from '../ytdlp/ytdlp.module';
import { DownloadModule } from '../download/download.module';
import { AnalyticsModule } from '../analytics/analytics.module';

@Module({
  // YtdlpModule импортируется (не YtdlpFormatService напрямую в providers) —
  // см. комментарий в download.module.ts и ytdlp-process.service.ts про
  // баг с тройным инстансом, который так фиксится.
  imports: [DownloadModule, AnalyticsModule, YtdlpModule],
  providers: [InfoService, PrismaService],
  controllers: [InfoController],
})
export class InfoModule {}
