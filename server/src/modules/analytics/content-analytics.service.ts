import { Injectable } from '@nestjs/common';
import { Downloaders, Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import type { DateRange } from 'src/lib/analytics-range';
import { TOPIC_LABELS, topicsOf, type TopicId } from 'src/lib/sensitive-topics';

// «Что качают» (дашборд, вкладка «Контент»): популярные авторы, категории
// и хэштеги удачных скачиваний за период. Данные — lib/content-meta.ts, с
// 18.11.2026; раньше — только то, что восстановилось из названий и ссылок
// (миграция download_content_meta). Проверки через API не считаем.

// Хэштеги, которые ничего не говорят о теме: ими помечают всё подряд ради
// рекомендаций. Без них верх списка был бы одинаковым у всех.
export const NOISE_HASHTAGS = [
  'shorts', 'short', 'youtubeshorts', 'shortsvideo', 'shortvideo', 'fyp', 'fy', 'fypシ', 'foryou', 'foryoupage',
  'fypage', 'viral', 'viralvideo', 'viralshorts', 'trending', 'trend', 'reels', 'reel', 'reelsinstagram',
  'instagram', 'instagood', 'tiktok', 'capcut', 'xyzbca', 'explore', 'explorepage', 'рек', 'рекомендации',
  'реки', 'хочуврек', 'врек', 'втоп', 'тренды', 'тренд', 'рекомендация',
];

const OK = Prisma.sql`d.status IN ('COMPLETED','EXPIRED') AND d.source <> 'API'`;

function platformFilter(platform?: Downloaders) {
  return platform ? Prisma.sql`AND d.downloader = ${platform}::"Downloaders"` : Prisma.empty;
}

export function parsePlatform(v: unknown): Downloaders | undefined {
  const s = typeof v === 'string' ? v.toUpperCase() : '';
  return (Object.values(Downloaders) as string[]).includes(s) ? (s as Downloaders) : undefined;
}

@Injectable()
export class ContentAnalyticsService {
  constructor(private prisma: PrismaService) {}

  // Авторы по числу удачных скачиваний: один и тот же автор на площадке —
  // по authorId (имя меняется), показываем самое свежее имя и ссылку.
  async authors(range: DateRange, platform: Downloaders | undefined, limit: number, sort: 'users' | 'downloads' = 'users') {
    const order = sort === 'users' ? Prisma.sql`users DESC, downloads DESC` : Prisma.sql`downloads DESC, users DESC`;
    const rows = await this.prisma.$queryRaw<
      { platform: string; author_key: string; name: string | null; url: string | null; downloads: bigint; users: bigint; last_at: Date }[]
    >`
      SELECT d.downloader::text AS platform,
             coalesce(d."authorId", d."authorName") AS author_key,
             (array_agg(d."authorName" ORDER BY d."createdAt" DESC) FILTER (WHERE d."authorName" IS NOT NULL))[1] AS name,
             (array_agg(d."authorUrl" ORDER BY d."createdAt" DESC) FILTER (WHERE d."authorUrl" IS NOT NULL))[1] AS url,
             count(*) AS downloads,
             count(DISTINCT coalesce(d."botUserId", d."clientIpHash")) AS users,
             max(d."createdAt") AS last_at
      FROM "Download" d
      WHERE ${OK} AND d."createdAt" >= ${range.from} AND d."createdAt" < ${range.to}
        AND coalesce(d."authorId", d."authorName") IS NOT NULL ${platformFilter(platform)}
      GROUP BY 1, 2
      ORDER BY ${order}, last_at DESC
      LIMIT ${limit}`;
    const [cover] = await this.prisma.$queryRaw<{ total: bigint; with_author: bigint }[]>`
      SELECT count(*) AS total, count(*) FILTER (WHERE coalesce(d."authorId", d."authorName") IS NOT NULL) AS with_author
      FROM "Download" d
      WHERE ${OK} AND d."createdAt" >= ${range.from} AND d."createdAt" < ${range.to} ${platformFilter(platform)}`;
    return {
      total: Number(cover?.total ?? 0),
      withAuthor: Number(cover?.with_author ?? 0),
      authors: rows.map((r) => ({
        key: `${r.platform}|${r.author_key}`,
        platform: r.platform,
        name: r.name ?? r.author_key,
        url: r.url,
        downloads: Number(r.downloads),
        users: Number(r.users),
        lastAt: r.last_at,
      })),
    };
  }

  // Категории площадок: YouTube — своя, Reddit — сабреддит.
  async categories(range: DateRange, limit: number) {
    const rows = await this.prisma.$queryRaw<{ platform: string; category: string; downloads: bigint }[]>`
      SELECT d.downloader::text AS platform, d.category, count(*) AS downloads
      FROM "Download" d
      WHERE ${OK} AND d."createdAt" >= ${range.from} AND d."createdAt" < ${range.to} AND d.category IS NOT NULL
      GROUP BY 1, 2 ORDER BY downloads DESC LIMIT ${limit}`;
    return rows.map((r) => ({ platform: r.platform, category: r.category, downloads: Number(r.downloads) }));
  }

  async hashtags(range: DateRange, platform: Downloaders | undefined, limit: number) {
    const rows = await this.prisma.$queryRaw<{ tag: string; downloads: bigint }[]>`
      SELECT tag, count(*) AS downloads
      FROM "Download" d, unnest(d.hashtags) AS tag
      WHERE ${OK} AND d."createdAt" >= ${range.from} AND d."createdAt" < ${range.to}
        AND tag <> ALL(${NOISE_HASHTAGS}) ${platformFilter(platform)}
      GROUP BY 1 ORDER BY downloads DESC LIMIT ${limit}`;
    return rows.map((r) => ({ tag: r.tag, downloads: Number(r.downloads) }));
  }

  // Религия по конфессиям и эзотерика (lib/sensitive-topics.ts) — частота,
  // число людей и примеры названий, по которым видно, где список слов
  // промахивается. Считается на лету: правка списка сразу пересчитывает и
  // прошлое. Пока только подсчёт, ничего не блокируем (владелец, 18.11.2026).
  async topics(range: DateRange, platform: Downloaders | undefined) {
    const rows = await this.prisma.$queryRaw<
      { title: string | null; hashtags: string[]; author: string | null; who: string | null }[]
    >`
      SELECT d."videoTitle" AS title, d.hashtags, d."authorName" AS author, coalesce(d."botUserId", d."clientIpHash") AS who
      FROM "Download" d
      WHERE ${OK} AND d."createdAt" >= ${range.from} AND d."createdAt" < ${range.to} ${platformFilter(platform)}
      LIMIT 200000`;
    const acc = new Map<TopicId, { downloads: number; users: Set<string>; examples: Map<string, number> }>();
    for (const r of rows) {
      for (const id of topicsOf(r)) {
        let t = acc.get(id);
        if (!t) acc.set(id, (t = { downloads: 0, users: new Set(), examples: new Map() }));
        t.downloads++;
        if (r.who) t.users.add(r.who);
        const title = (r.title ?? '').slice(0, 120) || '(без названия)';
        t.examples.set(title, (t.examples.get(title) ?? 0) + 1);
      }
    }
    return {
      total: rows.length,
      topics: (Object.keys(TOPIC_LABELS) as TopicId[]).map((id) => {
        const t = acc.get(id);
        return {
          id,
          label: TOPIC_LABELS[id],
          downloads: t?.downloads ?? 0,
          users: t?.users.size ?? 0,
          examples: t
            ? [...t.examples.entries()].sort((a, b) => b[1] - a[1]).slice(0, 15).map(([title, count]) => ({ title, count }))
            : [],
        };
      }),
    };
  }
}
