import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { join } from 'path';
import * as fs from 'fs';
import { createReadStream, statSync } from 'fs';
import { PrismaService } from '../prisma/prisma.service';
import { Response } from 'express';
import { VideoDownload } from '../../classes/VideoDownload';
import { DownloadStatus, Downloaders } from '@prisma/client';
import {
  DownloadFormatOptions,
  DownloadQualityOptions,
  VideoFormat,
} from 'src/types';
import { YtdlpService } from '../ytdlp/ytdlp.service';
import { getFileName } from 'src/lib/utils';

@Injectable()
export class DownloadService {
  private readonly downloadPath: string;

  constructor(
    private prisma: PrismaService,
    private ytdlp: YtdlpService,
  ) {
    this.downloadPath = join(__dirname, '..', '..', '..', 'downloads');
    // Ensure downloads directory exists
    if (!fs.existsSync(this.downloadPath)) {
      fs.mkdirSync(this.downloadPath, { recursive: true });
    }
  }

  private async checkDurationLimit(url: string, req: Request) {
    const apiKey = (req as any).apiKey;
    const info = await this.ytdlp.getYtdlpVideoInfo(url);

    if (info.duration > apiKey.maxDuration) {
      throw new BadRequestException(
        `Video duration (${Math.round(info.duration / 60)} minutes) exceeds the allowed limit (${Math.round(apiKey.maxDuration / 60)} minutes)`,
      );
    }

    return info;
  }

  async getFile(
    filename: string,
    range?: string,
  ): Promise<{ stream: fs.ReadStream; headers: any }> {
    const filePath = join(this.downloadPath, filename);

    if (!fs.existsSync(filePath)) {
      throw new NotFoundException('File not found');
    }

    const stat = statSync(filePath);
    const fileSize = stat.size;

    if (range) {
      const parts = range.replace(/bytes=/, '').split('-');
      const start = parseInt(parts[0], 10);
      const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;
      const chunkSize = end - start + 1;

      const stream = createReadStream(filePath, { start, end });
      const headers = {
        'Content-Range': `bytes ${start}-${end}/${fileSize}`,
        'Accept-Ranges': 'bytes',
        'Content-Length': chunkSize,
        'Content-Type': 'application/octet-stream',
      };

      return { stream, headers };
    }

    const stream = createReadStream(filePath);
    const headers = {
      'Content-Length': fileSize,
      'Content-Type': 'application/octet-stream',
      'Accept-Ranges': 'bytes',
    };

    return { stream, headers };
  }

  async getFileMetadata(filename: string) {
    const filePath = join(this.downloadPath, filename);

    if (!fs.existsSync(filePath)) {
      throw new NotFoundException('File not found');
    }

    const stat = statSync(filePath);
    return {
      size: stat.size,
      created: stat.birthtime,
      modified: stat.mtime,
      isFile: stat.isFile(),
      isDirectory: stat.isDirectory(),
    };
  }

  async createDownload(data: {
    originalUrl: string;
    downloader: Downloaders;
    filename: string;
  }) {
    return this.prisma.download.create({
      data: {
        originalUrl: data.originalUrl,
        status: DownloadStatus.PENDING,
        downloader: data.downloader,
        filename: data.filename,
      },
    });
  }

  async updateDownloadStatus(
    id: string,
    data: { status: DownloadStatus; downloadUrl?: string | null },
  ) {
    return this.prisma.download.update({
      where: { id },
      data,
    });
  }

  async getDownloadStatus(downloadId: string) {
    try {
      const download = await this.prisma.download.findUnique({
        where: { id: downloadId },
      });

      if (!download) {
        throw new BadRequestException('Download not found');
      }

      return {
        status: download.status,
        downloadUrl: download.downloadUrl,
      };
    } catch (error) {
      console.error(error);
      throw new BadRequestException('Failed to get download status');
    }
  }

