import { IsEmail, IsString, IsUUID } from 'class-validator';

export class LoginDto {
  @IsEmail()
  email: string;

  @IsString()
  password: string;
}

export class LogoutByDeviceIdDto {
  @IsUUID()
  device_id: string;
}
