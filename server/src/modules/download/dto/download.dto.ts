import { ApiProperty } from '@nestjs/swagger';
import {
  VideoQuality,
  AudioQuality,
  VideoFormat,
  AudioFormat,
} from '../../../types';
import { DownloadSource } from '@prisma/client';

// ВНИМАНИЕ: это описание ФОРМЫ запроса и источник Swagger-документации, а НЕ
// проверка входа. Декораторы class-validator (@IsUrl/@IsEnum/@IsOptional) здесь
// стояли, но не работали ни дня: они срабатывают только при включённом
// ValidationPipe, а в приложении его нет (см. main.ts). Убраны 19.08.2026 —
// именно из-за них поле quality считалось проверенным, хотя приходило любым, и
// через него получался обход пути при записи файла (коммит d898657).
//
// Где вход проверяется на самом деле:
//   url      — ValidUrlGuard (../auth/platform.guard) + parseAndValidateUrl;
//   quality/extension/options — zod-схема DownloadOptionsSchema (validate/schema.ts),
//              плюс санитизация при сборке имени файла (lib/utils.ts getFileName)
//              и запрет пути в getOutputPath (ytdlp-process.service.ts);
//   telegramId и лимиты — enforceWebLimits в DownloadService.
//
// Если когда-нибудь включать ValidationPipe — это отдельная задача с прогоном
// ВСЕХ запросов бота и сайта: сейчас они шлют, например, quality "hd"/"sd" для
// Facebook, и неаккуратное включение просто перестанет их принимать.
class RequestMetaDto {
  @ApiProperty({ description: 'Telegram user id', required: false })
  telegramId?: number;

  @ApiProperty({ description: 'Telegram username', required: false })
  telegramUsername?: string;

  @ApiProperty({ description: 'Telegram client language code', required: false })
  telegramLanguageCode?: string;

  @ApiProperty({
    description: 'Where the request came from',
    enum: DownloadSource,
    required: false,
  })
  source?: DownloadSource;
}

export class DownloadVideoDto extends RequestMetaDto {
  @ApiProperty({
    description: 'YouTube video URL',
    example: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
  })
  url: string;

  @ApiProperty({
    description: 'Video quality',
    enum: VideoQuality,
    example: VideoQuality['1080p'],
  })
  quality: VideoQuality;

  @ApiProperty({
    description: 'Video format',
    enum: VideoFormat,
    example: VideoFormat.mp4,
    required: false,
  })
  extension?: VideoFormat;
}

export class DownloadAudioDto extends RequestMetaDto {
  @ApiProperty({
    description: 'YouTube video URL',
    example: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
  })
  url: string;

  @ApiProperty({
    description: 'Audio quality',
    enum: AudioQuality,
    example: AudioQuality.best,
  })
  quality: AudioQuality;

  @ApiProperty({
    description: 'Audio format',
    enum: AudioFormat,
    example: AudioFormat.mp3,
    required: false,
  })
  extension?: AudioFormat;
}

export class DownloadResponseDto {
  @ApiProperty({
    description: 'Status message',
    example: 'Download started',
  })
  message: string;

  @ApiProperty({
    description: 'Download ID for tracking progress',
    example: 1,
  })
  downloadId: number;

  @ApiProperty({
    description: 'Output file name',
    example: 'Never Gonna Give You Up_1080p.mp4',
  })
  fileName: string;
}

export class DownloadStatusResponseDto {
  @ApiProperty({
    description: 'Download status',
    enum: ['PENDING', 'DOWNLOADING', 'CONVERTING', 'COMPLETED', 'FAILED'],
    example: 'COMPLETED',
  })
  status: 'PENDING' | 'DOWNLOADING' | 'CONVERTING' | 'COMPLETED' | 'FAILED';

  @ApiProperty({
    description: 'Download URL (available when status is COMPLETED)',
    example: '/downloads/video.mp4',
    required: false,
    nullable: true,
  })
  downloadUrl: string | null;
}
