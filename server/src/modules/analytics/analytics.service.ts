import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { DownloadStatus, SubscriptionKind } from '@prisma/client';

// Цены Stars-подписки — держим в синхроне с bot/src/bot.ts
// (subscribeMonthlyButton/subscribeYearlyButton). Тут только для оценки MRR,
// на сам биллинг не влияет.
const MONTHLY_PRICE_STARS = 150;
const YEARLY_PRICE_STARS = 1500;

// NULL и явное значение enum (например 'OTHER') должны схлопываться в одну
// группу при агрегации по nullable-полю — иначе они приходят как два разных
// ряда с одинаковой отображаемой меткой, и один молча перезаписывает другой
// при дальнейшем схлопывании по ключу (см. историю найденного и дважды
// исправленного бага: errorsTimeseries() ниже решает это COALESCE прямо в
// SQL, но Prisma `groupBy()` COALESCE не умеет — там нужен JS-мердж).
// Общий хелпер, чтобы при появлении следующего похожего группирования не
// пришлось третий раз находить этот же класс бага заново.
function mergeNullableGroups<T>(
  rows: T[],
  getCategory: (row: T) => string | null,
  getCount: (row: T) => number,
  fallback = 'OTHER',
): { category: string; count: number }[] {
  const merged = new Map<string, number>();
  for (const row of rows) {
    const category = getCategory(row) ?? fallback;
    merged.set(category, (merged.get(category) ?? 0) + getCount(row));
  }
  return Array.from(merged.entries()).map(([category, count]) => ({ category, count }));
}

@Injectable()
export class AnalyticsService {
  constructor(private prisma: PrismaService) {}

  async overview() {
    const [total, completed, failed, revenue, totalBotUsers] =
      await Promise.all([
        this.prisma.download.count(),
        this.prisma.download.count({
          where: { status: DownloadStatus.COMPLETED },
        }),
        this.prisma.download.count({
          where: { status: DownloadStatus.FAILED },
        }),
        this.prisma.download.aggregate({
          _sum: { starsAmount: true },
          where: { isPaid: true },
        }),
        this.prisma.botUser.count(),
      ]);

    const finished = completed + failed;

    return {
      totalDownloads: total,
      completedDownloads: completed,
      failedDownloads: failed,
      successRate: finished > 0 ? completed / finished : null,
      totalStarsRevenue: revenue._sum.starsAmount ?? 0,
      totalBotUsers,
    };
  }

  async platforms() {
    const rows = await this.prisma.download.groupBy({
      by: ['downloader'],
      _count: { _all: true },
    });
    return rows.map((row) => ({
      platform: row.downloader,
      count: row._count._all,
    }));
  }

  async sources() {
    const rows = await this.prisma.download.groupBy({
      by: ['source'],
      _count: { _all: true },
    });
    return rows.map((row) => ({
      source: row.source,
      count: row._count._all,
    }));
  }

  async timeseries(days: number) {
    const [downloads, newBotUsers] = await Promise.all([
      this.prisma.$queryRaw<{ day: Date; count: number }[]>`
        SELECT date_trunc('day', "createdAt") as day, COUNT(*)::int as count
        FROM "Download"
        WHERE "createdAt" >= NOW() - make_interval(days => ${days}::int)
        GROUP BY day
        ORDER BY day ASC
      `,
      this.prisma.$queryRaw<{ day: Date; count: number }[]>`
        SELECT date_trunc('day', "firstSeenAt") as day, COUNT(*)::int as count
        FROM "BotUser"
        WHERE "firstSeenAt" >= NOW() - make_interval(days => ${days}::int)
        GROUP BY day
        ORDER BY day ASC
      `,
    ]);

    return {
      downloads: downloads.map((row) => ({ day: row.day, count: row.count })),
      newBotUsers: newBotUsers.map((row) => ({
        day: row.day,
        count: row.count,
      })),
    };
  }

