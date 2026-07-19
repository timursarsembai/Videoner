import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

interface RateLimitInfo {
  count: number;
  resetAt: Date;
}

@Injectable()
export class RateLimitService {
  private rateLimits: Map<string, RateLimitInfo> = new Map();

  constructor(private prisma: PrismaService) {
    // Clean up expired rate limits every minute
    setInterval(() => this.cleanupExpiredLimits(), 60 * 1000);
  }

  async checkRateLimit(apiKeyId: string): Promise<{
    isAllowed: boolean;
    limit: number;
    remaining: number;
    resetAt: Date;
  }> {
    const apiKey = await this.prisma.apiKey.findUnique({
      where: { id: apiKeyId },
    });

    if (!apiKey) {
      return { isAllowed: false, limit: 0, remaining: 0, resetAt: new Date() };
    }

    const now = new Date();
    const rateLimitInfo = this.rateLimits.get(apiKeyId);

    // If no rate limit info exists or it's expired, create new one
    if (!rateLimitInfo || rateLimitInfo.resetAt < now) {
      const resetAt = new Date(now.getTime() + 60 * 1000); // Reset after 1 minute
      this.rateLimits.set(apiKeyId, {
        count: 1,
        resetAt,
      });

      return {
        isAllowed: true,
        limit: apiKey.rateLimit,
        remaining: apiKey.rateLimit - 1,
        resetAt,
      };
    }

    // Check if rate limit is exceeded
    if (rateLimitInfo.count >= apiKey.rateLimit) {
      return {
        isAllowed: false,
        limit: apiKey.rateLimit,
        remaining: 0,
        resetAt: rateLimitInfo.resetAt,
      };
    }

    // Increment counter
    rateLimitInfo.count++;
    this.rateLimits.set(apiKeyId, rateLimitInfo);

    return {
      isAllowed: true,
      limit: apiKey.rateLimit,
      remaining: apiKey.rateLimit - rateLimitInfo.count,
      resetAt: rateLimitInfo.resetAt,
    };
  }

  private cleanupExpiredLimits() {
    const now = new Date();
    for (const [key, info] of this.rateLimits.entries()) {
      if (info.resetAt < now) {
        this.rateLimits.delete(key);
      }
    }
  }
}
