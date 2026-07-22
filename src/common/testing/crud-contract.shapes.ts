import { ResolvedCrudContext } from './crud-contract.harness';

/**
 * Payload-shape builders matching BaseCrudService (src/common/services/base-crud.service.ts)
 * exactly:
 *   create:  { ...createDto, organizationId }
 *   list:    { ...paginationDto, organizationId }
 *   getOne:  { id, organizationId }
 *   update:  { id, ...updateDto, organizationId }
 *   softDelete (BaseCrudService.remove -> DELETE pattern): { id, organizationId }
 *   restore: { id, organizationId }
 *
 * These also match the hand-written (non-BaseCrudService) TablesService and
 * SectorsService, which independently implement the identical spread shape
 * for every op — confirmed by reading both files, not assumed. They do NOT
 * match PaymentMethodsService.update, which nests the DTO under a `dto` key
 * instead of spreading it; that resource supplies its own `update` builder.
 */
export const standardPayloadShapes = {
  create: (ctx: ResolvedCrudContext) => ({
    ...ctx.createDto,
    organizationId: ctx.organizationId,
  }),
  list: (ctx: ResolvedCrudContext) => ({
    ...ctx.paginationDto,
    organizationId: ctx.organizationId,
  }),
  getOne: (ctx: ResolvedCrudContext) => ({
    id: ctx.recordId,
    organizationId: ctx.organizationId,
  }),
  update: (ctx: ResolvedCrudContext) => ({
    id: ctx.recordId,
    ...ctx.updateDto,
    organizationId: ctx.organizationId,
  }),
  softDelete: (ctx: ResolvedCrudContext) => ({
    id: ctx.recordId,
    organizationId: ctx.organizationId,
  }),
  restore: (ctx: ResolvedCrudContext) => ({
    id: ctx.recordId,
    organizationId: ctx.organizationId,
  }),
};
