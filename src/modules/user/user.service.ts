import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { Brackets, getRepository, In, Repository, UpdateResult } from 'typeorm';
import { UserDto } from './dto/User.dto';
import { UsersPageOptionsDto } from './dto/users-page-options.dto';
import { User } from './entities/user.entity';
import { UserCreateDto } from './dto/user-create.dto';
import { UserUpdateDto } from './dto/UserUpdateDto';
import { InjectRepository } from '@nestjs/typeorm';
import { PaginationDto } from '../../common/dtos/page.dto';
import { ExceptionType } from '../../common/exceptions/types/ExceptionType';
import { PasswordUpdateDto } from './dto/password-update.dto';
import { UtilsService } from '../../providers/utils.service';
import { DeleteDto } from '../../common/dtos/delete.dto';
import { snakeCase } from 'change-case';
import { UserSetRolesDto } from './dto/user-set-roles.dto';
import { Role } from '../role/entities/role.entity';
import { AllUsersDto } from './dto/all-users.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async findOneForAuth(email: string): Promise<User> {
    try {
      return await this.userRepository.findOne({
        select: [
          'id',
          'firstName',
          'lastName',
          'mobileNumber',
          'email',
          'password',
        ],
        where: { email },
      });
    } catch (e) {
      console.error('Error', e.message);
      throw new ExceptionType(e.statusCode, e.message);
    }
  }

  async findOne(userId: number): Promise<UserDto> {
    try {
      const user = await this.userRepository.findOne({
        where: { id: userId },
        relations: ['userPermissions', 'roles', 'roles.permissions'],
      });
      if (!user) throw new ExceptionType(404, 'User not found');
      return user;
    } catch (e) {
      throw new ExceptionType(e.statusCode, e.message);
    }
  }

  async create(userCreateDto: UserCreateDto): Promise<UserDto> {
    if (!userCreateDto.email) {
      throw new ExceptionType(400, 'One of the fields is required: email');
    }
    try {
      const user = new User();
      user.firstName = userCreateDto.firstName;
      user.lastName = userCreateDto.lastName;
      user.email = userCreateDto.email;
      user.mobileNumber = userCreateDto.mobileNumber;
      user.isActive = userCreateDto.isActive || true;
      user.password = '123456';

      const customerRole = await this.userRepository.manager.findOne(Role, {
        where: { name: 'Super Admin' },
      });

      user.roles = [customerRole];
      const createdUser = await this.userRepository.create(user);
      if (createdUser) {
        await this.userRepository.save(createdUser);
      }
      return createdUser;
    } catch (e) {
      throw new ExceptionType(e.statusCode, e.message);
    }
  }

  async pagination(
    pageOptionsDto: UsersPageOptionsDto,
  ): Promise<PaginationDto<UserDto>> {
    const { search, isActive } = pageOptionsDto;
    try {
      const queryBuilder = this.userRepository
        .createQueryBuilder('user')
        .where(`user.is_active = :isActive`, { isActive: isActive });
      if (search) {
        queryBuilder.andWhere(
          new Brackets((qb) => {
            qb.where(`user.email ILIKE '%${search}%' OR 
          user.first_name ILIKE '%${search}%' OR 
          user.last_name ILIKE '%${search}%'`);
          }),
        );
      }

      const totalCount = await queryBuilder.getCount();
      const items = await queryBuilder
        .leftJoin('user.roles', 'roles')
        .select('user')
        .addSelect('roles')
        .orderBy(
          `user.${snakeCase(pageOptionsDto.orderBy)}`,
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
      console.error('Error', e.message);
      throw new ExceptionType(e.statusCode, e.message);
    }
  }

  async getAllUsers(dto: AllUsersDto): Promise<UserDto[]> {
    try {
      const { search } = dto;
      const queryBuilder = this.userRepository
        .createQueryBuilder('user')
        .where(`user.is_active = :isActive`, { isActive: true });
      if (search) {
        queryBuilder.andWhere(
          new Brackets((qb) => {
            qb.where(`user.email ILIKE '%${search}%' OR 
          user.first_name ILIKE '%${search}%' OR 
          user.last_name ILIKE '%${search}%'`);
          }),
        );
      }
      return await queryBuilder.getMany();
    } catch (e) {
      console.error('Error', e.message);
      throw new ExceptionType(e.statusCode, e.message);
    }
  }

  async update(userId: number, dto: UserUpdateDto): Promise<UserDto> {
    try {
      await this.userRepository.update(
        { id: userId },
        {
          firstName: dto.firstName,
          lastName: dto.lastName,
          email: dto.email,
          mobileNumber: dto.mobileNumber,
          isActive: dto.isActive || true,
        },
      );
      return await this.findOne(userId);
    } catch (e) {
      throw new ExceptionType(e.statusCode, e.message);
    }
  }

  async delete(userId: number): Promise<DeleteDto> {
    try {
      const user = await this.findOne(userId);
      await this.userRepository.softDelete(user.id);
      return { deleted: true };
    } catch (e) {
      throw new ExceptionType(e.statusCode, e.message);
    }
  }

  async passwordUpdate(dto: PasswordUpdateDto): Promise<UpdateResult> {
    const user = await this.userRepository.findOne({
      select: ['id', 'password'],
      where: { id: dto.userId },
    });
    if (!user) {
      const errors = { message: 'not found' };
      throw new HttpException(errors, HttpStatus.NOT_FOUND);
    }

    const isPasswordValid = await UtilsService.validateHash(
      dto.oldPassword,
      user && user.password,
    );
    delete user.password;
    if (!user || !isPasswordValid) {
      const errors = { message: 'მიმდინარე პაროლი არასწორია' };
      throw new HttpException(errors, HttpStatus.NOT_FOUND);
    }

    if (dto.password !== dto.checkPassword) {
      const errors = {
        message: 'ახალი პაროლი და განმეორებითი პაროლი არ ემთხვევა ერთმანეთს',
      };
      throw new HttpException({ errors }, HttpStatus.NOT_FOUND);
    }
    try {
      return await this.userRepository.update(user.id, {
        password: dto.password,
      });
    } catch (e) {
      throw new ExceptionType(e.statusCode, e.message);
    }
  }

  async setRoles(dto: UserSetRolesDto): Promise<UserDto> {
    const user = await this.userRepository.findOne({
      where: { id: dto.userId },
    });
    if (!user) {
      const errors = { message: 'not found' };
      throw new HttpException(errors, HttpStatus.NOT_FOUND);
    }
    const roles = await this.userRepository.manager.find(Role, {
      where: { id: In(dto.roleIds) },
    });
    if (!roles.length) {
      throw new BadRequestException('უფლება არ არის მითითებული');
    }

    try {
      const actualRelationships = await this.userRepository.manager
        .getRepository(User)
        .createQueryBuilder()
        .relation(User, 'roles')
        .of(dto.userId)
        .loadMany();

      await this.userRepository.manager
        .getRepository(User)
        .createQueryBuilder()
        .relation(User, 'roles')
        .of(dto.userId)
        .addAndRemove(roles, actualRelationships);

      return await this.findOne(dto.userId);
    } catch (e) {
      throw new ExceptionType(e.statusCode, e.message);
    }
  }
}
