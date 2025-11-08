import { ApiProperty } from '@nestjs/swagger';
import { BookModule } from '@prisma/client';
import { JournalType } from '@prisma/client';
import { Decimal } from '@prisma/client/runtime/library';

export class JournalAccountResponse {
  @ApiProperty({ example: '123e4567-e89b-12d3-a456-426614174000' })
  id: string;
  @ApiProperty({ example: 'Kas' })
  name: string;
  @ApiProperty({ example: '101' })
  code: string;
}

export class JournalEntryResponse {
  @ApiProperty({ example: '123e4567-e89b-12d3-a456-426614174000' })
  id: string;
  @ApiProperty({ example: new Decimal(10000) })
  amount: Decimal;
  @ApiProperty({ type: () => JournalAccountResponse })
  account: JournalAccountResponse;
  @ApiProperty({ example: new Decimal(10000), nullable: true })
  debit: Decimal | null;
  @ApiProperty({ example: new Decimal(10000), nullable: true })
  credit: Decimal | null;
  @ApiProperty({ example: 1 })
  position: number;
}

export class JournalListResponse {
  @ApiProperty({ example: '123e4567-e89b-12d3-a456-426614174000' })
  id: string;
  @ApiProperty({ example: new Date().toISOString() })
  date: Date;
  @ApiProperty({ example: 'Pembelian buku' })
  description: string | null;
  @ApiProperty({ example: new Decimal(10000) })
  total_amount: Decimal;
  @ApiProperty({ example: JournalType.GENERAL })
  type: JournalType;
  @ApiProperty({ example: BookModule.INCOME })
  ref_type: BookModule;
  @ApiProperty({ example: '123e4567-e89b-12d3-a456-426614174000' })
  ref_id: string | null;
  @ApiProperty({ type: () => [JournalEntryResponse] })
  entries: JournalEntryResponse[];
}

export class JournalDetailResponse extends JournalListResponse {}
