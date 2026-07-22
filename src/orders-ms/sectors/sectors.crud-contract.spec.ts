/**
 * Wired into the shared CRUD contract-test harness — see
 * src/product-ms/extras/extras.crud-contract.spec.ts for the fully-annotated
 * reference example and src/common/testing/crud-contract.harness.ts for what
 * this harness does and doesn't verify.
 *
 * SectorsService (src/orders-ms/sectors/sectors.service.ts) does NOT extend
 * BaseCrudService — hand-written class — but uses the identical
 * spread-payload shape for every op (confirmed by reading the file), so it
 * reuses `standardPayloadShapes`. Delete op is `softDelete`/`SOFT_DELETE`,
 * not `remove`/`DELETE`.
 */
import { SectorsService } from './sectors.service';
import { SECTOR_PATTERNS } from './patterns/sector-patterns';
import {
  runCrudContractTests,
  ResolvedCrudContext,
} from 'src/common/testing/crud-contract.harness';
import { standardPayloadShapes } from 'src/common/testing/crud-contract.shapes';
import { MockClientProxy } from 'src/common/testing/mock-client-proxy';

const ORGANIZATION_ID = '11111111-1111-4111-8111-111111111111';
const RECORD_ID = '22222222-2222-4222-8222-222222222222';

// CreateSectorDto: only `name` required (MaxLength 100); `sortOrder` optional.
const CREATE_DTO = { name: 'Terrace' };
// UpdateSectorDto: hand-written, both fields optional.
const UPDATE_DTO = { name: 'Terrace (renamed)' };

runCrudContractTests({
  resourceName: 'sectors',
  organizationId: ORGANIZATION_ID,
  recordId: RECORD_ID,
  createDto: CREATE_DTO,
  updateDto: UPDATE_DTO,
  paginationDto: {},
  createService: (client: MockClientProxy) => new SectorsService(client as any),
  ops: {
    create: {
      pattern: SECTOR_PATTERNS.CREATE,
      invoke: (service: SectorsService, ctx: ResolvedCrudContext) =>
        service.create(ctx.createDto as any, ctx.organizationId),
      expectedPayload: standardPayloadShapes.create,
    },
    list: {
      pattern: SECTOR_PATTERNS.FIND_ALL,
      invoke: (service: SectorsService, ctx: ResolvedCrudContext) =>
        service.findAll(ctx.paginationDto as any, ctx.organizationId),
      expectedPayload: standardPayloadShapes.list,
    },
    getOne: {
      pattern: SECTOR_PATTERNS.FIND_ONE,
      invoke: (service: SectorsService, ctx: ResolvedCrudContext) =>
        service.findOne(ctx.recordId, ctx.organizationId),
      expectedPayload: standardPayloadShapes.getOne,
    },
    update: {
      pattern: SECTOR_PATTERNS.UPDATE,
      invoke: (service: SectorsService, ctx: ResolvedCrudContext) =>
        service.update(ctx.recordId, ctx.updateDto as any, ctx.organizationId),
      expectedPayload: standardPayloadShapes.update,
    },
    softDelete: {
      pattern: SECTOR_PATTERNS.SOFT_DELETE, // note: key is SOFT_DELETE, not DELETE
      invoke: (service: SectorsService, ctx: ResolvedCrudContext) =>
        service.softDelete(ctx.recordId, ctx.organizationId), // note: method is softDelete, not remove
      expectedPayload: standardPayloadShapes.softDelete,
    },
    restore: {
      pattern: SECTOR_PATTERNS.RESTORE,
      invoke: (service: SectorsService, ctx: ResolvedCrudContext) =>
        service.restore(ctx.recordId, ctx.organizationId),
      expectedPayload: standardPayloadShapes.restore,
    },
  },
});
