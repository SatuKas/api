import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { catchError, Observable, tap, throwError } from 'rxjs';
import { AppLogger } from '../logger/logger.service';
import { LoggerEnum } from '../enums/logger/logger.enum';
import { loggerMessageFormater } from 'src/shared/utils/logger.utils';
@Injectable()
export class HttpLoggerInterceptor implements NestInterceptor {
  private readonly logger = new AppLogger();

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    this.logger.setContext(LoggerEnum.HTTP);
    const req = context.switchToHttp().getRequest();
    const { method, originalUrl, body } = req;

    const startTime = Date.now();

    return next.handle().pipe(
      tap((data) => {
        const res = context.switchToHttp().getResponse();
        const statusCode = res.statusCode;
        const duration = Date.now() - startTime;

        const logEntry = {
          method,
          endpoint: originalUrl,
          statusCode,
          responseTime: `${duration}ms`,
          request: body,
          response: data,
        };

        this.logger.info(loggerMessageFormater(logEntry));
      }),
      catchError((err) => {
        const res = context.switchToHttp().getResponse();
        const statusCode = res?.statusCode || err?.status || 500;
        const duration = Date.now() - startTime;

        const logEntry = {
          method,
          endpoint: originalUrl,
          statusCode,
          responseTime: `${duration}ms`,
          request: body,
        };

        this.logger.error(loggerMessageFormater(logEntry));

        return throwError(() => err);
      }),
    );
  }
}
