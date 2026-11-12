import { BadRequestException, Body, Controller, Get, NotFoundException, Post, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AnalyticsService } from './analytics.service';
import { BotUserService } from './bot-user.service';
import { GrantUnlimitedDto } from './dto/grant-unlimited.dto';
import { AdminOnly } from '../auth/admin.decorator';
import { parseRange, type DateRange } from 'src/lib/analytics-range';

// Потолок для DAU/WAU/MAU по дням: каждая точка — отдельные подзапросы.
const ACTIVE_DAILY_MAX_DAYS = 1100;
// Сколько графиков дашборд может запросить одним пакетом (GET /batch).
const MAX_BATCH = 40;

type QueryParams = Record<string, unknown>;

@ApiTags('Analytics')
@Controller('analytics')
@AdminOnly()
export class AnalyticsController {
  // Запросы с периодом (from, to — YYYY-MM-DD, to не включается). Одна
  // таблица и для отдельных адресов ниже, и для пакета: дашборд просит
  // данные всех графиков вкладки одним запросом — у каждого графика свой
  // период, и по запросу на график быстро упёрлись бы в лимит частоты.
  private readonly queries: Record<string, (q: QueryParams) => Promise<unknown>> = {
    since: () => this.analyticsService.since(),
    overview: (q) => this.analyticsService.overview(this.range(q)),
    languages: (q) => this.analyticsService.languages(this.range(q)),
    countries: (q) => this.analyticsService.countries(this.range(q)),
    platforms: (q) => this.analyticsService.platforms(this.range(q)),
    sources: (q) => this.analyticsService.sources(this.range(q)),
    timeseries: (q) => this.analyticsService.timeseries(this.range(q)),
    weekdays: (q) => this.analyticsService.weekdays(this.range(q)),
    'traffic/daily': (q) => this.analyticsService.trafficDaily(this.range(q)),
    'traffic/monthly': (q) => this.analyticsService.trafficMonthly(this.range(q)),
    'users/activity': () => this.analyticsService.usersActivity(),
    'users/active/daily': (q) =>
      this.analyticsService.activeDaily(this.range(q, ACTIVE_DAILY_MAX_DAYS)),
    'users/active/weekly': (q) => this.analyticsService.activePeriods('week', this.range(q)),
    'users/active/monthly': (q) => this.analyticsService.activePeriods('month', this.range(q)),
    'users/blocked': () => this.analyticsService.blockedSummary(),
    'users/blocked/daily': (q) => this.analyticsService.blockedPeriods('day', this.range(q)),
    'users/blocked/weekly': (q) => this.analyticsService.blockedPeriods('week', this.range(q)),
    'users/blocked/monthly': (q) => this.analyticsService.blockedPeriods('month', this.range(q)),
    'users/top': (q) => this.analyticsService.topUsers(this.limit(q.limit, 20, 100)),
    errors: (q) => this.analyticsService.errors(this.range(q)),
    'errors/timeseries': (q) => this.analyticsService.errorsTimeseries(this.range(q)),
    'errors/platforms': (q) => this.analyticsService.errorsPlatforms(this.range(q)),
    'errors/log': (q) =>
      this.analyticsService.errorsLog(
        this.range(q),
        {
          // Фильтры — только то, что похоже на площадку и категорию: остальное
          // молча игнорируем, как в журнале попыток.
          platform: typeof q.platform === 'string' && /^[a-z]{1,20}$/.test(q.platform) ? q.platform : undefined,
          category: typeof q.category === 'string' && /^[A-Z_]{1,40}$/.test(q.category) ? q.category : undefined,
        },
        this.limit(q.limit, 50, 200),
        this.offset(q.offset),
      ),
  };

  constructor(
    private readonly analyticsService: AnalyticsService,
    private readonly botUserService: BotUserService,
  ) {}

  private range(q: QueryParams, maxDays?: number): DateRange {
    return parseRange(q.from, q.to, maxDays);
  }

  private offset(value: unknown): number {
    const parsed = parseInt(String(value ?? 0), 10);
    return Number.isFinite(parsed) && parsed > 0 ? Math.min(parsed, 100_000) : 0;
  }

  private limit(value: unknown, fallback: number, max: number): number {
    const parsed = parseInt(String(value ?? fallback), 10);
    return Number.isFinite(parsed) && parsed > 0 ? Math.min(parsed, max) : fallback;
  }

