import { Module } from '@nestjs/common';
import { ValidationReportService } from './validation-report.service';

// ScheduleModule.forRoot() здесь сознательно НЕ импортируется: он уже поднят в
// CleanupModule, а второй forRoot() создаёт второй SchedulerOrchestrator, и
// каждая @Cron-задача начинает срабатывать дважды за тик (подробнее — в
// nudge.module.ts).
@Module({
  providers: [ValidationReportService],
})
export class ValidationReportModule {}
