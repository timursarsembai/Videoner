import { BadRequestException, Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ApiOperation, ApiSecurity, ApiTags } from '@nestjs/swagger';
import {
  CAPTION_STYLES,
  COOKIES_BY,
  GroupSettingsPatch,
  GroupSettingsService,
  LANGUAGE_CODE,
  QUALITY_MODES,
} from './group-settings.service';

const INT64_MAX = 2n ** 63n - 1n;

// chatId — BIGINT в базе: за пределами int64 Prisma упала бы с 500.
function parseChatId(raw: string): bigint {
  if (!/^-?\d{1,19}$/.test(raw)) throw new BadRequestException('Invalid chatId');
  const id = BigInt(raw);
  if (id > INT64_MAX || id < -INT64_MAX) throw new BadRequestException('Invalid chatId');
  return id;
}

// Настройки групп для бота. Под общим ApiKeyGuard: зовёт только бот, и он же
// проверяет, что настройки меняет админ группы.
@ApiTags('Group Settings')
@Controller('group-settings')
@ApiSecurity('X-API-Key')
export class GroupSettingsController {
  constructor(private readonly groupSettings: GroupSettingsService) {}

  @Get(':chatId')
  @ApiOperation({ summary: 'Settings of a group chat (defaults if never changed)' })
  get(@Param('chatId') chatId: string) {
    return this.groupSettings.get(parseChatId(chatId));
  }

  // Проверка тела — руками: DTO в этом проекте валидируются только в режиме
  // наблюдения (lib/shadow-validation.pipe.ts) и запрос не отвергают.
  @Post(':chatId')
  @ApiOperation({ summary: 'Change some of the settings of a group chat' })
  update(@Param('chatId') chatId: string, @Body() body: Record<string, unknown>) {
    const patch: GroupSettingsPatch = {};
    if (body?.deleteLinks !== undefined) {
      if (typeof body.deleteLinks !== 'boolean') throw new BadRequestException('deleteLinks must be boolean');
      patch.deleteLinks = body.deleteLinks;
    }
    if (body?.longVideos !== undefined) {
      if (typeof body.longVideos !== 'boolean') throw new BadRequestException('longVideos must be boolean');
      patch.longVideos = body.longVideos;
    }
    if (body?.cookiesBy !== undefined) {
      if (!(COOKIES_BY as readonly unknown[]).includes(body.cookiesBy)) throw new BadRequestException('Invalid cookiesBy');
      patch.cookiesBy = body.cookiesBy as GroupSettingsPatch['cookiesBy'];
    }
    if (body?.language !== undefined) {
      if (body.language !== null && !(typeof body.language === 'string' && LANGUAGE_CODE.test(body.language))) {
        throw new BadRequestException('Invalid language');
      }
      patch.language = body.language as string | null;
    }
    if (body?.caption !== undefined) {
      if (!(CAPTION_STYLES as readonly unknown[]).includes(body.caption)) throw new BadRequestException('Invalid caption');
      patch.caption = body.caption as GroupSettingsPatch['caption'];
    }
    if (body?.quality !== undefined) {
      if (!(QUALITY_MODES as readonly unknown[]).includes(body.quality)) throw new BadRequestException('Invalid quality');
      patch.quality = body.quality as GroupSettingsPatch['quality'];
    }
    return this.groupSettings.update(parseChatId(chatId), patch);
  }
}
