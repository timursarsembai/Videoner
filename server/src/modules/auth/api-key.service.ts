import {
  Injectable,
  UnauthorizedException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { randomBytes } from 'crypto';
import { Request } from 'express';

@Injectable()
export class ApiKeyService {
  constructor(private prisma: PrismaService) {}

  private generateApiKey(): string {
    return `dk_${randomBytes(32).toString('hex')}`;
  }

  async getAllUsers() {
    return this.prisma.user.findMany({
      orderBy: { createdAt: 'desc' },
    });
  }

  async createApiKey(
    userId: string,
    name: string,
    options?: {
      expiresAt?: Date;
      ipWhitelist?: string[];
      rateLimit?: number;
      maxDuration?: number;
    },
  ) {
    const key = this.generateApiKey();

    return this.prisma.apiKey.create({
      data: {
        key,
        name,
        userId,
        expiresAt: options?.expiresAt,
        ipWhitelist: options?.ipWhitelist || [],
        rateLimit: options?.rateLimit,
        maxDuration: options?.maxDuration,
      },
    });
  }

  async validateApiKey(key: string, req: Request) {
    const apiKey = await this.prisma.apiKey.findUnique({
      where: { key },
      include: { user: true },
    });

    if (!apiKey) {
      throw new UnauthorizedException('Invalid API key');
    }

    if (apiKey.isBlocked || apiKey.user.isBlocked) {
      throw new UnauthorizedException(
        apiKey.blockReason || 'API key or user is blocked',
      );
    }

    if (apiKey.expiresAt && apiKey.expiresAt < new Date()) {
      throw new UnauthorizedException('API key has expired');
    }

    // Check IP whitelist
    const clientIp = req.ip;
    if (
      apiKey.ipWhitelist.length > 0 &&
      !apiKey.ipWhitelist.includes(clientIp)
    ) {
      throw new UnauthorizedException('IP address not whitelisted');
    }

    // Update last used timestamp
    await this.prisma.apiKey.update({
      where: { id: apiKey.id },
      data: { lastUsedAt: new Date() },
    });

    return apiKey;
  }

  async revokeApiKey(id: string, userId: string) {
    const apiKey = await this.prisma.apiKey.findFirst({
      where: { id, userId },
    });

    if (!apiKey) {
      throw new BadRequestException('API key not found');
    }

    return this.prisma.apiKey.delete({
      where: { id },
    });
  }

  async revokeApiKeyAdmin(id: string) {
    return this.prisma.apiKey.delete({
      where: { id },
    });
  }

  async blockApiKey(id: string, reason: string) {
    return this.prisma.apiKey.update({
      where: { id },
      data: {
        isBlocked: true,
        blockReason: reason,
      },
    });
  }

  async unblockApiKey(id: string) {
    return this.prisma.apiKey.update({
      where: { id },
      data: {
        isBlocked: false,
        blockReason: null,
      },
    });
  }

  async updateApiKey(
    id: string,
    userId: string,
    data: {
      name?: string;
      expiresAt?: Date | null;
      ipWhitelist?: string[];
      rateLimit?: number;
      maxDuration?: number;
    },
  ) {
    const apiKey = await this.prisma.apiKey.findFirst({
      where: { id, userId },
    });

    if (!apiKey) {
      throw new BadRequestException('API key not found');
    }

    return this.prisma.apiKey.update({
      where: { id },
      data,
    });
  }

  async listApiKeys(userId: string) {
    return this.prisma.apiKey.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
  }
}
