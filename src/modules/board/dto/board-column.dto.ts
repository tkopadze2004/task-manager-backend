import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Board } from '../entities/board.entity';
import { BoardDto } from './board.dto';
import { Task } from '../../task/entities/task.entity';
import { TaskDto } from '../../task/dto/task.dto';
import { TaskStatusEnum } from '../../../common/enums/task-status.enum';

export class BoardColumnDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  description: string;

  @ApiProperty()
  position: number;

  @ApiProperty()
  boardId: number;

  @ApiProperty({
    type: () => BoardDto,
  })
  board: Board;

  @ApiProperty({
    type: () => TaskDto,
    isArray: true,
  })
  tasks: Task[];

  @ApiProperty({
    type: 'enum',
    enum: TaskStatusEnum,
    default: TaskStatusEnum.ToDo,
  })
  taskStatus: TaskStatusEnum;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;

  @ApiProperty()
  deletedAt: Date;
}
