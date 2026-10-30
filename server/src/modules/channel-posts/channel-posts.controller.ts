import { BadRequestException, Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { BotOnlyGuard } from 'src/lib/bot-auth';
import { ChannelPostsService } from './channel-posts.service';

const SLUG = /^[a-z0-9][a-z0-9-]{0,80}$/;

function slugOf(body: { slug?: unknown }): string {
  if (typeof body?.slug !== 'string' || !SLUG.test(body.slug)) throw new BadRequestException('Invalid slug');
  return body.slug;
}

// Какие статьи блога бот уже опубликовал в канале новостей. Только для бота.
@ApiTags('Channel posts')
@Controller('channel-posts')
@UseGuards(BotOnlyGuard)
export class ChannelPostsController {
  constructor(private readonly posts: ChannelPostsService) {}

  @Get()
  async list() {
    return { slugs: await this.posts.published() };
  }

  @Post('claim')
  async claim(@Body() body: { slug?: unknown }) {
    return { ok: await this.posts.claim(slugOf(body)) };
  }

  @Post('done')
  async done(@Body() body: { slug?: unknown; messageId?: unknown }) {
    if (!Number.isSafeInteger(body?.messageId)) throw new BadRequestException('Invalid messageId');
    await this.posts.done(slugOf(body), body.messageId as number);
    return { ok: true };
  }

  @Post('release')
  async release(@Body() body: { slug?: unknown }) {
    await this.posts.release(slugOf(body));
    return { ok: true };
  }
}
