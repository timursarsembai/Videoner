import { Module } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { BotUserService } from './bot-user.service';
import { AnalyticsService } from './analytics.service';
import { AnalyticsController } from './analytics.controller';

@Module({
  controllers: [AnalyticsController],
  providers: [PrismaService, BotUserService, AnalyticsService],
  exports: [BotUserService],
})
export class AnalyticsModule {}
