import { ApiProperty } from '@nestjs/swagger';
import { AccountCategory, AccountPosition, AccountType } from '@prisma/client';

export class CoaListResponse {
  @ApiProperty({
    description: 'The ID of the COA',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  id: string;

  @ApiProperty({
    description: 'The name of the COA',
    example: 'Cash',
  })
  name: string;

  @ApiProperty({
    description: 'The code of the COA',
    example: '1.01.001',
  })
  code: string;

  @ApiProperty({
    description: 'The description of the COA',
    example: 'Cash in the bank',
  })
  description: string | null;

  @ApiProperty({
    description: 'Whether the COA is active',
    example: true,
  })
  is_active: boolean;

  @ApiProperty({
    description: 'Whether the COA is a parent group',
    example: false,
  })
  is_parent_group: boolean;

  @ApiProperty({
    description: 'The level of the COA',
    example: 1,
  })
  level: number;

  @ApiProperty({
    description: 'The currency of the COA',
    example: 'IDR',
  })
  currency: string;

  @ApiProperty({
    description: 'The position of the COA',
    example: AccountPosition.DEBIT,
  })
  position: AccountPosition;

  @ApiProperty({
    description: 'The type of the COA',
    example: AccountType.CRAS,
  })
  type: AccountType;

  @ApiProperty({
    description: 'The category of the COA',
    example: AccountCategory.ASSET,
  })
  category: AccountCategory;

  @ApiProperty({
    description: 'The ID of the parent COA',
    example: '123e4567-e89b-12d3-a456-426614174000',
    nullable: true,
  })
  parent_id: string | null;
}

export class CoaDetailResponse {
  @ApiProperty({
    description: 'The ID of the COA',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  id: string;

  @ApiProperty({
    description: 'The name of the COA',
    example: 'Cash',
  })
  name: string;

  @ApiProperty({
    description: 'The description of the COA',
    example: 'Cash in the bank',
  })
  description: string | null;

  @ApiProperty({
    description: 'Whether the COA is active',
    example: true,
  })
  is_active: boolean;

  @ApiProperty({
    description: 'Whether the COA is a parent group',
    example: true,
  })
  is_parent_group: boolean;

  @ApiProperty({
    description: 'The level of the COA',
    example: 1,
  })
  level: number;

  @ApiProperty({
    description: 'The currency of the COA',
    example: 'IDR',
  })
  currency: string;

  @ApiProperty({
    description: 'The position of the COA',
    example: AccountPosition.DEBIT,
  })
  position: AccountPosition;

  @ApiProperty({
    description: 'The type of the COA',
    example: AccountType.CRAS,
  })
  type: AccountType;

  @ApiProperty({
    description: 'The category of the COA',
    example: AccountCategory.ASSET,
  })
  category: AccountCategory;
}
