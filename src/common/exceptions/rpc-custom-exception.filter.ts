import { Catch, ArgumentsHost, ExceptionFilter, Logger } from '@nestjs/common';

import { RpcException } from '@nestjs/microservices';

@Catch(RpcException)
export class RpcCustomExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(RpcCustomExceptionFilter.name);
  catch(exception: RpcException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();

    const rpcError = exception.getError();

    if ( rpcError.toString().includes('Empty response') ) {
      return response.status(500).json({
        statusCode: 500,
        message: rpcError.toString().substring(0, rpcError.toString().indexOf('(') - 1)
      })
    }



    if (
      typeof rpcError === 'object' &&
      'statusCode' in rpcError &&
      'message' in rpcError
    ) {
      const { statusCode, message } = rpcError as { statusCode: number | string, message: string };
      const httpStatus = isNaN(+statusCode) ? 400 : +statusCode;
      return response.status(httpStatus).json({ statusCode: httpStatus, message });
    }

    response.status(400).json({
      statusCode: 400,
      message: rpcError,
    });
  }
}
