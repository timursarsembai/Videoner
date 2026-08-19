import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

// Описание формы запроса и Swagger-документация, НЕ проверка входа: декораторы
// class-validator без ValidationPipe (его в приложении нет) не выполняются,
// поэтому убраны 19.08.2026. Ручка целиком под @AdminOnly() —
// см. AnalyticsController.
export class GrantUnlimitedDto {
  @ApiPropertyOptional()
  telegramId?: number;

  @ApiPropertyOptional()
  username?: string;

  @ApiProperty()
  isUnlimited: boolean;
}