  async subscribeToProgress(downloadId: string, res: Response) {
    // Check download status first
    const download = await this.prisma.download.findUnique({
      where: { id: downloadId },
    });

    if (!download) {
      res.write(
        `data: ${JSON.stringify({ type: 'error', message: 'Download not found' })}\n\n`,
      );
      res.end();
      return;
    }

    // If download is already completed or failed, send the final status and end connection
    if (
      download.status === DownloadStatus.COMPLETED ||
      download.status === DownloadStatus.FAILED
    ) {
      const data = {
        type:
          download.status === DownloadStatus.COMPLETED ? 'complete' : 'error',
        ...(download.status === DownloadStatus.COMPLETED
          ? { downloadUrl: download.downloadUrl }
          : { message: 'Download failed' }),
      };
      res.write(`data: ${JSON.stringify(data)}\n\n`);
      res.end();
      return;
    }

    // For in-progress downloads, set up SSE connection
    VideoDownload.subscribeToProgress(downloadId, res);
  }

  createProgressSubject(
    downloadId: string,
    extension: string,
    filename: string,
  ) {
    return VideoDownload.createProgressSubject(downloadId, extension, filename);
  }

  ensureDownloadDirectory() {
    if (!fs.existsSync(this.downloadPath)) {
      fs.mkdirSync(this.downloadPath, { recursive: true });
    }
    return this.downloadPath;
  }

  async downloadVideo(
    url: string,
    quality: DownloadQualityOptions['mergevideo'],
    extension?: DownloadFormatOptions['mergevideo'],
    req: Request = null,
  ) {
    try {
      // Check duration limit before proceeding
      const info = await this.checkDurationLimit(url, req);

      const downloadDir = this.ensureDownloadDirectory();

      const initialExtension =
        extension && extension !== 'mp4' ? 'mp4' : extension;
      const tempFileName = getFileName(info.title, quality, initialExtension);
      const finalFileName = getFileName(info.title, quality, extension);

      // Create download record in database
      const download = await this.createDownload({
        originalUrl: url,
        downloader: Downloaders.YOUTUBE,
        filename: finalFileName,
      });

      // Create progress subject
      const progressSubject = this.createProgressSubject(
        download.id,
        extension || 'mp4',
        extension && extension !== 'mp4' ? finalFileName : tempFileName,
      );

      console.log('start download', {
        quality,
        extension: initialExtension,
        fileName: tempFileName,
      });

      // Update status to DOWNLOADING
      await this.updateDownloadStatus(download.id, {
        status: DownloadStatus.DOWNLOADING,
      });

      // Start video download
      this.ytdlp
        .download(url, (req as any).platform, {
          filter: 'mergevideo',
          quality: quality,
          format: initialExtension as VideoFormat,
          output: {
            outDir: downloadDir,
            fileName: tempFileName,
          },
        })
        .then((progress$) => {
          progress$.subscribe({
            next: async (progress) => {
              if (progress instanceof Error) {
                console.error('Error:', progress);
                await this.updateDownloadStatus(download.id, {
                  status: DownloadStatus.FAILED,
                  downloadUrl: null,
                });
                progressSubject.error(progress);
              } else {
                console.log(
                  'Progress percentage string:',
                  progress.percentage_str,
                );
                progressSubject.next(progress);
              }
            },
            error: async (err) => {
              console.error('Error:', err);
              await this.updateDownloadStatus(download.id, {
                status: DownloadStatus.FAILED,
                downloadUrl: null,
              });
              progressSubject.error(err);
            },
            complete: async () => {
              console.log('Download complete');

              if (extension && extension !== 'mp4') {
                console.log('Converting video to', extension);
                const inputPath = join(downloadDir, tempFileName);
                const outputPath = join(downloadDir, finalFileName);

                await this.updateDownloadStatus(download.id, {
                  status: DownloadStatus.CONVERTING,
                });

                try {
                  const convertProgress$ = await this.ytdlp.convertVideo(
                    inputPath,
                    extension,
                    outputPath,
                  );

                  convertProgress$.subscribe({
                    next: (progress) => {
                      if (!(progress instanceof Error)) {
                        console.log(
                          'Conversion progress:',
                          progress.percentage_str,
                        );
                        progressSubject.next({
                          ...progress,
                          status: 'converting',
                        });
                      }
                    },
                    error: async (err) => {
                      console.error('Conversion error:', err);
                      await this.updateDownloadStatus(download.id, {
                        status: DownloadStatus.FAILED,
                        downloadUrl: null,
                      });
                      progressSubject.error(err);
                    },
                    complete: async () => {
                      console.log('Conversion complete');
                      fs.unlinkSync(inputPath);

                      await this.updateDownloadStatus(download.id, {
                        status: DownloadStatus.COMPLETED,
                        downloadUrl: `/downloads/${finalFileName}`,
                      });
                      progressSubject.complete();
                    },
                  });
                } catch (error) {
                  console.error('Conversion error:', error);
                  await this.updateDownloadStatus(download.id, {
                    status: DownloadStatus.FAILED,
                    downloadUrl: null,
                  });
                  progressSubject.error(error);
                }
              } else {
                await this.updateDownloadStatus(download.id, {
                  status: DownloadStatus.COMPLETED,
                  downloadUrl: `/downloads/${tempFileName}`,
                });
                progressSubject.complete();
              }
            },
          });
        })
        .catch(async (error) => {
          console.error('Failed to start download:', error);
          await this.updateDownloadStatus(download.id, {
            status: DownloadStatus.FAILED,
            downloadUrl: null,
          });
          progressSubject.error(error);
        });

      return {
        message: 'Download started',
        downloadId: download.id,
        fileName:
          extension && extension !== 'mp4' ? finalFileName : tempFileName,
      };
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new BadRequestException(
        error.message || 'Failed to start download',
      );
    }
  }

