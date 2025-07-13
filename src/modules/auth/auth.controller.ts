import { Controller, Post, Body, Req } from '@nestjs/common';
import { AuthService } from './services/auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { Public } from 'src/common/decorators/public.decorator';
import { Routes } from 'src/common/enums/routes/routes.enum';
import { ResponseData } from 'src/types/api-response.type';
import {
  LoginResponse,
  RefreshTokenResponse,
  RegisterResponse,
} from './auth.interfaces';
import { SuccessMessage } from 'src/common/enums/message/success-message.enum';
import { RefreshTokenDto } from './dto/refresh-token.dto';

@Controller(Routes.AUTH)
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post(Routes.AUTH_REGISTER)
  async register(
    @Body() dto: RegisterDto,
    @Req() req,
  ): Promise<ResponseData<RegisterResponse>> {
    const ip = req.ip;
    const userAgent = req.headers['user-agent'] || 'unknown';
    const registerData = await this.authService.register(dto, ip, userAgent);
    const registerResponse: RegisterResponse = {
      id: registerData.user.id,
      token: {
        access_token: registerData.tokens.access_token,
        refresh_token: registerData.tokens.refresh_token,
      },
    };
    return {
      message: SuccessMessage.REGISTER_SUCCESS,
      data: registerResponse,
    };
  }

  @Public()
  @Post(Routes.AUTH_LOGIN)
  async login(
    @Body() dto: LoginDto,
    @Req() req,
  ): Promise<ResponseData<LoginResponse>> {
    const ip = req.ip;
    const userAgent = req.headers['user-agent'] || 'unknown';
    const loginData = await this.authService.login(dto, ip, userAgent);

    const loginResponse: LoginResponse = {
      id: loginData.user.id,
      token: {
        access_token: loginData.tokens.access_token,
        refresh_token: loginData.tokens.refresh_token,
      },
    };

    return {
      message: SuccessMessage.LOGIN_SUCCESS,
      data: loginResponse,
    };
  }

  @Public()
  @Post(Routes.AUTH_REFRESH_TOKEN)
  async refreshToken(
    @Body() dto: RefreshTokenDto,
  ): Promise<ResponseData<RefreshTokenResponse>> {
    const refreshTokenData = await this.authService.refreshToken(dto);

    const refreshTokenResponse: RefreshTokenResponse = {
      token: {
        access_token: refreshTokenData.access_token,
        refresh_token: refreshTokenData.refresh_token,
      },
    };
    return {
      message: SuccessMessage.REFRESH_TOKEN_SUCCESS,
      data: refreshTokenResponse,
    };
  }
}
