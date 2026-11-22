import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ADULT_AUTHOR_PLATFORMS, adultAuthorNicks, nickFromInfo, nickFromUrl } from 'src/lib/adult-authors';
import { wouldBlockAdult } from 'src/lib/blocked-content';
import { WATCH_LOOKBACK_MS, adultHintInInfo, isWatched } from 'src/lib/adult-watch';

// Список аккаунтов 18+ (lib/adult-authors.ts): в памяти — для проверки на
// каждом запросе, в базе — чтобы переживал перезапуск.
const RELOAD_MS = 10 * 60 * 1000;
// Наблюдение (lib/adult-watch.ts): ответы базы держим недолго — человек
// мог только что получить отказ, автор — новый пост.
const WATCH_CACHE_MS = 5 * 60 * 1000;
const SUSPECT_CACHE_MS = 30 * 60 * 1000;
const CACHE_MAX = 5000;

@Injectable()
export class AdultAuthorsService implements OnModuleInit {
  private nicks = new Set<string>();
  // Добавленные за последние минуты: запись в базу могла ещё не дойти, когда
  // список перечитывается, — без этого аккаунт на время выпал бы из запрета.
  private recent = new Map<string, number>();
  private loadedAt = 0;
  private watched = new Map<number, { yes: boolean; at: number }>();
  private suspects = new Map<string, { yes: boolean; at: number }>();

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

  // Под наблюдением ли человек (lib/adult-watch.ts). Сбой базы — считаем,
  // что нет: строгий фильтр не должен ломать скачивание всем.
  async isWatchedUser(telegramId: number): Promise<boolean> {
    const cached = this.watched.get(telegramId);
    if (cached && Date.now() - cached.at < WATCH_CACHE_MS) return cached.yes;
    let yes = false;
    try {
      const rows = await this.prisma.linkFailure.findMany({
        where: {
          errorCategory: 'ADULT_CONTENT',
          createdAt: { gt: new Date(Date.now() - WATCH_LOOKBACK_MS) },
          botUser: { telegramId: BigInt(telegramId) },
        },
        select: { createdAt: true },
        take: 500,
      });
      yes = isWatched(rows.map((r) => r.createdAt));
    } catch (e) {
      console.error('Наблюдение 18+: не проверено:', e instanceof Error ? e.message : e);
      return false;
    }
    cacheSet(this.watched, telegramId, yes);
    return yes;
  }

  // Есть ли признаки 18+ в том, что раньше качали у этого автора X.
  private async suspectAuthor(nick: string): Promise<boolean> {
    const cached = this.suspects.get(nick);
    if (cached && Date.now() - cached.at < SUSPECT_CACHE_MS) return cached.yes;
    let yes = false;
    try {
      const rows = await this.prisma.$queryRaw<{ title: string | null; hashtags: string[]; author: string | null }[]>`
        SELECT "videoTitle" AS title, hashtags, "authorName" AS author
        FROM "Download"
        WHERE downloader = 'TWITTER' AND lower("authorId") = ${nick}
        ORDER BY "createdAt" DESC
        LIMIT 200`;
      yes = rows.some((r) => wouldBlockAdult(r));
    } catch (e) {
      console.error('Наблюдение 18+: автор не проверен:', e instanceof Error ? e.message : e);
      return false;
    }
    cacheSet(this.suspects, nick, yes);
    return yes;
  }

  // Строгий фильтр для людей под наблюдением: пост X с признаками 18+ или от
  // автора, у которого они были в других постах, — не качаем. telegramId
  // передавать только проверенный (запрос от бота).
  async isStrictBlocked(platform: string | null | undefined, info: unknown, url: string, telegramId?: number): Promise<boolean> {
    if (!telegramId || !platform || !ADULT_AUTHOR_PLATFORMS.has(platform)) return false;
    if (!(await this.isWatchedUser(telegramId))) return false;
    if (adultHintInInfo(info)) return true;
    for (const nick of adultAuthorNicks(platform, info, url)) {
      if (await this.suspectAuthor(nick)) return true;
    }
    return false;
  }
}

function cacheSet<K>(map: Map<K, { yes: boolean; at: number }>, key: K, yes: boolean) {
  if (map.size >= CACHE_MAX) map.clear();
  map.set(key, { yes, at: Date.now() });
}
