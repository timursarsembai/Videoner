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
    const botUser = await this.prisma.botUser.upsert({
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
    await this.recordActivityDay(botUser.id);
    // Блокировку здесь не снимаем: сюда приходят и запросы сайта, а человек,
    // заблокировавший бота, может пользоваться сайтом. О разблокировке Telegram
    // сообщает боту сам (setBlocked).
    return botUser;
  }

  // Человек заблокировал бота или разблокировал его. Событие для графиков
  // пишется только при смене состояния: Telegram может прислать то же самое
  // повторно. Смена и проверка — одним условным update, чтобы два
  // одновременных вызова не записали два события. Незнакомых боту людей
  // пропускаем: статистика — только по тем, кого мы уже видели.
  async setBlocked(telegramId: number | string, blocked: boolean, source: string) {
    try {
      const at = new Date();
      await this.prisma.$transaction(async (tx) => {
        const botUser = await tx.botUser.findUnique({
          where: { telegramId: BigInt(telegramId) },
          select: { id: true },
        });
        if (!botUser) return;
        const changed = await tx.botUser.updateMany({
          where: { id: botUser.id, blockedAt: blocked ? null : { not: null } },
          data: { blockedAt: blocked ? at : null },
        });
        if (changed.count !== 1) return;
        await tx.botBlockEvent.create({
          data: { botUserId: botUser.id, blocked, source, at },
        });
      });
    } catch (e) {
      console.error(`Failed to record block state for BotUser ${telegramId}:`, e);
    }
  }

  // День активности для графиков MAU (см. модель UserActivityDay). Сбой
  // записи только в лог: из-за статистики скачивание ломаться не должно.
  private async recordActivityDay(botUserId: string) {
    const now = new Date();
    const day = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()));
    try {
      await this.prisma.userActivityDay.createMany({
        data: [{ botUserId, day }],
        skipDuplicates: true,
      });
    } catch (e) {
      console.error(`Failed to record activity day for BotUser ${botUserId}:`, e);
    }
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
