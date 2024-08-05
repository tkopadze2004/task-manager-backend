import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  Index,
  JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { PasswordTransformer } from '../password.transformer';
import { Role } from '../../role/entities/role.entity';
import { Project } from '../../project/project.entity';
import { Permission } from '../../role/entities/permission.entity';

@Entity({ name: 'users' })
export class User {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({
    name: 'first_name',
    nullable: true,
    type: 'character varying',
    length: 20,
  })
  @Index()
  firstName: string;

  @Column({
    name: 'last_name',
    nullable: true,
    type: 'character varying',
    length: 50,
  })
  @Index()
  lastName: string;

  @Column({
    unique: true,
    nullable: false,
    type: 'character varying',
    length: 100,
  })
  @Index()
  email: string;

  @Column({
    select: false,
    nullable: true,
    type: 'character varying',
    length: 255,
    transformer: new PasswordTransformer(),
  })
  password: string;

  @Column({
    nullable: true,
    length: 20,
    type: 'character varying',
    name: 'mobile_no',
  })
  @Index()
  mobileNumber: string;

  @Column({ name: 'is_active', default: true, type: 'boolean' })
  @Index()
  isActive: boolean;

  @ManyToMany(() => Permission, (permissions) => permissions.users, {
    cascade: false,
    onDelete: 'RESTRICT',
  })
  @JoinTable({
    name: 'user_permissions',
    joinColumn: {
      name: 'user_id',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'permission_id',
      referencedColumnName: 'id',
    },
  })
  userPermissions: Permission[];

  @ManyToMany(() => Role, (roles) => roles.users, {
    cascade: false,
    onDelete: 'RESTRICT',
  })
  @JoinTable({
    name: 'user_roles',
    joinColumn: {
      name: 'user_id',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'role_id',
      referencedColumnName: 'id',
    },
  })
  roles: Role[];

  @ManyToMany(() => Project, (project) => project.users, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  @JoinTable({
    name: 'user_projects',
    joinColumn: {
      name: 'user_id',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'project_id',
      referencedColumnName: 'id',
    },
  })
  projects: Project[];

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
}
