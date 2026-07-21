/**
 * Wired into the shared CRUD contract-test harness — see
 * src/product-ms/extras/extras.crud-contract.spec.ts for the fully-annotated
 * reference example and src/common/testing/crud-contract.harness.ts for what
 * this harness does and doesn't verify.
 *
 * TablesService (src/orders-ms/tables/tables.service.ts) does NOT extend
 * BaseCrudService — it's a hand-written class — but every op it implements
 * uses the identical spread-payload shape (confirmed by reading the file),
 * so it reuses `standardPayloadShapes`. Its delete op is named `softDelete`
 * (method) / `SOFT_DELETE` (pattern key), not `remove`/`DELETE` like the
 * BaseCrudService resources.
 *
 * OUT OF SCOPE: `tables` also exposes a 7th op, `PATCH /tables/positions`
 * (`table.update_positions`, bulk position update via `updatePositions()`),
 * which doesn't fit this harness's create/list/get/update/soft-delete/restore
 * shape. Not covered here — give it its own dedicated test.
 */
import { TablesService } from './tables.service';
import { TABLE_PATTERNS } from './patterns/table-patterns';
import {
  runCrudContractTests,
  ResolvedCrudContext,
} from 'src/common/testing/crud-contract.harness';
import { standardPayloadShapes } from 'src/common/testing/crud-contract.shapes';
import { MockClientProxy } from 'src/common/testing/mock-client-proxy';

const ORGANIZATION_ID = '11111111-1111-4111-8111-111111111111';
const RECORD_ID = '22222222-2222-4222-8222-222222222222';
// CreateTableDto requires `sectorId` (UUID) — fixture value for a required
// foreign key, not a fabricated field.
const SECTOR_ID = '44444444-4444-4444-8444-444444444444';

// CreateTableDto: `sectorId` and `name` required; capacity/status/shape/posX/posY optional.
const CREATE_DTO = { sectorId: SECTOR_ID, name: 'Table 1' };
// UpdateTableDto: hand-written, all fields optional.
const UPDATE_DTO = { name: 'Table 1 (renamed)' };

runCrudContractTests({
  resourceName: 'tables',
  organizationId: ORGANIZATION_ID,
  recordId: RECORD_ID,
  createDto: CREATE_DTO,
  updateDto: UPDATE_DTO,
  paginationDto: {},
  createService: (client: MockClientProxy) => new TablesService(client as any),
  ops: {
    create: {
      pattern: TABLE_PATTERNS.CREATE,
      invoke: (service: TablesService, ctx: ResolvedCrudContext) =>
        service.create(ctx.createDto as any, ctx.organizationId),
      expectedPayload: standardPayloadShapes.create,
    },
    list: {
      pattern: TABLE_PATTERNS.FIND_ALL,
      invoke: (service: TablesService, ctx: ResolvedCrudContext) =>
        service.findAll(ctx.paginationDto as any, ctx.organizationId),
      expectedPayload: standardPayloadShapes.list,
    },
    getOne: {
      pattern: TABLE_PATTERNS.FIND_ONE,
      invoke: (service: TablesService, ctx: ResolvedCrudContext) =>
        service.findOne(ctx.recordId, ctx.organizationId),
      expectedPayload: standardPayloadShapes.getOne,
    },
    update: {
      pattern: TABLE_PATTERNS.UPDATE,
      invoke: (service: TablesService, ctx: ResolvedCrudContext) =>
        service.update(ctx.recordId, ctx.updateDto as any, ctx.organizationId),
      expectedPayload: standardPayloadShapes.update,
    },
    softDelete: {
      pattern: TABLE_PATTERNS.SOFT_DELETE, // note: key is SOFT_DELETE, not DELETE
      invoke: (service: TablesService, ctx: ResolvedCrudContext) =>
        service.softDelete(ctx.recordId, ctx.organizationId), // note: method is softDelete, not remove
      expectedPayload: standardPayloadShapes.softDelete,
    },
    restore: {
      pattern: TABLE_PATTERNS.RESTORE,
      invoke: (service: TablesService, ctx: ResolvedCrudContext) =>
        service.restore(ctx.recordId, ctx.organizationId),
      expectedPayload: standardPayloadShapes.restore,
    },
  },
});
