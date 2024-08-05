import {
  ApiHideProperty,
  ApiProperty,
  ApiPropertyOptional,
} from '@nestjs/swagger';

import type { User } from '../entities/user.entity';
import { Role } from '../../role/entities/role.entity';
import { Project } from '../../project/project.entity';
import { Permission } from '../../role/entities/permission.entity';

export class UserDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  createdAt: Date;

  updatedAt: Date;
  deletedAt: Date;

  @ApiProperty()
  firstName: string;

  @ApiProperty()
  lastName: string;

  @ApiProperty()
  email: string;

  @ApiProperty()
  mobileNumber: string;

  @ApiHideProperty()
  password: string;

  @ApiProperty()
  isActive: boolean;

  @ApiProperty()
  userPermissions: Permission[];

  @ApiProperty()
  roles: Role[];

  @ApiProperty()
  projects: Project[];

  constructor(user: User) {
    this.id = user.id;
    this.createdAt = user.createdAt;
    this.updatedAt = user.updatedAt;
    this.deletedAt = user.deletedAt;
    this.firstName = user.firstName;
    this.lastName = user.lastName;
    this.email = user.email;
    this.mobileNumber = user.mobileNumber;
    this.password = user.password;
    this.isActive = user.isActive;
    this.userPermissions = user.userPermissions;
    this.roles = user.roles;
    this.projects = user.projects;
  }
}
