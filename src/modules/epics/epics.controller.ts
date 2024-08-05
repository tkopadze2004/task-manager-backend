import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Put, HttpCode, HttpStatus
} from "@nestjs/common";
import { EpicsService } from './epics.service';
import { CreateEpicDto } from './dto/create-epic.dto';
import { UpdateEpicDto } from './dto/update-epic.dto';
import { ApiCreatedResponse, ApiTags } from "@nestjs/swagger";
import { ProjectAccess } from '../../decorators/project.decorator';
import { HeaderProject } from '../../decorators/project-http.decorator';
import { Project } from '../project/project.entity';
import { Auth } from '../../decorators/http.decorators';
import { BoardDto } from "../board/dto/board.dto";
import { EpicDto } from "./dto/epic.dto";
import { DeleteDto } from "../../common/dtos/delete.dto";

@ApiTags('Epic')
@Controller('epics')
export class EpicsController {
  constructor(private readonly epicsService: EpicsService) {}

  @Post()
  @Auth('epic:create')
  @ProjectAccess()
  @HttpCode(HttpStatus.CREATED)
  @ApiCreatedResponse({
    status: HttpStatus.CREATED,
    description: 'Create board',
    type: EpicDto,
  })
  async create(
    @HeaderProject() project: Project,
    @Body() createEpicDto: CreateEpicDto,
  ): Promise<EpicDto> {
    createEpicDto.projectId = project.id;
    return this.epicsService.create(createEpicDto);
  }

  @Get()
  @Auth('epic:list')
  @ProjectAccess()
  @HttpCode(HttpStatus.CREATED)
  @ApiCreatedResponse({
    status: HttpStatus.CREATED,
    description: 'Create board',
    type: EpicDto,
    isArray: true,
  })
  async findAll(@HeaderProject() project: Project): Promise<EpicDto[]> {
    return await this.epicsService.findAll(project.id);
  }

  @Get(':id')
  @Auth('epic:view')
  @ProjectAccess()
  @HttpCode(HttpStatus.CREATED)
  @ApiCreatedResponse({
    status: HttpStatus.CREATED,
    description: 'Create board',
    type: EpicDto,
    isArray: true,
  })
  async findOne(@HeaderProject() project: Project, @Param('id') id: string) {
    return this.epicsService.findOne(+id);
  }

  @Put(':id')
  @Auth('epic:edit')
  @ProjectAccess()
  @HttpCode(HttpStatus.CREATED)
  @ApiCreatedResponse({
    status: HttpStatus.CREATED,
    description: 'Create board',
    type: EpicDto,
    isArray: true,
  })
  async update(
    @HeaderProject() project: Project,
    @Param('id') id: string,
    @Body() updateEpicDto: UpdateEpicDto,
  ) {
    return this.epicsService.update(+id, updateEpicDto);
  }

  @Delete(':id')
  @Auth('epic:delete')
  @ProjectAccess()
  @HttpCode(HttpStatus.CREATED)
  @ApiCreatedResponse({
    status: HttpStatus.CREATED,
    description: 'Create board',
    type: EpicDto,
    isArray: true,
  })
  async remove(@HeaderProject() project: Project, @Param('id') id: string): Promise<DeleteDto> {
    return this.epicsService.remove(+id);
  }
}
