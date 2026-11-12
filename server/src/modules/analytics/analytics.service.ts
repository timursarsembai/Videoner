import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { DownloadSource, DownloadStatus, Downloaders } from '@prisma/client';
import {
  downloadLanguage,
  effectiveBotLanguage,
  UNKNOWN_LANGUAGE,
} from 'src/lib/languages';
import type { DateRange } from 'src/lib/analytics-range';

// Строка статистики по языкам (см. AnalyticsService.languages).
export interface LanguageStatsRow {
  lang: string;
  usersTotal: number;
  usersActive: number;
  usersNew: number;
  botDownloads: number;
  webDownloads: number;
  extensionDownloads: number;
  totalDownloads: number;
}

// Строка статистики по странам (см. AnalyticsService.countries).
export interface CountryStatsRow {
  country: string;
  webDownloads: number;
  extensionDownloads: number;
  totalDownloads: number;
}

// Страна неизвестна: скачивания до начала записи страны, запросы без
// заголовка Cloudflare или со служебным кодом (XX, T1).
export const UNKNOWN_COUNTRY = 'unknown';

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

// Границы периода для сырого SQL — строкой YYYY-MM-DD: так Postgres не
// пересчитывает их из пояса сессии, а время в базе — UTC без пояса.
function day(date: Date): string {
  return date.toISOString().slice(0, 10);
}

// Успешные — COMPLETED и EXPIRED: CleanupService через 30–60 минут переводит
// каждое успешное скачивание в EXPIRED (файл удалён с диска, но скачивание-то
// было).
const SUCCESS = [DownloadStatus.COMPLETED, DownloadStatus.EXPIRED];

// Каждый метод с периодом считает только записи внутри [from, to) — у каждого
// графика на дашборде свой период (src/lib/analytics-range.ts).
@Injectable()
export class AnalyticsService {
  constructor(private prisma: PrismaService) {}

  private created(range: DateRange) {
    return { gte: range.from, lt: range.to };
  }

  // С какого дня есть данные — для «всего времени» и списков месяцев,
  // кварталов и лет в выборе периода на дашборде.
  async since() {
    const [download, user] = await Promise.all([
      this.prisma.download.findFirst({
        where: { source: { not: DownloadSource.API } },
        orderBy: { createdAt: 'asc' },
        select: { createdAt: true },
      }),
      this.prisma.botUser.findFirst({
        orderBy: { firstSeenAt: 'asc' },
        select: { firstSeenAt: true },
      }),
    ]);
    const dates = [download?.createdAt, user?.firstSeenAt].filter((d): d is Date => !!d);
    const first = dates.length ? new Date(Math.min(...dates.map((d) => d.getTime()))) : new Date();
    return { since: day(first) };
  }

  // Счётчики скачиваний за период. Бот, сайт и расширение помечают свои
  // запросы (BOT, WEB, EXTENSION), а API — это ручные проверки и тесты,
  // живых пользователей там нет: их не считаем.
  async overview(range: DateRange) {
    const scope = {
      createdAt: this.created(range),
      source: { not: DownloadSource.API },
    };
    const allTime = { source: { not: DownloadSource.API } };
    const [total, completed, failed, totalBotUsers, webLoginUsers, linkFailures, allTimeTotal, allTimeCompleted] =
      await Promise.all([
        this.prisma.download.count({ where: scope }),
        this.prisma.download.count({ where: { ...scope, status: { in: SUCCESS } } }),
        this.prisma.download.count({
          where: { ...scope, status: DownloadStatus.FAILED },
        }),
        this.prisma.botUser.count(),
        this.prisma.botUser.count({ where: { lastWebLoginAt: { not: null } } }),
        // Отказы ещё при разборе ссылки (LinkFailure) — отдельно: скачивания
        // не было, в «Ошибок» и успешность скачиваний они не входят.
        this.prisma.linkFailure.count({ where: scope }),
        // Итог за всё время — рядом с периодом: «последние 30 дней» — окно,
        // которое каждый день сдвигается, и его сумма держится на месте или
        // даже уменьшается; без общего итога это читалось как сбой учёта.
        this.prisma.download.count({ where: allTime }),
        this.prisma.download.count({ where: { ...allTime, status: { in: SUCCESS } } }),
      ]);

    const finished = completed + failed;

    return {
      totalDownloads: total,
      completedDownloads: completed,
      failedDownloads: failed,
      successRate: finished > 0 ? completed / finished : null,
      totalBotUsers,
      webLoginUsers,
      linkFailures,
      allTimeTotal,
      allTimeCompleted,
    };
  }

