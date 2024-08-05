import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";

export class CreatePermissionDto {
  @ApiProperty()
  name: string;

  @ApiProperty()
  key: string;

  @ApiProperty()
  description: string;

  @ApiProperty()
  groupName: string;

  @ApiProperty()
  groupKey: string;

  @ApiPropertyOptional()
  active?: boolean;
}
