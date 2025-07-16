import { Controller, Get, NotFoundException, Req } from '@nestjs/common';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { SuccessMessage } from 'src/common/enums/message/success-message.enum';
import { UserService } from './services/user.service';
import { Routes } from 'src/common/enums/routes/routes.enum';
import { ResponseData } from 'src/types/api-response.type';
import { UserResponse } from './user.interface';
import { UserMapper } from './user.mapper';
import { ExceptionMessage } from 'src/common/enums/message/exception-message.enum';

@Controller(Routes.USER)
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly userMapper: UserMapper,
  ) {}

  @Get(Routes.USER_CURRENT_INFO)
  async getCurrentUser(
    @CurrentUser('sub') userId: string,
  ): Promise<ResponseData<UserResponse>> {
    const user = await this.userService.getUserById(userId);

    if (!user) {
      throw new NotFoundException(ExceptionMessage.USER_NOT_FOUND);
    }

    const response = this.userMapper.toResponse(user);
    return {
      message: SuccessMessage.FETCHED,
      data: response,
    };
  }
}
