import { Module } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { BotUserService } from './bot-user.service';
import { AnalyticsService } from './analytics.service';
import { AnalyticsController } from './analytics.controller';
import { BotUserController } from './bot-user.controller';
import { RedditAnalyticsService } from './reddit-analytics.service';
import { PublicStatsController } from './public-stats.controller';
import { PublicStatsService } from './public-stats.service';
import { ChannelMembershipService } from './channel-membership.service';

@Module({
  controllers: [AnalyticsController, BotUserController, PublicStatsController],
  providers: [
    PrismaService,
    BotUserService,
    AnalyticsService,
    RedditAnalyticsService,
    PublicStatsService,
    ChannelMembershipService,
  ],
  exports: [BotUserService],
})
export class AnalyticsModule {}
