import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  Index,
  ManyToMany, OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn
} from "typeorm";
import { User } from '../user/entities/user.entity';
import { Board } from "../board/entities/board.entity";

@Entity({ name: 'projects', orderBy: { createdAt: 'DESC' } })
export class Project {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({
    name: 'name',
    nullable: false,
    type: 'character varying',
    length: 50,
  })
  @Index()
  name: string;

  @Column({
    name: 'abbreviation',
    nullable: true,
    type: 'character varying',
    length: 15,
    unique: true,
  })
  abbreviation: string;

  @Column({
    name: 'description',
    nullable: false,
  })
  description: string;

  @Column({
    name: 'color',
    nullable: false,
  })
  color: string;

  @ManyToMany(() => User, (users) => users.projects)
  users: User[];

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


  @OneToMany(() => Board, (board) => board.project)
  boards: Board[];
}
