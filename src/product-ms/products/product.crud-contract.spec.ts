/**
 * Wired into the shared CRUD contract-test harness — see
 * src/product-ms/extras/extras.crud-contract.spec.ts for the fully-annotated
 * reference example and src/common/testing/crud-contract.harness.ts for what
 * this harness does and doesn't verify.
 *
 * ProductsService extends BaseCrudService (src/product-ms/products/product.service.ts).
 */
import { ProductsService } from './product.service';
import { PRODUCT_PATTERNS } from './patterns/product_patterns';
import {
  runCrudContractTests,
  ResolvedCrudContext,
} from 'src/common/testing/crud-contract.harness';
import { standardPayloadShapes } from 'src/common/testing/crud-contract.shapes';
import { MockClientProxy } from 'src/common/testing/mock-client-proxy';

const ORGANIZATION_ID = '11111111-1111-4111-8111-111111111111';
const RECORD_ID = '22222222-2222-4222-8222-222222222222';

// CreateProductDto (dto/create-product.dto.ts): only `name` and `price` are
// required; `tags`/`extras`/`ingredients`/`category`/etc. are all optional,
// so a minimal valid body omits them entirely — no fabricated fields.
const CREATE_DTO = { name: 'Margherita Pizza', price: 9.5 };
// UpdateProductDto = PartialType(CreateProductDto): every field optional.
const UPDATE_DTO = { price: 10 };

runCrudContractTests({
  resourceName: 'products',
  organizationId: ORGANIZATION_ID,
  recordId: RECORD_ID,
  createDto: CREATE_DTO,
  updateDto: UPDATE_DTO,
  paginationDto: {},
  createService: (client: MockClientProxy) => new ProductsService(client as any),
  ops: {
    create: {
      pattern: PRODUCT_PATTERNS.CREATE,
      invoke: (service: ProductsService, ctx: ResolvedCrudContext) =>
        service.create(ctx.createDto as any, ctx.organizationId),
      expectedPayload: standardPayloadShapes.create,
    },
    list: {
      pattern: PRODUCT_PATTERNS.FIND_ALL,
      invoke: (service: ProductsService, ctx: ResolvedCrudContext) =>
        service.findAll(ctx.paginationDto as any, ctx.organizationId),
      expectedPayload: standardPayloadShapes.list,
    },
    getOne: {
      pattern: PRODUCT_PATTERNS.FIND_ONE,
      invoke: (service: ProductsService, ctx: ResolvedCrudContext) =>
        service.findOne(ctx.recordId, ctx.organizationId),
      expectedPayload: standardPayloadShapes.getOne,
    },
    update: {
      pattern: PRODUCT_PATTERNS.UPDATE,
      invoke: (service: ProductsService, ctx: ResolvedCrudContext) =>
        service.update(ctx.recordId, ctx.updateDto as any, ctx.organizationId),
      expectedPayload: standardPayloadShapes.update,
    },
    softDelete: {
      pattern: PRODUCT_PATTERNS.DELETE,
      invoke: (service: ProductsService, ctx: ResolvedCrudContext) =>
        service.remove(ctx.recordId, ctx.organizationId),
      expectedPayload: standardPayloadShapes.softDelete,
    },
    restore: {
      pattern: PRODUCT_PATTERNS.RESTORE,
      invoke: (service: ProductsService, ctx: ResolvedCrudContext) =>
        service.restore(ctx.recordId, ctx.organizationId),
      expectedPayload: standardPayloadShapes.restore,
    },
  },
});
