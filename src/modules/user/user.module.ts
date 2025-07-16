import { Module } from '@nestjs/common';
import { UserService } from 'src/modules/user/services/user.service';
import { UserController } from 'src/modules/user/user.controller';
import { UserMapper } from './user.mapper';

@Module({
  providers: [UserService, UserMapper],
  controllers: [UserController],
  exports: [UserService],
})
export class UserModule {}
