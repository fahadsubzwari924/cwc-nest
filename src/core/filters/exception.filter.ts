import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { createErrorResponse, createResponse } from 'src/utils/response.utils';

@Catch()
export class CustomExceptionFilter implements ExceptionFilter {
  private readonly logger: Logger;
  catch(exception: Error, host: ArgumentsHost): any {
    console.log('--Exception--', exception['detail']);
    console.log(exception);
    const ctx = host.switchToHttp();
    const request = ctx.getRequest();
    const response = ctx.getResponse();

    const statusCode =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;
    const message =
      exception instanceof HttpException
        ? exception.message || exception.message['error']
        : exception['detail'];

    const devErrorResponse: any = {
      statusCode,
      timestamp: new Date().toISOString(),
      path: request.url,
      method: request.method,
      errorName: exception?.name,
      message: exception?.message,
    };

    console.log(
      `request method: ${request.method} request url${request.url}`,
      JSON.stringify(devErrorResponse),
    );
    response
      .status(statusCode)
      .json(createErrorResponse({ statusCode, message }));
  }
}
