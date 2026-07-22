import { BadRequestException, Body, Controller, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { SubscriptionKind } from '@prisma/client';
import { BotUserService } from './bot-user.service';
import { SetSubscriptionDto } from './dto/set-subscription.dto';

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
}
