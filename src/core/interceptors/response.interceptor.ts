import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { createResponse } from '../../utils/response.utils';
import { CustomResponse } from '../interfaces/controller-response.interface';

@Injectable()
export class ResponseInterceptor<T>
  implements NestInterceptor<T, CustomResponse>
{
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<CustomResponse> {
    return next.handle().pipe(map((data: any) => createResponse(data)));
  }
}
