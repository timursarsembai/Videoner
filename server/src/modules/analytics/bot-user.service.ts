import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

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
}
