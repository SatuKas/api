import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { Public } from 'src/common/decorators/public.decorator';
import { Routes } from 'src/common/enums/routes/routes.enum';

@Controller(Routes.AUTH)
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post(Routes.AUTH_REGISTER)
  register(@Body() dto: RegisterDto) {
    return this.authService.register(dto);
  }

  @Public()
  @Post(Routes.AUTH_LOGIN)
  login(@Body() dto: LoginDto) {
    return this.authService.login(dto);
  }
}
