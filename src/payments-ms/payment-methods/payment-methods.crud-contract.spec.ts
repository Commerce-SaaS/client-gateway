/**
 * Wired into the shared CRUD contract-test harness — see
 * src/product-ms/extras/extras.crud-contract.spec.ts for the fully-annotated
 * reference example and src/common/testing/crud-contract.harness.ts for what
 * this harness does and doesn't verify.
 *
 * PaymentMethodsService (src/payments-ms/payment-methods/payment-methods.service.ts)
 * does NOT extend BaseCrudService, and unlike tables/sectors it does NOT use
 * the standard spread-payload shape uniformly:
 *   - create/list/getOne/softDelete/restore: standard spread shape.
 *   - update: sends { id, organizationId, dto } — the DTO is nested under a
 *     `dto` key instead of being spread. This is the one resource in the
 *     whole audited set that does this; it gets its own `update` payload
 *     builder below rather than reusing `standardPayloadShapes.update`.
 * Delete op is `softDelete`/`SOFT_DELETE`, exposed at HTTP route
 * `PATCH /payment-methods/:id/delete` (not `/:id/soft-delete` like every
 * other resource) — the HTTP path says "delete" but the RPC pattern and
 * handler are unambiguously soft-delete. See the dedicated regression test
 * below.
 */
import { PaymentMethodsService } from './payment-methods.service';
import { PAYMENT_METHOD_PATTERNS } from './patterns/payment-methods.patterns';
import {
  runCrudContractTests,
  ResolvedCrudContext,
} from 'src/common/testing/crud-contract.harness';
import { standardPayloadShapes } from 'src/common/testing/crud-contract.shapes';
import { createMockClientProxy, MockClientProxy } from 'src/common/testing/mock-client-proxy';

const ORGANIZATION_ID = '11111111-1111-4111-8111-111111111111';
const RECORD_ID = '22222222-2222-4222-8222-222222222222';

// CreatePaymentMethodDto: only `name` required (Length 1-50); icon/isActive/
// isDefault/isCash/sortOrder all optional with defaults.
const CREATE_DTO = { name: 'Cash' };
// UpdatePaymentMethodDto: hand-written, all fields optional.
const UPDATE_DTO = { name: 'Cash (till 2)' };

const updatePayloadShape = (ctx: ResolvedCrudContext) => ({
  id: ctx.recordId,
  organizationId: ctx.organizationId,
  dto: ctx.updateDto,
});

runCrudContractTests({
  resourceName: 'payment-methods',
  organizationId: ORGANIZATION_ID,
  recordId: RECORD_ID,
  createDto: CREATE_DTO,
  updateDto: UPDATE_DTO,
  paginationDto: {},
  createService: (client: MockClientProxy) => new PaymentMethodsService(client as any),
  ops: {
    create: {
      pattern: PAYMENT_METHOD_PATTERNS.CREATE,
      invoke: (service: PaymentMethodsService, ctx: ResolvedCrudContext) =>
        service.create(ctx.createDto as any, ctx.organizationId),
      expectedPayload: standardPayloadShapes.create,
    },
    list: {
      pattern: PAYMENT_METHOD_PATTERNS.FIND_ALL, // literal: 'payment-method.findAll' (camelCase)
      invoke: (service: PaymentMethodsService, ctx: ResolvedCrudContext) =>
        service.findAll(ctx.paginationDto as any, ctx.organizationId),
      expectedPayload: standardPayloadShapes.list,
    },
    getOne: {
      pattern: PAYMENT_METHOD_PATTERNS.FIND_ONE, // literal: 'payment-method.findOne'
      invoke: (service: PaymentMethodsService, ctx: ResolvedCrudContext) =>
        service.findOne(ctx.recordId, ctx.organizationId),
      expectedPayload: standardPayloadShapes.getOne,
    },
    update: {
      pattern: PAYMENT_METHOD_PATTERNS.UPDATE,
      invoke: (service: PaymentMethodsService, ctx: ResolvedCrudContext) =>
        service.update(ctx.recordId, ctx.updateDto as any, ctx.organizationId),
      expectedPayload: updatePayloadShape, // nested { dto }, not spread — see header comment
    },
    softDelete: {
      pattern: PAYMENT_METHOD_PATTERNS.SOFT_DELETE, // literal: 'payment-method.softDelete'
      invoke: (service: PaymentMethodsService, ctx: ResolvedCrudContext) =>
        service.softDelete(ctx.recordId, ctx.organizationId),
      expectedPayload: standardPayloadShapes.softDelete,
    },
    restore: {
      pattern: PAYMENT_METHOD_PATTERNS.RESTORE,
      invoke: (service: PaymentMethodsService, ctx: ResolvedCrudContext) =>
        service.restore(ctx.recordId, ctx.organizationId),
      expectedPayload: standardPayloadShapes.restore,
    },
  },
});

/**
 * Dedicated regression test: `PATCH /payment-methods/:id/delete` — despite
 * its HTTP path segment being literally "delete" — must remain a SOFT
 * delete. This guards against two realistic regressions: (a) someone
 * "fixing" the HTTP route name by wiring it to a hard-delete pattern that
 * doesn't exist today, or (b) a future PAYMENT_METHOD_PATTERNS.DELETE
 * (hard-delete) constant being introduced and silently swapped in here by
 * mistake.
 */
describe('payment-methods — /delete route is a soft delete, not a hard delete', () => {
  it('PaymentMethodsController.softDelete sends the SOFT_DELETE pattern, not a hard-delete one', async () => {
    const client = createMockClientProxy({ id: RECORD_ID, deletedAt: new Date().toISOString() });
    const service = new PaymentMethodsService(client as any);

    await service.softDelete(RECORD_ID, ORGANIZATION_ID);

    expect(client.send).toHaveBeenCalledTimes(1);
    const [sentPattern] = client.send.mock.calls[0];
    expect(sentPattern).toBe(PAYMENT_METHOD_PATTERNS.SOFT_DELETE);
    expect(sentPattern).toBe('payment-method.softDelete');
  });

  it('PAYMENT_METHOD_PATTERNS has no hard-delete pattern to accidentally wire in', () => {
    // Locks in the current, verified pattern set: CREATE, FIND_ALL, FIND_ONE,
    // UPDATE, SOFT_DELETE, RESTORE. If a hard-delete pattern (e.g. `DELETE`)
    // is ever added, this test fails and forces a conscious update here.
    expect(Object.keys(PAYMENT_METHOD_PATTERNS).sort()).toEqual(
      ['CREATE', 'FIND_ALL', 'FIND_ONE', 'RESTORE', 'SOFT_DELETE', 'UPDATE'].sort(),
    );
  });
});
