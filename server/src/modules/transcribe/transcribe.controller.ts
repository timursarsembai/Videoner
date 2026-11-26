import { BadRequestException, Body, Controller, ForbiddenException, Get, Param, Post, Query, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { BotOnlyGuard } from 'src/lib/bot-auth';
import { TranscribeService } from './transcribe.service';

function telegramIdOf(value: unknown): number {
  const id = Number(value);
  if (!Number.isSafeInteger(id) || id <= 0) throw new BadRequestException('Invalid telegramId');
  return id;
}

// «Текст из видео» — только бот и пока только владелец (TranscribeService.allowed).
@ApiTags('Transcribe')
@Controller('transcribe')
@UseGuards(BotOnlyGuard)
export class TranscribeController {
  constructor(private readonly transcribe: TranscribeService) {}

  @Post()
  start(@Body() body: { url?: unknown; telegramId?: unknown }) {
    const telegramId = telegramIdOf(body?.telegramId);
    if (!this.transcribe.allowed(telegramId)) throw new ForbiddenException('Not available');
    if (typeof body?.url !== 'string' || body.url.length > 2048 || !/^https?:\/\//i.test(body.url)) {
      throw new BadRequestException('Invalid url');
    }
    return this.transcribe.start(body.url, telegramId);
  }

  @Get(':jobId')
  status(@Param('jobId') jobId: string, @Query('telegramId') telegramId: string) {
    if (!/^[0-9a-f-]{36}$/.test(jobId)) throw new BadRequestException('Invalid job');
    return this.transcribe.status(jobId, telegramIdOf(telegramId));
  }
}
