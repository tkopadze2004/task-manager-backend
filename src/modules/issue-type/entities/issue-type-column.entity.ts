import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { IssueType } from './issue-type.entity';

@Entity('issue_type_columns')
export class IssueTypeColumn {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ nullable: false })
  issueTypeId: number;
  @ManyToOne((type) => IssueType, {
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  issueType: IssueType;

  @Column({ nullable: false })
  name: string;

  @Column({ nullable: false })
  filedName: string;

  @Column({ nullable: true })
  isRequired: boolean;

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
