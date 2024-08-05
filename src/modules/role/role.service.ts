import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { getManager, getRepository, In, Repository } from 'typeorm';
import { PaginationDto } from '../../common/dtos/page.dto';
import { snakeCase } from 'typeorm/util/StringUtils';
import { ExceptionType } from '../../common/exceptions/types/ExceptionType';
import { DeleteDto } from '../../common/dtos/delete.dto';
import { RolePageOptionsDto } from './dto/role-page-options.dto';
import { RoleType } from '../../common/enums';
import { Role } from './entities/role.entity';
import { RoleDto } from './dto/role.dto';
import { User } from '../user/entities/user.entity';
import { RoleSetPermissionsDto } from './dto/role-set-permissions.dto';
import { Permission } from './entities/permission.entity';
import { PermissionDto } from './dto/permission.dto';

@Injectable()
export class RoleService {
  constructor(
    @InjectRepository(Role)
    private readonly repository: Repository<Role>,
  ) {}

  async pagination(
    pageOptionsDto: RolePageOptionsDto,
  ): Promise<PaginationDto<RoleDto>> {
    const { search, type } = pageOptionsDto;
    try {
      const queryBuilder = this.repository
        .createQueryBuilder('role')
        .where('1=1');
      if (search) {
        queryBuilder.andWhere(`role.name ILIKE '%${search}%'`);
      }
      if (type) {
        queryBuilder.andWhere(`role.type = :type`, { type: type });
      }
      const totalCount = await queryBuilder.getCount();
      const items = await queryBuilder
        .orderBy(
          `role.${snakeCase(pageOptionsDto.orderBy)}`,
          pageOptionsDto.order,
        )
        .offset(pageOptionsDto.skip)
        .limit(pageOptionsDto.limit)
        .getMany();
      return new PaginationDto(items, {
        totalCount,
        page: pageOptionsDto.page,
        limit: pageOptionsDto.limit,
      });
    } catch (e) {
      throw new ExceptionType(e.statusCode, e.message);
    }
  }

  async getAll(): Promise<RoleDto[]> {
    try {
      return await this.repository.find();
    } catch (e) {
      throw new ExceptionType(e.statusCode, e.message);
    }
  }

  async create(createRoleDto: CreateRoleDto): Promise<RoleDto> {
    try {
      const role = new Role();
      role.name = createRoleDto.name;
      role.type = RoleType.Custom;
      const created = await this.repository.save(role);
      return created.toDto();
    } catch (e) {
      throw new ExceptionType(e.statusCode, e.message);
    }
  }

  async findOne(roleId: string): Promise<RoleDto> {
    try {
      const role = await this.repository.findOne({
        where: { id: roleId },
        relations: ['permissions'],
      });
      return role.toDto();
    } catch (e) {
      throw new ExceptionType(e.statusCode, e.message);
    }
  }

  async update(roleId: string, dto: UpdateRoleDto): Promise<RoleDto> {
    try {
      await this.repository.update(
        { id: roleId },
        {
          name: dto.name,
          type: RoleType.Custom,
        },
      );
      return await this.findOne(roleId);
    } catch (e) {
      throw new ExceptionType(e.statusCode, e.message);
    }
  }

  async delete(roleId: string): Promise<DeleteDto> {
    const role = await this.findOne(roleId);
    if (role && role.type === RoleType.System) {
      throw new BadRequestException(
        'სისტემური როლის წაშლა არ არის შესაძლებელი',
      );
    }
    try {
      await this.repository.softDelete(role.id);
      return { deleted: true };
    } catch (e) {
      throw new ExceptionType(e.statusCode, e.message);
    }
  }

  async myRoles(user: User): Promise<RoleDto[]> {
    return await this.repository
      .createQueryBuilder('role')
      .innerJoin('role.users', 'users', 'users.id = :userId', {
        userId: user.id,
      })
      .leftJoinAndSelect('role.permissions', 'permissions')
      .getMany();
  }

  async getPermissions(roleId: string): Promise<any> {
    const role = await this.repository
      .createQueryBuilder('role')
      .leftJoinAndSelect('role.permissions', 'permissions')
      .where('role.id = :roleId', { roleId: roleId })
      .getOne();

    const permissions = await this.repository.manager
      .getRepository(Permission)
      .createQueryBuilder('permission')
      .getMany();
    // const perms = permissions.map((m) => {
    //   return {
    //     ...m,
    //     active: true,
    //   };
    // });

    const rolesMapped = {
      ...role,
      permissions: permissions.map((m) => {
        return {
          ...m,
          active: !!role.permissions.find((f) => f.id === m.id),
        };
      }),
    };
    // console.log(perms);
    return rolesMapped;
  }

  async setPermissionsToRole(dto: RoleSetPermissionsDto): Promise<RoleDto> {
    const role = await this.repository.findOne({
      where: { id: dto.roleId },
    });
    if (!role) {
      const errors = { message: 'not found' };
      throw new HttpException(errors, HttpStatus.NOT_FOUND);
    }
    const permissions = await this.repository.manager.find(Permission, {
      where: {
        id: In(dto.permissions),
      },
    });

    if (!permissions.length) {
      throw new BadRequestException('უფლება არ არის მითითებული');
    }

    try {
      const actualRelationships = await this.repository.manager
        .getRepository(Role)
        .createQueryBuilder()
        .relation(Role, 'permissions')
        .of(dto.roleId)
        .loadMany();

      await this.repository.manager
        .getRepository(Role)
        .createQueryBuilder()
        .relation(Role, 'permissions')
        .of(dto.roleId)
        .addAndRemove(permissions, actualRelationships);

      return await this.findOne(dto.roleId);
    } catch (e) {
      throw new ExceptionType(e.statusCode, e.message);
    }
  }

  async getAllPermissions(): Promise<Permission[]> {
    try {
      return await this.repository.manager
        .getRepository(Permission)
        .createQueryBuilder('permission')
        .getMany();
    } catch (e) {
      throw new ExceptionType(e.statusCode, e.message);
    }
  }
}
