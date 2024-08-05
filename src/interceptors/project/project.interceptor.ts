import {
  CallHandler,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { ContextService } from '../../providers/contect.service';
import { Project } from '../../modules/project/project.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class ProjectInterceptor implements NestInterceptor {
  constructor(
    @InjectRepository(Project)
    private readonly repository: Repository<Project>,
  ) {}

  async intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Promise<Observable<any>> {
    const request = context.switchToHttp().getRequest();
    const project = request.header('project');
    if (!project) throw new ForbiddenException('Missing project header');
    try {
      const branch = await this.verifyProject(+project);
      ContextService.set('project', branch);
      request['project'] = branch;
      return next.handle();
    } catch (e) {
      throw new ForbiddenException(e.message);
    }
  }

  async verifyProject(projectId: number): Promise<Project> {
    return await this.repository.findOne({
      where: { id: projectId },
    });
  }
}