  // Пакет: q — JSON-массив [{ id, name, from?, to?, limit? }]. Ответ —
  // { [id]: данные } или { [id]: { error } } для запроса, который не удался:
  // один сломанный график не должен гасить остальные.
  @Get('batch')
  async batch(@Query('q') raw?: string) {
    let items: unknown;
    try {
      items = JSON.parse(raw ?? '[]');
    } catch {
      throw new BadRequestException('q must be a JSON array');
    }
    if (!Array.isArray(items) || items.length > MAX_BATCH) {
      throw new BadRequestException(`q must be an array of at most ${MAX_BATCH} queries`);
    }
    const entries = await Promise.all(
      items.map(async (item: unknown) => {
        const q = (item && typeof item === 'object' ? item : {}) as QueryParams;
        const id = typeof q.id === 'string' ? q.id : '';
        const run = typeof q.name === 'string' ? this.queries[q.name] : undefined;
        if (!id || !run) return [id || '?', { error: 'unknown query' }] as const;
        try {
          return [id, await run(q)] as const;
        } catch (e) {
          return [id, { error: e instanceof Error ? e.message : 'failed' }] as const;
        }
      }),
    );
    return Object.fromEntries(entries);
  }

  @Get('since')
  since() {
    return this.queries.since({});
  }

  @Get('overview')
  overview(@Query() q: QueryParams) {
    return this.queries.overview(q);
  }

  // Пользователи бота и скачивания по языкам интерфейса (вкладка «Языки»).
  @Get('languages')
  languages(@Query() q: QueryParams) {
    return this.queries.languages(q);
  }

  // Скачивания сайта и расширения по странам (вкладка «Страны»).
  @Get('countries')
  countries(@Query() q: QueryParams) {
    return this.queries.countries(q);
  }

  @Get('platforms')
  platforms(@Query() q: QueryParams) {
    return this.queries.platforms(q);
  }

  @Get('sources')
  sources(@Query() q: QueryParams) {
    return this.queries.sources(q);
  }

  @Get('timeseries')
  timeseries(@Query() q: QueryParams) {
    return this.queries.timeseries(q);
  }

  // Успешные скачивания по дням недели.
  @Get('weekdays')
  weekdays(@Query() q: QueryParams) {
    return this.queries.weekdays(q);
  }

  @Get('traffic/daily')
  trafficDaily(@Query() q: QueryParams) {
    return this.queries['traffic/daily'](q);
  }

  @Get('traffic/monthly')
  trafficMonthly(@Query() q: QueryParams) {
    return this.queries['traffic/monthly'](q);
  }

  @Get('users/activity')
  usersActivity() {
    return this.queries['users/activity']({});
  }

  @Get('users/active/daily')
  activeDaily(@Query() q: QueryParams) {
    return this.queries['users/active/daily'](q);
  }

  @Get('users/active/weekly')
  activeWeekly(@Query() q: QueryParams) {
    return this.queries['users/active/weekly'](q);
  }

  @Get('users/active/monthly')
  activeMonthly(@Query() q: QueryParams) {
    return this.queries['users/active/monthly'](q);
  }

  @Get('users/blocked')
  blocked() {
    return this.queries['users/blocked']({});
  }

  @Get('users/blocked/daily')
  blockedDaily(@Query() q: QueryParams) {
    return this.queries['users/blocked/daily'](q);
  }

  @Get('users/blocked/weekly')
  blockedWeekly(@Query() q: QueryParams) {
    return this.queries['users/blocked/weekly'](q);
  }

  @Get('users/blocked/monthly')
  blockedMonthly(@Query() q: QueryParams) {
    return this.queries['users/blocked/monthly'](q);
  }

  @Get('users/top')
  topUsers(@Query() q: QueryParams) {
    return this.queries['users/top'](q);
  }

  @Get('errors')
  errors(@Query() q: QueryParams) {
    return this.queries.errors(q);
  }

  @Get('errors/platforms')
  errorsPlatforms(@Query() q: QueryParams) {
    return this.queries['errors/platforms'](q);
  }

  @Get('errors/log')
  errorsLog(@Query() q: QueryParams) {
    return this.queries['errors/log'](q);
  }

  @Get('errors/timeseries')
  errorsTimeseries(@Query() q: QueryParams) {
    return this.queries['errors/timeseries'](q);
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
    @Query('source') source?: string,
  ) {
    const parsedOffset = parseInt(offset ?? '0', 10);
    return this.analyticsService.attempts(
      this.limit(limit, 50, 200),
      Number.isFinite(parsedOffset) && parsedOffset > 0 ? parsedOffset : 0,
      platform,
      status,
      source,
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
