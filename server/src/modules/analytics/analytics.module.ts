import { Module } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { BotUserService } from './bot-user.service';
import { AnalyticsService } from './analytics.service';
import { AnalyticsController } from './analytics.controller';
import { BotUserController } from './bot-user.controller';
import { SubscriptionReminderService } from './subscription-reminder.service';

@Module({
  controllers: [AnalyticsController, BotUserController],
  providers: [
    PrismaService,
    BotUserService,
    AnalyticsService,
    SubscriptionReminderService,
  ],
  exports: [BotUserService],
})
export class AnalyticsModule {}
