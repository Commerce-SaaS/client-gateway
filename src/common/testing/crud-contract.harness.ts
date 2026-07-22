import { createMockClientProxy, MockClientProxy } from './mock-client-proxy';

/**
 * Parameterized CRUD contract-test harness.
 *
 * WHAT THIS TESTS (and only this): the gateway-boundary contract between a
 * resource's *.service.ts and the RabbitMQ ClientProxy it's injected with —
 * i.e. that calling a given service method sends the correct pattern string
 * with the correct payload shape on `client.send(...)`, and that whatever
 * the (mocked) RPC call resolves with is returned unchanged. It does NOT
 * start a Nest application, does NOT exercise guards/controllers/HTTP, and
 * does NOT talk to a real broker or microservice — those are out of scope.
 *
 * WHY THIS SHAPE: this repo has no working precedent for mocking a
 * ClientProxy (see audit notes in each *.crud-contract.spec.ts file for
 * specifics) — the two existing test styles either fail to compile (Nest-CLI
 * boilerplate that never provides the ClientProxy token) or bypass DI
 * entirely via `new Controller(mockService)` and never reach the service/
 * ClientProxy layer at all. This harness follows that second style (plain
 * instantiation, no Test.createTestingModule, no supertest) but one layer
 * deeper — `new XService(mockClient)` — since that's the only layer where
 * the pattern string and payload are actually decided.
 *
 * Resources are wired in via a small descriptor (see each
 * `*.crud-contract.spec.ts` file) rather than assuming every resource's
 * service has an identical method/payload shape — several genuinely don't
 * (see payment-methods' `update`, which nests the DTO instead of spreading
 * it). Non-conforming resources are excluded rather than forced in; see the
 * scaffolding summary for the full list and reasons.
 */

export type CrudOpName =
  | 'create'
  | 'list'
  | 'getOne'
  | 'update'
  | 'softDelete'
  | 'restore';

export interface ResolvedCrudContext {
  organizationId: string;
  recordId: string;
  createDto: Record<string, unknown>;
  updateDto: Record<string, unknown>;
  paginationDto: Record<string, unknown>;
}

export interface CrudOpSpec {
  /** The exact literal RabbitMQ pattern string this operation must send. */
  pattern: string;
  /** Calls the real service method under test using the resolved context. */
  invoke: (service: any, ctx: ResolvedCrudContext) => Promise<any>;
  /** Builds the exact payload object expected on client.send(pattern, payload). */
  expectedPayload: (ctx: ResolvedCrudContext) => Record<string, unknown>;
}

export interface CrudResourceDescriptor {
  /** Human-readable resource name, used in describe() block titles. */
  resourceName: string;
  /** Builds a real service instance wired to the given mock ClientProxy. */
  createService: (client: MockClientProxy) => any;
  organizationId: string;
  recordId: string;
  /** Minimal valid CreateDto body, derived from the actual DTO — never fabricated. */
  createDto: Record<string, unknown>;
  /** Minimal valid UpdateDto body (may be a partial subset of createDto's fields). */
  updateDto: Record<string, unknown>;
  /** Query params the gateway's `list` route actually forwards; {} if none. */
  paginationDto?: Record<string, unknown>;
  /**
   * Ops this resource exposes through this harness. Omit an op the resource
   * doesn't have (e.g. organization-domains has no restore route) rather
   * than forcing a fake one in.
   */
  ops: Partial<Record<CrudOpName, CrudOpSpec>>;
}

const FAKE_RPC_RESPONSE = Object.freeze({
  __marker: 'crud-contract-harness-fake-rpc-response',
  id: 'fake-response-id',
});

/**
 * Generates, for every op present in `descriptor.ops`, two tests:
 *   1. the correct pattern + payload shape is sent to client.send(...)
 *   2. the mocked RPC response is returned unchanged (no gateway-side mutation)
 *
 * Call this from a `*.crud-contract.spec.ts` file — it registers real
 * describe()/it() blocks as a side effect, same as calling describe.each
 * would, just without that Jest API (unused anywhere else in this repo).
 */
export function runCrudContractTests(descriptor: CrudResourceDescriptor): void {
  const ctx: ResolvedCrudContext = {
    organizationId: descriptor.organizationId,
    recordId: descriptor.recordId,
    createDto: descriptor.createDto,
    updateDto: descriptor.updateDto,
    paginationDto: descriptor.paginationDto ?? {},
  };

  const opNames = Object.keys(descriptor.ops) as CrudOpName[];

  describe(`${descriptor.resourceName} — CRUD gateway contract`, () => {
    if (opNames.length === 0) {
      it.todo('no ops wired for this resource yet');
      return;
    }

    opNames.forEach((opName) => {
      const op = descriptor.ops[opName] as CrudOpSpec;

      describe(opName, () => {
        it(`sends pattern "${op.pattern}" with the expected payload`, async () => {
          const client = createMockClientProxy(FAKE_RPC_RESPONSE);
          const service = descriptor.createService(client);

          await op.invoke(service, ctx);

          expect(client.send).toHaveBeenCalledTimes(1);
          const [sentPattern, sentPayload] = client.send.mock.calls[0];
          expect(sentPattern).toBe(op.pattern);
          expect(sentPayload).toEqual(op.expectedPayload(ctx));
        });

        it('passes the mocked RPC response back through unchanged', async () => {
          const client = createMockClientProxy(FAKE_RPC_RESPONSE);
          const service = descriptor.createService(client);

          const result = await op.invoke(service, ctx);

          expect(result).toEqual(FAKE_RPC_RESPONSE);
        });
      });
    });
  });
}
