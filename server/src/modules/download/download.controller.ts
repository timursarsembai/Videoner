import {
  Controller,
  Get,
  Param,
  Res,
  Headers,
  HttpStatus,
  Header,
  ParseUUIDPipe,
  Post,
  HttpCode,
  Body,
  Req,
  UseGuards,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiProduces,
  ApiBody,
  ApiSecurity,
} from '@nestjs/swagger';
import { Response } from 'express';
import { StreamableFile } from '@nestjs/common';
import { DownloadService } from './download.service';
import { Public } from '../auth/public.decorator';
import {
  DownloadAudioDto,
  DownloadResponseDto,
  DownloadVideoDto,
} from './dto/download.dto';
import { ValidUrlGuard } from '../auth/platform.guard';

@ApiTags('Download')
@Controller('download')
export class DownloadController {
  constructor(private readonly downloadService: DownloadService) {}

  @Public()
  @Get(':filename')
  @ApiOperation({
    summary: 'Download a file by filename',
    operationId: 'downloadFile',
  })
  @ApiParam({
    name: 'filename',
    required: true,
    description: 'Name of the file to download',
  })
  @ApiResponse({ status: 200, description: 'File downloaded successfully' })
  @ApiResponse({ status: 206, description: 'Partial content' })
  @ApiResponse({ status: 404, description: 'File not found' })
  @ApiProduces('application/octet-stream')
  async downloadFile(
    @Param('filename') filename: string,
    @Headers('range') range: string,
    @Res() res: Response,
  ) {
    const { stream, headers } = await this.downloadService.getFile(
      filename,
      range,
    );

    if (range) {
      res.status(206);
    } else {
      res.status(200);
    }

    res.set(headers);
    stream.pipe(res);
  }

  @Public()
  @Get(':filename/metadata')
  @ApiOperation({
    summary: 'Get file metadata',
    operationId: 'getFileMetadata',
  })
  @ApiParam({
    name: 'filename',
    required: true,
    description: 'Name of the file',
  })
  @ApiResponse({
    status: 200,
    description: 'File metadata retrieved successfully',
  })
  @ApiResponse({ status: 404, description: 'File not found' })
  async getFileMetadata(@Param('filename') filename: string) {
    return this.downloadService.getFileMetadata(filename);
  }

  @Public()
  @Get(':id/status')
  @ApiOperation({ summary: 'Get download status' })
  @ApiParam({
    name: 'id',
    description: 'Download ID',
    type: 'number',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Download status retrieved successfully',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Download not found',
  })
  async getDownloadStatus(@Param('id') id: string) {
    return this.downloadService.getDownloadStatus(id);
  }

  @Public()
  @Get(':id/progress')
  @ApiOperation({
    summary: 'Subscribe to download progress updates',
    description:
      'Returns a Server-Sent Events (SSE) stream with real-time progress updates',
  })
  @ApiParam({
    name: 'id',
    description: 'Download ID',
    type: 'number',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'SSE connection established',
    content: {
      'text/event-stream': {
        schema: {
          type: 'object',
          properties: {
            type: {
              type: 'string',
              enum: ['progress', 'complete', 'error'],
              description: 'Event type',
            },
            data: {
              type: 'object',
              description: 'Progress data (for type: "progress")',
              properties: {
                percentage: { type: 'number' },
                percentage_str: { type: 'string' },
                downloaded: { type: 'number' },
                downloaded_str: { type: 'string' },
                total: { type: 'number' },
                total_str: { type: 'string' },
                speed: { type: 'number' },
                speed_str: { type: 'string' },
                eta: { type: 'number' },
                eta_str: { type: 'string' },
              },
            },
            message: {
              type: 'string',
              description: 'Error message (for type: "error")',
            },
          },
        },
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Download not found',
  })
  async subscribeToProgress(
    @Param('id', ParseUUIDPipe) id: string,
    @Res() response: Response,
  ) {
    return this.downloadService.subscribeToProgress(id, response);
  }

  @ApiSecurity('X-API-Key')
  @Post('video')
  @HttpCode(HttpStatus.ACCEPTED)
  @ApiOperation({ summary: 'Start video download' })
  @ApiBody({ type: DownloadVideoDto })
  @UseGuards(ValidUrlGuard)
  @ApiResponse({
    status: HttpStatus.ACCEPTED,
    description: 'Download started successfully',
    type: DownloadResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Invalid URL',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Invalid or missing API key',
  })
  async downloadVideo(
    @Body() downloadDto: DownloadVideoDto,
    @Req() req: Request,
  ) {
    return this.downloadService.downloadVideo(
      downloadDto.url,
      downloadDto.quality,
      downloadDto.extension,
      req,
    );
  }

  @ApiSecurity('X-API-Key')
  @Post('audio')
  @HttpCode(HttpStatus.ACCEPTED)
  @ApiOperation({ summary: 'Start audio download' })
  @ApiBody({ type: DownloadAudioDto })
  @UseGuards(ValidUrlGuard)
  @ApiResponse({
    status: HttpStatus.ACCEPTED,
    description: 'Download started successfully',
    type: DownloadResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Invalid input or YouTube URL',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Invalid or missing API key',
  })
  async downloadAudio(
    @Body() downloadDto: DownloadAudioDto,
    @Req() req: Request,
  ) {
    return this.downloadService.downloadAudio(
      downloadDto.url,
      downloadDto.quality,
      downloadDto.extension,
      req,
    );
  }
}