  // Статистика по языкам за период: пользователи бота и успешные скачивания
  // из бота, с сайта и из расширения.
  //   Язык человека в боте — выбранный вручную (BotUser.language), иначе по
  //   языку Telegram (languageCode); вне списка 46 языков — «other». Группируем
  //   в SQL по двум сырым колонкам (разных пар немного), а сводим к языку в
  //   JS — правила те же, что у бота (src/lib/languages.ts).
  //   Всего — кто пришёл до конца периода; активный — был активен хотя бы в
  //   один день периода (UserActivityDay); новый — firstSeenAt в периоде.
  //   Скачивания бота — по языку его пользователя (запись без пользователя —
  //   «unknown»), сайта и расширения — по Download.lang; до начала записи
  //   языка там null — «unknown».
  async languages(range: DateRange): Promise<LanguageStatsRow[]> {
    const from = day(range.from);
    const to = day(range.to);
    const [users, botDownloads, clientDownloads] = await Promise.all([
      this.prisma.$queryRaw<
        {
          language: string | null;
          languageCode: string | null;
          total: number;
          active: number;
          newUsers: number;
        }[]
      >`
        SELECT u.language, u."languageCode",
               COUNT(*)::int AS total,
               COUNT(*) FILTER (WHERE EXISTS (
                 SELECT 1 FROM "UserActivityDay" a
                  WHERE a."botUserId" = u.id AND a.day >= ${from}::date AND a.day < ${to}::date
               ))::int AS active,
               COUNT(*) FILTER (WHERE u."firstSeenAt" >= ${from}::timestamp)::int AS "newUsers"
        FROM "BotUser" u
        WHERE u."firstSeenAt" < ${to}::timestamp
        GROUP BY u.language, u."languageCode"
      `,
      this.prisma.$queryRaw<
        {
          hasUser: boolean;
          language: string | null;
          languageCode: string | null;
          count: number;
        }[]
      >`
        SELECT (u.id IS NOT NULL) AS "hasUser", u.language, u."languageCode",
               COUNT(*)::int AS count
        FROM "Download" d
        LEFT JOIN "BotUser" u ON u.id = d."botUserId"
        WHERE d.source = 'BOT'
          AND d.status IN ('COMPLETED', 'EXPIRED')
          AND d."createdAt" >= ${from}::timestamp
          AND d."createdAt" < ${to}::timestamp
        GROUP BY 1, 2, 3
      `,
      this.prisma.download.groupBy({
        by: ['source', 'lang'],
        where: {
          source: { in: [DownloadSource.WEB, DownloadSource.EXTENSION] },
          status: { in: SUCCESS },
          createdAt: this.created(range),
        },
        _count: { _all: true },
      }),
    ]);

    const rows = new Map<string, LanguageStatsRow>();
    const row = (lang: string) => {
      let r = rows.get(lang);
      if (!r) {
        r = {
          lang,
          usersTotal: 0,
          usersActive: 0,
          usersNew: 0,
          botDownloads: 0,
          webDownloads: 0,
          extensionDownloads: 0,
          totalDownloads: 0,
        };
        rows.set(lang, r);
      }
      return r;
    };

    for (const u of users) {
      const r = row(effectiveBotLanguage(u.language, u.languageCode));
      r.usersTotal += u.total;
      r.usersActive += u.active;
      r.usersNew += u.newUsers;
    }
    for (const d of botDownloads) {
      const lang = d.hasUser
        ? effectiveBotLanguage(d.language, d.languageCode)
        : UNKNOWN_LANGUAGE;
      const r = row(lang);
      r.botDownloads += d.count;
      r.totalDownloads += d.count;
    }
    for (const d of clientDownloads) {
      const r = row(downloadLanguage(d.lang));
      const count = d._count._all;
      if (d.source === DownloadSource.WEB) r.webDownloads += count;
      else r.extensionDownloads += count;
      r.totalDownloads += count;
    }

    return Array.from(rows.values()).sort(
      (a, b) =>
        b.totalDownloads - a.totalDownloads ||
        b.usersActive - a.usersActive ||
        b.usersTotal - a.usersTotal ||
        a.lang.localeCompare(b.lang),
    );
  }

