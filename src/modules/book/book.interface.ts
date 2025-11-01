import { ApiProperty } from '@nestjs/swagger';

export type BookListResponse = {
  id: string;
  name: string;
  description: string | null;
  created_at: Date;
  owner: {
    id: string;
    name: string;
    username: string;
  };
};

export class BookDetailResponse {
  @ApiProperty({
    description: 'Book ID',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  id: string;

  @ApiProperty({
    description: 'Book name',
    example: 'General Ledger 2023',
  })
  name: string;

  @ApiProperty({
    description: 'Book description',
    nullable: true,
    example: 'Financial records for fiscal year 2023',
  })
  description: string | null;

  @ApiProperty({
    description: 'Book creation date',
    example: '2023-01-01T00:00:00Z',
  })
  created_at: Date;

  @ApiProperty({
    description: 'Book owner information',
    type: 'object',
    properties: {
      id: {
        type: 'string',
        example: '123e4567-e89b-12d3-a456-426614174000',
      },
    },
  })
  owner: {
    id: string;
  };
}
