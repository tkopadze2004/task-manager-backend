import { AbstractDto } from './dtos/Abstract.dto';
import {
  CreateDateColumn,
  DeleteDateColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { UtilsService } from '../providers/utils.service';
import { Exclude } from 'class-transformer';
import { AbstractIncrementDto } from './dtos/Abstract-increment.dto';
import { AbstractEntity } from './abstract.entity';

export abstract class AbstractIncrementEntity<
  T extends AbstractIncrementDto = AbstractIncrementDto,
> {
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

  @Exclude()
  abstract dtoClassIncrement: new (
    entity: AbstractIncrementEntity,
    options?: any,
  ) => T;

  toDto(options?: any): T {
    return UtilsService.toDto(this.dtoClassIncrement, this, options);
  }
}
