import { SeederModule } from './seeder/seeder.module';
import { NestFactory } from '@nestjs/core';
import { Logger } from '@nestjs/common';
import { RoleSeeder } from './seeder/role/role.seeder';
import { PermissionsSeeder } from './seeder/permissions/permissions.seeder';
import { SeederService } from './seeder/seeder.service';

async function bootstrap() {
  NestFactory.createApplicationContext(SeederModule)
    .then((appContext) => {
      const logger = appContext.get(Logger);
      const seederService = appContext.get(SeederService);
      seederService
        .seed()
        .then(() => {
          logger.debug('permissionsSeeder complete!');
        })
        .catch((error) => {
          logger.error('permissionsSeeder failed!');
          throw error;
        })
        .finally(() => appContext.close());
    })
    .catch((error) => {
      throw error;
    });
}

bootstrap();
