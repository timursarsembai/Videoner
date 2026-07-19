import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async createUser(data: { email: string; name?: string; isAdmin?: boolean }) {
    // Check if user already exists
    const existingUser = await this.prisma.user.findUnique({
      where: { email: data.email },
    });

    if (existingUser) {
      throw new BadRequestException('User with this email already exists');
    }

    return this.prisma.user.create({
      data: {
        email: data.email,
        name: data.name,
        isAdmin: data.isAdmin || false,
      },
    });
  }

  async getUser(id: string) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      include: {
        apiKeys: {
          orderBy: { createdAt: 'desc' },
        },
      },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  async updateUser(
    id: string,
    data: {
      name?: string;
      isBlocked?: boolean;
      isAdmin?: boolean;
    },
  ) {
    const user = await this.prisma.user.findUnique({
      where: { id },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return this.prisma.user.update({
      where: { id },
      data,
    });
  }

  async listUsers(includeApiKeys = false) {
    return this.prisma.user.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        apiKeys: includeApiKeys,
      },
    });
  }

  async deleteUser(id: string) {
    const user = await this.prisma.user.findUnique({
      where: { id },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Delete all API keys first
    await this.prisma.apiKey.deleteMany({
      where: { userId: id },
    });

    // Then delete the user
    return this.prisma.user.delete({
      where: { id },
    });
  }
}
