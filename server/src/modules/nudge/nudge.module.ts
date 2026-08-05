import { Module } from '@nestjs/common';
import { NudgeService } from './nudge.service';
import { PrismaModule } from '../prisma/prisma.module';

// ScheduleModule.forRoot() здесь сознательно НЕ импортируется: он уже поднят в
// CleanupModule, а второй forRoot() создаёт второй SchedulerOrchestrator — и
// каждая @Cron-задача начинает срабатывать дважды за тик. Для рассылки живым
// людям это означало бы два одинаковых сообщения подряд. Обходчик расписаний
// сканирует ВСЕ провайдеры приложения, поэтому @Cron в NudgeService находится
// и без локального импорта.
@Module({
  imports: [PrismaModule],
  providers: [NudgeService],
})
export class NudgeModule {}
