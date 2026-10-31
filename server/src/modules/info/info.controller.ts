import { BadRequestException, Body, Controller, HttpStatus, Post, Req, UseGuards } from '@nestjs/common';
import { youtubePlaylistId } from 'src/lib/youtube-playlist';
import { YtdlpFormatService } from '../ytdlp/ytdlp-format.service';
import { Request } from 'express';
import { isBotRequest } from 'src/lib/bot-auth';
import {
  ApiOperation,
  ApiResponse,
  ApiSecurity,
  ApiTags,
} from '@nestjs/swagger';
import { InfoService } from './info.service';
import { ValidUrlGuard } from '../auth/platform.guard';
import { GetVideoInfoDto } from './dto/get-video-info.dto';

@ApiTags('Video Info')
@Controller('info')
@ApiSecurity('X-API-Key')
@UseGuards(ValidUrlGuard)
export class InfoController {
  constructor(
    private readonly infoService: InfoService,
    private readonly ytdlpFormat: YtdlpFormatService,
  ) {}

  // Плейлист YouTube: только список видео. Скачивают их по одному обычным
  // /download — бот, сайт и расширение сами идут по списку и могут
  // остановиться в любой момент.
  @Post('playlist')
  @ApiOperation({ summary: 'List the videos of a YouTube playlist' })
  async getPlaylist(@Body() body: { url?: string }) {
    const listId = typeof body?.url === 'string' ? youtubePlaylistId(body.url) : null;
    if (!listId) throw new BadRequestException('Not a YouTube playlist link');
    try {
      const playlist = await this.ytdlpFormat.getPlaylist(listId);
      return { ...playlist, count: playlist.entries.length };
    } catch (e: any) {
      throw new BadRequestException(`Playlist unavailable: ${String(e?.message ?? e).slice(0, 200)}`);
    }
  }

  @Post()
  @ApiOperation({
    summary: 'Get video information from any supported platform',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Video information retrieved successfully',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Invalid URL or unsupported platform',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Invalid or missing API key',
  })
  async getVideoInfo(@Body() dto: GetVideoInfoDto, @Req() req: Request) {
    // Подключённые людьми куки — только для бота (lib/bot-auth.ts).
    if (!isBotRequest(req)) {
      delete dto.cookieScope;
      delete dto.cookieFallbackScope;
    }
    return this.infoService.getVideoInfo(dto);
  }
}
