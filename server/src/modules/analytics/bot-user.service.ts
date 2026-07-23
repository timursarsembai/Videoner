import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { DownloadStatus, SubscriptionKind } from '@prisma/client';

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

export interface SubscriptionStatus {
  telegramId: string;
  username: string | null;
  firstName: string | null;
  isUnlimited: boolean;
  subscriptionUntil: Date | null;
  subscriptionKind: SubscriptionKind | null;
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

  // Полный снимок статуса подписки — для входа на сайт через Telegram Login
  // Widget (см. bot-user.controller.ts): в отличие от isUnlimited() ниже, тут
  // нужны сырые даты для отображения ("активна до ..."), а не просто boolean.
  async getSubscriptionStatus(telegramId: number): Promise<SubscriptionStatus | null> {
    const botUser = await this.prisma.botUser.findUnique({
      where: { telegramId: BigInt(telegramId) },
    });
    if (!botUser) return null;

    return {
      telegramId: botUser.telegramId.toString(),
      username: botUser.username,
      firstName: botUser.firstName,
      isUnlimited:
        botUser.isUnlimited ||
        (botUser.subscriptionUntil != null && botUser.subscriptionUntil > new Date()),
      subscriptionUntil: botUser.subscriptionUntil,
      subscriptionKind: botUser.subscriptionKind,
    };
  }

  // true и для ручного гранта (isUnlimited, без срока — см. /grant), и для
  // действующей купленной подписки (subscriptionUntil в будущем).
  async isUnlimited(telegramId: number): Promise<boolean> {
    const botUser = await this.prisma.botUser.findUnique({
      where: { telegramId: BigInt(telegramId) },
      select: { isUnlimited: true, subscriptionUntil: true },
    });
    if (!botUser) return false;
    return (
      botUser.isUnlimited ||
      (botUser.subscriptionUntil != null && botUser.subscriptionUntil > new Date())
    );
  }

  // Вызывается после успешной оплаты Stars (месячная — при каждом
  // автопродлении тоже, сервер просто продлевает дату; годовая — один раз).
  // Апсертим, а не только update: пользователь уже писал боту к этому моменту
  // (иначе не смог бы дойти до оплаты), но на всякий случай не полагаемся на это.
  async setSubscriptionUntil(
    telegramId: number,
    until: Date,
    kind: SubscriptionKind,
    meta?: { username?: string; languageCode?: string },
  ) {
    const bigId = BigInt(telegramId);
    return this.prisma.botUser.upsert({
      where: { telegramId: bigId },
      create: {
        telegramId: bigId,
        username: meta?.username,
        languageCode: meta?.languageCode,
        subscriptionUntil: until,
        subscriptionKind: kind,
      },
      update: {
        subscriptionUntil: until,
        subscriptionKind: kind,
        username: meta?.username,
        languageCode: meta?.languageCode,
      },
    });
  }

  // Для ежедневного напоминания о продлении годовой подписки — только YEARLY,
  // т.к. MONTHLY продлевается автоматически (Telegram сам спишет звёзды),
  // напоминание про неё было бы вводящим в заблуждение.
  async findYearlySubscriptionsExpiringBetween(from: Date, to: Date) {
    return this.prisma.botUser.findMany({
      where: {
        subscriptionKind: SubscriptionKind.YEARLY,
        subscriptionUntil: { gte: from, lt: to },
      },
    });
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

  // Считаем только успешно завершённые бесплатные скачивания за последние 24ч —
  // неудачные попытки (битая ссылка и т.п.) не должны съедать лимит пользователя.
  // EXPIRED считаем тоже: CleanupService переводит в него COMPLETED после удаления
  // файла с диска, это не отменяет сам факт скачивания.
  async countFreeDownloadsToday(telegramId: number): Promise<number> {
    const botUser = await this.prisma.botUser.findUnique({
      where: { telegramId: BigInt(telegramId) },
    });
    if (!botUser) return 0;

    const since = new Date(Date.now() - 24 * 60 * 60 * 1000);
    return this.prisma.download.count({
      where: {
        botUserId: botUser.id,
        isPaid: false,
        status: { in: [DownloadStatus.COMPLETED, DownloadStatus.EXPIRED] },
        createdAt: { gte: since },
      },
    });
  }
}
