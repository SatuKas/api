import {
  IsBoolean,
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsString,
  IsDate,
  MinLength,
} from 'class-validator';
import { UserRole } from 'src/common/enums/role/user-role.enum';

export class CreateUserDto {
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(6)
  password: string;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  username: string;
}

export class ChangePasswordDto {
  @IsString()
  @MinLength(6)
  newPassword: string;
}

export class UpdateUserDto {
  @IsString()
  name?: string;

  @IsString()
  @IsNotEmpty()
  username?: string;

  @IsEmail()
  email?: string;

  @IsString()
  @MinLength(6)
  password?: string;

  @IsEnum(UserRole)
  role?: UserRole;

  @IsBoolean()
  isVerified?: boolean;

  @IsDate()
  verifiedAt?: Date;
}
