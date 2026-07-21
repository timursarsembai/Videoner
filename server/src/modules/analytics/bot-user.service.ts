import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { DownloadStatus } from '@prisma/client';

export interface UpsertBotUserInput {
  telegramId: number;
  username?: string;
  languageCode?: string;
}

@Injectable()
export class BotUserService {
  constructor(private prisma: PrismaService) {}

  async upsertBotUser(data: UpsertBotUserInput) {
    const telegramId = BigInt(data.telegramId);
    return this.prisma.botUser.upsert({
      where: { telegramId },
      create: {
        telegramId,
        username: data.username,
        languageCode: data.languageCode,
      },
      update: {
        username: data.username,
        languageCode: data.languageCode,
        lastSeenAt: new Date(),
      },
    });
  }

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
