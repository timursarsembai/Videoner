import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { DownloadSource, DownloadStatus, Downloaders } from '@prisma/client';

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

  // Счётчики скачиваний — за выбранный на дашборде период и без запросов
  // напрямую в API. Раньше они считались за всё время и врали в обе стороны:
  //   успешным считался только COMPLETED, а CleanupService через 30-60 минут
  //   переводит каждое успешное скачивание в EXPIRED (файл удалён с диска,
  //   но скачивание-то было). В «Успешных» оставались лишь файлы последнего
  //   часа, и успешность выходила заниженной в разы;
  //   ошибки копились с самого начала, включая проверки при разработке. Бот
  //   и сайт помечают свои запросы BOT и WEB, а API — это ручные проверки и
  //   тесты, живых пользователей там нет.
  async overview(days: number) {
    const scope = {
      createdAt: { gte: new Date(Date.now() - days * 24 * 60 * 60 * 1000) },
      source: { not: DownloadSource.API },
    };
    const [total, completed, failed, totalBotUsers, webLoginUsers] =
      await Promise.all([
        this.prisma.download.count({ where: scope }),
        this.prisma.download.count({
          where: {
            ...scope,
            status: { in: [DownloadStatus.COMPLETED, DownloadStatus.EXPIRED] },
          },
        }),
        this.prisma.download.count({
          where: { ...scope, status: DownloadStatus.FAILED },
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

  // Объём и число успешных скачиваний по дням и площадкам. bytes — что
  // реально скачано из сети (для YouTube это трафик прокси), cachedBytes —
  // что отдано повторно из кеша, не потратив ничего. Запросы через API здесь
  // учитываются: трафик они тратят по-настоящему. Скачанное самим браузером
  // (clientSide, отчёт расширения) входит в число, но не в объём: сервер
  // его не качал. Сумма BigInt в Postgres
  // даёт numeric, а его Prisma отдаёт объектом Decimal — приводим к float8,
  // точности double на байтах хватает с запасом.
  async trafficDaily(days: number) {
    return this.prisma.$queryRaw<
      { day: Date; platform: string; count: number; bytes: number; cachedBytes: number }[]
    >`
      SELECT date_trunc('day', "createdAt") as day,
             downloader::text as platform,
             COUNT(*)::int as count,
             COALESCE(SUM("fileSize") FILTER (WHERE NOT "fromCache" AND NOT "clientSide"), 0)::float8 as bytes,
             COALESCE(SUM("fileSize") FILTER (WHERE "fromCache"), 0)::float8 as "cachedBytes"
      FROM "Download"
      WHERE status IN ('COMPLETED', 'EXPIRED')
        AND "createdAt" >= NOW() - make_interval(days => ${days}::int)
      GROUP BY day, platform
      ORDER BY day ASC
    `;
  }

  // То же помесячно за всё время — чтобы видеть, во что обходится каждый
  // расчётный период прокси.
  async trafficMonthly() {
    return this.prisma.$queryRaw<
      { month: Date; platform: string; count: number; bytes: number; cachedBytes: number }[]
    >`
      SELECT date_trunc('month', "createdAt") as month,
             downloader::text as platform,
             COUNT(*)::int as count,
             COALESCE(SUM("fileSize") FILTER (WHERE NOT "fromCache" AND NOT "clientSide"), 0)::float8 as bytes,
             COALESCE(SUM("fileSize") FILTER (WHERE "fromCache"), 0)::float8 as "cachedBytes"
      FROM "Download"
      WHERE status IN ('COMPLETED', 'EXPIRED')
      GROUP BY month, platform
      ORDER BY month ASC
    `;
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

  // DAU, WAU и MAU на каждый день периода: сколько разных людей были активны
  // в этот календарный день, за 7 и за 30 дней по него включительно (UTC).
  // Последняя точка — те же числа, что в карточках, с точностью до границы
  // суток (карточки считают последние 24 часа, 7 и 30 суток от «сейчас»).
  async activeDaily(days: number) {
    return this.prisma.$queryRaw<
      { day: Date; dau: number; wau: number; mau: number }[]
    >`
      SELECT d::timestamp AS day,
             (SELECT COUNT(*)
                FROM "UserActivityDay" a
               WHERE a.day = d::date)::int AS dau,
             (SELECT COUNT(DISTINCT a."botUserId")
                FROM "UserActivityDay" a
               WHERE a.day BETWEEN d::date - 6 AND d::date)::int AS wau,
             (SELECT COUNT(DISTINCT a."botUserId")
                FROM "UserActivityDay" a
               WHERE a.day BETWEEN d::date - 29 AND d::date)::int AS mau
      FROM generate_series(
             (NOW() AT TIME ZONE 'UTC')::date - (${days}::int - 1),
             (NOW() AT TIME ZONE 'UTC')::date,
             interval '1 day'
           ) AS d
      ORDER BY day ASC
    `;
  }

  // Активные пользователи по календарным неделям (с понедельника) за
  // последние weeks недель. Текущая неделя ещё не закончилась и растёт.
  async activeWeekly(weeks: number) {
    return this.prisma.$queryRaw<{ week: Date; users: number }[]>`
      SELECT date_trunc('week', day::timestamp) AS week,
             COUNT(DISTINCT "botUserId")::int AS users
      FROM "UserActivityDay"
      WHERE day >= date_trunc('week', NOW() AT TIME ZONE 'UTC')::date - (${weeks}::int - 1) * 7
      GROUP BY week
      ORDER BY week ASC
    `;
  }

  // Активные пользователи по календарным месяцам за всё время. Текущий месяц
  // ещё не закончился, поэтому его столбик растёт до конца месяца.
  async activeMonthly() {
    return this.prisma.$queryRaw<{ month: Date; users: number }[]>`
      SELECT date_trunc('month', day::timestamp) AS month,
             COUNT(DISTINCT "botUserId")::int AS users
      FROM "UserActivityDay"
      GROUP BY month
      ORDER BY month ASC
    `;
  }

  // Блокировки бота: сколько заблокировали сейчас и сколько блокировали и
  // разблокировали по дням (days дней), неделям (полгода) и месяцам (год). События
  // baseline — те, кто заблокировал до начала учёта (29.10.2026), дата
  // неизвестна: в «сейчас» они входят, в разбивку по периодам — нет.
  async blocked(days: number) {
    const [total, blocked, daily, weekly, monthly] = await Promise.all([
      this.prisma.botUser.count(),
      this.prisma.botUser.count({ where: { blockedAt: { not: null } } }),
      this.prisma.$queryRaw<{ period: Date; blocked: number; unblocked: number }[]>`
        SELECT d::timestamp AS period,
               COUNT(e.id) FILTER (WHERE e.blocked)::int AS blocked,
               COUNT(e.id) FILTER (WHERE NOT e.blocked)::int AS unblocked
        FROM generate_series(
               (NOW() AT TIME ZONE 'UTC')::date - (${days}::int - 1),
               (NOW() AT TIME ZONE 'UTC')::date,
               interval '1 day'
             ) AS d
        LEFT JOIN "BotBlockEvent" e
               ON e.at >= d::timestamp AND e.at < d::timestamp + interval '1 day' AND e.source <> 'baseline'
        GROUP BY d
        ORDER BY d ASC
      `,
      this.blockedByPeriod('week', 26),
      this.blockedByPeriod('month', 12),
    ]);
    return { total, blocked, daily, weekly, monthly };
  }

  // Периоды без событий тоже нужны — иначе пустая неделя пропала бы с оси.
  private blockedByPeriod(unit: 'week' | 'month', count: number) {
    const step = unit === 'week' ? '1 week' : '1 month';
    return this.prisma.$queryRaw<{ period: Date; blocked: number; unblocked: number }[]>`
      SELECT p AS period,
             COUNT(e.id) FILTER (WHERE e.blocked)::int AS blocked,
             COUNT(e.id) FILTER (WHERE NOT e.blocked)::int AS unblocked
      FROM generate_series(
             date_trunc(${unit}, NOW() AT TIME ZONE 'UTC') - (${count}::int - 1) * ${step}::interval,
             date_trunc(${unit}, NOW() AT TIME ZONE 'UTC'),
             ${step}::interval
           ) AS p
      LEFT JOIN "BotBlockEvent" e
             ON e.at >= p AND e.at < p + ${step}::interval AND e.source <> 'baseline'
      GROUP BY p
      ORDER BY p ASC
    `;
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
        // Скачал сам браузер (отчёт расширения), сервер файл не качал.
        clientSide: row.clientSide,
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
