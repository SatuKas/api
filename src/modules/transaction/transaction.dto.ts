import { Type } from 'class-transformer';
import {
  IsArray,
  IsDate,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  IsUUID,
  ValidateNested,
} from 'class-validator';

export class CreateTransactionEntryItemDto {
  @IsUUID()
  account_id: string;

  @IsNumber()
  position: number;

  @IsOptional()
  @IsPositive()
  @IsNumber()
  debit?: number;

  @IsOptional()
  @IsPositive()
  @IsNumber()
  credit?: number;
}

export class CreateTransactionEntryDto {
  @IsUUID()
  book_id: string;

  @IsString()
  description: string;

  @IsDate()
  date: Date;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateTransactionEntryItemDto)
  entries: CreateTransactionEntryItemDto[];
}