  async downloadAudio(
    url: string,
    quality: DownloadQualityOptions['audioonly'],
    extension?: DownloadFormatOptions['audioonly'],
    req: Request = null,
  ) {
    try {
      // Check duration limit before proceeding
      const info = await this.checkDurationLimit(url, req);

      const downloadDir = this.ensureDownloadDirectory();
      const fileName = getFileName(info.title, quality, extension);

      // Create download record in database
      const download = await this.createDownload({
        originalUrl: url,
        downloader: Downloaders.YOUTUBE,
        filename: fileName,
      });

      // Create progress subject
      const progressSubject = this.createProgressSubject(
        download.id,
        extension || 'mp3',
        fileName,
      );

      console.log('start download', {
        quality,
        extension,
        fileName,
      });

      // Update status to DOWNLOADING
      await this.updateDownloadStatus(download.id, {
        status: DownloadStatus.DOWNLOADING,
      });

      // Audio download
      const progress$ = await this.ytdlp.download(url, (req as any).platform, {
        filter: 'audioonly',
        quality: quality,
        format: extension,
        output: {
          outDir: downloadDir,
          fileName: fileName,
        },
      });

      progress$.subscribe({
        next: async (progress) => {
          if (progress instanceof Error) {
            console.error('Error:', progress);
            await this.updateDownloadStatus(download.id, {
              status: DownloadStatus.FAILED,
              downloadUrl: null,
            });
            progressSubject.error(progress);
          } else {
            console.log('Progress percentage string:', progress.percentage_str);
            progressSubject.next(progress);
          }
        },
        error: async (err) => {
          console.error('Error:', err);
          await this.updateDownloadStatus(download.id, {
            status: DownloadStatus.FAILED,
            downloadUrl: null,
          });
          progressSubject.error(err);
        },
        complete: async () => {
          console.log('Download complete');
          await this.updateDownloadStatus(download.id, {
            status: DownloadStatus.COMPLETED,
            downloadUrl: `/downloads/${fileName}`,
          });
          progressSubject.complete();
        },
      });

      return {
        message: 'Download started',
        downloadId: download.id,
        fileName: fileName,
      };
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new BadRequestException('Failed to download audio');
    }
  }
}
