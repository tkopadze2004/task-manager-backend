import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Board } from './board.entity';
import { TaskStatusEnum } from '../../../common/enums/task-status.enum';
import { Task } from "../../task/entities/task.entity";

@Entity('board_columns')
export class BoardColumn {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column()
  name: string;

  @Column({ nullable: true })
  description: string;

  @Column({ default: 0 })
  position: number;

  @Column({ nullable: true })
  boardId: number;
  @ManyToOne(() => Board, (board) => board.columns)
  board: Board;

  @OneToMany(() => Task, (column) => column.boardColumn)
  tasks: Task[];

  @Column({
    nullable: true,
    type: 'enum',
    enum: TaskStatusEnum,
    enumName: 'task_status_enum',
    default: TaskStatusEnum.ToDo,
  })
  taskStatus: TaskStatusEnum;

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
