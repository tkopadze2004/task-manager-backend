import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Project } from '../../project/project.entity';
import { ProjectDto } from '../../project/dto/project.dto';
import { BoardColumn } from '../entities/board-column.entity';
import { BoardColumnDto } from './board-column.dto';
import { Task } from '../../task/entities/task.entity';
import { TaskDto } from '../../task/dto/task.dto';

export class BoardDto {
  @ApiProperty()
  @IsNotEmpty()
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
  @IsNotEmpty()
  position: number;

  @ApiProperty()
  projectId: number;

  @ApiProperty({
    type: () => ProjectDto,
  })
  project: Project;

  @ApiProperty({
    type: () => BoardColumnDto,
    isArray: true,
  })
  columns: BoardColumn[];

  @ApiProperty({
    type: () => TaskDto,
    isArray: true,
  })
  tasks: Task[];

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;

  @ApiProperty()
  deletedAt: Date;
}
