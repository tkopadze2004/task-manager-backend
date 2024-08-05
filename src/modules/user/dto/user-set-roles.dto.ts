import {
  ApiHideProperty,
  ApiProperty,
  ApiPropertyOptional,
} from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';
import { Trim } from '../../../decorators/transforms.decorator';

export class UserSetRolesDto {
  @ApiProperty()
  userId: number;

  @ApiProperty()
  roleIds: string[];
}
