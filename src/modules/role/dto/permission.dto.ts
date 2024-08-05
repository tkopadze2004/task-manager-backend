import { AbstractDto } from '../../../common/dtos/Abstract.dto';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { RoleType } from '../../../common/enums';
import { Permission } from '../entities/permission.entity';
import { Role } from '../../role/entities/role.entity';

export class PermissionDto {
  @ApiProperty()
  id: string;

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

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;

  @ApiProperty()
  deletedAt: Date;
}
