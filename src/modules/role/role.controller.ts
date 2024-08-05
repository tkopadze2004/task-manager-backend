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
import { RoleService } from './role.service';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { ApiBadGatewayResponse, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Auth } from '../../decorators/http.decorators';
import { DeleteDto } from '../../common/dtos/delete.dto';
import { ExceptionType } from '../../common/exceptions/types/ExceptionType';
import { ApiPaginatedResponse } from '../../common/api-pagination-responce';
import { PaginationDto } from '../../common/dtos/page.dto';
import { RolePageOptionsDto } from './dto/role-page-options.dto';
import { RoleDto } from './dto/role.dto';
import { AuthUser } from '../../decorators/auth-user.decorator';
import { User } from '../user/entities/user.entity';
import { RoleSetPermissionsDto } from './dto/role-set-permissions.dto';
import { Permission } from './entities/permission.entity';

@ApiTags('Roles')
@Controller('role')
export class RoleController {
  constructor(private readonly roleService: RoleService) {}

  @Get()
  @Auth('role:list')
  @HttpCode(HttpStatus.OK)
  @ApiPaginatedResponse(RoleDto)
  async pagination(
    @Query(new ValidationPipe({ transform: true }))
    pageOptionsDto: RolePageOptionsDto,
  ): Promise<PaginationDto<RoleDto>> {
    return await this.roleService.pagination(pageOptionsDto);
  }

  @Get('/permission')
  @Auth('permission:list')
  @HttpCode(HttpStatus.OK)
  async getAllPermissions(): Promise<Permission[]> {
    return await this.roleService.getAllPermissions();
  }

  @Get('/my')
  @Auth()
  @HttpCode(HttpStatus.OK)
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Get role my',
    type: RoleDto,
    isArray: true,
  })
  async myRoles(@AuthUser() user: User): Promise<RoleDto[]> {
    return await this.roleService.myRoles(user);
  }

  @Get('/all')
  @Auth('role:dropdown')
  @HttpCode(HttpStatus.OK)
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Get role list',
    type: RoleDto,
    isArray: true,
  })
  async getAllUsers(): Promise<RoleDto[]> {
    const roles = await this.roleService.getAll();
    return roles;
  }

  @Post()
  @Auth('role:create')
  @HttpCode(HttpStatus.OK)
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Create role',
    type: RoleDto,
  })
  async create(@Body() createOwnerDto: CreateRoleDto): Promise<RoleDto> {
    return await this.roleService.create(createOwnerDto);
  }

  @Post('permissions')
  @Auth('role:permission:create')
  @HttpCode(HttpStatus.OK)
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Create role',
    type: RoleDto,
  })
  async setPermissions(
    @Body() createOwnerDto: RoleSetPermissionsDto,
  ): Promise<RoleDto> {
    return await this.roleService.setPermissionsToRole(createOwnerDto);
  }

  @Get(':roleId')
  @Auth('role:view')
  @HttpCode(HttpStatus.OK)
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Get role',
    type: RoleDto,
  })
  async findOne(@Param('roleId') roleId: string): Promise<RoleDto> {
    return await this.roleService.findOne(roleId);
  }

  @Get('/permissions/:roleId')
  @Auth('role:permission:view')
  @HttpCode(HttpStatus.OK)
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Get role',
    type: RoleDto,
    isArray: true,
  })
  async getPermissions(@Param('roleId') roleId: string): Promise<any> {
    return await this.roleService.getPermissions(roleId);
  }

  @Put(':roleId')
  @Auth('role:edit')
  @HttpCode(HttpStatus.OK)
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Update role',
    type: RoleDto,
  })
  async update(
    @Param('roleId') roleId: string,
    @Body(new ValidationPipe({ transform: true })) dto: UpdateRoleDto,
  ): Promise<RoleDto> {
    return await this.roleService.update(roleId, dto);
  }

  @Delete(':roleId')
  @Auth('role:delete')
  @HttpCode(HttpStatus.OK)
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Delete role',
    type: DeleteDto,
  })
  @ApiBadGatewayResponse({
    status: HttpStatus.BAD_REQUEST,
    type: ExceptionType,
  })
  async delete(@Param('roleId') roleId: string): Promise<DeleteDto> {
    return await this.roleService.delete(roleId);
  }
}
