import { Global, Module } from "@nestjs/common";
import { TypeOrmModule } from '@nestjs/typeorm';
import { Project } from '../../modules/project/project.entity';
import { ProjectInterceptor } from './project.interceptor';

@Global()
@Module({
  imports: [TypeOrmModule.forFeature([Project])],
  providers: [ProjectInterceptor],
  exports: [TypeOrmModule, ProjectInterceptor],
})
export class ProjectInterceptorModule {}
