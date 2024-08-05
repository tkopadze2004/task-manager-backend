import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { TaskPriorityEnum } from '../../../common/enums/task-priority.enum';
import { TaskStatusEnum } from '../../../common/enums/task-status.enum';
import { IssueTypeColumnDto } from '../../issue-type/dto/issue-type-column.dto';
import { CreateTaskPropertyDto } from './create-task-property.dto';
import { IsBoolean, IsNotEmpty, IsString } from "class-validator";

export class CreateTaskDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  name: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  description: string;

  @IsNotEmpty()
  @ApiProperty()
  issueTypeId: number;

  @ApiProperty({
    type: () => CreateTaskPropertyDto,
    isArray: true,
  })
  taskProperty: CreateTaskPropertyDto[];

  @ApiPropertyOptional()
  epicId: number;

  @ApiProperty()
  boardId: number;

  @ApiPropertyOptional()
  boardColumnId: number;

  @IsNotEmpty()
  @IsBoolean()
  @ApiProperty()
  isBacklog: boolean;

  @IsNotEmpty()
  @ApiProperty({
    enum: TaskPriorityEnum,
    default: TaskPriorityEnum.LOW,
    type: 'enum',
  })
  priority: TaskPriorityEnum;

  @IsNotEmpty()
  @ApiProperty({
    enum: TaskStatusEnum,
    default: TaskStatusEnum.ToDo,
    type: 'enum',
  })
  taskStatus: TaskStatusEnum;

  @ApiPropertyOptional()
  assigneeId: number;

  @ApiProperty()
  reporterId: number;

  projectId: number;
  createdById: number;
}
