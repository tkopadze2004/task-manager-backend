import { Logger, Module } from '@nestjs/common';
import { PermissionsSeederService } from './permissions-seeder.service';
import { PermissionsSeeder } from './permissions.seeder';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Permission } from '../../modules/role/entities/permission.entity';
import { Role } from "../../modules/role/entities/role.entity";

@Module({
  imports: [TypeOrmModule.forFeature([Permission,Role])],
  controllers: [],
  providers: [Logger, PermissionsSeederService, PermissionsSeeder],
  exports: [PermissionsSeederService, PermissionsSeeder],
})
export class PermissionsModule {}
