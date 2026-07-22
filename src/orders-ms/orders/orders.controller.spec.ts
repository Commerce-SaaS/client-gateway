/**
 * OrdersController — wiring tests (Part A-3).
 *
 * Purpose: lock down that:
 *   1. findMyOrderById (CUSTOMER) forwards { id, organizationId, userId: user.id }
 *      to service.findOne — the userId scoping is mandatory.
 *   2. findOne (STAFF) forwards { id, organizationId } WITHOUT userId — STAFF
 *      may see any order in the org.
 *
 * Both routes use @OrganizationId() which resolves from request.user.organizationId
 * (set by OrganizationGuard). Here we call controller methods directly — no HTTP
 * server, no guards, no broker.
 *
 * Strategy: instantiate the controller directly (new OrdersController(mock))
 * so Nest DI and guards are bypassed. We test pure method dispatch.
 */

import { OrdersController } from './orders.controller';
import { CurrentUserContext } from '../../common/interfaces/current-user-context.type';
import { PlatformRolesEnum } from '../../common/enums/platform-roles.enum';
import { OrganizationRole } from '../../common/enums/organization-roles.enum';

const ORG_ID   = 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa';
const USER_ID  = 'u1111111-1111-1111-1111-111111111111';
const ORDER_ID = 'o1111111-1111-1111-1111-111111111111';

function makeCustomerContext(): CurrentUserContext {
  return {
    id: USER_ID,
    organizationId: ORG_ID,
    platformRole: PlatformRolesEnum.CUSTOMER,
    organizationRole: OrganizationRole.CUSTOMER,
    aud: 'customer',
    stripeAccountId: null,
    email: 'customer@example.com',
  };
}

describe('OrdersController — wiring (C-3)', () => {
  let controller: OrdersController;
  const svc = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
    // Direct instantiation — no Nest DI, no guard resolution, no broker
    controller = new OrdersController(svc as any);
  });

  // ─────────────────────────────────────────────────────────────────────────
  // GET /orders/me/:id — CUSTOMER, must scope by userId
  // ─────────────────────────────────────────────────────────────────────────
  describe('GET /orders/me/:id — findMyOrderById (CUSTOMER)', () => {
    it('calls service.findOne with { id, organizationId, userId: user.id }', () => {
      const user = makeCustomerContext();
      // Args match what Nest's param pipeline would resolve:
      //   @Param('id')      → ORDER_ID
      //   @User()           → user (from request.user, set by guards)
      //   @OrganizationId() → ORG_ID  (from request.user.organizationId)
      controller.findMyOrderById(ORDER_ID, user, ORG_ID);

      expect(svc.findOne).toHaveBeenCalledTimes(1);
      expect(svc.findOne).toHaveBeenCalledWith({
        id: ORDER_ID,
        organizationId: ORG_ID,
        userId: USER_ID,
      });
    });

    it('always includes userId — customer isolation depends on it', () => {
      const user = makeCustomerContext();
      controller.findMyOrderById(ORDER_ID, user, ORG_ID);

      const payload = svc.findOne.mock.calls[0][0];
      expect(payload).toHaveProperty('userId', USER_ID);
    });

    it('carries organizationId from the @OrganizationId() param (guard-validated)', () => {
      const user = makeCustomerContext();
      controller.findMyOrderById(ORDER_ID, user, ORG_ID);

      const payload = svc.findOne.mock.calls[0][0];
      expect(payload.organizationId).toBe(ORG_ID);
    });
  });

  // ─────────────────────────────────────────────────────────────────────────
  // GET /orders/:id — STAFF, must NOT scope by userId
  // ─────────────────────────────────────────────────────────────────────────
  describe('GET /orders/:id — findOne (STAFF)', () => {
    it('calls service.findOne with { id, organizationId } — no userId', () => {
      controller.findOne(ORDER_ID, ORG_ID);

      expect(svc.findOne).toHaveBeenCalledTimes(1);
      expect(svc.findOne).toHaveBeenCalledWith({
        id: ORDER_ID,
        organizationId: ORG_ID,
      });
    });

    it('does NOT include userId — STAFF sees any order in the org', () => {
      controller.findOne(ORDER_ID, ORG_ID);

      const payload = svc.findOne.mock.calls[0][0];
      expect(payload).not.toHaveProperty('userId');
    });

    it('organizationId is sourced from @OrganizationId() (guard-validated)', () => {
      controller.findOne(ORDER_ID, ORG_ID);

      const payload = svc.findOne.mock.calls[0][0];
      expect(payload.organizationId).toBe(ORG_ID);
    });
  });

  // ─────────────────────────────────────────────────────────────────────────
  // Contrast: customer vs STAFF on the same order id
  // ─────────────────────────────────────────────────────────────────────────
  describe('CUSTOMER vs STAFF scoping — explicit contrast', () => {
    it('customer call includes userId; staff call for same order does not', () => {
      const user = makeCustomerContext();

      controller.findMyOrderById(ORDER_ID, user, ORG_ID);
      controller.findOne(ORDER_ID, ORG_ID);

      const customerPayload = svc.findOne.mock.calls[0][0];
      const staffPayload    = svc.findOne.mock.calls[1][0];

      expect(customerPayload).toHaveProperty('userId');
      expect(staffPayload).not.toHaveProperty('userId');
    });
  });

  // ─────────────────────────────────────────────────────────────────────────
  // GET /orders — findAll (STAFF spot-check)
  // ─────────────────────────────────────────────────────────────────────────
  describe('GET /orders — findAll (STAFF)', () => {
    it('forwards pagination and organizationId to service.findAll', () => {
      const paginationDto = { limit: 10, offset: 0 } as any;
      controller.findAll(paginationDto, ORG_ID);

      expect(svc.findAll).toHaveBeenCalledWith({ ...paginationDto }, ORG_ID);
    });
  });
});