  async usersActivity() {
    const now = Date.now();
    const dayAgo = new Date(now - 24 * 60 * 60 * 1000);
    const weekAgo = new Date(now - 7 * 24 * 60 * 60 * 1000);
    const monthAgo = new Date(now - 30 * 24 * 60 * 60 * 1000);

    const [dau, wau, mau, newInLast30Days] = await Promise.all([
      this.prisma.botUser.count({ where: { lastSeenAt: { gte: dayAgo } } }),
      this.prisma.botUser.count({ where: { lastSeenAt: { gte: weekAgo } } }),
      this.prisma.botUser.count({ where: { lastSeenAt: { gte: monthAgo } } }),
      this.prisma.botUser.count({
        where: { firstSeenAt: { gte: monthAgo } },
      }),
    ]);

    return {
      dau,
      wau,
      mau,
      newUsersLast30Days: newInLast30Days,
      returningUsersLast30Days: mau - newInLast30Days,
    };
  }

  async topUsers(limit: number) {
    const users = await this.prisma.botUser.findMany({
      orderBy: { downloads: { _count: 'desc' } },
      take: limit,
      include: { _count: { select: { downloads: true } } },
    });

    return users.map((user) => ({
      id: user.id,
      telegramId: user.telegramId.toString(),
      username: user.username,
      languageCode: user.languageCode,
      firstSeenAt: user.firstSeenAt,
      lastSeenAt: user.lastSeenAt,
      downloadCount: user._count.downloads,
    }));
  }

  async errors() {
    const rows = await this.prisma.download.groupBy({
      by: ['errorCategory'],
      where: { status: DownloadStatus.FAILED },
      _count: { _all: true },
    });
    return mergeNullableGroups(
      rows,
      (row) => row.errorCategory,
      (row) => row._count._all,
    );
  }

  async errorsTimeseries(days: number) {
    // COALESCE прямо в SQL — иначе NULL и строка 'OTHER' группируются как
    // разные строки, а при схлопывании в один день на фронте одна запись
    // молча перезаписывает другую (теряется часть счётчика).
    const rows = await this.prisma.$queryRaw<
      { day: Date; category: string; count: number }[]
    >`
      SELECT date_trunc('day', "createdAt") as day, COALESCE("errorCategory"::text, 'OTHER') as category, COUNT(*)::int as count
      FROM "Download"
      WHERE status = 'FAILED' AND "createdAt" >= NOW() - make_interval(days => ${days}::int)
      GROUP BY day, category
      ORDER BY day ASC
    `;
    return rows;
  }

  // Разовые Stars-платежи за скачивания больше нельзя купить в боте (см. память
  // bot-monetization) — единственный источник дохода теперь подписка, которая
  // не создаёт запись Download, поэтому overview().totalStarsRevenue с этого
  // момента заморожен и требует этих метрик вместо/вместе с собой.
  async subscriptions() {
    const now = new Date();
    const in7Days = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
    const in30Days = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);

    const [
      activeMonthly,
      activeYearly,
      manualUnlimited,
      expiring7d,
      expiring30d,
      totalBotUsers,
      webLoginUsers,
    ] = await Promise.all([
      this.prisma.botUser.count({
        where: { subscriptionKind: SubscriptionKind.MONTHLY, subscriptionUntil: { gt: now } },
      }),
      this.prisma.botUser.count({
        where: { subscriptionKind: SubscriptionKind.YEARLY, subscriptionUntil: { gt: now } },
      }),
      this.prisma.botUser.count({ where: { isUnlimited: true } }),
      this.prisma.botUser.count({
        where: { subscriptionUntil: { gt: now, lte: in7Days } },
      }),
      this.prisma.botUser.count({
        where: { subscriptionUntil: { gt: now, lte: in30Days } },
      }),
      this.prisma.botUser.count(),
      this.prisma.botUser.count({ where: { lastWebLoginAt: { not: null } } }),
    ]);

    const activeTotal = activeMonthly + activeYearly;

    return {
      activeMonthly,
      activeYearly,
      activeTotal,
      manualUnlimited,
      expiring7d,
      expiring30d,
      mrrStars: activeMonthly * MONTHLY_PRICE_STARS + Math.round((activeYearly * YEARLY_PRICE_STARS) / 12),
      conversionRate: totalBotUsers > 0 ? activeTotal / totalBotUsers : null,
      totalBotUsers,
      webLoginUsers,
    };
  }
}
