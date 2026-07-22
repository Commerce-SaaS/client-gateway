import { Catch, ArgumentsHost, ExceptionFilter, Logger } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';

@Catch(RpcException)
export class RpcCustomExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(RpcCustomExceptionFilter.name);

  catch(exception: RpcException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const rpcError = exception.getError();

    if (typeof rpcError === 'string' && rpcError.includes('Empty response')) {
      this.logger.error(`RPC empty response: ${rpcError}`);
      return response.status(503).json({
        statusCode: 503,
        message: 'Service temporarily unavailable',
      });
    }

    if (
      typeof rpcError === 'object' &&
      rpcError !== null &&
      'statusCode' in rpcError &&
      'message' in rpcError
    ) {
      const { statusCode, message, code } = rpcError as {
        statusCode: number | string;
        message: string;
        code: string;
      };
      const httpStatus = isNaN(+statusCode) ? 400 : +statusCode;
      return response.status(httpStatus).json({ statusCode: httpStatus, message, code });
    }

    // [ORDER-FLOW] This branch is the last stop before a 500. The full rpcError
    // shape is logged here so the real cause is visible even when not an RpcException.
    this.logger.error(
      `[ORDER-FLOW] Unhandled RPC error — typeof=${typeof rpcError} shape=${JSON.stringify(rpcError)}`,
      rpcError instanceof Error ? rpcError.stack : undefined,
    );
    return response.status(500).json({
      statusCode: 500,
      message: 'Internal server error',
    });
  }
}