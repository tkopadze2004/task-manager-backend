import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModuleAsyncOptions } from '@nestjs/typeorm';
import { join } from 'path';
import { SnakeNamingStrategy } from '../common/snake-naming.strategy';

export const getTypeORMConfig = (): TypeOrmModuleAsyncOptions => ({
  imports: [ConfigModule],
  inject: [ConfigService],
  useFactory: (configService: ConfigService) => {
    return {
      type: 'postgres',
      host: configService.get('PG_HOST'),
      port: configService.get('PG_PORT'),
      database: configService.get('PG_DATABASE'),
      schema: configService.get('PG_SCHEMA') || 'public',
      username: configService.get('PG_USERNAME'),
      password: configService.get('PG_PASSWORD'),
      entities: [join(__dirname, '..', './**/*.entity{.ts,.js}')],
      namingStrategy: new SnakeNamingStrategy(),
      synchronize: configService.get('PG_SYNC'), // never true in production!
      ssl: configService.get('PG_SSL'),
    };
  },
});
