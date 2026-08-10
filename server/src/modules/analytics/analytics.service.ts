import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { DownloadStatus, Downloaders } from '@prisma/client';

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
    const [total, completed, failed, totalBotUsers, webLoginUsers] =
      await Promise.all([
        this.prisma.download.count(),
        this.prisma.download.count({
          where: { status: DownloadStatus.COMPLETED },
        }),
        this.prisma.download.count({
          where: { status: DownloadStatus.FAILED },
        }),
        this.prisma.botUser.count(),
        this.prisma.botUser.count({ where: { lastWebLoginAt: { not: null } } }),
      ]);

    const finished = completed + failed;

    return {
      totalDownloads: total,
      completedDownloads: completed,
      failedDownloads: failed,
      successRate: finished > 0 ? completed / finished : null,
      totalBotUsers,
      // Переехало из удалённой секции subscriptions(): к деньгам метрика
      // отношения не имела, а знать, сколько людей вообще доходит до сайта,
      // а не только до бота, по-прежнему полезно.
      webLoginUsers,
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

  async attempts(
    limit: number,
    offset: number,
    platform?: string,
    status?: string,
  ) {
    // Значения фильтров приходят из строки запроса, то есть могут быть любыми.
    // Сверяем их с enum'ами и молча игнорируем нераспознанное: Prisma на
    // невалидном значении enum бросает исключение, и опечатка в адресной
    // строке превращалась бы в 500 вместо пустого фильтра.
    const where: { downloader?: Downloaders; status?: DownloadStatus } = {};
    if (platform && platform in Downloaders) {
      where.downloader = platform as Downloaders;
    }
    if (status && status in DownloadStatus) {
      where.status = status as DownloadStatus;
    }

    // count идёт с тем же where, что и findMany. Иначе постраничная навигация
    // врёт: общее число осталось бы от всей таблицы, и кнопка «Вперёд»
    // листала бы в пустоту за концом отфильтрованной выборки.
    const [rows, total] = await this.prisma.$transaction([
      this.prisma.download.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        take: limit,
        skip: offset,
        include: {
          botUser: { select: { telegramId: true, username: true } },
        },
      }),
      this.prisma.download.count({ where }),
    ]);

    return {
      total,
      limit,
      offset,
      rows: rows.map((row) => ({
        id: row.id,
        // ISO с миллисекундами — форматирование в местное время делает
        // фронтенд, сервер живёт в UTC и не должен решать за него.
        createdAt: row.createdAt.toISOString(),
        status: row.status,
        platform: row.downloader,
        source: row.source,
        url: row.originalUrl,
        title: row.videoTitle,
        errorCategory: row.errorCategory,
        // BigInt не сериализуется в JSON — отдаём строкой, как telegramId.
        fileSize: row.fileSize === null ? null : row.fileSize.toString(),
        user: row.botUser
          ? {
              telegramId: row.botUser.telegramId.toString(),
              username: row.botUser.username,
            }
          : null,
      })),
    };
  }
}
