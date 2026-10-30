import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';

// Взятая, но не отмеченная статья (messageId пуст): бот упал или
// перезапустился между «взял» и «опубликовал». Через столько её можно взять
// снова. Если пост при этом успел уйти, а номер так и не записался, он
// выйдет второй раз — это меньшее зло, чем статья, которая не выйдет никогда
// (неудачный done бот повторяет сам, пока жив, — blog-channel.ts).
const STALE_CLAIM_MS = 15 * 60_000;

@Injectable()
export class ChannelPostsService {
  constructor(private readonly prisma: PrismaService) {}

  // Опубликованные и взятые недавно — их бот пропускает.
  async published(): Promise<string[]> {
    const rows = await this.prisma.channelPost.findMany({
      where: { OR: [{ messageId: { not: null } }, { publishedAt: { gt: this.staleBefore() } }] },
      select: { slug: true },
    });
    return rows.map((r) => r.slug);
  }

  private staleBefore() {
    return new Date(Date.now() - STALE_CLAIM_MS);
  }

  // true — статья наша, можно публиковать; false — её уже взяли.
  async claim(slug: string): Promise<boolean> {
    try {
      await this.prisma.channelPost.create({ data: { slug } });
      return true;
    } catch (e) {
      if (!(e instanceof Prisma.PrismaClientKnownRequestError && e.code === 'P2002')) throw e;
      // Уже взята. Забираем, только если взявший давно пропал (см. выше);
      // условный update — чтобы два бота не забрали её одновременно.
      const { count } = await this.prisma.channelPost.updateMany({
        where: { slug, messageId: null, publishedAt: { lt: this.staleBefore() } },
        data: { publishedAt: new Date() },
      });
      return count === 1;
    }
  }

  async done(slug: string, messageId: number) {
    await this.prisma.channelPost.update({ where: { slug }, data: { messageId } });
  }

  async release(slug: string) {
    await this.prisma.channelPost.deleteMany({ where: { slug, messageId: null } });
  }
}
