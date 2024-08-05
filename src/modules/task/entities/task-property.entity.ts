import {
  Column,
  Entity,
  JoinColumn,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Task } from './task.entity';
import { User } from '../../user/entities/user.entity';

@Entity('task_properties')
export class TaskProperty {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ nullable: false })
  taskId: number;
  @ManyToOne((type) => Task, {
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  task: Task;

  @Column({ nullable: true })
  name: string;

  @Column({ nullable: true })
  filedName: string;

  @Column({ nullable: true })
  value: string;

  @Column({ nullable: true })
  isRequired: true;
}
