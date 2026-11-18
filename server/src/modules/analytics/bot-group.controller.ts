import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { BotOnlyGuard } from 'src/lib/bot-auth';
import { BotGroupService, parseBotGroupEvent } from './bot-group.service';

// События групп от бота (bot/src/group-tracking.ts). Только для бота: иначе
// любой с API-ключом сайта мог бы наполнять список групп в дашборде.
@ApiTags('BotGroups')
@Controller('bot-groups')
export class BotGroupController {
  constructor(private readonly botGroups: BotGroupService) {}

  @Post('event')
  @UseGuards(BotOnlyGuard)
  async event(@Body() body: Record<string, unknown>) {
    await this.botGroups.record(parseBotGroupEvent(body));
    return { ok: true };
  }
}
