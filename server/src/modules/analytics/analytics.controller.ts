import { Controller, Get, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AnalyticsService } from './analytics.service';
import { AdminOnly } from '../auth/admin.decorator';

@ApiTags('Analytics')
@Controller('analytics')
@AdminOnly()
export class AnalyticsController {
  constructor(private readonly analyticsService: AnalyticsService) {}

  @Get('overview')
  overview() {
    return this.analyticsService.overview();
  }

  @Get('platforms')
  platforms() {
    return this.analyticsService.platforms();
  }

  @Get('timeseries')
  timeseries(@Query('days') days?: string) {
    const parsed = parseInt(days ?? '30', 10);
    return this.analyticsService.timeseries(
      Number.isFinite(parsed) && parsed > 0 ? parsed : 30,
    );
  }

  @Get('users/activity')
  usersActivity() {
    return this.analyticsService.usersActivity();
  }

  @Get('users/top')
  topUsers(@Query('limit') limit?: string) {
    const parsed = parseInt(limit ?? '20', 10);
    return this.analyticsService.topUsers(
      Number.isFinite(parsed) && parsed > 0 ? parsed : 20,
    );
  }

  @Get('errors')
  errors() {
    return this.analyticsService.errors();
  }
}
