import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsInt, IsOptional, IsString } from 'class-validator';

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
