import { IsOptional, IsString } from 'class-validator';

export class CreateBookDto {
  @IsString()
  name: string;

  @IsString()
  @IsOptional()
  description?: string;
}
