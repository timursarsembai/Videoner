import { ApiProperty } from '@nestjs/swagger';

// Описание формы запроса и Swagger-документация, НЕ проверка входа: декораторы
// class-validator работают только при включённом ValidationPipe, которого в
// приложении нет (см. main.ts), поэтому убраны 19.08.2026 как вводящие в
// заблуждение. Ссылку реально проверяет ValidUrlGuard на InfoController.
export class GetVideoInfoDto {
  @ApiProperty({
    description: 'Video URL',
    example: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
  })
  url: string;

  @ApiProperty({ description: 'Telegram user id', required: false })
  telegramId?: number;

  @ApiProperty({ description: 'Telegram username', required: false })
  telegramUsername?: string;

  @ApiProperty({ description: 'Telegram client language code', required: false })
  telegramLanguageCode?: string;
}
