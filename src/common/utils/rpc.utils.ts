import { ServiceUnavailableException } from '@nestjs/common';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { firstValueFrom, timeout, catchError, throwError } from 'rxjs';
import { TimeoutError } from 'rxjs';

const DEFAULT_TIMEOUT_MS = 5000;

export function rpcSend<T = any>(
  client: ClientProxy,
  pattern: string,
  data: any,
  timeoutMs = DEFAULT_TIMEOUT_MS,
): Promise<T> {
  return firstValueFrom(
    client.send<T>(pattern, data).pipe(
      timeout(timeoutMs),
      catchError((err) => {
        if (err instanceof TimeoutError) {
          return throwError(
            () =>
              new ServiceUnavailableException(
                `Service did not respond within ${timeoutMs}ms`,
              ),
          );
        }
        return throwError(() => new RpcException(err));
      }),
    ),
  );
}
