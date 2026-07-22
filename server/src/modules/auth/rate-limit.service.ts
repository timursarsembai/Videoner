import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

interface RateLimitInfo {
  count: number;
  resetAt: Date;
}

interface RateLimitResult {
  isAllowed: boolean;
  limit: number;
  remaining: number;
  resetAt: Date;
}

// Дефолт для per-IP лимита ниже общего per-API-key бюджета (у web/bot один
// shared ключ на всех посетителей сразу — без этого один агрессивный IP
// может выесть весь лимит и получить soft-DoS для остальных).
const DEFAULT_IP_RATE_LIMIT = 60;

@Injectable()
export class RateLimitService {
  private rateLimits: Map<string, RateLimitInfo> = new Map();
  private ipRateLimits: Map<string, RateLimitInfo> = new Map();

  constructor(private prisma: PrismaService) {
    // Clean up expired rate limits every minute
    setInterval(() => this.cleanupExpiredLimits(), 60 * 1000);
  }

  private checkLimit(
    store: Map<string, RateLimitInfo>,
    key: string,
    limit: number,
  ): RateLimitResult {
    const now = new Date();
    const rateLimitInfo = store.get(key);

    if (!rateLimitInfo || rateLimitInfo.resetAt < now) {
      const resetAt = new Date(now.getTime() + 60 * 1000);
      store.set(key, { count: 1, resetAt });
      return { isAllowed: true, limit, remaining: limit - 1, resetAt };
    }

    if (rateLimitInfo.count >= limit) {
      return {
        isAllowed: false,
        limit,
        remaining: 0,
        resetAt: rateLimitInfo.resetAt,
      };
    }

    rateLimitInfo.count++;
    store.set(key, rateLimitInfo);
    return {
      isAllowed: true,
      limit,
      remaining: limit - rateLimitInfo.count,
      resetAt: rateLimitInfo.resetAt,
    };
  }

  async checkRateLimit(apiKeyId: string): Promise<RateLimitResult> {
    const apiKey = await this.prisma.apiKey.findUnique({
      where: { id: apiKeyId },
    });

    if (!apiKey) {
      return { isAllowed: false, limit: 0, remaining: 0, resetAt: new Date() };
    }

    return this.checkLimit(this.rateLimits, apiKeyId, apiKey.rateLimit);
  }

  // Отдельный, более узкий лимит на клиентский IP (req.ip — корректен только
  // при включённом `trust proxy`, см. main.ts). Не завязан на БД, т.к. это
  // защита от злоупотребления одним посетителем общего API-ключа, а не
  // персональная квота.
  checkIpRateLimit(
    ip: string,
    limit: number = DEFAULT_IP_RATE_LIMIT,
  ): RateLimitResult {
    return this.checkLimit(this.ipRateLimits, ip, limit);
  }

  private cleanupExpiredLimits() {
    const now = new Date();
    for (const [key, info] of this.rateLimits.entries()) {
      if (info.resetAt < now) {
        this.rateLimits.delete(key);
      }
    }
    for (const [key, info] of this.ipRateLimits.entries()) {
      if (info.resetAt < now) {
        this.ipRateLimits.delete(key);
      }
    }
  }
}
