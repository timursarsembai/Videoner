import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import type { DateRange } from '../../lib/analytics-range';

export interface RedditDailyRow {
  day: string;
  source: 'BOT' | 'WEB';
  completed: number;
  failed: number;
  pending: number;
  linkFailures: number;
  policyRefusals: number;
  cached: number;
  bytes: number;
}

@Injectable()
export class RedditAnalyticsService {
  constructor(private readonly prisma: PrismaService) {}

  async summary(range: DateRange) {
    const from = range.from.toISOString().slice(0, 10);
    const to = range.to.toISOString().slice(0, 10);
    // Distinct stages: LinkFailure is not another failed Download. Browser
    // extension reports and API checks do not measure the server rollout.
    const daily = await this.prisma.$queryRaw<RedditDailyRow[]>`
      SELECT day::date::text AS day, source,
             SUM(completed)::int AS completed, SUM(failed)::int AS failed,
             SUM(pending)::int AS pending, SUM("linkFailures")::int AS "linkFailures",
             SUM("policyRefusals")::int AS "policyRefusals",
             SUM(cached)::int AS cached, SUM(bytes)::float8 AS bytes
      FROM (
        SELECT date_trunc('day', "createdAt") AS day, source::text AS source,
          COUNT(*) FILTER (WHERE status IN ('COMPLETED', 'EXPIRED')) AS completed,
          COUNT(*) FILTER (WHERE status = 'FAILED' AND "errorCategory" IS DISTINCT FROM 'ADULT_CONTENT' AND "errorCategory" IS DISTINCT FROM 'BLOCKED_CONTENT') AS failed,
          COUNT(*) FILTER (WHERE status NOT IN ('COMPLETED', 'EXPIRED', 'FAILED')) AS pending,
          0 AS "linkFailures",
          COUNT(*) FILTER (WHERE status = 'FAILED' AND "errorCategory" IN ('ADULT_CONTENT', 'BLOCKED_CONTENT')) AS "policyRefusals",
          COUNT(*) FILTER (WHERE status IN ('COMPLETED', 'EXPIRED') AND "fromCache") AS cached,
          COALESCE(SUM("fileSize") FILTER (WHERE status IN ('COMPLETED', 'EXPIRED')), 0)::float8 AS bytes
        FROM "Download"
        WHERE downloader = 'REDDIT' AND source IN ('BOT', 'WEB') AND NOT "clientSide"
          AND "createdAt" >= ${from}::timestamp AND "createdAt" < ${to}::timestamp
        GROUP BY 1, 2
        UNION ALL
        SELECT date_trunc('day', "createdAt"), source::text, 0, 0, 0,
          COUNT(*) FILTER (WHERE "errorCategory" NOT IN ('ADULT_CONTENT', 'BLOCKED_CONTENT')),
          COUNT(*) FILTER (WHERE "errorCategory" IN ('ADULT_CONTENT', 'BLOCKED_CONTENT')), 0, 0::float8
        FROM "LinkFailure"
        WHERE platform = 'reddit' AND source IN ('BOT', 'WEB')
          AND "createdAt" >= ${from}::timestamp AND "createdAt" < ${to}::timestamp
        GROUP BY 1, 2
      ) events
      GROUP BY day, source ORDER BY day, source
    `;
    const totals = daily.reduce((sum, row) => ({
      completed: sum.completed + row.completed, failed: sum.failed + row.failed,
      pending: sum.pending + row.pending, linkFailures: sum.linkFailures + row.linkFailures,
      policyRefusals: sum.policyRefusals + row.policyRefusals,
      cached: sum.cached + row.cached, bytes: sum.bytes + row.bytes,
    }), { completed: 0, failed: 0, pending: 0, linkFailures: 0, policyRefusals: 0, cached: 0, bytes: 0 });
    const terminal = totals.completed + totals.failed;
    return { daily, totals, successRate: terminal ? totals.completed / terminal : null };
  }
}
