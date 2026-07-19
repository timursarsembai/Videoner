import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Delete,
  Put,
  UnauthorizedException,
  Req,
} from '@nestjs/common';
import { ApiKeyService } from './api-key.service';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { Request } from 'express';
import { Public } from './public.decorator';
import { AdminOnly } from './admin.decorator';

@ApiTags('API Keys')
@Controller('api-keys')
export class ApiKeyController {
  constructor(private readonly apiKeyService: ApiKeyService) {}

  @Get('all')
  @AdminOnly()
  @ApiOperation({ summary: 'List all API keys (Admin only)' })
  @ApiResponse({ status: 200, description: 'List of all API keys' })
  async listAllApiKeys(@Req() req: Request) {
    const users = await this.apiKeyService.getAllUsers();
    const apiKeys = await Promise.all(
      users.map((user) => this.apiKeyService.listApiKeys(user.id)),
    );
    return apiKeys.flat();
  }

  @Post()
  @AdminOnly()
  @ApiOperation({ summary: 'Create a new API key (Admin only)' })
  @ApiResponse({ status: 201, description: 'API key created successfully' })
  async createApiKey(
    @Body()
    data: {
      userId: string;
      name: string;
      expiresAt?: Date;
      ipWhitelist?: string[];
      rateLimit?: number;
      maxDuration?: number;
    },
  ) {
    return this.apiKeyService.createApiKey(data.userId, data.name, {
      expiresAt: data.expiresAt,
      ipWhitelist: data.ipWhitelist,
      rateLimit: data.rateLimit,
      maxDuration: data.maxDuration,
    });
  }

  @Get('my-keys')
  @ApiOperation({ summary: 'List all API keys for the current user' })
  @ApiResponse({ status: 200, description: 'List of API keys' })
  async listMyApiKeys(@Req() req: Request) {
    const user = (req as any).user;
    if (!user) {
      throw new UnauthorizedException('User not found');
    }
    return this.apiKeyService.listApiKeys(user.id);
  }

  @Delete(':id')
  @AdminOnly()
  @ApiOperation({ summary: 'Revoke an API key (Admin only)' })
  @ApiResponse({ status: 200, description: 'API key revoked successfully' })
  async revokeApiKey(@Param('id') id: string) {
    return this.apiKeyService.revokeApiKeyAdmin(id);
  }

  @Delete('my-key/:id')
  @ApiOperation({ summary: 'Revoke own API key' })
  @ApiResponse({ status: 200, description: 'API key revoked successfully' })
  async revokeOwnApiKey(@Param('id') id: string, @Req() req: Request) {
    const user = (req as any).user;
    if (!user) {
      throw new UnauthorizedException('User not found');
    }
    return this.apiKeyService.revokeApiKey(id, user.id);
  }

  @Put(':id/block')
  @AdminOnly()
  @ApiOperation({ summary: 'Block an API key (Admin only)' })
  @ApiResponse({ status: 200, description: 'API key blocked successfully' })
  async blockApiKey(@Param('id') id: string, @Body() data: { reason: string }) {
    return this.apiKeyService.blockApiKey(id, data.reason);
  }

  @Put(':id/unblock')
  @AdminOnly()
  @ApiOperation({ summary: 'Unblock an API key (Admin only)' })
  @ApiResponse({ status: 200, description: 'API key unblocked successfully' })
  async unblockApiKey(@Param('id') id: string) {
    return this.apiKeyService.unblockApiKey(id);
  }

  @Put('my-key/:id')
  @ApiOperation({ summary: 'Update own API key' })
  @ApiResponse({ status: 200, description: 'API key updated successfully' })
  async updateOwnApiKey(
    @Param('id') id: string,
    @Body()
    data: {
      name?: string;
      ipWhitelist?: string[];
      maxDuration?: number;
    },
    @Req() req: Request,
  ) {
    const user = (req as any).user;
    if (!user) {
      throw new UnauthorizedException('User not found');
    }
    return this.apiKeyService.updateApiKey(id, user.id, {
      name: data.name,
      ipWhitelist: data.ipWhitelist,
      maxDuration: data.maxDuration,
    });
  }

  @Get('validate')
  @Public()
  @ApiOperation({ summary: 'Validate an API key' })
  @ApiResponse({ status: 200, description: 'API key is valid' })
  async validateApiKey(@Req() req: Request) {
    const apiKey = this.extractApiKey(req);
    if (!apiKey) {
      throw new UnauthorizedException('API key is required');
    }
    return this.apiKeyService.validateApiKey(apiKey, req);
  }

  private extractApiKey(request: Request): string | undefined {
    const authHeader = request.header('Authorization');
    if (authHeader?.startsWith('Bearer ')) {
      return authHeader.substring(7);
    }

    const queryApiKey = request.query['api_key'];
    if (queryApiKey && typeof queryApiKey === 'string') {
      return queryApiKey;
    }

    return request.header('X-API-Key');
  }
}
