import { BookModule, JournalType } from '@prisma/client';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsDate,
  IsEnum,
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

  @Type(() => Date)
  @IsDate()
  date: Date;

  @IsEnum(JournalType)
  type: JournalType;

  @IsEnum(BookModule)
  ref_type: BookModule;

  @IsString()
  @IsOptional()
  ref_id?: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateTransactionEntryItemDto)
  entries: CreateTransactionEntryItemDto[];
}
