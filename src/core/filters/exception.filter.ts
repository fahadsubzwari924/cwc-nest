import {
  ArgumentsHost,
  BadRequestException,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { GenericResponseDto } from '../dtos/generic-response.dto';
import { ValidationCodes } from 'src/utils/constants/validation-codes.constant';
@Catch()
export class CustomExceptionFilter implements ExceptionFilter {
  private readonly logger: Logger;
  catch(exception: Error, host: ArgumentsHost): any {
    console.log('------------ Exception ------------');
    const ctx = host.switchToHttp();
    const request = ctx.getRequest();
    const response = ctx.getResponse();

    let error = [ValidationCodes.general.somethingWentWrong];
    if (exception instanceof BadRequestException) {
      if (exception['response']['message'] instanceof Array) {
        error = exception['response']['message'] || exception.message['error'];
      }
    }

    const statusCode =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    const devErrorResponse: any = {
      statusCode,
      timestamp: new Date().toISOString(),
      path: request.url,
      method: request.method,
      errorName: exception?.name,
      exception,
    };

    console.log(
      `request method: ${request.method} request url${request.url}`,
      JSON.stringify(devErrorResponse),
    );
    response.status(statusCode).json(new GenericResponseDto({ error }));
  }
}
