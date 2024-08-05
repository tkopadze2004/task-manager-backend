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
import {
  ApiCreatedResponse,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { UserDto } from './dto/User.dto';
import { UsersPageOptionsDto } from './dto/users-page-options.dto';
import { UserService } from './user.service';
import { UserCreateDto } from './dto/user-create.dto';
import { UserUpdateDto } from './dto/UserUpdateDto';
import { PaginationDto } from '../../common/dtos/page.dto';
import { Auth } from '../../decorators/http.decorators';
import { PasswordUpdateDto } from './dto/password-update.dto';
import { AuthUser } from '../../decorators/auth-user.decorator';
import { DeleteDto } from '../../common/dtos/delete.dto';
import { ApiPaginatedResponse } from '../../common/api-pagination-responce';
import { Permission } from '../../decorators/permission.decorator';
import { UserSetRolesDto } from './dto/user-set-roles.dto';
import { ProjectAccess } from '../../decorators/project.decorator';
import { HeaderProject } from '../../decorators/project-http.decorator';
import { Project } from '../project/project.entity';
import { AllUsersDto } from "./dto/all-users.dto";

@Controller('users')
@ApiTags('Users')
export class UserController {
  constructor(private userService: UserService) {}

  @Get()
  @Auth('user:list')
  @HttpCode(HttpStatus.OK)
  @ApiPaginatedResponse(UserDto)
  async pagination(
    @Query(new ValidationPipe({ transform: true }))
    pageOptionsDto: UsersPageOptionsDto,
  ): Promise<PaginationDto<UserDto>> {
    return await this.userService.pagination(pageOptionsDto);
  }

  @Get('/all')
  @Auth('user:dropdown')
  @HttpCode(HttpStatus.OK)
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Get users list',
    type: UserDto,
    isArray: true,
  })
  async getAllUsers(
    @Query(new ValidationPipe({ transform: true })) dto: AllUsersDto,
  ): Promise<UserDto[]> {
    return await this.userService.getAllUsers(dto);
  }

  @Post()
  @ApiOperation({ summary: 'user:create' })
  @Auth('user:create')
  @HttpCode(HttpStatus.CREATED)
  @ApiCreatedResponse({
    status: HttpStatus.CREATED,
    description: 'Create user',
    type: UserDto,
  })
  async create(
    @Body(new ValidationPipe({ transform: true }))
    dto: UserCreateDto,
  ): Promise<UserDto> {
    return await this.userService.create(dto);
  }

  @Post('roles')
  @Auth('user:setRoles')
  @HttpCode(HttpStatus.OK)
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Create set roles',
    type: UserDto,
  })
  async setRoles(
    @Body(new ValidationPipe({ transform: true }))
    dto: UserSetRolesDto,
  ): Promise<UserDto> {
    return await this.userService.setRoles(dto);
  }

  @Get(':id')
  @Permission('user:view')
  @Auth()
  @HttpCode(HttpStatus.OK)
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Get users by userId',
    type: UserDto,
  })
  getUser(
    @Param('id') userId: number,
  ): Promise<UserDto> {
    return this.userService.findOne(userId);
  }

  @Put(':id')
  @Auth('user:edit')
  @HttpCode(HttpStatus.OK)
  async update(
    @Param('id') userId: number,
    @Body(new ValidationPipe({ transform: true })) dto: UserUpdateDto,
  ): Promise<UserDto> {
    return await this.userService.update(userId, dto);
  }

  @Delete(':id')
  @Auth('user:delete')
  @HttpCode(HttpStatus.OK)
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Delete user',
    type: DeleteDto,
  })
  async delete(@Param('id') userId: number): Promise<DeleteDto> {
    return await this.userService.delete(userId);
  }

  @Post('passwordUpdate')
  @Auth()
  @HttpCode(HttpStatus.CREATED)
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Password Update',
  })
  passwordUpdate(
    @AuthUser() user: any,
    @Body() passwordUpdateDto: PasswordUpdateDto,
  ) {
    passwordUpdateDto.userId = user.id;
    return this.userService.passwordUpdate(passwordUpdateDto);
  }
}
