import { Injectable } from '@nestjs/common';
import { PermissionsSeeder } from './permissions/permissions.seeder';
import { RoleSeeder } from './role/role.seeder';

@Injectable()
export class SeederService {
  constructor(
    private readonly permissionsSeeder: PermissionsSeeder,
    private readonly roleSeeder: RoleSeeder,
  ) {}

  async seed() {
    await this.permissionsSeeder.seed();
    await this.roleSeeder.seed();
    await this.permissionsSeeder.rolePermissions();
  }
}
