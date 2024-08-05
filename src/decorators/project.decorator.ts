import { applyDecorators, UseInterceptors } from '@nestjs/common';
import { ApiForbiddenResponse, ApiHeader } from '@nestjs/swagger';

import { ProjectInterceptor } from '../interceptors/project/project.interceptor';

export function ProjectAccess() {
  return applyDecorators(
    UseInterceptors(ProjectInterceptor),
    ApiForbiddenResponse({ description: 'Access denied' }),
    ApiHeader({ name: 'project', required: true }),
  );
}
