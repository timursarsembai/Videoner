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
import { BotGroupService } from './bot-group.service';
import { ContentAnalyticsService } from './content-analytics.service';
import { BotGroupController } from './bot-group.controller';

@Module({
  controllers: [AnalyticsController, BotUserController, PublicStatsController, BotGroupController],
  providers: [
    PrismaService,
    BotUserService,
    AnalyticsService,
    RedditAnalyticsService,
    PublicStatsService,
    ChannelMembershipService,
    BotGroupService,
    ContentAnalyticsService,
  ],
  exports: [BotUserService],
})
export class AnalyticsModule {}
