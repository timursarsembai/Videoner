import { Module } from '@nestjs/common';
import { YtdlpService } from './ytdlp.service';

@Module({
  providers: [YtdlpService],
  exports: [YtdlpService],
})
export class YtdlpModule {}
