import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsString } from 'class-validator';

// Правила ниже работают ТОЛЬКО в режиме наблюдения (VALIDATION_MODE=shadow):
// проверяются и пишутся в лог, но запрос не отвергают — см.
// lib/shadow-validation.pipe.ts. Ссылку по-настоящему проверяет ValidUrlGuard
// на InfoController, и он остаётся единственной действующей защитой.
//
// @IsUrl намеренно НЕ ставим: пользователи присылают в том числе короткие и
// «поделиться»-ссылки площадок, и придирки валидатора к их форме здесь только
// зашумили бы наблюдение — форму ссылки разбирает getPlatform/parseAndValidateUrl,
// который знает про каждую площадку отдельно.

export class GetVideoInfoDto {
  @ApiProperty({
    description: 'Video URL',
    example: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
  })
  @IsString()
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
