import { BadRequestException, Injectable } from '@nestjs/common';
import * as fs from 'fs';
import {
  audioExtensionLabel,
  audioQualityLabel,
  videoExtensionLabel,
} from 'src/lib/config';
import { YtdlpService } from '../ytdlp/ytdlp.service';
import { getPlatform } from 'src/validate/url';
import { VideoInfoResponse } from 'src/types/youtube';
import { FacebookVideoQuality } from 'src/types/facebook';
import { getVideoFormats } from 'src/lib/helper';

@Injectable()
export class InfoService {
  constructor(private ytdlp: YtdlpService) {}

  async getVideoInfo(url: string): Promise<VideoInfoResponse> {
    const platform = getPlatform(url);
    if (!platform) {
      throw new BadRequestException('Unsupported platform or invalid URL');
    }

    try {
      const info = await this.ytdlp.getYtdlpVideoInfo(url);
      fs.writeFileSync('info.json', JSON.stringify(info, null, 2));

      const { allFormats, allExtensions } = this.getPlatformFormats(
        info,
        platform,
      );

      const videoInfo: VideoInfoResponse = {
        id: info.id,
        title: this.getTitle(info, platform),
        thumbnail: info.thumbnail,
        description: info.description || '',
        duration: info.duration,
        viewCount: info.view_count,
        uploader: info.uploader,
        uploaderUrl: info.uploader_url,
        timestamp: info.timestamp,
        categories: info.categories || [],
        qualities: allFormats,
        extensions: allExtensions,
        tags: info.tags || [],
        likeCount: info.like_count,
        commentCount: info.comment_count,
      };

      return videoInfo;
    } catch (error) {
      const errorMessage = this.handleError(error, platform);
      throw new BadRequestException(errorMessage);
    }
  }

  private getPlatformFormats(info: any, platform: string) {
    const audioFormats = Object.keys(audioQualityLabel);
    const allExtensions = {
      video: Object.keys(videoExtensionLabel),
      audio: Object.keys(audioExtensionLabel),
    };

    let videoFormats: string[];
    switch (platform) {
      case 'facebook':
        videoFormats = [FacebookVideoQuality.hd, FacebookVideoQuality.sd];
        break;
      default:
        videoFormats = getVideoFormats(info);
    }

    const allFormats = {
      video: [...new Set(videoFormats)],
      audio: [...new Set(audioFormats)],
    };

    return { allFormats, allExtensions };
  }

  private getTitle(info: any, platform: string): string {
    switch (platform) {
      case 'instagram':
        return info.title || 'Instagram Video';
      case 'tiktok':
        return info.title || 'TikTok Video';
      case 'twitter':
        return info.title || 'Twitter Video';
      default:
        return info.title;
    }
  }

  private handleError(error: unknown, platform: string): string {
    let errorMessage = `Invalid ${platform || ''} URL`;
    if (error instanceof Error) {
      errorMessage = error.message;
    }

    if (errorMessage.includes('ERROR:')) {
      errorMessage = errorMessage.split(':').pop()?.trim() || errorMessage;
    }

    return errorMessage;
  }
}
