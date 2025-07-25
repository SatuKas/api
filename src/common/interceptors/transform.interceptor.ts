import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { ApiResponse } from 'src/types/api-response.type';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { SuccessResponseMapper } from 'src/common/mappers/success-response.mapper';

@Injectable()
export class TransformInterceptor<T>
  implements NestInterceptor<T, ApiResponse<T>>
{
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<ApiResponse<T>> {
    return next.handle().pipe(
      map((data: any) => {
        // Skip transform for HTML responses
        const response = context.switchToHttp().getResponse();
        const contentType = response.getHeader('Content-Type');

        if (contentType?.includes('text/html')) {
          return data; // ← Return as-is untuk HTML
        }

        // If data already has status 'error', return as is (from exception filter)
        if (data?.status === 'error') {
          return data;
        }

        // Map success response
        return SuccessResponseMapper.mapSuccess(
          data?.data,
          data?.message,
          data?.code,
        );
      }),
    );
  }
}
