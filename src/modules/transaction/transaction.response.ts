import { ApiProperty } from '@nestjs/swagger';

export class TransactionEntryResponse {
  @ApiProperty({ example: 'uuid-entry-123' })
  id: string;

  @ApiProperty({
    example: {
      id: 'uuid-account-123',
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
  debit: number | null;

  @ApiProperty({ example: 0, nullable: true })
  credit: number | null;

  @ApiProperty({ example: 10000 })
  amount: number;
}

export class TransactionResponse {
  @ApiProperty({
    description: 'The ID of the transaction',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  id: string;

  @ApiProperty({
    description: 'The description of the transaction',
    example: 'Pembelian buku',
  })
  description: string | null;

  @ApiProperty({
    description: 'Date of transaction',
    example: '',
  })
  date: string;

  @ApiProperty({ type: () => [TransactionEntryResponse] })
  entries: TransactionEntryResponse[];
}
