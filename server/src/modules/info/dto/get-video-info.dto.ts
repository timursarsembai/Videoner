import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsString, IsUrl } from 'class-validator';

export class GetVideoInfoDto {
  @ApiProperty({
    description: 'Video URL',
    example: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
  })
  @IsUrl()
  url: string;

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
}
