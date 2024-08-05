import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpCode,
  HttpStatus, Put
} from "@nestjs/common";
import { BoardService } from './board.service';
import { CreateBoardDto } from './dto/create-board.dto';
import { UpdateBoardDto } from './dto/update-board.dto';
import { ApiCreatedResponse, ApiTags } from '@nestjs/swagger';
import { Auth } from '../../decorators/http.decorators';
import { ProjectAccess } from '../../decorators/project.decorator';
import { TaskDto } from '../task/dto/task.dto';
import { BoardDto } from './dto/board.dto';
import { AuthUser } from '../../decorators/auth-user.decorator';
import { UserDto } from '../user/dto/User.dto';
import { HeaderProject } from '../../decorators/project-http.decorator';
import { Project } from '../project/project.entity';
import { DeleteDto } from "../../common/dtos/delete.dto";

@ApiTags('Board')
@Controller('board')
export class BoardController {
  constructor(private readonly boardService: BoardService) {}

  @Post()
  @Auth('board:create')
  @ProjectAccess()
  @HttpCode(HttpStatus.CREATED)
  @ApiCreatedResponse({
    status: HttpStatus.CREATED,
    description: 'Create board',
    type: BoardDto,
  })
  async create(
    @AuthUser() user: UserDto,
    @HeaderProject() project: Project,
    @Body() createBoardDto: CreateBoardDto,
  ): Promise<BoardDto> {
    createBoardDto.projectId = project.id;
    return await this.boardService.create(createBoardDto);
  }

  @Get()
  @Auth('board:list')
  @ProjectAccess()
  @HttpCode(HttpStatus.OK)
  @ApiCreatedResponse({
    status: HttpStatus.OK,
    description: 'Create board',
    type: BoardDto,
    isArray: true,
  })
  async findAll(
    @AuthUser() user: UserDto,
    @HeaderProject() project: Project,
  ): Promise<BoardDto[]> {
    return await this.boardService.findAll(project.id);
  }

  @Get(':id')
  @Auth('board:view')
  @ProjectAccess()
  @HttpCode(HttpStatus.OK)
  @ApiCreatedResponse({
    status: HttpStatus.OK,
    description: 'Get board',
    type: BoardDto,
  })
  async findOne(@Param('id') id: number): Promise<BoardDto> {
    console.log(id)
    return this.boardService.findOne(+id);
  }

  @Put(':id')
  @Auth('board:edit')
  @ProjectAccess()
  @HttpCode(HttpStatus.OK)
  @ApiCreatedResponse({
    status: HttpStatus.OK,
    description: 'Get board',
    type: BoardDto,
  })
  async update(@Param('id') id: string, @Body() updateBoardDto: UpdateBoardDto): Promise<BoardDto> {
    return await this.boardService.update(+id, updateBoardDto);
  }

  @Delete(':id')
  @Auth('board:delete')
  @ProjectAccess()
  @HttpCode(HttpStatus.OK)
  @ApiCreatedResponse({
    status: HttpStatus.OK,
    description: 'Get board',
    type: BoardDto,
  })
  async remove(@Param('id') id: string): Promise<DeleteDto> {
    return await this.boardService.remove(+id);
  }
}
