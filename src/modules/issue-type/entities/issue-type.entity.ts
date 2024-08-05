import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { IssueTypeColumn } from './issue-type-column.entity';
import { IssueTypeEnum } from '../../../common/enums/issue-type.enum';
import { Project } from '../../project/project.entity';

@Entity('issue_types')
export class IssueType {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({
    name: 'name',
    nullable: false,
    type: 'character varying',
    length: 50,
  })
  name: string;

  @Column({
    name: 'description',
    nullable: true,
    type: 'character varying',
  })
  description: string;

  @Column({
    name: 'icon',
    nullable: true,
    type: 'character varying',
  })
  icon: string;

  @Column({
    name: 'color',
    nullable: true,
    type: 'character varying',
  })
  color: string;

  @Column({
    name: 'is_active',
    nullable: false,
    type: 'boolean',
    default: true,
  })
  isActive: boolean;

  @Column({
    name: 'type',
    enum: IssueTypeEnum,
    enumName: 'issue_type_enum',
    nullable: false,
    type: 'enum',
    default: IssueTypeEnum.Task,
  })
  type: string;

  @Column({ nullable: false })
  projectId: number;
  @ManyToOne((type) => Project, {
    cascade: false,
    nullable: false,
  })
  @JoinColumn()
  project: Project;

  @OneToMany(
    () => IssueTypeColumn,
    (issueTypeColumn) => issueTypeColumn.issueType,
  )
  issueTypeColumns: IssueTypeColumn[];

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
