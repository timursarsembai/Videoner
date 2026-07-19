import { Body, Controller, HttpStatus, Post, UseGuards } from '@nestjs/common';
import {
  ApiBody,
  ApiOperation,
  ApiResponse,
  ApiSecurity,
  ApiTags,
} from '@nestjs/swagger';
import { InfoService } from './info.service';
import { ValidUrlGuard } from '../auth/platform.guard';

@ApiTags('Video Info')
@Controller('info')
@ApiSecurity('X-API-Key')
@UseGuards(ValidUrlGuard)
export class InfoController {
  constructor(private readonly infoService: InfoService) {}

  @Post()
  @ApiOperation({
    summary: 'Get video information from any supported platform',
  })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        url: {
          type: 'string',
          example: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
        },
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Video information retrieved successfully',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Invalid URL or unsupported platform',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Invalid or missing API key',
  })
  async getVideoInfo(@Body('url') url: string) {
    return this.infoService.getVideoInfo(url);
  }
}
