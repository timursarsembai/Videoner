import { Module } from '@nestjs/common';
import { ProxyHealthService } from './proxy-health.service';
import { YtdlpModule } from '../ytdlp/ytdlp.module';

// ScheduleModule.forRoot() здесь сознательно НЕ импортируется: он уже поднят в
// CleanupModule, а второй forRoot() создаёт второй SchedulerOrchestrator, и
// каждая @Cron-задача начинает срабатывать дважды за тик (подробнее — в
// nudge.module.ts). AlertService доступен без импорта: AlertModule помечен
// @Global.
@Module({
  // Список прокси и их блокировки по площадкам — у YtdlpProcessService.
  imports: [YtdlpModule],
  providers: [ProxyHealthService],
})
export class ProxyHealthModule {}
