import {
  Catch,
  ArgumentsHost,
  ExceptionFilter,
  HttpException,
} from '@nestjs/common';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const status = exception.getStatus();
    const res = exception.getResponse();

    const body =
      typeof res === 'string'
        ? { statusCode: status, message: res }
        : { statusCode: status, ...(res as Record<string, unknown>) };

    response.status(status).json(body);
  }
}
