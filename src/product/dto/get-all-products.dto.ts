import { Transform } from 'class-transformer';
import { IsOptional, IsInt, Min, Max } from 'class-validator';

const stringToInt = ({ value }: { value: any }) => 
  typeof value === 'string' ? parseInt(value, 10) : value;

export class GetAllProductsDTO {
  @Transform(({ value }) =>
    typeof value === 'string' ? value.split(',').map((v) => v.trim()) : value
  )
  categories?: string[];

  @Transform(stringToInt)
  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(100)
  limit?: number;

  @Transform(stringToInt)
  @IsOptional()
  @IsInt()
  @Min(0)
  offset?: number;

  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}