  // Успешные скачивания сайта и расширения по странам за период (страну
  // определяет Cloudflare, см. src/lib/countries.ts). Бота здесь нет:
  // Telegram не сообщает ботам, откуда человек.
  async countries(range: DateRange): Promise<CountryStatsRow[]> {
    const groups = await this.prisma.download.groupBy({
      by: ['source', 'country'],
      where: {
        source: { in: [DownloadSource.WEB, DownloadSource.EXTENSION] },
        status: { in: SUCCESS },
        createdAt: this.created(range),
      },
      _count: { _all: true },
    });
    const rows = new Map<string, CountryStatsRow>();
    for (const g of groups) {
      const country = g.country ?? UNKNOWN_COUNTRY;
      const r = rows.get(country) ?? {
        country,
        webDownloads: 0,
        extensionDownloads: 0,
        totalDownloads: 0,
      };
      if (g.source === DownloadSource.WEB) r.webDownloads += g._count._all;
      else r.extensionDownloads += g._count._all;
      r.totalDownloads += g._count._all;
      rows.set(country, r);
    }
    return Array.from(rows.values()).sort(
      (a, b) => b.totalDownloads - a.totalDownloads || a.country.localeCompare(b.country),
    );
  }

  // Все попытки за период по площадкам (включая неудачные).
  async platforms(range: DateRange) {
    const rows = await this.prisma.download.groupBy({
      by: ['downloader'],
      where: { createdAt: this.created(range) },
      _count: { _all: true },
    });
    return rows.map((row) => ({
      platform: row.downloader,
      count: row._count._all,
    }));
  }

  // Все попытки за период по источникам: бот, сайт, расширение, API.
  async sources(range: DateRange) {
    const rows = await this.prisma.download.groupBy({
      by: ['source'],
      where: { createdAt: this.created(range) },
      _count: { _all: true },
    });
    return rows.map((row) => ({
      source: row.source,
      count: row._count._all,
    }));
  }

  // Попытки скачивания (бот, сайт и расширение — без проверок через API, как
  // в overview) и новые пользователи бота по дням периода — каждый день,
  // включая пустые, чтобы ось не сжималась.
  async timeseries(range: DateRange) {
    const from = day(range.from);
    const to = day(range.to);
    return this.prisma.$queryRaw<{ day: Date; downloads: number; newUsers: number }[]>`
      WITH days AS (
        SELECT generate_series(${from}::date, ${to}::date - 1, interval '1 day')::timestamp AS day
      ),
      dl AS (
        SELECT date_trunc('day', "createdAt") AS day, COUNT(*)::int AS count
        FROM "Download"
        WHERE source <> 'API'
          AND "createdAt" >= ${from}::timestamp AND "createdAt" < ${to}::timestamp
        GROUP BY 1
      ),
      nu AS (
        SELECT date_trunc('day', "firstSeenAt") AS day, COUNT(*)::int AS count
        FROM "BotUser"
        WHERE "firstSeenAt" >= ${from}::timestamp AND "firstSeenAt" < ${to}::timestamp
        GROUP BY 1
      )
      SELECT days.day, COALESCE(dl.count, 0)::int AS downloads, COALESCE(nu.count, 0)::int AS "newUsers"
      FROM days
      LEFT JOIN dl ON dl.day = days.day
      LEFT JOIN nu ON nu.day = days.day
      ORDER BY days.day ASC
    `;
  }

  // Успешные скачивания по дням недели (понедельник — 1) и источникам за
  // период: в какие дни качают больше. API не считаем — это проверки.
  async weekdays(range: DateRange) {
    const from = day(range.from);
    const to = day(range.to);
    return this.prisma.$queryRaw<{ weekday: number; source: string; count: number }[]>`
      SELECT EXTRACT(ISODOW FROM "createdAt")::int AS weekday,
             source::text AS source,
             COUNT(*)::int AS count
      FROM "Download"
      WHERE status IN ('COMPLETED', 'EXPIRED')
        AND source <> 'API'
        AND "createdAt" >= ${from}::timestamp AND "createdAt" < ${to}::timestamp
      GROUP BY 1, 2
      ORDER BY 1, 2
    `;
  }

