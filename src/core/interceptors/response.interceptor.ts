import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable, catchError, map, of } from 'rxjs';
import { GenericResponseDto } from '../dtos/generic-response.dto';
import { NO_INTERCEPT_METADATA_KEY } from 'src/utils/decorators/no-intercept.decorator';

@Injectable()
export class ResponseInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, handler: CallHandler): Observable<any> {
    const isNoIntercept = Reflect.getMetadata(
      NO_INTERCEPT_METADATA_KEY,
      context.getHandler(),
    );

    if (isNoIntercept) {
      return handler.handle(); // Skip interception
    }

    return handler.handle().pipe(
      map((data: any) => {
        console.log(data);
        return new GenericResponseDto({
          records: data?.data,
          metadata: data?.metadata,
        });
      }),
    );
  }
}
