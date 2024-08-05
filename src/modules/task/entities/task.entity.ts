import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { TaskStatusEnum } from '../../../common/enums/task-status.enum';
import { Board } from '../../board/entities/board.entity';
import { BoardColumn } from '../../board/entities/board-column.entity';
import { User } from '../../user/entities/user.entity';
import { Epic } from '../../epics/entities/epic.entity';
import { Project } from '../../project/project.entity';
import { TaskPriorityEnum } from '../../../common/enums/task-priority.enum';
import { IssueType } from '../../issue-type/entities/issue-type.entity';
import { TaskProperty } from './task-property.entity';
import { Permission } from '../../role/entities/permission.entity';

@Entity('tasks')
export class Task {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ nullable: false })
  name: string;

  @Column({ nullable: true, type: 'text' })
  description: string;

  @Column({ nullable: false, default: true, type: 'boolean' })
  isBacklog: boolean;

  @Column({
    nullable: false,
    default: TaskPriorityEnum.LOW,
    type: 'enum',
    enum: TaskPriorityEnum,
  })
  priority: TaskPriorityEnum;

  @Column({
    nullable: true,
    type: 'enum',
    enum: TaskStatusEnum,
    enumName: 'task_status_enum',
    default: TaskStatusEnum.ToDo,
  })
  taskStatus: TaskStatusEnum;

  @Column({ nullable: false })
  projectId: number;
  @ManyToOne((type) => Project, {
    cascade: false,
    nullable: false,
  })
  @JoinColumn()
  project: Project;

  @Column({ nullable: true })
  epicId: number;
  @ManyToOne((type) => Epic, {
    cascade: false,
    nullable: true,
  })
  @JoinColumn()
  epic: Epic;

  @Column({ nullable: true })
  issueTypeId: number;
  @ManyToOne((type) => IssueType, {
    cascade: false,
    nullable: true,
  })
  @JoinColumn()
  issueType: IssueType;

  @Column({ nullable: true })
  boardId: number;
  @ManyToOne((type) => Board, {
    cascade: false,
    nullable: true,
  })
  @JoinColumn()
  board: Board;

  @Column({ nullable: true })
  boardColumnId: number;
  @ManyToOne((type) => BoardColumn, {
    cascade: false,
    nullable: true,
  })
  @JoinColumn()
  boardColumn: BoardColumn;

  @Column({ nullable: true })
  assigneeId: number;

  @ManyToOne(() => User, {
    cascade: false,
    nullable: true,
  })
  @JoinColumn()
  assignee: User;

  @Column({ nullable: true })
  reporterId: number;

  @ManyToOne(() => User, {
    cascade: false,
    nullable: true,
  })
  @JoinColumn()
  reporter: User;

  @Column({ nullable: true })
  createdById: number;
  @ManyToOne((type) => User, {
    cascade: false,
  })
  @JoinColumn()
  createdBy: User;

  @Column({ name: 'deleted_by_id', nullable: true })
  deletedById: number;
  @ManyToOne((type) => User, {
    cascade: false,
    nullable: true,
  })
  @JoinColumn({ name: 'deleted_by_id' })
  deletedBy: User;

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

  @OneToMany(() => TaskProperty, (operationDetail) => operationDetail.task)
  taskProperties: TaskProperty[];
}
