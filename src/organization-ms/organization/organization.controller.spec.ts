/**
 * OrganizationController — wiring tests (Part A-2).
 *
 * Purpose: lock down that the three tenant-scoped routes (GET, PATCH, PATCH
 * soft-delete) all forward organizationId from the VALIDATED @User() context
 * (i.e., request.user.organizationId populated by OrganizationGuard), NOT from
 * any client-controllable path parameter.
 *
 * Route review (confirmed from source):
 *   POST   /organization              — creates org, uses user.id as ownerId
 *   GET    /organization              — no :id param; uses user.organizationId
 *   PATCH  /organization              — no :id param; uses user.organizationId
 *   PATCH  /organization/soft-delete — no :id param; uses user.organizationId
 *
 * There is NO /:id route for these three operations. The organizationId is
 * always sourced from the guard-validated CurrentUserContext, making it
 * impossible for a client to substitute a different org identifier.
 *
 * Strategy: instantiate the controller directly (new OrganizationController(mock))
 * so Nest DI and guards are bypassed. We test pure method dispatch.
 */

import { OrganizationController } from './organization.controller';
import { CurrentUserContext, AuthenticatedUser } from '../../common/interfaces/current-user-context.type';
import { PlatformRolesEnum } from '../../common/enums/platform-roles.enum';
import { OrganizationRole } from '../../common/enums/organization-roles.enum';

const ORG_ID  = 'org00000-aaaa-aaaa-aaaa-000000000001';
const USER_ID = 'usr00000-aaaa-aaaa-aaaa-000000000001';

function makeStaffContext(): CurrentUserContext {
  return {
    id: USER_ID,
    organizationId: ORG_ID,
    platformRole: PlatformRolesEnum.STAFF,
    organizationRole: OrganizationRole.STAFF,
    aud: 'saas',
    stripeAccountId: null,
    email: 'staff@example.com',
  };
}

describe('OrganizationController — wiring (C-1/C-2)', () => {
  let controller: OrganizationController;
  const svc = {
    create: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
    findAll: jest.fn(),
    restore: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
    // Direct instantiation — no Nest DI, no guard resolution, no broker
    controller = new OrganizationController(svc as any);
  });

  // ─────────────────────────────────────────────────────────────────────────
  // GET /organization
  // ─────────────────────────────────────────────────────────────────────────
  describe('GET /organization — findOne', () => {
    it('calls service.findOne with user.organizationId from @User()', () => {
      const user = makeStaffContext();
      controller.findOne(user);

      expect(svc.findOne).toHaveBeenCalledTimes(1);
      expect(svc.findOne).toHaveBeenCalledWith(ORG_ID);
    });

    it('forwards whatever organizationId the guard set on the user — not a path param', () => {
      const user = makeStaffContext();
      const otherOrg = 'zzzzzzzz-zzzz-zzzz-zzzz-zzzzzzzzzzzz';
      user.organizationId = otherOrg;
      controller.findOne(user);
      expect(svc.findOne).toHaveBeenCalledWith(otherOrg);
    });

    it('method signature takes only @User() — no :id path parameter (length === 1)', () => {
      expect(controller.findOne.length).toBe(1);
    });
  });

  // ─────────────────────────────────────────────────────────────────────────
  // PATCH /organization
  // ─────────────────────────────────────────────────────────────────────────
  describe('PATCH /organization — update', () => {
    it('calls service.update(organizationId, dto, organizationId) from @User()', () => {
      const user = makeStaffContext();
      const dto = { name: 'Acme Corp' } as any;

      controller.update(dto, user);

      expect(svc.update).toHaveBeenCalledTimes(1);
      expect(svc.update).toHaveBeenCalledWith(ORG_ID, dto, ORG_ID);
    });

    it('uses organizationId as both the resource id and the org scope — no :id param', () => {
      const user = makeStaffContext();
      controller.update({} as any, user);

      const [resourceId, , scopeId] = svc.update.mock.calls[0];
      expect(resourceId).toBe(ORG_ID);
      expect(scopeId).toBe(ORG_ID);
    });

    it('method signature takes @Body() + @User() only — no :id path param (length === 2)', () => {
      expect(controller.update.length).toBe(2);
    });
  });

  // ─────────────────────────────────────────────────────────────────────────
  // PATCH /organization/soft-delete
  // ─────────────────────────────────────────────────────────────────────────
  describe('PATCH /organization/soft-delete — remove', () => {
    it('calls service.remove(organizationId, organizationId) from @User()', () => {
      const user = makeStaffContext();

      controller.remove(user);

      expect(svc.remove).toHaveBeenCalledTimes(1);
      expect(svc.remove).toHaveBeenCalledWith(ORG_ID, ORG_ID);
    });

    it('method signature takes @User() only — no :id path param (length === 1)', () => {
      expect(controller.remove.length).toBe(1);
    });
  });

  // ─────────────────────────────────────────────────────────────────────────
  // POST /organization — create (sanity check)
  // ─────────────────────────────────────────────────────────────────────────
  describe('POST /organization — create', () => {
    it('passes user.id as ownerId when creating an organization', () => {
      const user: AuthenticatedUser = {
        id: USER_ID,
        platformRole: PlatformRolesEnum.STAFF,
        aud: 'saas',
      };
      const dto = { name: 'New Org' } as any;

      controller.create(dto, user);

      expect(svc.create).toHaveBeenCalledWith({ ...dto, ownerId: USER_ID });
    });
  });
});
