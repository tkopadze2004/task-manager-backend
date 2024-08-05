import { Injectable } from '@nestjs/common';
import { roleSeeder } from './role.data';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RoleDto } from '../../modules/role/dto/role.dto';
import { Role } from '../../modules/role/entities/role.entity';

@Injectable()
export class RoleSeederService {
  constructor(
    @InjectRepository(Role)
    private readonly repository: Repository<Role>,
  ) {}

  create(): Array<Promise<Role>> {
    return roleSeeder.map(async (role: RoleDto) => {
      return await this.repository
        .findOne({ where: { name: role.name } })
        .then(async (dbRole) => {
          // We check if a language already exists.
          // If it does don't create a new one.
          if (dbRole) {
            return Promise.resolve(null);
          }
          return Promise.resolve(
            // or create(language).then(() => { ... });
            await this.repository.save(role),
          );
        })
        .catch((error) => Promise.reject(error));
    });
  }
}
