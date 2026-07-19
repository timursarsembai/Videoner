import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsUrl } from 'class-validator';
import {
  VideoQuality,
  AudioQuality,
  VideoFormat,
  AudioFormat,
} from '../../../types';

export class DownloadVideoDto {
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

export class DownloadAudioDto {
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
