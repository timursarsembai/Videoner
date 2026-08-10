import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { DownloadStatus } from '@prisma/client';

export interface UpsertBotUserInput {
  telegramId: number;
  username?: string;
  firstName?: string;
  languageCode?: string;
  // true только из telegramLogin (вход на сайте) — отдельно от обычного
  // upsert'а в боте, который вызывается на каждое сообщение и не должен
  // считаться "заходом на сайт".
  markWebLogin?: boolean;
}

// Профиль, который отдаётся сайту после входа через Telegram Login Widget.
// Раньше назывался SubscriptionStatus и нёс даты подписки — платных функций
// больше нет, остался только признак ручного админского безлимита.
export interface BotUserProfile {
  telegramId: string;
  username: string | null;
  firstName: string | null;
  isUnlimited: boolean;
}

@Injectable()
export class BotUserService {
  constructor(private prisma: PrismaService) {}

  async upsertBotUser(data: UpsertBotUserInput) {
    const telegramId = BigInt(data.telegramId);
    const webLogin = data.markWebLogin ? { lastWebLoginAt: new Date() } : {};
    return this.prisma.botUser.upsert({
      where: { telegramId },
      create: {
        telegramId,
        username: data.username,
        firstName: data.firstName,
        languageCode: data.languageCode,
        ...webLogin,
      },
      update: {
        username: data.username,
        firstName: data.firstName,
        languageCode: data.languageCode,
        lastSeenAt: new Date(),
        ...webLogin,
      },
    });
  }

  // Профиль для входа на сайт через Telegram Login Widget
  // (см. bot-user.controller.ts).
  async getProfile(telegramId: number): Promise<BotUserProfile | null> {
    const botUser = await this.prisma.botUser.findUnique({
      where: { telegramId: BigInt(telegramId) },
    });
    if (!botUser) return null;

    return {
      telegramId: botUser.telegramId.toString(),
      username: botUser.username,
      firstName: botUser.firstName,
      isUnlimited: botUser.isUnlimited,
    };
  }

  // Ручной админский грант через /grant, без срока. Купить его нельзя —
  // платных функций в сервисе нет.
  async isUnlimited(telegramId: number): Promise<boolean> {
    const botUser = await this.prisma.botUser.findUnique({
      where: { telegramId: BigInt(telegramId) },
      select: { isUnlimited: true },
    });
    return botUser?.isUnlimited ?? false;
  }

  // Пользователь должен хотя бы раз написать боту (BotUser создаётся через
  // upsertBotUser), поэтому здесь только update — без create.
  async setUnlimited(
    target: { telegramId?: number; username?: string },
    isUnlimited: boolean,
  ) {
    const botUser = target.telegramId
      ? await this.prisma.botUser.findUnique({
          where: { telegramId: BigInt(target.telegramId) },
        })
      : await this.prisma.botUser.findFirst({
          where: { username: { equals: target.username, mode: 'insensitive' } },
        });
    if (!botUser) return null;

    return this.prisma.botUser.update({
      where: { id: botUser.id },
      data: { isUnlimited },
    });
  }

  // Считаем только успешно завершённые скачивания за последние 24ч —
  // неудачные попытки (битая ссылка и т.п.) не должны съедать лимит пользователя.
  // EXPIRED считаем тоже: CleanupService переводит в него COMPLETED после удаления
  // файла с диска, это не отменяет сам факт скачивания.
  async countDownloadsToday(telegramId: number): Promise<number> {
    const botUser = await this.prisma.botUser.findUnique({
      where: { telegramId: BigInt(telegramId) },
    });
    if (!botUser) return 0;

    const since = new Date(Date.now() - 24 * 60 * 60 * 1000);
    return this.prisma.download.count({
      where: {
        botUserId: botUser.id,
        status: { in: [DownloadStatus.COMPLETED, DownloadStatus.EXPIRED] },
        createdAt: { gte: since },
      },
    });
  }
}
