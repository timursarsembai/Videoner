import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from '../prisma/prisma.module';
import { DownloadModule } from '../download/download.module';
import { YtdlpModule } from '../ytdlp/ytdlp.module';
import { CleanupModule } from '../cleanup/cleanup.module';
import { AuthModule } from '../auth/auth.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { InfoModule } from '../info/info.module';
import { AlertModule } from '../alert/alert.module';
import { AnalyticsModule } from '../analytics/analytics.module';
import { NudgeModule } from '../nudge/nudge.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    AlertModule,
    PrismaModule,
    AuthModule,
    AnalyticsModule,
    DownloadModule,
    YtdlpModule,
    CleanupModule,
    InfoModule,
    NudgeModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
