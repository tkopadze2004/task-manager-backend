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

export class RoleSetPermissionsDto {
  @ApiProperty()
  roleId: string;

  @ApiProperty()
  permissions: string[];
}
