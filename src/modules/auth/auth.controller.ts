import {
  Controller,
  Post,
  Body,
  Req,
  Param,
  Get,
  Header,
} from '@nestjs/common';
import { AuthService } from './services/auth.service';
import {
  ForgotPasswordDto,
  LoginDto,
  RegisterDto,
  ResetPasswordDto,
  VerifyEmailDto,
} from 'src/modules/auth/dto/auth.dto';
import { Public } from 'src/common/decorators/public.decorator';
import { Routes } from 'src/common/enums/routes/routes.enum';
import { ResponseData } from 'src/types/api-response.type';
import {
  LoginResponse,
  RefreshTokenResponse,
  RegisterResponse,
} from 'src/modules/auth/auth.interfaces';
import { SuccessMessage } from 'src/common/enums/message/success-message.enum';
import { RefreshTokenDto } from 'src/modules/auth/dto/refresh-token.dto';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';

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
        access_token: registerData.tokens.token.access_token,
        refresh_token: registerData.tokens.token.refresh_token,
      },
      expires: {
        access_token: registerData.tokens.expires.access_token,
        refresh_token: registerData.tokens.expires.refresh_token,
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
        access_token: loginData.tokens.token.access_token,
        refresh_token: loginData.tokens.token.refresh_token,
      },
      expires: {
        access_token: loginData.tokens.expires.access_token,
        refresh_token: loginData.tokens.expires.refresh_token,
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
        access_token: refreshTokenData.token.access_token,
        refresh_token: refreshTokenData.token.refresh_token,
      },
      expires: {
        access_token: refreshTokenData.expires.access_token,
        refresh_token: refreshTokenData.expires.refresh_token,
      },
    };
    return {
      message: SuccessMessage.REFRESH_TOKEN_SUCCESS,
      data: refreshTokenResponse,
    };
  }

  @Post(Routes.AUTH_LOGOUT)
  async logout(
    @CurrentUser('sub') userId: string,
    @CurrentUser('device_id') deviceId: string,
  ): Promise<ResponseData<null>> {
    await this.authService.logout({
      device_id: deviceId,
      user_id: userId,
    });
    return {
      message: SuccessMessage.LOGOUT_SUCCESS,
      data: null,
    };
  }

  @Public()
  @Post(Routes.AUTH_LOGOUT_BY_DEVICE_ID)
  async logoutByDeviceId(
    @Param('device_id') deviceId: string,
  ): Promise<ResponseData<null>> {
    await this.authService.logout({
      device_id: deviceId,
    });
    return {
      message: SuccessMessage.LOGOUT_SUCCESS,
      data: null,
    };
  }

  @Public()
  @Post(Routes.AUTH_EMAIL_VERIFY)
  async verifyEmail(@Body() dto: VerifyEmailDto): Promise<ResponseData<null>> {
    const verifyData = await this.authService.verifyEmail(dto.token);
    return {
      message: verifyData.message,
      data: null,
    };
  }

  @Post(Routes.AUTH_RESEND_VERIFICATION)
  async resendVerification(
    @CurrentUser('sub') userId: string,
  ): Promise<ResponseData<null>> {
    const resendData = await this.authService.resendVerification(userId);
    return {
      message: resendData.message,
      data: null,
    };
  }

  @Public()
  @Get(Routes.AUTH_VERIFY_EMAIL_FROM_LINK)
  @Header('Content-Type', 'text/html')
  async verifyEmailFromLink(@Param('token') token: string) {
    const html = await this.authService.verifyEmailViaBackend(token);
    return html;
  }

  @Public()
  @Post(Routes.AUTH_FORGOT_PASSWORD)
  async forgotPassword(@Body() dto: ForgotPasswordDto) {
    await this.authService.forgotPassword(dto);

    return { message: SuccessMessage.FORGOT_PASSWORD_SUCCESS, data: null };
  }

  @Public()
  @Post(Routes.AUTH_RESET_PASSWORD)
  async resetPassword(@Body() dto: ResetPasswordDto) {
    await this.authService.resetPassword(dto);

    return { message: SuccessMessage.RESET_PASSWORD_SUCCESS, data: null };
  }
}
