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

export class BalanceSheetAccountResponse {
  @ApiProperty({ example: '1.01.001' })
  code: string;

  @ApiProperty({ example: 'Kas' })
  name: string;

  @ApiProperty({ example: new Decimal(12500000) })
  balance: Decimal;
}

export class BalanceSheetAssetsResponse {
  @ApiProperty({ type: () => [BalanceSheetAccountResponse] })
  currentAssets: BalanceSheetAccountResponse[];

  @ApiProperty({ type: () => [BalanceSheetAccountResponse] })
  fixedAssets: BalanceSheetAccountResponse[];

  @ApiProperty({ example: new Decimal(35500000) })
  totalAssets: Decimal;
}

export class BalanceSheetLiabilitiesResponse {
  @ApiProperty({ type: () => [BalanceSheetAccountResponse] })
  currentLiabilities: BalanceSheetAccountResponse[];

  @ApiProperty({ example: new Decimal(5000000) })
  totalLiabilities: Decimal;
}

export class BalanceSheetEquityResponse {
  @ApiProperty({ type: () => [BalanceSheetAccountResponse] })
  equityAccounts: BalanceSheetAccountResponse[];

  @ApiProperty({ example: new Decimal(30000000) })
  totalEquity: Decimal;
}

export class BalanceSheetCheckResponse {
  @ApiProperty({ example: new Decimal(35500000) })
  assets: Decimal;

  @ApiProperty({ example: new Decimal(35000000) })
  liabilitiesPlusEquity: Decimal;

  @ApiProperty({ example: false })
  isBalanced: boolean;
}

export class BalanceSheetReportResponse {
  @ApiProperty({ example: '2025-01-31' })
  date: Date;

  @ApiProperty({ type: () => BalanceSheetAssetsResponse })
  assets: BalanceSheetAssetsResponse;

  @ApiProperty({ type: () => BalanceSheetLiabilitiesResponse })
  liabilities: BalanceSheetLiabilitiesResponse;

  @ApiProperty({ type: () => BalanceSheetEquityResponse })
  equity: BalanceSheetEquityResponse;

  @ApiProperty({ type: () => BalanceSheetCheckResponse })
  check: BalanceSheetCheckResponse;
}
