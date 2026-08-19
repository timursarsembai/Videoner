import { Module } from '@nestjs/common';
import { ProxyHealthService } from './proxy-health.service';

// ScheduleModule.forRoot() здесь сознательно НЕ импортируется: он уже поднят в
// CleanupModule, а второй forRoot() создаёт второй SchedulerOrchestrator, и
// каждая @Cron-задача начинает срабатывать дважды за тик (подробнее — в
// nudge.module.ts). AlertService доступен без импорта: AlertModule помечен
// @Global.
@Module({
  providers: [ProxyHealthService],
})
export class ProxyHealthModule {}
