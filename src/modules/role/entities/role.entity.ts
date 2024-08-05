import { AbstractEntity } from '../../../common/abstract.entity';
import { RoleDto } from '../dto/role.dto';
import { Column, Entity, Index, JoinTable, ManyToMany } from 'typeorm';
import { RoleType } from '../../../common/enums';
import { User } from '../../user/entities/user.entity';
import { Permission } from "./permission.entity";

@Entity({ name: 'roles', orderBy: { createdAt: 'DESC' } })
export class Role extends AbstractEntity<RoleDto> {
  @Column({
    name: 'role_name',
    nullable: false,
    type: 'character varying',
    length: 20,
  })
  @Index()
  name: string;

  @Column({
    name: 'role_type',
    type: 'enum',
    enum: RoleType,
    enumName: 'role_type_enum',
    default: RoleType.Custom,
  })
  @Index()
  type: RoleType;

  @ManyToMany(() => User, (users) => users.roles)
  users: User[];

  @ManyToMany(() => Permission, (permissions) => permissions.roles, {
    cascade: false,
    onDelete: 'RESTRICT',
  })
  @JoinTable({
    name: 'role_permissions',
    joinColumn: {
      name: 'role_id',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'permission_id',
      referencedColumnName: 'id',
    },
  })
  permissions: Permission[];

  dtoClass = RoleDto;
}
