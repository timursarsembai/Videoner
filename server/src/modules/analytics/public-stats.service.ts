import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

// Масштаб проекта для страницы «Videoner в цифрах» на сайте (web
// app/[locale]/stats). Удачное скачивание — то, что получило номер
// (Download.downloadNumber): бот, сайт, расширение, выдача из кеша. Сайт и
// расширение считают только скачивания — людей там без входа не различить;
// люди — пользователи бота, активный — удачно скачивал за 30 дней.
// Считается не чаще раза в CACHE_MS: страницу смотрят посетители, а запросы
// идут по всей таблице скачиваний.
const CACHE_MS = 60 * 60 * 1000;
const ACTIVE_DAYS = 30;

export interface PublicStats {
  updatedAt: string;
  since: string | null;
  downloads: number;
  bySource: { source: string; count: number }[];
  byPlatform: { platform: string; count: number }[];
  botUsers: number;
  activeBotUsers: number;
  countries: number;
}

@Injectable()
export class PublicStatsService {
  private cached: { at: number; data: PublicStats } | null = null;
  private pending: Promise<PublicStats> | null = null;

  constructor(private readonly prisma: PrismaService) {}

  async get(): Promise<PublicStats> {
    if (this.cached && Date.now() - this.cached.at < CACHE_MS) return this.cached.data;
    this.pending ??= this.compute()
      .then((data) => {
        this.cached = { at: Date.now(), data };
        return data;
      })
      .finally(() => {
        this.pending = null;
      });
    return this.pending;
  }

  private async compute(): Promise<PublicStats> {
    const numbered = { downloadNumber: { not: null } };
    const activeSince = new Date(Date.now() - ACTIVE_DAYS * 24 * 60 * 60 * 1000);
    const [downloads, first, bySource, byPlatform, botUsers, active, countries] = await Promise.all([
      this.prisma.download.count({ where: numbered }),
      this.prisma.download.findFirst({ where: numbered, orderBy: { createdAt: 'asc' }, select: { createdAt: true } }),
      this.prisma.download.groupBy({ by: ['source'], where: numbered, _count: { _all: true } }),
      this.prisma.download.groupBy({ by: ['downloader'], where: numbered, _count: { _all: true } }),
      this.prisma.botUser.count(),
      this.prisma.$queryRaw<{ n: number }[]>`
        SELECT COUNT(DISTINCT "botUserId")::int AS n FROM "Download"
        WHERE "downloadNumber" IS NOT NULL AND "botUserId" IS NOT NULL AND "createdAt" >= ${activeSince}`,
      this.prisma.$queryRaw<{ n: number }[]>`
        SELECT COUNT(DISTINCT country)::int AS n FROM "Download"
        WHERE "downloadNumber" IS NOT NULL AND country IS NOT NULL`,
    ]);
    return {
      updatedAt: new Date().toISOString(),
      since: first?.createdAt.toISOString() ?? null,
      downloads,
      bySource: bySource
        .map((r) => ({ source: r.source, count: r._count._all }))
        .sort((a, b) => b.count - a.count),
      byPlatform: byPlatform
        .map((r) => ({ platform: String(r.downloader), count: r._count._all }))
        .sort((a, b) => b.count - a.count),
      botUsers,
      activeBotUsers: active[0]?.n ?? 0,
      countries: countries[0]?.n ?? 0,
    };
  }
}
