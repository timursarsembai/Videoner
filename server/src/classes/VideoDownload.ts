import { Subject } from 'rxjs';
import { Response } from 'express';
import { ProgressType } from '../types';

interface Progress {
  percentage: number;
  [key: string]: any;
}

export class VideoDownload {
  private static downloads: Map<string, Subject<ProgressType | Error>> =
    new Map();
  private static clients: Map<string, Set<Response>> = new Map();
  private static progressTracker: Map<string, Record<string, number>> =
    new Map();
  private static progressUpdateCounter: Map<string, number> = new Map();
  private static downloadInfo: Map<
    string,
    { extension: string; filename: string }
  > = new Map();
  private static readonly SKIP_INITIAL_UPDATES = 3;

  static subscribeToProgress(downloadId: string, res: Response) {
    // Set up SSE headers
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    res.flushHeaders();

    // Add client to the clients map
    if (!this.clients.has(downloadId)) {
      this.clients.set(downloadId, new Set());
    }
    this.clients.get(downloadId)?.add(res);

    // Handle client disconnect
    res.on('close', () => {
      this.clients.get(downloadId)?.delete(res);
      if (this.clients.get(downloadId)?.size === 0) {
        this.clients.delete(downloadId);
        this.progressTracker.delete(downloadId);
      }
    });
  }

  static createProgressSubject(
    downloadId: string,
    extension: string,
    filename: string,
  ): Subject<ProgressType | Error> {
    const subject = new Subject<ProgressType | Error>();
    this.progressTracker.set(downloadId, { download: 0, conversion: 0 });
    this.progressUpdateCounter.set(downloadId, 0);
    this.downloadInfo.set(downloadId, { extension, filename });

    // Store the subject
    this.downloads.set(downloadId, subject);

    // Subscribe to progress updates
    subject.subscribe({
      next: (progress) => {
        const clients = this.clients.get(downloadId);
        if (clients) {
          if (progress instanceof Error) {
            const data = { type: 'error', message: progress.message };
            clients.forEach((client) => {
              client.write(`data: ${JSON.stringify(data)}\n\n`);
            });
          } else {
            const currentProgress = this.progressTracker.get(downloadId) || {
              download: 0,
              conversion: 0,
            };
            const isConverting = progress.status === 'converting';
            const progressKey = isConverting ? 'conversion' : 'download';

            // Get and increment update counter
            const updateCount =
              (this.progressUpdateCounter.get(downloadId) || 0) + 1;
            this.progressUpdateCounter.set(downloadId, updateCount);

            // Only process progress after skipping initial updates
            if (updateCount >= this.SKIP_INITIAL_UPDATES) {
              // Only send progress if it's higher than before
              if (progress.percentage > currentProgress[progressKey]) {
                this.progressTracker.set(downloadId, {
                  ...currentProgress,
                  [progressKey]: progress.percentage,
                });

                const data = {
                  type: 'progress',
                  data: {
                    ...progress,
                    isConverting,
                  },
                };

                clients.forEach((client) => {
                  client.write(`data: ${JSON.stringify(data)}\n\n`);
                });
              }
            }
          }
        }
      },
      complete: async () => {
        const clients = this.clients.get(downloadId);
        if (clients) {
          try {
            // Get the download URL from the database or storage
            const downloadUrl = await this.getDownloadUrl(downloadId);
            clients.forEach((client) => {
              client.write(
                `data: ${JSON.stringify({
                  type: 'complete',
                  data: downloadUrl,
                })}\n\n`,
              );
              client.end();
            });
          } catch (error) {
            clients.forEach((client) => {
              client.write(
                `data: ${JSON.stringify({
                  type: 'error',
                  message: 'Failed to get download URL',
                })}\n\n`,
              );
              client.end();
            });
          }
          this.clients.delete(downloadId);
        }
        this.downloads.delete(downloadId);
        this.progressTracker.delete(downloadId);
        this.progressUpdateCounter.delete(downloadId);
        this.downloadInfo.delete(downloadId);
      },
      error: (error) => {
        const clients = this.clients.get(downloadId);
        if (clients) {
          clients.forEach((client) => {
            client.write(
              `data: ${JSON.stringify({ type: 'error', message: error.message })}\n\n`,
            );
            client.end();
          });
          this.clients.delete(downloadId);
        }
        this.downloads.delete(downloadId);
        this.progressTracker.delete(downloadId);
        this.progressUpdateCounter.delete(downloadId);
        this.downloadInfo.delete(downloadId);
      },
    });

    return subject;
  }

  private static async getDownloadUrl(downloadId: string): Promise<string> {
    try {
      const info = this.downloadInfo.get(downloadId);
      if (!info) {
        throw new Error('Download info not found');
      }

      return info.filename;
    } catch (error) {
      console.error('Error getting download URL:', error);
      throw new Error('Failed to get download URL');
    }
  }

  static getProgressSubject(
    downloadId: string,
  ): Subject<ProgressType | Error> | undefined {
    return this.downloads.get(downloadId);
  }

  private static handleProgress(
    downloadId: string,
    progress: Progress,
    clients: Set<Response>,
    progressKey: string,
    isConverting = false,
  ) {
    const currentProgress = VideoDownload.progressTracker.get(downloadId) || {};
    const updateCount =
      VideoDownload.progressUpdateCounter.get(downloadId) || 0;

    // Increment the update counter
    VideoDownload.progressUpdateCounter.set(downloadId, updateCount + 1);

    // Only process progress after skipping initial updates
    if (updateCount >= VideoDownload.SKIP_INITIAL_UPDATES) {
      if (progress.percentage > currentProgress[progressKey]) {
        VideoDownload.progressTracker.set(downloadId, {
          ...currentProgress,
          [progressKey]: progress.percentage,
        });

        const data = {
          type: 'progress',
          data: {
            ...progress,
            isConverting,
          },
        };

        clients.forEach((client) => {
          client.write(`data: ${JSON.stringify(data)}\n\n`);
        });
      }
    }
  }

  // Clean up method to clear all data
  public static cleanup(downloadId: string) {
    this.progressTracker.delete(downloadId);
    this.progressUpdateCounter.delete(downloadId);
    this.downloadInfo.delete(downloadId);
    this.downloads.delete(downloadId);
    this.clients.delete(downloadId);
  }
}
