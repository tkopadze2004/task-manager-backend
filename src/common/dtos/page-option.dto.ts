import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Max,
  Min,
} from 'class-validator';
import { Type } from 'class-transformer';
import { Order } from '../enums';

export class PageOptionDto {
  @ApiPropertyOptional({
    enum: Order,
    default: Order.DESC,
  })
  @IsEnum(Order)
  @IsOptional()
  readonly order: Order = Order.DESC;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  readonly orderBy: string = 'created_at';

  @ApiPropertyOptional({
    minimum: 1,
    default: 1,
  })
  @Type(() => Number)
  @Min(1)
  @IsInt()
  @IsOptional()
  readonly page: number = 1;

  @ApiPropertyOptional({
    minimum: 1,
    maximum: 100,
    default: 10,
  })
  @Type(() => Number)
  @Min(1)
  @Max(100)
  @IsInt()
  @IsOptional()
  readonly limit: number = 10;

  get skip(): number {
    return (this.page - 1) * this.limit;
  }

  @ApiPropertyOptional()
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  readonly search?: string;
}
