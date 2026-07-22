import { of, throwError } from 'rxjs';

/**
 * Minimal stand-in for @nestjs/microservices' ClientProxy, shaped to satisfy
 * rpcSend() (src/common/utils/rpc.utils.ts), which does:
 *   client.send(pattern, data).pipe(timeout(...), catchError(...))
 * then firstValueFrom(...). `.send()` must therefore return an Observable,
 * not a bare Promise or plain value.
 */
export interface MockClientProxy {
  send: jest.Mock;
  emit: jest.Mock;
}

/**
 * Builds a mock ClientProxy whose `.send()` always resolves (via an
 * Observable) to `response`, regardless of pattern/payload. Tests assert the
 * pattern/payload separately from `send.mock.calls`.
 */
export function createMockClientProxy(response: unknown): MockClientProxy {
  return {
    send: jest.fn().mockReturnValue(of(response)),
    emit: jest.fn().mockReturnValue(of(undefined)),
  };
}

/**
 * Marker wrapper for createMockClientProxyByPattern: wrap a value with
 * rejects(err) to make that specific pattern's .send() call fail instead of
 * resolving — used to test orchestration flows (fan-out / multi-call
 * sequences) where different patterns on the same client need different
 * outcomes.
 */
export function rejects(error: unknown): { __reject: unknown } {
  return { __reject: error };
}

/**
 * Builds a mock ClientProxy whose `.send()` response depends on the pattern
 * string passed in, so a single client mock can stand in for a service that
 * sends several different patterns (fan-out) or the same pattern's client
 * sequentially with different responses per call (orchestration chains).
 * Each entry in `responses` is either a plain value (resolved via `of()`) or
 * `rejects(err)` (failed via `throwError()`), matching what `rpcSend()`
 * expects from a real ClientProxy. Calling `.send()` with a pattern that has
 * no entry throws synchronously, surfacing test setup gaps immediately
 * instead of silently returning `undefined`.
 */
export function createMockClientProxyByPattern(
  responses: Record<string, unknown>,
): MockClientProxy {
  return {
    send: jest.fn((pattern: string) => {
      if (!(pattern in responses)) {
        throw new Error(
          `createMockClientProxyByPattern: no mock response configured for pattern "${pattern}"`,
        );
      }
      const entry = responses[pattern];
      if (entry && typeof entry === 'object' && '__reject' in (entry as any)) {
        return throwError(() => (entry as any).__reject);
      }
      return of(entry);
    }),
    emit: jest.fn().mockReturnValue(of(undefined)),
  };
}
