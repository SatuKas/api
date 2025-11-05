import { ApiProperty } from '@nestjs/swagger';
import { BookModule } from '@prisma/client';
import { JournalType } from '@prisma/client';
import { Decimal } from '@prisma/client/runtime/library';

export class TransactionEntryResponse {
  @ApiProperty({ example: '123e4567-e89b-12d3-a456-426614174000' })
  id: string;

  @ApiProperty({
    example: {
      id: '123e4567-e89b-12d3-a456-426614174000',
      name: 'Kas',
      code: '101',
    },
  })
  account: {
    id: string;
    name: string;
    code: string;
  };

  @ApiProperty({ example: 10000, nullable: true })
  debit: Decimal | null;

  @ApiProperty({ example: 0, nullable: true })
  credit: Decimal | null;

  @ApiProperty({ example: 10000 })
  amount: Decimal;
}

export class TransactionResponse {
  @ApiProperty({ example: '123e4567-e89b-12d3-a456-426614174000' })
  id: string;

  @ApiProperty({ example: 'Pembelian buku' })
  description: string | null;

  @ApiProperty({ example: new Date().toISOString() })
  date: Date;

  @ApiProperty({ example: JournalType.GENERAL })
  type: JournalType;

  @ApiProperty({ example: BookModule.INCOME })
  ref_type: BookModule;

  @ApiProperty({ example: '123e4567-e89b-12d3-a456-426614174000' })
  ref_id: string | null;

  @ApiProperty({ example: new Decimal(10000) })
  total_amount: Decimal;

  @ApiProperty({ type: () => [TransactionEntryResponse] })
  entries: TransactionEntryResponse[];
}
