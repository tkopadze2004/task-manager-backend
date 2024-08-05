import { PageOptionDto } from '../../../common/dtos/page-option.dto';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsOptional } from 'class-validator';

export class UsersPageOptionsDto extends PageOptionDto {
  @ApiPropertyOptional({
    enum: ['true', 'false'],
    default: 'true',
  })
  @IsEnum(['true', 'false'])
  readonly isActive: string = 'true';
}
