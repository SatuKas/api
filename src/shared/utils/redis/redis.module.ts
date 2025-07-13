import { Global, Module } from '@nestjs/common';
import Redis from 'ioredis';
import configuration from 'src/config/env.config';

@Global()
@Module({
  providers: [
    {
      provide: 'REDIS_CLIENT',
      useFactory: () => {
        return new Redis({
          host: configuration().redisHost,
          port: configuration().redisPort,
          username: configuration().redisUsername,
          password: configuration().redisPassword,
          tls: {},
        });
      },
    },
  ],
  exports: ['REDIS_CLIENT'],
})
export class RedisModule {}
