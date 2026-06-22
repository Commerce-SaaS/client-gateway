/**
 * Anti-spoof integration test for @OrganizationId().
 *
 * Security invariant under test:
 *   For an authenticated STAFF user, @OrganizationId() must resolve from
 *   request.user.organizationId (set by OrganizationGuard after Redis membership
 *   validation) and NEVER from the raw x-organization-id header.
 *
 * Test strategy:
 *   Build a tiny throwaway Nest HTTP app with one probe route that uses
 *   @OrganizationId(). Replace the real guard chain with a StubGuard that
 *   simulates what the real guard pipeline produces:
 *     - request.tenant.organizationId = ORG_FROM_HEADER  (TenantMiddleware output)
 *     - request.user.organizationId  = ORG_FROM_GUARD    (OrganizationGuard output)
 *   The two values are deliberately different UUIDs. The request is sent with
 *   x-organization-id: ORG_FROM_HEADER. We assert the handler receives
 *   ORG_FROM_GUARD — proving the decorator reads from the guard-validated
 *   user context, not directly from the header.
 */

import {
  CanActivate,
  Controller,
  ExecutionContext,
  Get,
  INestApplication,
  Injectable,
} from '@nestjs/common';
import { Test } from '@nestjs/testing';
// eslint-disable-next-line @typescript-eslint/no-require-imports
const request = require('supertest') as typeof import('supertest');
import { OrganizationId } from './organizationId.decorator';

/** Value the attacker sends in the header (what TenantMiddleware would copy to request.tenant) */
const ORG_FROM_HEADER = 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa';

/**
 * Value the OrganizationGuard would write to request.user after validating
 * Redis membership. Deliberately different from ORG_FROM_HEADER to make the
 * distinction visible in the assertion.
 */
const ORG_FROM_GUARD = 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb';

/**
 * Simulates the combined output of TenantMiddleware + OrganizationGuard:
 *  - Sets request.tenant from the header value (as TenantMiddleware does)
 *  - Sets request.user.organizationId to the guard-validated value (different)
 */
@Injectable()
class StubOrganizationGuard implements CanActivate {
  canActivate(ctx: ExecutionContext): boolean {
    const req = ctx.switchToHttp().getRequest<Record<string, any>>();
    // TenantMiddleware would read x-organization-id header → request.tenant
    req['tenant'] = { organizationId: ORG_FROM_HEADER, source: 'header' };
    // OrganizationGuard validates Redis membership then writes to request.user
    req['user'] = { id: 'u-staff-001', organizationId: ORG_FROM_GUARD };
    return true;
  }
}

@Controller('probe')
class ProbeController {
  @Get()
  getOrg(@OrganizationId() orgId: string) {
    return { orgId };
  }
}

describe('@OrganizationId() — anti-spoof: reads request.user, not x-organization-id header', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      controllers: [ProbeController],
    }).compile();

    app = module.createNestApplication();
    // Apply stub globally — no DI needed, no RabbitMQ, no Redis
    app.useGlobalGuards(new StubOrganizationGuard());
    await app.init();
  });

  afterAll(async () => {
    await app?.close();
  });

  it(
    'returns the guard-validated organizationId (ORG_FROM_GUARD), ' +
      'NOT the x-organization-id header value (ORG_FROM_HEADER)',
    async () => {
      const res = await request(app.getHttpServer())
        .get('/probe')
        .set('x-organization-id', ORG_FROM_HEADER)
        .expect(200);

      // PRIMARY SECURITY ASSERTION
      expect(res.body.orgId).toBe(ORG_FROM_GUARD);
      // Explicit negative: header value was ignored
      expect(res.body.orgId).not.toBe(ORG_FROM_HEADER);
    },
  );

  it('request.tenant.organizationId (header-sourced) differs from the returned value', async () => {
    // Double-check that the two test UUIDs are actually different — if they
    // were equal, the test would be vacuous.
    expect(ORG_FROM_GUARD).not.toBe(ORG_FROM_HEADER);

    const res = await request(app.getHttpServer())
      .get('/probe')
      .set('x-organization-id', ORG_FROM_HEADER)
      .expect(200);

    // The returned value must equal the guard-set value, not the tenant/header value
    expect(res.body.orgId).toBe(ORG_FROM_GUARD);
  });
});
