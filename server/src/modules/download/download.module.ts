import { Module } from '@nestjs/common';
import { DownloadController } from './download.controller';
import { DownloadService } from './download.service';
import { PrismaService } from '../prisma/prisma.service';
import { YtdlpModule } from '../ytdlp/ytdlp.module';
import { AnalyticsModule } from '../analytics/analytics.module';

@Module({
  // YtdlpModule импортируется (а не YtdlpProcessService/YtdlpFormatService
  // напрямую в providers) — иначе получим отдельный, не связанный с
  // остальным приложением инстанс, и семафоры в нём перестанут быть
  // глобальными (см. подробности в ytdlp-process.service.ts).
  imports: [AnalyticsModule, YtdlpModule],
  controllers: [DownloadController],
  providers: [DownloadService, PrismaService],
  exports: [DownloadService],
})
export class DownloadModule {}
