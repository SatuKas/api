import { NestFactory } from '@nestjs/core';
import { IoAdapter } from '@nestjs/platform-socket.io';
import { ValidationPipe } from '@nestjs/common';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { AppModule } from 'src/app.module';
import configuration from 'src/config/env.config';
import { AppLogger } from 'src/common/logger/logger.service';
import { AllExceptionsFilter } from 'src/common/filters/all-exception.filter';
import { TransformInterceptor } from 'src/common/interceptors/transform.interceptor';
import { HttpLoggerInterceptor } from 'src/common/interceptors/http-logger.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    bufferLogs: true,
  });

  app.useLogger(app.get(WINSTON_MODULE_NEST_PROVIDER));
  const logger = await app.resolve(AppLogger);

  app.setGlobalPrefix('api');
  app.enableCors();
  app.useWebSocketAdapter(new IoAdapter(app));
  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));

  app.useGlobalFilters(new AllExceptionsFilter(logger));

  app.useGlobalInterceptors(new TransformInterceptor());
  app.useGlobalInterceptors(new HttpLoggerInterceptor());

  await app.listen(configuration().port, () => {
    logger.info(`🚀 App listening on port: ${configuration().port}`);
  });
}
bootstrap();