  // Объём и число успешных скачиваний по дням и площадкам. bytes — что
  // реально скачано из сети (для YouTube это трафик прокси), cachedBytes —
  // что отдано повторно из кеша, не потратив ничего. Запросы через API здесь
  // учитываются: трафик они тратят по-настоящему. Скачанное самим браузером
  // (clientSide, отчёт расширения) входит в число, но не в объём: сервер
  // его не качал. Сумма BigInt в Postgres даёт numeric, а его Prisma отдаёт
  // объектом Decimal — приводим к float8, точности double на байтах хватает
  // с запасом.
  async trafficDaily(range: DateRange) {
    return this.traffic('day', range);
  }

  // То же по календарным месяцам — во что обходится каждый расчётный период
  // прокси. Месяц на краю периода считается только в его пределах.
  async trafficMonthly(range: DateRange) {
    return this.traffic('month', range);
  }

  private traffic(unit: 'day' | 'month', range: DateRange) {
    const from = day(range.from);
    const to = day(range.to);
    return this.prisma.$queryRaw<
      { period: Date; platform: string; count: number; bytes: number; cachedBytes: number }[]
    >`
      SELECT date_trunc(${unit}, "createdAt") AS period,
             downloader::text AS platform,
             COUNT(*)::int AS count,
             COALESCE(SUM("fileSize") FILTER (WHERE NOT "fromCache" AND NOT "clientSide"), 0)::float8 AS bytes,
             COALESCE(SUM("fileSize") FILTER (WHERE "fromCache"), 0)::float8 AS "cachedBytes"
      FROM "Download"
      WHERE status IN ('COMPLETED', 'EXPIRED')
        AND "createdAt" >= ${from}::timestamp AND "createdAt" < ${to}::timestamp
      GROUP BY 1, 2
      ORDER BY 1 ASC
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
  async activeDaily(range: DateRange) {
    const from = day(range.from);
    const to = day(range.to);
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
      FROM generate_series(${from}::date, ${to}::date - 1, interval '1 day') AS d
      ORDER BY day ASC
    `;
  }

  // Активные пользователи по календарным неделям (с понедельника) или
  // месяцам, которые пересекаются с периодом. Неделя или месяц на краю
  // считаются целиком — иначе первый столбик врал бы в меньшую сторону.
  // Текущие неделя и месяц ещё не закончились и растут.
  async activePeriods(unit: 'week' | 'month', range: DateRange) {
    const from = day(range.from);
    const to = day(range.to);
    return this.prisma.$queryRaw<{ period: Date; users: number }[]>`
      SELECT date_trunc(${unit}, day::timestamp) AS period,
             COUNT(DISTINCT "botUserId")::int AS users
      FROM "UserActivityDay"
      WHERE day >= date_trunc(${unit}, ${from}::timestamp)::date
        AND day < ${to}::date
      GROUP BY 1
      ORDER BY 1 ASC
    `;
  }

  // Сколько заблокировали бота сейчас и кто именно. События baseline — те,
  // кто заблокировал до начала учёта (29.10.2026), дата неизвестна: в
  // «сейчас» они входят, в разбивку по периодам (blockedPeriods) — нет.
  //
  // users — кто заблокировал бота сейчас или блокировал раньше и вернулся, с
  // последним событием: его source говорит, насколько точно известно время
  // (telegram — точное, check — время проверки, baseline — неизвестно).
  async blockedSummary() {
    const [total, blocked, users] = await Promise.all([
      this.prisma.botUser.count(),
      this.prisma.botUser.count({ where: { blockedAt: { not: null } } }),
      this.prisma.botUser.findMany({
        where: {
          OR: [{ blockedAt: { not: null } }, { blockEvents: { some: {} } }],
        },
        include: {
          _count: { select: { downloads: true } },
          blockEvents: { orderBy: { at: 'desc' }, take: 1 },
        },
      }),
    ]);
    return {
      total,
      blocked,
      users: users.map((user) => {
        const last = user.blockEvents[0];
        return {
          telegramId: user.telegramId.toString(),
          username: user.username,
          firstName: user.firstName,
          languageCode: user.languageCode,
          firstSeenAt: user.firstSeenAt,
          lastSeenAt: user.lastSeenAt,
          downloadCount: user._count.downloads,
          blocked: user.blockedAt !== null,
          lastEvent: last
            ? { blocked: last.blocked, source: last.source, at: last.at }
            : null,
        };
      }),
    };
  }

