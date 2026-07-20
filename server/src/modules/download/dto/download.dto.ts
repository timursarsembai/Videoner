import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsEnum,
  IsInt,
  IsNumber,
  IsOptional,
  IsString,
  IsUrl,
} from 'class-validator';
import {
  VideoQuality,
  AudioQuality,
  VideoFormat,
  AudioFormat,
} from '../../../types';
import { DownloadSource } from '@prisma/client';

// Опциональные поля контекста запроса (телеграм-бот/оплата Stars) — сейчас
// без runtime-валидации, т.к. глобальный ValidationPipe в проекте не включён,
// но типизация нужна для DownloadService и аналитики.
class RequestMetaDto {
  @ApiProperty({ description: 'Telegram user id', required: false })
  @IsOptional()
  @IsNumber()
  telegramId?: number;

  @ApiProperty({ description: 'Telegram username', required: false })
  @IsOptional()
  @IsString()
  telegramUsername?: string;

  @ApiProperty({ description: 'Telegram client language code', required: false })
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

  @ApiProperty({ description: 'Paid via Telegram Stars', required: false })
  @IsOptional()
  @IsBoolean()
  isPaid?: boolean;

  @ApiProperty({ description: 'Amount of Telegram Stars paid', required: false })
  @IsOptional()
  @IsInt()
  starsAmount?: number;
}

export class DownloadVideoDto extends RequestMetaDto {
  @ApiProperty({
    description: 'YouTube video URL',
    example: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
  })
  @IsUrl({}, { message: 'Invalid YouTube URL' })
  url: string;

  @ApiProperty({
    description: 'Video quality',
    enum: VideoQuality,
    example: VideoQuality['1080p'],
  })
  @IsEnum(VideoQuality)
  quality: VideoQuality;

  @ApiProperty({
    description: 'Video format',
    enum: VideoFormat,
    example: VideoFormat.mp4,
    required: false,
  })
  @IsOptional()
  @IsEnum(VideoFormat)
  extension?: VideoFormat;
}

export class DownloadAudioDto extends RequestMetaDto {
  @ApiProperty({
    description: 'YouTube video URL',
    example: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
  })
  @IsUrl({}, { message: 'Invalid YouTube URL' })
  url: string;

  @ApiProperty({
    description: 'Audio quality',
    enum: AudioQuality,
    example: AudioQuality.best,
  })
  @IsEnum(AudioQuality)
  quality: AudioQuality;

  @ApiProperty({
    description: 'Audio format',
    enum: AudioFormat,
    example: AudioFormat.mp3,
    required: false,
  })
  @IsOptional()
  @IsEnum(AudioFormat)
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
