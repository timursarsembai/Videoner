import { BadRequestException, Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiSecurity, ApiTags } from '@nestjs/swagger';
import { ValidUrlGuard } from '../auth/platform.guard';
import { CreateShareLinkDto } from './dto/create-share-link.dto';
import { ShareLinkService } from './share-link.service';

const MAX_URL_LENGTH = 2048;

// Ссылки-приглашения в бота (videoner.download/b/<code> → t.me/<бот>?start=<code>).
// Оба эндпоинта под общим ApiKeyGuard: зовут их только бот и сайт. Код выдаётся
// лишь для ссылок поддерживаемых площадок (ValidUrlGuard) — иначе это был бы
// открытый сокращатель ссылок на что угодно.
@ApiTags('Share Links')
@Controller('share-links')
@ApiSecurity('X-API-Key')
export class ShareLinkController {
  constructor(private readonly shareLinkService: ShareLinkService) {}

  @Post()
  @UseGuards(ValidUrlGuard)
  @ApiOperation({ summary: 'Get or create a short code for a video URL' })
  async create(@Body() dto: CreateShareLinkDto) {
    // Явная проверка, а не только @MaxLength: DTO здесь валидируются в режиме
    // наблюдения (lib/shadow-validation.pipe.ts) и запрос не отвергают.
    if (dto.url.length > MAX_URL_LENGTH) throw new BadRequestException('URL is too long');
    return { code: await this.shareLinkService.getOrCreate(dto.url.trim()) };
  }

  @Get(':code')
  @ApiOperation({ summary: 'Resolve a short code back to the video URL' })
  async resolve(@Param('code') code: string) {
    return { url: await this.shareLinkService.resolve(code) };
  }
}