  // Приток и отток по дням, неделям или месяцам, пересекающимся с периодом:
  // сколько пришло новых (первое появление в боте или на сайте) и сколько
  // заблокировали и разблокировали бота. Периоды без событий тоже нужны —
  // иначе пустая неделя пропала бы с оси.
  async blockedPeriods(unit: 'day' | 'week' | 'month', range: DateRange) {
    const from = day(range.from);
    const to = day(range.to);
    const step = `1 ${unit}`;
    return this.prisma.$queryRaw<
      { period: Date; newUsers: number; blocked: number; unblocked: number }[]
    >`
      SELECT p AS period,
             (SELECT COUNT(*) FROM "BotUser" u
               WHERE u."firstSeenAt" >= p AND u."firstSeenAt" < p + ${step}::interval)::int AS "newUsers",
             COUNT(e.id) FILTER (WHERE e.blocked)::int AS blocked,
             COUNT(e.id) FILTER (WHERE NOT e.blocked)::int AS unblocked
      FROM generate_series(
             date_trunc(${unit}, ${from}::timestamp),
             date_trunc(${unit}, ${to}::timestamp - interval '1 day'),
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

  // Ошибки — это и упавшие скачивания (Download FAILED), и отказы ещё при
  // разборе ссылки (LinkFailure): во втором случае скачивание не начиналось
  // вовсе, и без этой таблицы блокировка площадки в статистике не видна.
  // Без API (ручные проверки) — во всех графиках вкладки и в журнале, чтобы
  // их числа сходились.
  async errors(range: DateRange) {
    const [downloads, links] = await Promise.all([
      this.prisma.download.groupBy({
        by: ['errorCategory'],
        where: {
          status: DownloadStatus.FAILED,
          source: { not: DownloadSource.API },
          createdAt: this.created(range),
        },
        _count: { _all: true },
      }),
      this.prisma.linkFailure.groupBy({
        by: ['errorCategory'],
        where: { source: { not: DownloadSource.API }, createdAt: this.created(range) },
        _count: { _all: true },
      }),
    ]);
    return mergeNullableGroups(
      [...downloads, ...links],
      (row) => row.errorCategory,
      (row) => row._count._all,
    );
  }

  async errorsTimeseries(range: DateRange) {
    const from = day(range.from);
    const to = day(range.to);
    // COALESCE прямо в SQL — иначе NULL и строка 'OTHER' группируются как
    // разные строки, а при схлопывании в один день на фронте одна запись
    // молча перезаписывает другую (теряется часть счётчика).
    return this.prisma.$queryRaw<
      { day: Date; category: string; count: number }[]
    >`
      SELECT date_trunc('day', "createdAt") AS day, category, COUNT(*)::int AS count
      FROM (
        SELECT "createdAt", COALESCE("errorCategory"::text, 'OTHER') AS category
        FROM "Download"
        WHERE status = 'FAILED' AND source <> 'API'
          AND "createdAt" >= ${from}::timestamp AND "createdAt" < ${to}::timestamp
        UNION ALL
        SELECT "createdAt", "errorCategory"::text
        FROM "LinkFailure"
        WHERE source <> 'API'
          AND "createdAt" >= ${from}::timestamp AND "createdAt" < ${to}::timestamp
      ) e
      GROUP BY 1, 2
      ORDER BY 1 ASC
    `;
  }

  // Ошибки по дням и площадкам: всплеск у одной площадки — почти всегда
  // её блокировка или поломка, а не случайные отказы. У Download площадка —
  // downloader (YOUTUBE → youtube), у LinkFailure она записана как есть.
  async errorsPlatforms(range: DateRange) {
    const from = day(range.from);
    const to = day(range.to);
    return this.prisma.$queryRaw<
      { day: Date; platform: string; count: number }[]
    >`
      SELECT date_trunc('day', "createdAt") AS day, platform, COUNT(*)::int AS count
      FROM (
        SELECT "createdAt", lower(downloader::text) AS platform
        FROM "Download"
        WHERE status = 'FAILED' AND source <> 'API'
          AND "createdAt" >= ${from}::timestamp AND "createdAt" < ${to}::timestamp
        UNION ALL
        SELECT "createdAt", platform
        FROM "LinkFailure"
        WHERE source <> 'API'
          AND "createdAt" >= ${from}::timestamp AND "createdAt" < ${to}::timestamp
      ) e
      GROUP BY 1, 2
      ORDER BY 1 ASC
    `;
  }

  // Журнал ошибок: упавшие скачивания (Download FAILED) и отказы при разборе
  // ссылки (LinkFailure) одним списком, новые сверху. Повторы — тот же человек,
  // та же ссылка, тот же этап и причина — одной строкой со счётчиком: четыре
  // попытки одной ссылки подряд читались бы как четыре разные проблемы.
  // API (ручные проверки) не показываем, как и в остальной статистике.
  async errorsLog(
    range: DateRange,
    filter: { platform?: string; category?: string },
    limit: number,
    offset: number,
  ) {
    const from = day(range.from);
    const to = day(range.to);
    const platform = filter.platform ?? '';
    const category = filter.category ?? '';
    const rows = await this.prisma.$queryRaw<
      {
        stage: 'download' | 'link';
        platform: string;
        source: string;
        category: string;
        country: string | null;
        url: string | null;
        message: string | null;
        lastAt: Date;
        firstAt: Date;
        count: number;
        username: string | null;
        telegramId: string | null;
        total: number;
      }[]
    >`
      WITH e AS (
        SELECT 'download' AS stage, d."createdAt" AS at, d."originalUrl" AS url,
               lower(d.downloader::text) AS platform, d.source::text AS source,
               COALESCE(d."errorCategory"::text, 'OTHER') AS category,
               d."errorMessage" AS message, d."botUserId" AS uid, d.country
        FROM "Download" d
        WHERE d.status = 'FAILED' AND d.source <> 'API'
          AND d."createdAt" >= ${from}::timestamp AND d."createdAt" < ${to}::timestamp
        UNION ALL
        SELECT 'link', l."createdAt", l.url, l.platform, l.source::text,
               l."errorCategory"::text, l.message, l."botUserId", l.country
        FROM "LinkFailure" l
        WHERE l.source <> 'API'
          AND l."createdAt" >= ${from}::timestamp AND l."createdAt" < ${to}::timestamp
      ),
      g AS (
        SELECT stage, platform, source, category, uid, country, url,
               max(at) AS "lastAt", min(at) AS "firstAt", count(*)::int AS count,
               (array_agg(message ORDER BY at DESC))[1] AS message
        FROM e
        WHERE (${platform} = '' OR platform = ${platform})
          AND (${category} = '' OR category = ${category})
        -- Старые отказы разбора ссылки без самой ссылки не склеиваем в одну
        -- строку: группируем их ещё и по тексту ошибки.
        -- Склеиваем повторы одного человека бота; посетителей сайта по
        -- человеку не различить, их строки не склеиваем вовсе.
        GROUP BY stage, platform, source, category, uid, country, url,
                 CASE WHEN url IS NULL THEN message END,
                 CASE WHEN uid IS NULL THEN at END
      )
      SELECT g.stage, g.platform, g.source, g.category, g.country, g.url, g.message,
             g."lastAt", g."firstAt", g.count, b.username, b."telegramId"::text AS "telegramId",
             count(*) OVER()::int AS total
      FROM g LEFT JOIN "BotUser" b ON b.id = g.uid
      ORDER BY g."lastAt" DESC
      LIMIT ${limit} OFFSET ${offset}
    `;
    return {
      total: rows[0]?.total ?? 0,
      rows: rows.map(({ total: _total, lastAt, firstAt, ...row }) => ({
        ...row,
        lastAt: lastAt.toISOString(),
        firstAt: firstAt.toISOString(),
      })),
    };
  }

  async attempts(
    limit: number,
    offset: number,
    platform?: string,
    status?: string,
    source?: string,
  ) {
    // Значения фильтров приходят из строки запроса, то есть могут быть любыми.
    // Сверяем их с enum'ами и молча игнорируем нераспознанное: Prisma на
    // невалидном значении enum бросает исключение, и опечатка в адресной
    // строке превращалась бы в 500 вместо пустого фильтра.
    const where: {
      downloader?: Downloaders;
      status?: DownloadStatus;
      source?: DownloadSource;
    } = {};
    if (platform && platform in Downloaders) {
      where.downloader = platform as Downloaders;
    }
    if (status && status in DownloadStatus) {
      where.status = status as DownloadStatus;
    }
    if (source && source in DownloadSource) {
      where.source = source as DownloadSource;
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
        country: row.country,
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
