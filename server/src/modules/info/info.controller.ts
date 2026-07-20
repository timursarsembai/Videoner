import { Body, Controller, HttpStatus, Post, UseGuards } from '@nestjs/common';
import {
  ApiOperation,
  ApiResponse,
  ApiSecurity,
  ApiTags,
} from '@nestjs/swagger';
import { InfoService } from './info.service';
import { ValidUrlGuard } from '../auth/platform.guard';
import { GetVideoInfoDto } from './dto/get-video-info.dto';

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
  async getVideoInfo(@Body() dto: GetVideoInfoDto) {
    return this.infoService.getVideoInfo(dto);
  }
}
