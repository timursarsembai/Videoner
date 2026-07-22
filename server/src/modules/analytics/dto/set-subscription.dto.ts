import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsDateString, IsEnum, IsInt, IsOptional, IsString } from 'class-validator';
import { SubscriptionKind } from '@prisma/client';

export class SetSubscriptionDto {
  @ApiProperty()
  @IsInt()
  telegramId: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  telegramUsername?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  telegramLanguageCode?: string;

  @ApiProperty({ enum: SubscriptionKind })
  @IsEnum(SubscriptionKind)
  kind: SubscriptionKind;

  @ApiProperty()
  @IsDateString()
  until: string;
}
