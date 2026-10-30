import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

export const CAPTION_STYLES = ['full', 'short', 'none'] as const;
export const QUALITY_MODES = ['standard', 'max'] as const;
export const COOKIES_BY = ['admins', 'all'] as const;

export type GroupSettingsView = {
  chatId: string;
  deleteLinks: boolean;
  caption: (typeof CAPTION_STYLES)[number];
  quality: (typeof QUALITY_MODES)[number];
  longVideos: boolean;
  cookiesBy: (typeof COOKIES_BY)[number];
};

export type GroupSettingsPatch = Partial<Omit<GroupSettingsView, 'chatId'>>;

const DEFAULTS: Omit<GroupSettingsView, 'chatId'> = {
  deleteLinks: false,
  caption: 'full',
  quality: 'standard',
  longVideos: false,
  cookiesBy: 'admins',
};

@Injectable()
export class GroupSettingsService {
  constructor(private readonly prisma: PrismaService) {}

  // Строки нет — настройки по умолчанию; в базу при этом ничего не пишем:
  // большинство групп настройки не трогает.
  async get(chatId: bigint): Promise<GroupSettingsView> {
    const row = await this.prisma.groupSettings.findUnique({ where: { chatId } });
    return this.view(chatId, row ?? DEFAULTS);
  }

  async update(chatId: bigint, patch: GroupSettingsPatch): Promise<GroupSettingsView> {
    const row = await this.prisma.groupSettings.upsert({
      where: { chatId },
      create: { chatId, ...DEFAULTS, ...patch },
      update: patch,
    });
    return this.view(chatId, row);
  }

  private view(
    chatId: bigint,
    s: { deleteLinks: boolean; caption: string; quality: string; longVideos: boolean; cookiesBy: string },
  ): GroupSettingsView {
    return {
      // BigInt в JSON не сериализуется — отдаём строкой, как telegramId.
      chatId: chatId.toString(),
      deleteLinks: s.deleteLinks,
      caption: (CAPTION_STYLES as readonly string[]).includes(s.caption) ? (s.caption as GroupSettingsView['caption']) : DEFAULTS.caption,
      quality: (QUALITY_MODES as readonly string[]).includes(s.quality) ? (s.quality as GroupSettingsView['quality']) : DEFAULTS.quality,
      longVideos: s.longVideos,
      cookiesBy: (COOKIES_BY as readonly string[]).includes(s.cookiesBy) ? (s.cookiesBy as GroupSettingsView['cookiesBy']) : DEFAULTS.cookiesBy,
    };
  }
}
