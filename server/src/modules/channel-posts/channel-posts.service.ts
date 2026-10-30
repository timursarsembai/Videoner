import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ChannelPostsService {
  constructor(private readonly prisma: PrismaService) {}

  async published(): Promise<string[]> {
    const rows = await this.prisma.channelPost.findMany({ select: { slug: true } });
    return rows.map((r) => r.slug);
  }

  // true — статья наша, можно публиковать; false — её уже взяли.
  async claim(slug: string): Promise<boolean> {
    try {
      await this.prisma.channelPost.create({ data: { slug } });
      return true;
    } catch (e) {
      if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === 'P2002') return false;
      throw e;
    }
  }

  async done(slug: string, messageId: number) {
    await this.prisma.channelPost.update({ where: { slug }, data: { messageId } });
  }

  async release(slug: string) {
    await this.prisma.channelPost.deleteMany({ where: { slug, messageId: null } });
  }
}
