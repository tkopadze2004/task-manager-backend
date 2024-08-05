import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  Index,
  ManyToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from '../../user/entities/user.entity';
import { Role } from '../../role/entities/role.entity';

@Entity({ name: 'permissions', orderBy: { createdAt: 'DESC' } })
export class Permission {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @CreateDateColumn({
    type: 'timestamp without time zone',
    name: 'created_at',
    nullable: true,
  })
  createdAt: Date;

  @UpdateDateColumn({
    type: 'timestamp without time zone',
    name: 'updated_at',
    nullable: true,
  })
  updatedAt: Date;

  @DeleteDateColumn({
    type: 'timestamp without time zone',
    name: 'deleted_at',
    nullable: true,
  })
  deletedAt: Date;

  @Column({
    name: 'name',
    nullable: false,
    type: 'character varying',
    length: 50,
  })
  @Index()
  name: string;

  @Column({
    name: 'key',
    nullable: false,
    type: 'character varying',
    length: 50,
  })
  @Index()
  key: string;

  @Column({
    name: 'description',
    nullable: true,
    type: 'character varying',
    length: 255,
  })
  description: string;

  @Column({
    name: 'group_name',
    nullable: false,
    type: 'character varying',
    length: 50,
  })
  @Index()
  groupName: string;

  @Column({
    name: 'group_key',
    nullable: false,
    type: 'character varying',
    length: 50,
  })
  @Index()
  groupKey: string;

  @ManyToMany(() => User, (users) => users.userPermissions)
  users: User[];

  @ManyToMany(() => Role, (roles) => roles.permissions)
  roles: Role[];

  active?: boolean;
}
