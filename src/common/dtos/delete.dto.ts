import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class DeleteDto {
  @ApiProperty()
  deleted: boolean;

  @ApiPropertyOptional()
  message?: string;
}
