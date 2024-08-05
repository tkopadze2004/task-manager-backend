import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({ name: 'tokens', orderBy: { createdAt: 'DESC' } })
export class Token {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ name: 'user_id' })
  @Index()
  userId: number;

  @Column()
  @Index()
  token: string;

  @Column()
  @Index()
  type: string;

  @Column({ name: 'is_revoked', type: 'boolean', default: false })
  @Index()
  isRevoked: boolean;

  @CreateDateColumn({
    type: 'timestamptz',
    name: 'created_at',
  })
  createdAt: Date;

  @UpdateDateColumn({
    type: 'timestamptz',
    name: 'updated_at',
  })
  updatedAt: Date;
}
