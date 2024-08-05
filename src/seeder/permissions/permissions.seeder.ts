import { PermissionsSeederService } from './permissions-seeder.service';
import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class PermissionsSeeder {
  constructor(
    private readonly logger: Logger,
    private readonly service: PermissionsSeederService,
  ) {}

  async seed() {
    await this.data()
      .then((completed) => {
        this.logger.debug('Successfuly completed seeding permission...');
        Promise.resolve(completed);
      })
      .catch((error) => {
        this.logger.error('Failed seeding permission...');
        Promise.reject(error);
      });
  }

  async rolePermissions() {
    await this.service
      .rolePermissions()
      .then((completed) => {
        this.logger.debug('Successfuly completed seeding role permissions...');
        Promise.resolve(completed);
      })
      .catch((error) => {
        this.logger.error('Failed seeding role permissions...');
        Promise.reject(error);
      });
  }

  async data() {
    return await Promise.all(this.service.create())
      .then((createdLanguages) => {
        // Can also use this.logger.verbose('...');
        this.logger.debug(
          'created : ' +
            // Remove all null values and return only created languages.
            createdLanguages.filter(
              (nullValueOrCreatedLanguage) => nullValueOrCreatedLanguage,
            ).length,
        );
        return Promise.resolve(true);
      })
      .catch((error) => Promise.reject(error));
  }
}
