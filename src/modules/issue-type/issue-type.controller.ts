import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpCode,
  HttpStatus,
  Put,
} from '@nestjs/common';
import { IssueTypeService } from './issue-type.service';
import { CreateIssueTypeDto } from './dto/create-issue-type.dto';
import { UpdateIssueTypeDto } from './dto/update-issue-type.dto';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { Auth } from '../../decorators/http.decorators';
import { ApiPaginatedResponse } from '../../common/api-pagination-responce';
import { ProjectDto } from '../project/dto/project.dto';
import { IssueTypeDto } from './dto/issue-type.dto';
import { PaginationDto } from '../../common/dtos/page.dto';
import { IssueType } from './entities/issue-type.entity';
import { DeleteDto } from '../../common/dtos/delete.dto';
import { ProjectAccess } from '../../decorators/project.decorator';
import { HeaderProject } from '../../decorators/project-http.decorator';
import { Project } from '../project/project.entity';

@ApiTags('IssueType')
@Controller('issue-type')
@Auth()
export class IssueTypeController {
  constructor(private readonly issueConfigService: IssueTypeService) {}

  @Post()
  @Auth('issueType:create')
  @HttpCode(HttpStatus.CREATED)
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Get issue type list',
    type: IssueTypeDto,
  })
  @ProjectAccess()
  create(
    @HeaderProject() project: Project,
    @Body() createIssueConfigDto: CreateIssueTypeDto,
  ): Promise<IssueTypeDto> {
    createIssueConfigDto.projectId = project.id;
    return this.issueConfigService.create(createIssueConfigDto);
  }

  @Get()
  @Auth('issueType:list')
  @HttpCode(HttpStatus.OK)
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Get issue type list',
    type: IssueTypeDto,
    isArray: true,
  })
  @ProjectAccess()
  async findAll(@HeaderProject() project: Project): Promise<IssueTypeDto[]> {
    return await this.issueConfigService.findAll(project);
  }

  @Get(':id')
  @Auth('issueType:view')
  @HttpCode(HttpStatus.OK)
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Get issue type',
    type: IssueTypeDto,
  })
  @ProjectAccess()
  async findOne(
    @HeaderProject() project: Project,
    @Param('id') id: string,
  ): Promise<IssueTypeDto> {
    return await this.issueConfigService.findOne(+id, project);
  }

  @Put(':id')
  @Auth('issueType:edit')
  @HttpCode(HttpStatus.OK)
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Get issue type',
    type: IssueTypeDto,
  })
  @ProjectAccess()
  async update(
    @HeaderProject() project: Project,
    @Param('id') id: string,
    @Body() updateIssueConfigDto: UpdateIssueTypeDto,
  ): Promise<IssueTypeDto> {
    updateIssueConfigDto.projectId = project.id;
    return await this.issueConfigService.update(+id, updateIssueConfigDto);
  }

  @Delete(':id')
  @Auth('issueType:delete')
  @HttpCode(HttpStatus.OK)
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Delete issue type',
    type: DeleteDto,
  })
  @ProjectAccess()
  async remove(
    @HeaderProject() project: Project,
    @Param('id') id: string,
  ): Promise<DeleteDto> {
    return await this.issueConfigService.remove(+id, project);
  }
}
