import { ApiProperty } from '@nestjs/swagger';
import { IssueTypeDto } from '../../issue-type/dto/issue-type.dto';
import { IssueType } from '../../issue-type/entities/issue-type.entity';
import { EpicDto } from '../../epics/dto/epic.dto';
import { Epic } from '../../epics/entities/epic.entity';
import { ProjectDto } from '../../project/dto/project.dto';
import { Project } from '../../project/project.entity';
import { BoardDto } from '../../board/dto/board.dto';
import { Board } from '../../board/entities/board.entity';
import { BoardColumnDto } from '../../board/dto/board-column.dto';
import { BoardColumn } from '../../board/entities/board-column.entity';
import { TaskPriorityEnum } from '../../../common/enums/task-priority.enum';
import { TaskStatusEnum } from '../../../common/enums/task-status.enum';
import { UserDto } from '../../user/dto/User.dto';
import { User } from '../../user/entities/user.entity';

export class TaskDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  name: string;

  @ApiProperty()
  description: string;

  @ApiProperty()
  issueTypeId: number;

  @ApiProperty({
    type: () => IssueTypeDto,
  })
  issueType: IssueType;

  @ApiProperty()
  epicId: number;

  @ApiProperty({
    type: () => EpicDto,
  })
  epic: Epic;

  @ApiProperty()
  projectId: number;

  @ApiProperty({
    type: () => ProjectDto,
  })
  project: Project;

  @ApiProperty()
  boardId: number;

  @ApiProperty({
    type: () => BoardDto,
  })
  board: Board;

  @ApiProperty()
  boardColumnId: number;

  @ApiProperty({
    type: () => BoardColumnDto,
  })
  boardColumn: BoardColumn;

  @ApiProperty()
  isBacklog: boolean;

  @ApiProperty({
    enum: TaskPriorityEnum,
    default: TaskPriorityEnum.LOW,
    type: 'enum',
  })
  priority: TaskPriorityEnum;

  @ApiProperty({
    enum: TaskStatusEnum,
    default: TaskStatusEnum.ToDo,
    type: 'enum',
  })
  taskStatus: TaskStatusEnum;

  @ApiProperty()
  assigneeId: number;
  @ApiProperty({
    type: () => UserDto,
  })
  assignee: User;

  @ApiProperty()
  reporterId: number;

  @ApiProperty({
    type: () => UserDto,
  })
  reporter: User;

  @ApiProperty()
  createdById: number;

  @ApiProperty({
    type: () => UserDto,
  })
  createdBy: User;

  @ApiProperty()
  deletedById: number;

  @ApiProperty({
    type: () => UserDto,
  })
  deletedBy: User;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;

  @ApiProperty()
  deletedAt: Date;
}
