/**
 * Wired into the shared CRUD contract-test harness — see
 * src/product-ms/extras/extras.crud-contract.spec.ts for the fully-annotated
 * reference example and src/common/testing/crud-contract.harness.ts for what
 * this harness does and doesn't verify.
 *
 * TagsService extends BaseCrudService (src/product-ms/tags/tags.service.ts).
 */
import { TagsService } from './tags.service';
import { TAG_PATTERNS } from './patterns/tag_patterns';
import {
  runCrudContractTests,
  ResolvedCrudContext,
} from 'src/common/testing/crud-contract.harness';
import { standardPayloadShapes } from 'src/common/testing/crud-contract.shapes';
import { MockClientProxy } from 'src/common/testing/mock-client-proxy';

const ORGANIZATION_ID = '11111111-1111-4111-8111-111111111111';
const RECORD_ID = '22222222-2222-4222-8222-222222222222';
// CreateTagDto requires `categoryId` (UUID) in addition to `name` — this is
// a fixture value for a required foreign key, not a fabricated DTO field.
const CATEGORY_ID = '33333333-3333-4333-8333-333333333333';

// CreateTagDto: `name` and `categoryId` required; `ui` optional.
const CREATE_DTO = { name: 'Spicy', categoryId: CATEGORY_ID };
// UpdateTagDto = PartialType(CreateTagDto): optional.
const UPDATE_DTO = { name: 'Extra Spicy' };

runCrudContractTests({
  resourceName: 'tags',
  organizationId: ORGANIZATION_ID,
  recordId: RECORD_ID,
  createDto: CREATE_DTO,
  updateDto: UPDATE_DTO,
  paginationDto: {},
  createService: (client: MockClientProxy) => new TagsService(client as any),
  ops: {
    create: {
      pattern: TAG_PATTERNS.CREATE,
      invoke: (service: TagsService, ctx: ResolvedCrudContext) =>
        service.create(ctx.createDto as any, ctx.organizationId),
      expectedPayload: standardPayloadShapes.create,
    },
    list: {
      pattern: TAG_PATTERNS.FIND_ALL,
      invoke: (service: TagsService, ctx: ResolvedCrudContext) =>
        service.findAll(ctx.paginationDto as any, ctx.organizationId),
      expectedPayload: standardPayloadShapes.list,
    },
    getOne: {
      pattern: TAG_PATTERNS.FIND_ONE,
      invoke: (service: TagsService, ctx: ResolvedCrudContext) =>
        service.findOne(ctx.recordId, ctx.organizationId),
      expectedPayload: standardPayloadShapes.getOne,
    },
    update: {
      pattern: TAG_PATTERNS.UPDATE,
      invoke: (service: TagsService, ctx: ResolvedCrudContext) =>
        service.update(ctx.recordId, ctx.updateDto as any, ctx.organizationId),
      expectedPayload: standardPayloadShapes.update,
    },
    softDelete: {
      pattern: TAG_PATTERNS.DELETE,
      invoke: (service: TagsService, ctx: ResolvedCrudContext) =>
        service.remove(ctx.recordId, ctx.organizationId),
      expectedPayload: standardPayloadShapes.softDelete,
    },
    restore: {
      pattern: TAG_PATTERNS.RESTORE,
      invoke: (service: TagsService, ctx: ResolvedCrudContext) =>
        service.restore(ctx.recordId, ctx.organizationId),
      expectedPayload: standardPayloadShapes.restore,
    },
  },
});
