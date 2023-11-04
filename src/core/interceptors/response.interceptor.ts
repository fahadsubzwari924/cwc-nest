import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable, catchError, map, of } from 'rxjs';
import { GenericResponseDto } from '../dtos/generic-response.dto';

@Injectable()
export class ResponseInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, handler: CallHandler): Observable<any> {
    return handler.handle().pipe(
      map((data: any) => {
        console.log(data);
        return new GenericResponseDto({
          records: data?.data,
          metadata: data?.metadata,
        });
      })
    );
  }
}
