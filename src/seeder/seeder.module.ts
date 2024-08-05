import { Logger, Module } from '@nestjs/common';
import { RoleSeeder } from './role/role.seeder';
import { RoleSeederService } from './role/role-seeder.service';
import { Role } from '../modules/role/entities/role.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { getTypeORMConfig } from '../config/typeorm.config';
import { ConfigModule } from '@nestjs/config';
import { PermissionsModule } from './permissions/permissions.module';
import { SeederService } from "./seeder.service";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    TypeOrmModule.forRootAsync(getTypeORMConfig()),
    TypeOrmModule.forFeature([Role]),
    PermissionsModule,
  ],
  controllers: [],
  providers: [Logger, RoleSeeder, RoleSeederService, SeederService],
  exports: [TypeOrmModule, RoleSeederService, SeederService],
})
export class SeederModule {}
