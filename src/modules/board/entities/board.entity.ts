import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity, JoinColumn, ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn
} from "typeorm";
import { BoardColumn } from './board-column.entity';
import { Task } from '../../task/entities/task.entity';
import { Project } from "../../project/project.entity";

@Entity('boards')
export class Board {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column()
  name: string;

  @Column({ nullable: true })
  description: string;

  @Column({ default: 0 })
  position: number;

  @Column({ nullable: false })
  projectId: number;
  @ManyToOne((type) => Project, {
    cascade: false,
    nullable: false,
  })
  @JoinColumn()
  project: Project;

  @OneToMany(() => BoardColumn, (column) => column.board)
  columns: BoardColumn[];

  @OneToMany(() => Task, (column) => column.board)
  tasks: Task[];

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
