import { Body, Controller, Get, NotFoundException, Post, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AnalyticsService } from './analytics.service';
import { BotUserService } from './bot-user.service';
import { GrantUnlimitedDto } from './dto/grant-unlimited.dto';
import { AdminOnly } from '../auth/admin.decorator';

@ApiTags('Analytics')
@Controller('analytics')
@AdminOnly()
export class AnalyticsController {
  constructor(
    private readonly analyticsService: AnalyticsService,
    private readonly botUserService: BotUserService,
  ) {}

  @Get('overview')
  overview() {
    return this.analyticsService.overview();
  }

  @Get('platforms')
  platforms() {
    return this.analyticsService.platforms();
  }

  @Get('sources')
  sources() {
    return this.analyticsService.sources();
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

  @Get('errors/timeseries')
  errorsTimeseries(@Query('days') days?: string) {
    const parsed = parseInt(days ?? '30', 10);
    return this.analyticsService.errorsTimeseries(
      Number.isFinite(parsed) && parsed > 0 ? parsed : 30,
    );
  }

  @Get('subscriptions')
  subscriptions() {
    return this.analyticsService.subscriptions();
  }

  // Потолок в 200 строк — не вкусовщина: без него достаточно руками подставить
  // limit=100000, чтобы вытащить всю таблицу разом и посадить и сервер, и
  // браузер. Отрицательные и нечисловые значения схлопываются к дефолту.
  @Get('attempts')
  attempts(
    @Query('limit') limit?: string,
    @Query('offset') offset?: string,
    @Query('platform') platform?: string,
    @Query('status') status?: string,
  ) {
    const parsedLimit = parseInt(limit ?? '50', 10);
    const parsedOffset = parseInt(offset ?? '0', 10);
    return this.analyticsService.attempts(
      Number.isFinite(parsedLimit) && parsedLimit > 0
        ? Math.min(parsedLimit, 200)
        : 50,
      Number.isFinite(parsedOffset) && parsedOffset > 0 ? parsedOffset : 0,
      platform,
      status,
    );
  }

  @Post('bot-users/grant')
  async grantUnlimited(@Body() dto: GrantUnlimitedDto) {
    const result = await this.botUserService.setUnlimited(
      { telegramId: dto.telegramId, username: dto.username },
      dto.isUnlimited,
    );
    if (!result) {
      throw new NotFoundException(
        'Bot user not found — they must message the bot at least once first',
      );
    }
    return {
      telegramId: result.telegramId.toString(),
      username: result.username,
      isUnlimited: result.isUnlimited,
    };
  }
}
