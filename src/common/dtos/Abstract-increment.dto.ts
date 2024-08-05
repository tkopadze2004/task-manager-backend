import { ApiProperty } from '@nestjs/swagger';
import { AbstractIncrementEntity } from '../abstract-increment.entity';

export class AbstractIncrementDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  createdAt: Date;

  updatedAt: Date;

  constructor(entity: AbstractIncrementEntity) {
    this.id = entity.id;
    this.createdAt = entity.createdAt;
    this.updatedAt = entity.updatedAt;
  }
}
