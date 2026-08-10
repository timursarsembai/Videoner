import { Module } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { BotUserService } from './bot-user.service';
import { AnalyticsService } from './analytics.service';
import { AnalyticsController } from './analytics.controller';
import { BotUserController } from './bot-user.controller';

@Module({
  controllers: [AnalyticsController, BotUserController],
  providers: [
    PrismaService,
    BotUserService,
    AnalyticsService,
  ],
  exports: [BotUserService],
})
export class AnalyticsModule {}
