import { ApiProperty } from '@nestjs/swagger';
import { IsString, MaxLength } from 'class-validator';

export class CreateShareLinkDto {
  @ApiProperty({
    description: 'Video URL',
    example: 'https://www.youtube.com/shorts/KjwPtdqZ4sM',
  })
  @IsString()
  @MaxLength(2048)
  url: string;
}
