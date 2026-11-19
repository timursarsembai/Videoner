import { Module } from '@nestjs/common';
import { InfoService } from './info.service';
import { InfoController } from './info.controller';
import { PrismaService } from '../prisma/prisma.service';
import { YtdlpModule } from '../ytdlp/ytdlp.module';
import { UserCookiesModule } from '../user-cookies/user-cookies.module';
import { DownloadModule } from '../download/download.module';
import { AnalyticsModule } from '../analytics/analytics.module';
import { AdultAuthorsModule } from '../adult-authors/adult-authors.module';
import { InfoJobsService } from './info-jobs.service';
import { InfoJobsController } from './info-jobs.controller';

@Module({
  // YtdlpModule импортируется (не YtdlpFormatService напрямую в providers) —
  // см. комментарий в download.module.ts и ytdlp-process.service.ts про
  // баг с тройным инстансом, который так фиксится.
  imports: [DownloadModule, AnalyticsModule, YtdlpModule, UserCookiesModule, AdultAuthorsModule],
  providers: [InfoService, PrismaService, InfoJobsService],
  controllers: [InfoController, InfoJobsController],
})
export class InfoModule {}
