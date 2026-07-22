import { BadRequestException, Injectable } from '@nestjs/common';
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
import { AlertService } from '../alert/alert.service';
import { BotUserService } from '../analytics/bot-user.service';
import { GetVideoInfoDto } from './dto/get-video-info.dto';

// Платформы, где cookies нужны только для приватного/залогиненного контента —
// публичное видео и так скачивается анонимно, поэтому при признаках "нужен
// логин" (протухшие cookies) имеет смысл фолбэк без cookies. YouTube сюда
// не входит: там "Sign in to confirm you're not a bot" — это анти-бот защита
// по IP дата-центра, а не про приватность конкретного видео, без cookies
// с этого сервера не работает вообще ничего.
const COOKIE_FALLBACK_PLATFORMS = [
  'instagram',
  'facebook',
  'vimeo',
  'tiktok',
  'twitter',
  'vk',
  'rutube',
  'okru',
];

const AUTH_REQUIRED_PATTERN =
  /(login required|only works when logged-in|rate-limit reached|HTTP Error 401|Unauthorized)/i;

@Injectable()
export class InfoService {
  constructor(
    private ytdlp: YtdlpService,
    private alert: AlertService,
    private botUser: BotUserService,
  ) {}

  async getVideoInfo(dto: GetVideoInfoDto): Promise<VideoInfoResponse> {
    const { url, telegramId, telegramUsername, telegramLanguageCode } = dto;
    const platform = getPlatform(url);
    if (!platform) {
      throw new BadRequestException('Unsupported platform or invalid URL');
    }

    if (telegramId) {
      void this.botUser.upsertBotUser({
        telegramId,
        username: telegramUsername,
        languageCode: telegramLanguageCode,
      });
    }

    try {
      const info = await this.fetchInfoWithCookieFallback(url, platform);

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

  private async fetchInfoWithCookieFallback(url: string, platform: string) {
    try {
      return await this.ytdlp.getYtdlpVideoInfo(url);
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      if (
        !COOKIE_FALLBACK_PLATFORMS.includes(platform) ||
        !AUTH_REQUIRED_PATTERN.test(message)
      ) {
        throw error;
      }

      // Cookies выглядят протухшими — уведомляем админа независимо от того,
      // сработает ли фолбэк (публичный контент может скачаться и анонимно,
      // но cookies всё равно пора переэкспортировать для приватного).
      void this.alert.notifyCookiesExpired(platform, message);
      return this.ytdlp.getYtdlpVideoInfo(url, { skipCookies: true });
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
      // Берём всё после первого "ERROR:" (а не split(':').pop(), который рубил
      // сообщение по последнему двоеточию — например по "https:" в ссылке).
      let msg = errorMessage
        .slice(errorMessage.indexOf('ERROR:') + 'ERROR:'.length)
        .trim();
      // Отрезаем хвост со служебными ссылками yt-dlp ("See https://…", "Also see …"),
      // сохраняя суть (в т.ч. "Sign in to confirm…", по которой бот распознаёт нужность cookies).
      msg = msg.split(/\s*(?:See|Also see)\s+https?:\/\//i)[0].trim();
      errorMessage = msg || errorMessage;
    }

    if (/sign in to confirm/i.test(errorMessage)) {
      // Не ждём отправки — не задерживаем ответ пользователю алертом в Telegram.
      void this.alert.notifyYoutubeAuthRequired(errorMessage);
    }

    if (/no video formats? found/i.test(errorMessage)) {
      // yt-dlp отдаёт тут техническое сообщение с просьбой завести issue на GitHub —
      // на деле это почти всегда пост без видео (например, пин с одними фото).
      errorMessage =
        "This link doesn't contain a downloadable video — the post appears to be photo-only content.";
    }

    return errorMessage;
  }
}
