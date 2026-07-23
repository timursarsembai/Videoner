import { Module } from '@nestjs/common';
import { YtdlpProcessService } from './ytdlp-process.service';
import { YtdlpFormatService } from './ytdlp-format.service';

// providers+exports здесь — ЕДИНСТВЕННОЕ место, где эти два сервиса должны
// создаваться. Модули-потребители (DownloadModule, InfoModule) обязаны
// импортировать YtdlpModule и получать эти инстансы через DI, а НЕ
// перечислять YtdlpProcessService/YtdlpFormatService в своих собственных
// providers — иначе Nest создаст отдельный инстанс на каждый такой модуль
// (см. подробный комментарий в ytdlp-process.service.ts про баг, который
// это уже вызывало: три независимых инстанса, три независимых семафора,
// setupBinaries() трижды при каждом старте).
@Module({
  providers: [YtdlpProcessService, YtdlpFormatService],
  exports: [YtdlpProcessService, YtdlpFormatService],
})
export class YtdlpModule {}
