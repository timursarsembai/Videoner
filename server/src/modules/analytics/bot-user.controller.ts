import {
  BadRequestException,
  Body,
  Controller,
  Get,
  NotFoundException,
  Param,
  Post,
  UnauthorizedException,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { SubscriptionKind } from '@prisma/client';
import { createHash, createHmac, timingSafeEqual } from 'crypto';
import { BotUserService } from './bot-user.service';
import { SetSubscriptionDto } from './dto/set-subscription.dto';
import { TelegramLoginDto } from './dto/telegram-login.dto';

// Telegram Login Widget требует, чтобы auth_date не был слишком старым —
// иначе перехваченный однажды payload можно было бы реиграть бесконечно.
const MAX_AUTH_AGE_SECONDS = 24 * 60 * 60;

// Отдельно от AnalyticsController: тот целиком @AdminOnly(), а этот эндпоинт
// вызывает бот от лица ЛЮБОГО оплатившего пользователя (не только админа) —
// доверенная граница тут та же, что и у /download/*: валидный shared API-ключ бота.
@ApiTags('BotUsers')
@Controller('bot-users')
export class BotUserController {
  constructor(private readonly botUserService: BotUserService) {}

  @Post('subscription')
  async setSubscription(@Body() dto: SetSubscriptionDto) {
    // В проекте нет глобального ValidationPipe (см. RequestMetaDto в
    // download.dto.ts) — декораторы class-validator тут для Swagger, а не
    // рантайм-проверки. BigInt(telegramId)/parse даты на мусорном вводе иначе
    // падают необработанным 500 — здесь это единственная ручная проверка на входе.
    if (!Number.isFinite(dto.telegramId)) {
      throw new BadRequestException('telegramId must be a number');
    }
    if (!Object.values(SubscriptionKind).includes(dto.kind)) {
      throw new BadRequestException('kind must be MONTHLY or YEARLY');
    }
    const until = new Date(dto.until);
    if (Number.isNaN(until.getTime())) {
      throw new BadRequestException('until must be a valid date');
    }

    const result = await this.botUserService.setSubscriptionUntil(
      dto.telegramId,
      until,
      dto.kind,
      { username: dto.telegramUsername, languageCode: dto.telegramLanguageCode },
    );
    return {
      telegramId: result.telegramId.toString(),
      subscriptionUntil: result.subscriptionUntil,
      subscriptionKind: result.subscriptionKind,
    };
  }

  // Вызывается серверным route handler'ом веба (web/app/api/auth/telegram) —
  // НЕ браузером напрямую, поэтому провала CORS/шаринга секрета тут нет: бот-токен
  // остаётся только на этом сервере (см. план — веб его не получает и не хранит).
  @Post('telegram-login')
  async telegramLogin(@Body() dto: TelegramLoginDto) {
    if (
      !Number.isFinite(dto?.id) ||
      typeof dto?.hash !== 'string' ||
      !dto.hash ||
      !Number.isFinite(dto?.auth_date)
    ) {
      throw new BadRequestException('Invalid Telegram auth payload');
    }

    if (!this.verifyTelegramAuth(dto)) {
      throw new UnauthorizedException('Invalid Telegram signature');
    }

    const ageSeconds = Math.floor(Date.now() / 1000) - dto.auth_date;
    if (ageSeconds > MAX_AUTH_AGE_SECONDS || ageSeconds < -60) {
      throw new UnauthorizedException('Telegram auth expired, please log in again');
    }

    await this.botUserService.upsertBotUser({
      telegramId: dto.id,
      username: dto.username,
      firstName: dto.first_name,
      markWebLogin: true,
    });

    return this.botUserService.getSubscriptionStatus(dto.id);
  }

  // Для обновления статуса подписки на сайте (GET /api/auth/me) без
  // повторной проверки подписи Telegram при каждом заходе — сессия сайта уже
  // подтверждает личность, тут просто читаем актуальные данные по telegramId.
  @Get(':telegramId/subscription')
  async getSubscription(@Param('telegramId') telegramId: string) {
    const id = Number(telegramId);
    if (!Number.isFinite(id)) {
      throw new BadRequestException('telegramId must be a number');
    }

    const status = await this.botUserService.getSubscriptionStatus(id);
    if (!status) {
      throw new NotFoundException('Bot user not found');
    }
    return status;
  }

  // HMAC-SHA256 по документированному алгоритму Telegram Login Widget:
  // https://core.telegram.org/widgets/login#checking-authorization
  // secret_key = SHA256(bot_token); data-check-string — все поля кроме hash,
  // отсортированные по ключу, "key=value" через \n; сравнение — constant-time.
  private verifyTelegramAuth(dto: TelegramLoginDto): boolean {
    const botToken = process.env.BOT_TOKEN;
    if (!botToken) return false;

    const { hash, ...fields } = dto as unknown as Record<string, unknown>;
    if (typeof hash !== 'string' || !/^[0-9a-f]{64}$/i.test(hash)) return false;

    const dataCheckString = Object.entries(fields)
      .filter(([, value]) => value !== undefined && value !== null)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([key, value]) => `${key}=${value}`)
      .join('\n');

    const secretKey = createHash('sha256').update(botToken).digest();
    const computedHash = createHmac('sha256', secretKey)
      .update(dataCheckString)
      .digest('hex');

    const computedBuf = Buffer.from(computedHash, 'hex');
    const providedBuf = Buffer.from(hash, 'hex');
    if (computedBuf.length !== providedBuf.length) return false;
    return timingSafeEqual(computedBuf, providedBuf);
  }
}
