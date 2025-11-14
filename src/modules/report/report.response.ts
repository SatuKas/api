import { ApiProperty } from '@nestjs/swagger';
import { AccountPosition } from '@prisma/client';
import { Decimal } from '@prisma/client/runtime/library';

export class LedgerAccountResponse {
  @ApiProperty({ example: '123e4567-e89b-12d3-a456-426614174000' })
  id: string;

  @ApiProperty({ example: '1-100' })
  code: string;

  @ApiProperty({ example: 'Kas' })
  name: string;

  @ApiProperty({ example: AccountPosition.DEBIT })
  position: AccountPosition;
}

export class LedgerEntryResponse {
  @ApiProperty({ example: '2025-01-10' })
  date: Date;

  @ApiProperty({ example: 'Pembelian alat tulis', nullable: true })
  description: string | null;

  @ApiProperty({ example: 'JRN-001' })
  ref: string;

  @ApiProperty({ example: new Decimal(0) })
  debit: Decimal;

  @ApiProperty({ example: new Decimal(100000) })
  credit: Decimal;

  @ApiProperty({ example: new Decimal(400000) })
  balance: Decimal;
}

export class LedgerReportResponse {
  @ApiProperty({ type: () => LedgerAccountResponse })
  account: LedgerAccountResponse;

  @ApiProperty({ example: new Decimal(500000) })
  openingBalance: Decimal;

  @ApiProperty({ type: () => [LedgerEntryResponse] })
  entries: LedgerEntryResponse[];

  @ApiProperty({ example: new Decimal(250000) })
  totalDebit: Decimal;

  @ApiProperty({ example: new Decimal(100000) })
  totalCredit: Decimal;

  @ApiProperty({ example: new Decimal(650000) })
  closingBalance: Decimal;
}
