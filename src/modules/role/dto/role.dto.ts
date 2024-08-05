import { AbstractDto } from '../../../common/dtos/Abstract.dto';
import { ApiProperty } from '@nestjs/swagger';
import { Role } from '../entities/role.entity';
import { RoleType } from '../../../common/enums';
import { Permission } from "../entities/permission.entity";

export class RoleDto extends AbstractDto {
  @ApiProperty()
  name: string;

  @ApiProperty({
    enum: RoleType,
  })
  type: RoleType;

  @ApiProperty()
  permissions: Permission[];

  constructor(entity: Role) {
    super(entity);
    this.name = entity.name;
    this.type = entity.type;
    this.permissions = entity.permissions;
  }
}
