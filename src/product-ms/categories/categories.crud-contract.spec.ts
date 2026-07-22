/**
 * Wired into the shared CRUD contract-test harness — see
 * src/product-ms/extras/extras.crud-contract.spec.ts for the fully-annotated
 * reference example and src/common/testing/crud-contract.harness.ts for what
 * this harness does and doesn't verify.
 *
 * CategoriesService extends BaseCrudService (src/product-ms/categories/categories.service.ts).
 * NOTE the quirk: this resource's patterns (patterns/categories.ts) use
 * camelCase `findAll`/`findOne`, unlike every sibling resource's snake_case
 * `find_all`/`find_one` — confirmed real, not a typo to "fix" here.
 */
import { CategoriesService } from './categories.service';
import { CATEGORIES_PATTERNS } from './patterns/categories';
import {
  runCrudContractTests,
  ResolvedCrudContext,
} from 'src/common/testing/crud-contract.harness';
import { standardPayloadShapes } from 'src/common/testing/crud-contract.shapes';
import { MockClientProxy } from 'src/common/testing/mock-client-proxy';

const ORGANIZATION_ID = '11111111-1111-4111-8111-111111111111';
const RECORD_ID = '22222222-2222-4222-8222-222222222222';

// CreateCategoryDto: only `name` is required; `description`/`ui`/
// `countsTowardKitchenCapacity` are all optional.
const CREATE_DTO = { name: 'Pizzas' };
// UpdateCategoryDto = PartialType(CreateCategoryDto): every field optional.
const UPDATE_DTO = { name: 'Pizzas & Calzones' };

runCrudContractTests({
  resourceName: 'categories',
  organizationId: ORGANIZATION_ID,
  recordId: RECORD_ID,
  createDto: CREATE_DTO,
  updateDto: UPDATE_DTO,
  paginationDto: {},
  createService: (client: MockClientProxy) => new CategoriesService(client as any),
  ops: {
    create: {
      pattern: CATEGORIES_PATTERNS.CREATE,
      invoke: (service: CategoriesService, ctx: ResolvedCrudContext) =>
        service.create(ctx.createDto as any, ctx.organizationId),
      expectedPayload: standardPayloadShapes.create,
    },
    list: {
      pattern: CATEGORIES_PATTERNS.FIND_ALL, // literal string: 'categories.findAll'
      invoke: (service: CategoriesService, ctx: ResolvedCrudContext) =>
        service.findAll(ctx.paginationDto as any, ctx.organizationId),
      expectedPayload: standardPayloadShapes.list,
    },
    getOne: {
      pattern: CATEGORIES_PATTERNS.FIND_ONE, // literal string: 'categories.findOne'
      invoke: (service: CategoriesService, ctx: ResolvedCrudContext) =>
        service.findOne(ctx.recordId, ctx.organizationId),
      expectedPayload: standardPayloadShapes.getOne,
    },
    update: {
      pattern: CATEGORIES_PATTERNS.UPDATE,
      invoke: (service: CategoriesService, ctx: ResolvedCrudContext) =>
        service.update(ctx.recordId, ctx.updateDto as any, ctx.organizationId),
      expectedPayload: standardPayloadShapes.update,
    },
    softDelete: {
      pattern: CATEGORIES_PATTERNS.DELETE,
      invoke: (service: CategoriesService, ctx: ResolvedCrudContext) =>
        service.remove(ctx.recordId, ctx.organizationId),
      expectedPayload: standardPayloadShapes.softDelete,
    },
    restore: {
      pattern: CATEGORIES_PATTERNS.RESTORE,
      invoke: (service: CategoriesService, ctx: ResolvedCrudContext) =>
        service.restore(ctx.recordId, ctx.organizationId),
      expectedPayload: standardPayloadShapes.restore,
    },
  },
});
