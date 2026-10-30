import {
  BadRequestException,
  Body,
  Controller,
  Get,
  NotFoundException,
  Param,
  Post,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { BotOnlyGuard } from 'src/lib/bot-auth';
import { LANGUAGE_CODE } from '../group-settings/group-settings.service';
import { ApiTags } from '@nestjs/swagger';
import { createHash, createHmac, timingSafeEqual } from 'crypto';
import { BotUserService } from './bot-user.service';
import { TelegramLoginDto } from './dto/telegram-login.dto';

// Telegram Login Widget требует, чтобы auth_date не был слишком старым —
// иначе перехваченный однажды payload можно было бы реиграть бесконечно.
const MAX_AUTH_AGE_SECONDS = 24 * 60 * 60;

// Отдельно от AnalyticsController: тот целиком @AdminOnly(), а сюда ходит веб
// от лица любого пользователя — доверенная граница та же, что и у /download/*:
// валидный shared API-ключ.
function parseTelegramId(raw: string): number {
  const id = Number(raw);
  if (!/^\d{1,16}$/.test(raw) || !Number.isSafeInteger(id)) throw new BadRequestException('Invalid telegramId');
  return id;
}

@ApiTags('BotUsers')
@Controller('bot-users')
export class BotUserController {
  constructor(private readonly botUserService: BotUserService) {}

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

    return this.botUserService.getProfile(dto.id);
  }

  // Бот сообщает, что человек его заблокировал или разблокировал (Telegram
  // присылает боту my_chat_member). Только для статистики в дашборде.
  @Post('blocked')
  async setBlocked(@Body() body: { telegramId?: unknown; blocked?: unknown }) {
    if (!Number.isSafeInteger(body?.telegramId) || typeof body?.blocked !== 'boolean') {
      throw new BadRequestException('telegramId and blocked are required');
    }
    await this.botUserService.setBlocked(body.telegramId as number, body.blocked, 'telegram');
    return { ok: true };
  }

  // Язык бота, выбранный вручную (/language в боте). Только для бота: иначе
  // любой с API-ключом сайта переключал бы язык чужим людям.
  @Get(':telegramId/language')
  @UseGuards(BotOnlyGuard)
  async getLanguage(@Param('telegramId') telegramId: string) {
    return { language: await this.botUserService.getLanguage(parseTelegramId(telegramId)) };
  }

  // language: код ("uk") или null — снова по языку Telegram.
  @Post(':telegramId/language')
  @UseGuards(BotOnlyGuard)
  async setLanguage(@Param('telegramId') telegramId: string, @Body() body: { language?: unknown }) {
    const language = body?.language ?? null;
    if (language !== null && !(typeof language === 'string' && LANGUAGE_CODE.test(language))) {
      throw new BadRequestException('Invalid language');
    }
    await this.botUserService.setLanguage(parseTelegramId(telegramId), language as string | null);
    return { language };
  }

  // Для обновления профиля на сайте (GET /api/auth/me) без повторной проверки
  // подписи Telegram при каждом заходе — сессия сайта уже подтверждает
  // личность, тут просто читаем актуальные данные по telegramId.
  @Get(':telegramId/profile')
  async getProfile(@Param('telegramId') telegramId: string) {
    const id = Number(telegramId);
    if (!Number.isFinite(id)) {
      throw new BadRequestException('telegramId must be a number');
    }

    const profile = await this.botUserService.getProfile(id);
    if (!profile) {
      throw new NotFoundException('Bot user not found');
    }
    return profile;
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
