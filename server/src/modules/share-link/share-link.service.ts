import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { randomInt } from 'crypto';
import { PrismaService } from '../prisma/prisma.service';

// Без похожих друг на друга символов (0/O, 1/l/I): код иногда переписывают
// руками со скриншота. 8 символов из 56 — около 10^14 вариантов, перебором
// чужие ссылки не найти, да и секретного в них ничего нет.
const ALPHABET = 'abcdefghijkmnopqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ23456789';
const CODE_LENGTH = 8;
const MAX_ATTEMPTS = 5;

function generateCode(): string {
  let code = '';
  for (let i = 0; i < CODE_LENGTH; i++) code += ALPHABET[randomInt(ALPHABET.length)];
  return code;
}

@Injectable()
export class ShareLinkService {
  constructor(private readonly prisma: PrismaService) {}

  /** Код для ссылки: существующий, если её уже выдавали, иначе новый. */
  async getOrCreate(url: string): Promise<string> {
    for (let attempt = 0; attempt < MAX_ATTEMPTS; attempt++) {
      const existing = await this.prisma.shareLink.findUnique({ where: { url } });
      if (existing) return existing.code;
      try {
        const created = await this.prisma.shareLink.create({
          data: { url, code: generateCode() },
        });
        return created.code;
      } catch (e) {
        // P2002 — нарушена уникальность: либо совпал код (повторяем с новым),
        // либо ту же ссылку параллельно записал другой запрос (следующий
        // круг найдёт её через findUnique).
        if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === 'P2002') continue;
        throw e;
      }
    }
    throw new Error('Не удалось подобрать свободный код для ссылки');
  }

  async resolve(code: string): Promise<string> {
    const link = await this.prisma.shareLink.findUnique({ where: { code } });
    if (!link) throw new NotFoundException('Share link not found');
    return link.url;
  }
}
