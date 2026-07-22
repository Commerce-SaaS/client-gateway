/**
 * REFERENCE EXAMPLE for the shared CRUD contract-test harness
 * (src/common/testing/crud-contract.harness.ts). This resource is fully
 * worked out — real fixtures, all 6 ops — as the pattern the other wired
 * resources follow. See that file's header comment for what this harness
 * does and doesn't verify, and the scaffolding summary for why this
 * approach was chosen over the repo's two existing (broken / DI-bypassing)
 * test styles.
 *
 * ExtrasService extends BaseCrudService directly (src/product-ms/extras/extras.service.ts),
 * so every op uses the standard spread-payload shape.
 */
import { ExtrasService } from './extras.service';
import { EXTRA_PATTERNS } from './patterns/extra_patterns';
import {
  runCrudContractTests,
  ResolvedCrudContext,
} from 'src/common/testing/crud-contract.harness';
import { standardPayloadShapes } from 'src/common/testing/crud-contract.shapes';
import { MockClientProxy } from 'src/common/testing/mock-client-proxy';

const ORGANIZATION_ID = '11111111-1111-4111-8111-111111111111';
const RECORD_ID = '22222222-2222-4222-8222-222222222222';

// CreateExtraDto (src/product-ms/extras/dto/create-extra.dto.ts): both fields required, no optionals.
const CREATE_DTO = { name: 'Extra Cheese', price: 1.5 };
// UpdateExtraDto = PartialType(CreateExtraDto): every field optional, partial update is valid.
const UPDATE_DTO = { price: 2 };

runCrudContractTests({
  resourceName: 'extras',
  organizationId: ORGANIZATION_ID,
  recordId: RECORD_ID,
  createDto: CREATE_DTO,
  updateDto: UPDATE_DTO,
  paginationDto: {},
  createService: (client: MockClientProxy) => new ExtrasService(client as any),
  ops: {
    create: {
      pattern: EXTRA_PATTERNS.CREATE,
      invoke: (service: ExtrasService, ctx: ResolvedCrudContext) =>
        service.create(ctx.createDto as any, ctx.organizationId),
      expectedPayload: standardPayloadShapes.create,
    },
    list: {
      pattern: EXTRA_PATTERNS.FIND_ALL,
      invoke: (service: ExtrasService, ctx: ResolvedCrudContext) =>
        service.findAll(ctx.paginationDto as any, ctx.organizationId),
      expectedPayload: standardPayloadShapes.list,
    },
    getOne: {
      pattern: EXTRA_PATTERNS.FIND_ONE,
      invoke: (service: ExtrasService, ctx: ResolvedCrudContext) =>
        service.findOne(ctx.recordId, ctx.organizationId),
      expectedPayload: standardPayloadShapes.getOne,
    },
    update: {
      pattern: EXTRA_PATTERNS.UPDATE,
      invoke: (service: ExtrasService, ctx: ResolvedCrudContext) =>
        service.update(ctx.recordId, ctx.updateDto as any, ctx.organizationId),
      expectedPayload: standardPayloadShapes.update,
    },
    softDelete: {
      pattern: EXTRA_PATTERNS.DELETE,
      invoke: (service: ExtrasService, ctx: ResolvedCrudContext) =>
        service.remove(ctx.recordId, ctx.organizationId),
      expectedPayload: standardPayloadShapes.softDelete,
    },
    restore: {
      pattern: EXTRA_PATTERNS.RESTORE,
      invoke: (service: ExtrasService, ctx: ResolvedCrudContext) =>
        service.restore(ctx.recordId, ctx.organizationId),
      expectedPayload: standardPayloadShapes.restore,
    },
  },
});
