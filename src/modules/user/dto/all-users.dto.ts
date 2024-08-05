import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsOptional, IsString } from "class-validator";

export class AllUsersDto {
  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  search: string;
}
