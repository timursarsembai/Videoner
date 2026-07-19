import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { ApiKeyService } from './api-key.service';
import { RateLimitService } from './rate-limit.service';
import { Request } from 'express';
import { Reflector } from '@nestjs/core';

@Injectable()
export class ApiKeyGuard implements CanActivate {
  constructor(
    private apiKeyService: ApiKeyService,
    private rateLimitService: RateLimitService,
    private reflector: Reflector,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    // Check if the endpoint is public
    const isPublic = this.reflector.get<boolean>(
      'isPublic',
      context.getHandler(),
    );
    if (isPublic) {
      return true;
    }

    const request = context.switchToHttp().getRequest<Request>();
    const apiKey = this.extractApiKey(request);

    if (!apiKey) {
      throw new UnauthorizedException('API key is required');
    }

    try {
      const validApiKey = await this.apiKeyService.validateApiKey(
        apiKey,
        request,
      );

      // Check rate limit
      const rateLimitResult = await this.rateLimitService.checkRateLimit(
        validApiKey.id,
      );

      if (!rateLimitResult.isAllowed) {
        throw new HttpException(
          {
            statusCode: HttpStatus.TOO_MANY_REQUESTS,
            error: 'Too Many Requests',
            message: 'Rate limit exceeded',
            limit: rateLimitResult.limit,
            remaining: rateLimitResult.remaining,
            resetAt: rateLimitResult.resetAt,
          },
          HttpStatus.TOO_MANY_REQUESTS,
        );
      }

      // Add rate limit headers
      const response = context.switchToHttp().getResponse();
      response.header('X-RateLimit-Limit', rateLimitResult.limit);
      response.header('X-RateLimit-Remaining', rateLimitResult.remaining);
      response.header('X-RateLimit-Reset', rateLimitResult.resetAt.getTime());

      // Attach API key and user to request for later use
      (request as any).apiKey = validApiKey;
      (request as any).user = validApiKey.user;
      return true;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new UnauthorizedException(error.message);
    }
  }

  private extractApiKey(request: Request): string | undefined {
    // Try to extract from Authorization header
    const authHeader = request.header('Authorization');
    if (authHeader?.startsWith('Bearer ')) {
      return authHeader.substring(7);
    }

    // Try to extract from query parameter
    const queryApiKey = request.query['api_key'];
    if (queryApiKey && typeof queryApiKey === 'string') {
      return queryApiKey;
    }

    // Try to extract from custom header
    return request.header('X-API-Key');
  }
}
