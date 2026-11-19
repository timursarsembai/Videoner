import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ADULT_AUTHOR_PLATFORMS, adultAuthorNicks, nickFromInfo, nickFromUrl } from 'src/lib/adult-authors';

// Список аккаунтов 18+ (lib/adult-authors.ts): в памяти — для проверки на
// каждом запросе, в базе — чтобы переживал перезапуск.
const RELOAD_MS = 10 * 60 * 1000;

@Injectable()
export class AdultAuthorsService implements OnModuleInit {
  private nicks = new Set<string>();
  // Добавленные за последние минуты: запись в базу могла ещё не дойти, когда
  // список перечитывается, — без этого аккаунт на время выпал бы из запрета.
  private recent = new Map<string, number>();
  private loadedAt = 0;

  constructor(private prisma: PrismaService) {}

  async onModuleInit() {
    await this.reload();
  }

  private async reload() {
    try {
      const started = Date.now();
      const rows = await this.prisma.adultAuthor.findMany({ select: { platform: true, nick: true } });
      const nicks = new Set(rows.map((r) => `${r.platform}|${r.nick}`));
      for (const [key, at] of this.recent) {
        if (at < started - 60_000) this.recent.delete(key);
        else nicks.add(key);
      }
      this.nicks = nicks;
      this.loadedAt = Date.now();
    } catch (e) {
      console.error('AdultAuthor: список не загрузился:', e instanceof Error ? e.message : e);
    }
  }

  // Подтягиваем изменения из базы (их могли внести руками) не чаще раза в 10 минут.
  private refresh() {
    if (Date.now() - this.loadedAt > RELOAD_MS) {
      this.loadedAt = Date.now();
      void this.reload();
    }
  }

  // Пост от аккаунта 18+ — не качаем.
  isBlocked(platform: string | null | undefined, info: unknown, url: string): boolean {
    this.refresh();
    return adultAuthorNicks(platform, info, url).some((n) => this.nicks.has(`${platform}|${n}`));
  }

  // Площадка пометила пост как 18+ — запоминаем автора. Ник — из ответа
  // площадки, а если пост скрыт и ответа нет — из ссылки.
  remember(platform: string | null | undefined, info: unknown, url: string) {
    if (!platform || !ADULT_AUTHOR_PLATFORMS.has(platform)) return;
    const nick = nickFromInfo(info) ?? nickFromUrl(url);
    if (!nick) return;
    this.nicks.add(`${platform}|${nick}`);
    this.recent.set(`${platform}|${nick}`, Date.now());
    this.prisma.adultAuthor
      .upsert({
        where: { platform_nick: { platform, nick } },
        create: { platform, nick },
        update: { hits: { increment: 1 }, lastAt: new Date() },
      })
      .catch((e) => console.error('AdultAuthor: не записан:', e instanceof Error ? e.message : e));
  }
}
