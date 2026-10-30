import { BadRequestException, Body, Controller, Get, HttpCode, Param, Post, UseGuards } from '@nestjs/common';
import { BotOnlyGuard } from 'src/lib/bot-auth';
import { ApiOperation, ApiSecurity, ApiTags } from '@nestjs/swagger';
import { Owner, UserCookiesService } from './user-cookies.service';

// Проверка тела — руками: DTO здесь валидируются только в режиме наблюдения
// (lib/shadow-validation.pipe.ts) и запрос не отвергают.
function owner(body: any): Owner {
  const o = body?.owner;
  if (!o || !Number.isSafeInteger(o.telegramId) || o.telegramId <= 0) throw new BadRequestException('Invalid owner');
  return {
    telegramId: o.telegramId,
    name: typeof o.name === 'string' ? o.name.slice(0, 128) : undefined,
    lang: typeof o.lang === 'string' ? o.lang.slice(0, 16) : undefined,
  };
}

function str(v: unknown, field: string): string {
  if (typeof v !== 'string' || !v) throw new BadRequestException(`Invalid ${field}`);
  return v;
}

function telegramIdParam(raw: string): number {
  const id = Number(raw);
  if (!Number.isSafeInteger(id) || id <= 0) throw new BadRequestException('Invalid telegramId');
  return id;
}

// Куки, подключённые людьми (см. UserCookiesService). Все пути — только для
// бота (BotOnlyGuard, lib/bot-auth.ts), кроме POST /user-cookies/codes: туда
// куки шлёт расширение через прокси сайта (web/app/api/ext/[...path]/route.ts),
// и код сам по себе ничего не даёт — подключает его бот.
@ApiTags('User Cookies')
@Controller('user-cookies')
@ApiSecurity('X-API-Key')
@UseGuards(BotOnlyGuard)
export class UserCookiesController {
  constructor(private readonly cookies: UserCookiesService) {}

  @Post('file')
  @HttpCode(200)
  @ApiOperation({ summary: 'Connect cookies from a cookies.txt sent to the bot' })
  addFromFile(@Body() body: any) {
    return this.cookies.addFromFile(str(body?.scope, 'scope'), str(body?.raw, 'raw'), owner(body), body?.platform);
  }

  @Post('claim')
  @HttpCode(200)
  @ApiOperation({ summary: 'Attach cookies behind a one-time code to a scope' })
  claim(@Body() body: any) {
    return this.cookies.claim(str(body?.code, 'code'), str(body?.scope, 'scope'), owner(body));
  }

  @Post('burn')
  @HttpCode(200)
  @ApiOperation({ summary: 'Destroy a one-time code without using it' })
  burn(@Body() body: any) {
    return this.cookies.burnCode(str(body?.code, 'code'));
  }

  @Post('scope-delete')
  @HttpCode(200)
  @ApiOperation({ summary: 'Delete every connection of a group (the bot left it)' })
  removeScope(@Body() body: any) {
    return this.cookies.removeScope(str(body?.scope, 'scope'));
  }

  @Post('migrate')
  @HttpCode(200)
  @ApiOperation({ summary: 'Move a group\'s connections after it became a supergroup' })
  migrate(@Body() body: any) {
    return this.cookies.migrateScope(str(body?.from, 'from'), str(body?.to, 'to'));
  }

  @Get('scope/:scope')
  @ApiOperation({ summary: 'Connections of a private chat or a group' })
  listScope(@Param('scope') scope: string) {
    return this.cookies.listScope(scope);
  }

  @Get('owner/:telegramId')
  @ApiOperation({ summary: 'Connections a person made, in every scope' })
  listOwned(@Param('telegramId') telegramId: string) {
    return this.cookies.listOwned(telegramIdParam(telegramId));
  }

  @Post('owner/:telegramId/delete-all')
  @HttpCode(200)
  @ApiOperation({ summary: 'Delete every connection a person made' })
  removeAllOwned(@Param('telegramId') telegramId: string) {
    return this.cookies.removeAllOwned(telegramIdParam(telegramId));
  }

  @Post(':id/delete')
  @HttpCode(200)
  @ApiOperation({ summary: 'Delete a connection (its owner, or an admin of its group)' })
  remove(@Param('id') id: string, @Body() body: any) {
    if (!/^[0-9a-f-]{36}$/i.test(id)) throw new BadRequestException('Invalid id');
    const by = body?.telegramId;
    if (!Number.isSafeInteger(by) || by <= 0) throw new BadRequestException('Invalid telegramId');
    const adminOfScope = typeof body?.adminOfScope === 'string' ? body.adminOfScope : undefined;
    return this.cookies.remove(id, by, adminOfScope);
  }
}

// Отдельный контроллер без BotOnlyGuard: сюда приходит расширение.
@ApiTags('User Cookies')
@Controller('user-cookies')
@ApiSecurity('X-API-Key')
export class UserCookieCodesController {
  constructor(private readonly cookies: UserCookiesService) {}

  @Post('codes')
  @HttpCode(200)
  @ApiOperation({ summary: 'Store cookies from the extension and return a one-time code' })
  createCode(@Body() body: any) {
    return this.cookies.createCode(str(body?.raw, 'raw'), body?.platform);
  }
}
