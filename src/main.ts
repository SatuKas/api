import { NestFactory, Reflector } from '@nestjs/core';
import { IoAdapter } from '@nestjs/platform-socket.io';
import { ValidationPipe, VersioningType } from '@nestjs/common';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { AppModule } from 'src/app.module';
import configuration from 'src/config/env.config';
import { AppLogger } from 'src/common/logger/logger.service';
import { AllExceptionsFilter } from 'src/common/filters/all-exception.filter';
import { TransformInterceptor } from 'src/common/interceptors/transform.interceptor';
import { HttpLoggerInterceptor } from 'src/common/interceptors/http-logger.interceptor';
import { JwtAuthGuard } from 'src/modules/auth/guard/jwt-auth.guard';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { apiReference } from '@scalar/nestjs-api-reference';

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

  app.useGlobalGuards(new JwtAuthGuard(app.get(Reflector)));

  app.useGlobalFilters(new AllExceptionsFilter(logger));

  app.useGlobalInterceptors(new TransformInterceptor());
  app.useGlobalInterceptors(new HttpLoggerInterceptor());

  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: '1',
  });

  const config = new DocumentBuilder()
    .setTitle('API Server Docs')
    .setDescription('API Server Docs')
    .setVersion('1.0')
    .addTag('docs')
    .build();
  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('swagger', app, documentFactory, {
    jsonDocumentUrl: 'swagger/json',
  });
  app.use(
    '/docs',
    apiReference({
      content: documentFactory,
    }),
  );

  await app.listen(configuration().port, () => {
    logger.setContext('AppConsole');
    logger.info(`🚀 App listening on port: ${configuration().port}`);
  });
}
bootstrap();
