import { AccountCategory, AccountPosition, AccountType } from '@prisma/client';
import {
  IsBoolean,
  IsEnum,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  IsUUID,
  Matches,
} from 'class-validator';

export class CreateCoaDto {
  @IsUUID()
  book_id: string;

  @IsString()
  name: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  @Matches(/^[0-9\.]+$/, { message: 'Code must be a number or dot' })
  code: string;

  @IsEnum(AccountType)
  type: AccountType;

  @IsOptional()
  @IsNumber()
  @IsPositive()
  balance?: number;

  @IsOptional()
  @IsUUID()
  parent_id?: string;

  @IsOptional()
  @IsEnum(AccountCategory)
  category?: AccountCategory;

  @IsOptional()
  @IsBoolean()
  is_parent_group?: boolean;

  @IsEnum(AccountPosition)
  @IsOptional()
  position?: AccountPosition;
}

export class UpdateCoaDto {
  @IsUUID()
  book_id: string;

  @IsString()
  name: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsBoolean()
  @IsOptional()
  is_active?: boolean;
}
