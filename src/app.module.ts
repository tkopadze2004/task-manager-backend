import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './modules/auth/auth.module';
import { ProjectModule } from './modules/project/project.module';
import { UserModule } from './modules/user/user.module';
import { RoleModule } from './modules/role/role.module';
import { getTypeORMConfig } from './config/typeorm.config';
import { ConfigModule } from '@nestjs/config';
import { BoardModule } from './modules/board/board.module';
import { IssueTypeModule } from './modules/issue-type/issue-type.module';
import { TaskModule } from './modules/task/task.module';
import { EpicsModule } from './modules/epics/epics.module';
import { ProjectInterceptorModule } from './interceptors/project/project.module';
import { contextMiddleware } from './middlewares';
import { join } from 'path';
import { ServeStaticModule } from '@nestjs/serve-static';

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'docs'),
      serveRoot: process.env.NODE_ENV === 'development' ? '/' : '/docs',
    }),
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    TypeOrmModule.forRootAsync(getTypeORMConfig()),
    ProjectInterceptorModule,
    AuthModule,
    ProjectModule,
    UserModule,
    RoleModule,
    IssueTypeModule,
    BoardModule,
    TaskModule,
    EpicsModule,
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer): MiddlewareConsumer | void {
    consumer.apply(contextMiddleware).forRoutes('*');
  }
}
