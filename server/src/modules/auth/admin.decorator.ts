import { applyDecorators, UseGuards } from '@nestjs/common';
import { AdminGuard } from './admin.guard';
import {
  ApiSecurity,
  ApiBearerAuth,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';

export function AdminOnly() {
  return applyDecorators(
    UseGuards(AdminGuard),
    ApiSecurity('X-API-Key'),
    ApiBearerAuth(),
    ApiUnauthorizedResponse({ description: 'Admin access required' }),
  );
}
