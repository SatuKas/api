import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { WinstonModule } from 'nest-winston';

import { AppController } from 'src/app.controller';
import { AppService } from 'src/app.service';
import { RequestLoggerMiddleware } from 'src/common/middleware/request-logger.middleware';
import { AppLogger } from 'src/common/logger/logger.service';
import configuration from 'src/config/env.config';
import envValidationSchema from 'src/config/validation.config';
import { createWinstonLoggerConfig } from 'src/common/logger/winston-logger';
import { HealthModule } from 'src/modules/health/health.module';
import { PrismaService } from 'src/database/prisma.service';
import { UserModule } from './modules/user/user.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
      validationSchema: envValidationSchema,
    }),
    WinstonModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: () => createWinstonLoggerConfig(),
    }),
    HealthModule,
    UserModule,
  ],
  controllers: [AppController],
  providers: [AppService, AppLogger, PrismaService],
  exports: [PrismaService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(RequestLoggerMiddleware).forRoutes('*');
  }
}
