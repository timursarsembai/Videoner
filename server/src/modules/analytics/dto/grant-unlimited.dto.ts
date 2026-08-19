import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsInt, IsOptional, IsString } from 'class-validator';

// Правила ниже работают ТОЛЬКО в режиме наблюдения (VALIDATION_MODE=shadow) —
// см. lib/shadow-validation.pipe.ts. Ручка целиком под @AdminOnly(), это и есть
// её настоящая защита.

export class GrantUnlimitedDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsInt()
  telegramId?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  username?: string;

  @ApiProperty()
  @IsBoolean()
  isUnlimited: boolean;
}
