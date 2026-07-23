import { Injectable } from '@nestjs/common';
import { PlaylistVideoInfo, YtdlpVideoInfo } from '../../types/youtube';
import { YtdlpProcessService } from './ytdlp-process.service';

// Метаданные (info/playlist) — вторая половина бывшего единого YtdlpService
// (см. ytdlp-process.service.ts про причину разделения и про исправленный
// заодно баг с тройным инстансом). Сам запуск процесса, семафоры и куки —
// в YtdlpProcessService, этот сервис только парсит JSON-вывод yt-dlp.
@Injectable()
export class YtdlpFormatService {
  constructor(private readonly process: YtdlpProcessService) {}

  async getYtdlpVideoInfo(
    url: string,
    options?: { skipCookies?: boolean },
  ): Promise<YtdlpVideoInfo> {
    const command = ['--dump-json', '--no-download', url];
    return this.process.ytdlp(command, options).then((result) => {
      return JSON.parse(result.stdout);
    });
  }

  async getYoutubePlaylistInfo(url: string): Promise<PlaylistVideoInfo[]> {
    const command = [
      '--dump-json',
      '--no-download',
      '--flat-playlist',
      '--playlist-reverse',
      url,
    ];
    return this.process.ytdlp(command).then((result) => {
      // Split output into lines and filter empty lines
      const jsonLines = result.stdout.split('\n').filter((line) => line.trim());
      // parse all json lines
      const json = jsonLines.map((line) => JSON.parse(line));

      return json;
    });
  }
}
