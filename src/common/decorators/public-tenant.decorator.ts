import { applyDecorators, UseGuards } from '@nestjs/common';
import { TenantRequiredGuard } from '../guards/tenant-required.guard';

/**
 * Decorator for public routes that require tenant context.
 *
 * Use this on endpoints like GET /products or GET /products/:id
 * where no authentication is needed but the request must be scoped
 * to a specific organization (resolved from domain or header).
 */
export function PublicTenant() {
  return applyDecorators(UseGuards(TenantRequiredGuard));
}
