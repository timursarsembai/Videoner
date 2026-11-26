import { Module } from '@nestjs/common';
import { YtdlpModule } from '../ytdlp/ytdlp.module';
import { TranscribeController } from './transcribe.controller';
import { TranscribeService } from './transcribe.service';

@Module({
  imports: [YtdlpModule],
  controllers: [TranscribeController],
  providers: [TranscribeService],
})
export class TranscribeModule {}
