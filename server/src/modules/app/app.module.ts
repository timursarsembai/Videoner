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

@Module({
  imports: [
    ConfigModule.forRoot(),
    PrismaModule,
    AuthModule,
    DownloadModule,
    YtdlpModule,
    CleanupModule,
    InfoModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
