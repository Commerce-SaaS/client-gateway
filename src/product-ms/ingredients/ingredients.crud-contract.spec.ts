/**
 * Wired into the shared CRUD contract-test harness — see
 * src/product-ms/extras/extras.crud-contract.spec.ts for the fully-annotated
 * reference example and src/common/testing/crud-contract.harness.ts for what
 * this harness does and doesn't verify.
 *
 * IngredientsService extends BaseCrudService (src/product-ms/ingredients/ingredients.service.ts).
 */
import { IngredientsService } from './ingredients.service';
import { INGREDIENT_PATTERNS } from './patterns/ingredients_patterns';
import {
  runCrudContractTests,
  ResolvedCrudContext,
} from 'src/common/testing/crud-contract.harness';
import { standardPayloadShapes } from 'src/common/testing/crud-contract.shapes';
import { MockClientProxy } from 'src/common/testing/mock-client-proxy';

const ORGANIZATION_ID = '11111111-1111-4111-8111-111111111111';
const RECORD_ID = '22222222-2222-4222-8222-222222222222';

// CreateIngredientDto: only `name` is required (Length 1-100).
const CREATE_DTO = { name: 'Basil' };
// UpdateIngredientDto = PartialType(CreateIngredientDto): optional.
const UPDATE_DTO = { name: 'Fresh Basil' };

runCrudContractTests({
  resourceName: 'ingredients',
  organizationId: ORGANIZATION_ID,
  recordId: RECORD_ID,
  createDto: CREATE_DTO,
  updateDto: UPDATE_DTO,
  paginationDto: {},
  createService: (client: MockClientProxy) => new IngredientsService(client as any),
  ops: {
    create: {
      pattern: INGREDIENT_PATTERNS.CREATE,
      invoke: (service: IngredientsService, ctx: ResolvedCrudContext) =>
        service.create(ctx.createDto as any, ctx.organizationId),
      expectedPayload: standardPayloadShapes.create,
    },
    list: {
      pattern: INGREDIENT_PATTERNS.FIND_ALL,
      invoke: (service: IngredientsService, ctx: ResolvedCrudContext) =>
        service.findAll(ctx.paginationDto as any, ctx.organizationId),
      expectedPayload: standardPayloadShapes.list,
    },
    getOne: {
      pattern: INGREDIENT_PATTERNS.FIND_ONE,
      invoke: (service: IngredientsService, ctx: ResolvedCrudContext) =>
        service.findOne(ctx.recordId, ctx.organizationId),
      expectedPayload: standardPayloadShapes.getOne,
    },
    update: {
      pattern: INGREDIENT_PATTERNS.UPDATE,
      invoke: (service: IngredientsService, ctx: ResolvedCrudContext) =>
        service.update(ctx.recordId, ctx.updateDto as any, ctx.organizationId),
      expectedPayload: standardPayloadShapes.update,
    },
    softDelete: {
      pattern: INGREDIENT_PATTERNS.DELETE,
      invoke: (service: IngredientsService, ctx: ResolvedCrudContext) =>
        service.remove(ctx.recordId, ctx.organizationId),
      expectedPayload: standardPayloadShapes.softDelete,
    },
    restore: {
      pattern: INGREDIENT_PATTERNS.RESTORE,
      invoke: (service: IngredientsService, ctx: ResolvedCrudContext) =>
        service.restore(ctx.recordId, ctx.organizationId),
      expectedPayload: standardPayloadShapes.restore,
    },
  },
});
