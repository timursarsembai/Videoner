import { ApiProperty } from '@nestjs/swagger';
import {
  IsEnum,
  IsIn,
  IsNumber,
  IsOptional,
  IsString,
  Matches,
} from 'class-validator';
import {
  VideoQuality,
  AudioQuality,
  VideoFormat,
  AudioFormat,
} from '../../../types';
import { DownloadSource } from '@prisma/client';

// Правила ниже РАБОТАЮТ ТОЛЬКО В РЕЖИМЕ НАБЛЮДЕНИЯ (VALIDATION_MODE=shadow):
// они проверяются и записываются в лог, но запрос не отвергается никогда —
// см. lib/shadow-validation.pipe.ts. Пока не набралась неделя живого трафика,
// считать их защитой нельзя.
//
// Настоящая проверка входа сегодня — в других местах, и она никуда не делась:
//   url      — ValidUrlGuard (../auth/platform.guard) + parseAndValidateUrl;
//   опции    — zod-схема DownloadOptionsSchema (validate/schema.ts);
//   имя файла — санитизация в lib/utils.ts getFileName и запрет пути
//              в getOutputPath (ytdlp-process.service.ts);
//   лимиты   — enforceWebLimits в DownloadService.
//
// Про quality отдельно. Здесь НЕ перечисление, хотя раньше стояло @IsEnum:
// значения приходят из нашего же ответа /info и зависят от площадки — «1080p»,
// «hd»/«sd» у Facebook, «original» у поста без единого видео. Фиксированный
// список гарантированно отверг бы рабочие запросы, поэтому проверяем ФОРМУ
// (короткая строка из букв и цифр) — этого достаточно, чтобы в поле не приехал
// путь или что-то ещё неожиданное, и не достаточно, чтобы сломать площадку,
// которая завтра назовёт качество по-своему.

class RequestMetaDto {
  @ApiProperty({ description: 'Telegram user id', required: false })
  @IsOptional()
  @IsNumber()
  telegramId?: number;

  @ApiProperty({ description: 'Telegram username', required: false })
  @IsOptional()
  @IsString()
  telegramUsername?: string;

  @ApiProperty({
    description: 'Telegram client language code',
    required: false,
  })
  @IsOptional()
  @IsString()
  telegramLanguageCode?: string;

  @ApiProperty({
    description: 'Where the request came from',
    enum: DownloadSource,
    required: false,
  })
  @IsOptional()
  @IsEnum(DownloadSource)
  source?: DownloadSource;
}

export class DownloadVideoDto extends RequestMetaDto {
  @ApiProperty({
    description: 'YouTube video URL',
    example: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
  })
  @IsString()
  url: string;

  @ApiProperty({
    description: 'Video quality',
    enum: VideoQuality,
    example: VideoQuality['1080p'],
  })
  @Matches(/^[A-Za-z0-9]{1,16}$/)
  quality: VideoQuality;

  @ApiProperty({
    description: 'Video format',
    enum: VideoFormat,
    example: VideoFormat.mp4,
    required: false,
  })
  @IsOptional()
  @IsIn(['avi', 'flv', 'mkv', 'mov', 'mp4', 'webm', 'ogg'])
  extension?: VideoFormat;
}

export class DownloadAudioDto extends RequestMetaDto {
  @ApiProperty({
    description: 'YouTube video URL',
    example: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
  })
  @IsString()
  url: string;

  @ApiProperty({
    description: 'Audio quality',
    enum: AudioQuality,
    example: AudioQuality.best,
  })
  @Matches(/^[A-Za-z0-9]{1,16}$/)
  quality: AudioQuality;

  @ApiProperty({
    description: 'Audio format',
    enum: AudioFormat,
    example: AudioFormat.mp3,
    required: false,
  })
  @IsOptional()
  @IsIn(['aac', 'flac', 'mp3', 'm4a', 'opus', 'vorbis', 'wav', 'alac'])
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
