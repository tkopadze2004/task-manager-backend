import { ApiProperty } from '@nestjs/swagger';
import { IsArray } from "class-validator";
import { Type } from "@nestjs/common/interfaces";

interface IPageMeta {
  totalCount: number;
  page: number;
  limit: number;
}

export class PaginationDto<T> {
  @IsArray()
  @ApiProperty({
    isArray: true
  })
  readonly data: T[];

  @ApiProperty()
  readonly totalCount: number;

  @ApiProperty()
  readonly page: number;

  @ApiProperty()
  readonly limit: number;

  constructor(data: T[], { totalCount, page, limit }: IPageMeta) {
    this.data = data;
    this.totalCount = totalCount;
    this.page = page;
    this.limit = limit;
  }
}
