import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

// Поля ровно те, что присылает Telegram Login Widget в data-onauth колбэке —
// см. https://core.telegram.org/widgets/login. hash подписывает все
// остальные поля, проверяется в BotUserController.telegramLogin().
export class TelegramLoginDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  first_name: string;

  @ApiPropertyOptional()
  last_name?: string;

  @ApiPropertyOptional()
  username?: string;

  @ApiPropertyOptional()
  photo_url?: string;

  @ApiProperty()
  auth_date: number;

  @ApiProperty()
  hash: string;
}
