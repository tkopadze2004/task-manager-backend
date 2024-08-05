import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Put,
  HttpCode,
  HttpStatus,
  Query,
} from '@nestjs/common';
import { TaskService } from './task.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { ProjectAccess } from '../../decorators/project.decorator';
import { Project } from '../project/project.entity';
import { HeaderProject } from '../../decorators/project-http.decorator';
import { ApiCreatedResponse, ApiTags } from '@nestjs/swagger';
import { Auth } from '../../decorators/http.decorators';
import { TaskDto } from './dto/task.dto';
import { AuthUser } from '../../decorators/auth-user.decorator';
import { UserDto } from '../user/dto/User.dto';
import { DeleteDto } from '../../common/dtos/delete.dto';
import { GetTasksDto } from './dto/get-tasks.dto';

@ApiTags('Tasks')
@Controller('task')
export class TaskController {
  constructor(private readonly taskService: TaskService) {}

  @Post()
  @Auth('task:create')
  @ProjectAccess()
  @HttpCode(HttpStatus.CREATED)
  @ApiCreatedResponse({
    status: HttpStatus.CREATED,
    description: 'Create task',
    type: TaskDto,
  })
  async create(
    @AuthUser() user: UserDto,
    @HeaderProject() project: Project,
    @Body() createTaskDto: CreateTaskDto,
  ): Promise<TaskDto> {
    createTaskDto.createdById = user.id;
    createTaskDto.projectId = project.id;
    return await this.taskService.create(createTaskDto);
  }

  @Get()
  @Auth('task:list')
  @ProjectAccess()
  @HttpCode(HttpStatus.OK)
  @ApiCreatedResponse({
    status: HttpStatus.OK,
    description: 'Create task',
    type: TaskDto,
    isArray: true,
  })
  async findAll(
    @HeaderProject() project: Project,
    @Query() dto: GetTasksDto,
  ): Promise<TaskDto[]> {
    return await this.taskService.findAll(project.id, dto);
  }

  @Get('/my')
  @Auth()
  @HttpCode(HttpStatus.OK)
  @ApiCreatedResponse({
    status: HttpStatus.OK,
    description: 'Create task',
    type: TaskDto,
    isArray: true,
  })
  async findAllMy(
    @AuthUser() user: UserDto
  ): Promise<TaskDto[]> {
    return await this.taskService.findAllMy(user.id);
  }


  @Get(':id')
  @Auth('task:view')
  @ProjectAccess()
  @HttpCode(HttpStatus.OK)
  @ApiCreatedResponse({
    status: HttpStatus.OK,
    description: 'Create task',
    type: TaskDto,
  })
  async findOne(
    @HeaderProject() project: Project,
    @Param('id') id: number,
  ): Promise<TaskDto> {
    return await this.taskService.findOne(+id);
  }



  @Put(':id')
  @Auth('task:update')
  @ProjectAccess()
  @HttpCode(HttpStatus.OK)
  @ApiCreatedResponse({
    status: HttpStatus.OK,
    description: 'Create task',
    type: TaskDto,
  })
  async update(
    @HeaderProject() project: Project,
    @Param('id') id: number,
    @Body() updateTaskDto: UpdateTaskDto,
  ): Promise<TaskDto> {
    return await this.taskService.update(+id, updateTaskDto);
  }

  @Delete(':id')
  @Auth('task:delete')
  @ProjectAccess()
  @HttpCode(HttpStatus.OK)
  @ApiCreatedResponse({
    status: HttpStatus.OK,
    description: 'Delete task',
    type: DeleteDto,
  })
  async remove(
    @HeaderProject() project: Project,
    @Param('id') id: string,
  ): Promise<DeleteDto> {
    return await this.taskService.remove(+id);
  }
}
