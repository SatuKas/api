import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { WinstonModule } from 'nest-winston';

import { RequestLoggerMiddleware } from 'src/common/middleware/request-logger.middleware';
import { AppLogger } from 'src/common/logger/logger.service';
import configuration from 'src/config/env.config';
import envValidationSchema from 'src/config/validation.config';
import { createWinstonLoggerConfig } from 'src/common/logger/winston-logger';
import { HealthModule } from 'src/modules/health/health.module';
import { UserModule } from './modules/user/user.module';
import { AuthModule } from './modules/auth/auth.module';
import { RedisModule } from './shared/redis/redis.module';
import { MailerModule } from './shared/mailer/mailer.module';
import { PrismaModule } from './database/prisma.module';

/**
 * Root module of the application that configures global settings and imports all feature modules
 *
 * @module AppModule
 * @description
 * - Configures environment variables and validation using ConfigModule
 * - Sets up Winston logger for application-wide logging
 * - Imports core feature modules (Health, User, Auth)
 * - Imports shared modules (Redis, Mailer, Prisma)
 * - Applies request logging middleware globally
 */
@Module({
  imports: [
    // Configure environment variables with validation
    ConfigModule.forRoot({
      isGlobal: true, // Make config accessible throughout the app
      load: [configuration],
      validationSchema: envValidationSchema,
    }),
    // Configure Winston logger
    WinstonModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: () => createWinstonLoggerConfig(),
    }),
    // Core feature modules
    HealthModule,
    UserModule,
    AuthModule,
    // Shared infrastructure modules
    RedisModule,
    MailerModule,
    PrismaModule,
  ],
  controllers: [],
  providers: [AppLogger],
  exports: [],
})
export class AppModule implements NestModule {
  /**
   * Configures global middleware
   * Applies request logging for all routes ('*') to track incoming requests
   */
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(RequestLoggerMiddleware).forRoutes('*');
  }
}
