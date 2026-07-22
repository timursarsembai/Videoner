import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsInt, IsOptional, IsString } from 'class-validator';

// Поля ровно те, что присылает Telegram Login Widget в data-onauth колбэке —
// см. https://core.telegram.org/widgets/login. hash подписывает все
// остальные поля, проверяется в BotUserController.telegramLogin().
export class TelegramLoginDto {
  @ApiProperty()
  @IsInt()
  id: number;

  @ApiProperty()
  @IsString()
  first_name: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  last_name?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  username?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  photo_url?: string;

  @ApiProperty()
  @IsInt()
  auth_date: number;

  @ApiProperty()
  @IsString()
  hash: string;
}
