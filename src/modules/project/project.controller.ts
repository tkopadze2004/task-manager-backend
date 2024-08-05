import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Put,
  Query,
  ValidationPipe,
} from '@nestjs/common';
import { ProjectService } from './project.service';
import { ApiBadGatewayResponse, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ApiPaginatedResponse } from '../../common/api-pagination-responce';
import { Auth } from '../../decorators/http.decorators';
import { ProjectDto } from './dto/project.dto';
import { PaginationDto } from '../../common/dtos/page.dto';
import { ProjectPageOptionsDto } from './dto/project-page-options.dto';
import { CreateProjectDto } from './dto/project-create.dto';
import { DeleteDto } from '../../common/dtos/delete.dto';
import { ExceptionType } from '../../common/exceptions/types/ExceptionType';
import { UpdateProjectDto } from './dto/update-project.dto';
import { AuthUser } from '../../decorators/auth-user.decorator';
import { ProjectUsersDto } from './dto/project-users.dto';
import { ProjectAccess } from '../../decorators/project.decorator';
import { HeaderProject } from '../../decorators/project-http.decorator';
import { Project } from './project.entity';
import { UserDto } from '../user/dto/User.dto';
import { ProjectWithBoardsDto } from "./dto/project-with-boards.dto";

@ApiTags('Projects')
@Controller('project')
export class ProjectController {
  constructor(private readonly projectService: ProjectService) {}

  @Get()
  @Auth('project:list')
  @HttpCode(HttpStatus.OK)
  @ApiPaginatedResponse(ProjectDto)
  async pagination(
    @Query(new ValidationPipe({ transform: true }))
    pageOptionsDto: ProjectPageOptionsDto,
  ): Promise<PaginationDto<ProjectDto>> {
    console.log(pageOptionsDto)
    return await this.projectService.pagination(pageOptionsDto);
  }

  @Get('/all')
  @Auth('project:dropdown')
  @HttpCode(HttpStatus.OK)
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Get project list',
    type: ProjectDto,
    isArray: true,
  })
  async getAll(): Promise<ProjectDto[]> {
    return await this.projectService.getAll();
  }

  @Get('/withBoards')
  @Auth()
  @HttpCode(HttpStatus.OK)
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Get project list',
    type: ProjectWithBoardsDto,
    isArray: true,
  })
  async withBoards(): Promise<ProjectWithBoardsDto[]> {
    return await this.projectService.withBoards();
  }

  @Get('/my')
  @Auth()
  @HttpCode(HttpStatus.OK)
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Get project list',
    type: ProjectDto,
    isArray: true,
  })
  async myProjects(@AuthUser() user): Promise<ProjectDto[]> {
    return await this.projectService.myProjects(user);
  }

  @Post()
  @Auth('project:create')
  @HttpCode(HttpStatus.OK)
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Create project',
    type: ProjectDto,
  })
  async create(
    @AuthUser() user,
    @Body() createOwnerDto: CreateProjectDto,
  ): Promise<ProjectDto> {
    return await this.projectService.create(createOwnerDto, user);
  }

  @Post('users')
  @Auth('project:users:create')
  @HttpCode(HttpStatus.OK)
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Create project',
    type: ProjectDto,
  })
  async setUsers(
    @Body() projectUsersDto: ProjectUsersDto,
  ): Promise<ProjectDto> {
    return await this.projectService.setUsers(projectUsersDto);
  }

  @Delete('users/:userId')
  @Auth('project:users:delete')
  @HttpCode(HttpStatus.OK)
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Get users list by project',
    type: UserDto,
    isArray: true,
  })
  @ProjectAccess()
  async deleteProjectUsers(@HeaderProject() project: Project, @Param('userId') userId: string): Promise<DeleteDto> {
    return await this.projectService.deleteProjectUsers(project, +userId);
  }

  @Get('users')
  @Auth('project:users:list')
  @HttpCode(HttpStatus.OK)
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Get users list by project',
    type: UserDto,
    isArray: true,
  })
  @ProjectAccess()
  async getProjectUsers(@HeaderProject() project: Project): Promise<UserDto[]> {
    return await this.projectService.getProjectUsers(project);
  }

  @Get(':projectId')
  @Auth('project:view')
  @HttpCode(HttpStatus.OK)
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Get project',
    type: ProjectDto,
  })
  async findOne(@Param('projectId') projectId: number): Promise<ProjectDto> {
    return await this.projectService.findOne(projectId);
  }

  @Put(':projectId')
  @Auth('project:edit')
  @HttpCode(HttpStatus.OK)
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Update project',
    type: ProjectDto,
  })
  async update(
    @Param('projectId') projectId: number,
    @Body(new ValidationPipe({ transform: true })) dto: UpdateProjectDto,
  ): Promise<ProjectDto> {
    console.log(dto)
    return await this.projectService.update(projectId, dto);
  }

  @Delete(':projectId')
  @Auth('project:delete')
  @HttpCode(HttpStatus.OK)
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Delete project',
    type: DeleteDto,
  })
  @ApiBadGatewayResponse({
    status: HttpStatus.BAD_REQUEST,
    type: ExceptionType,
  })
  async delete(@Param('projectId') projectId: number): Promise<DeleteDto> {
    return await this.projectService.delete(projectId);
  }
}
