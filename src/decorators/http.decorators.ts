import {
  applyDecorators,
  Param,
  ParseUUIDPipe,
  PipeTransform, SetMetadata,
  UseGuards,
  UseInterceptors
} from "@nestjs/common";
import { Type } from '@nestjs/common/interfaces';
import { ApiBearerAuth, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { AuthGuard } from '../guards/auth.guard';
import { AuthUserInterceptor } from '../interceptors/auth-user-interceptor.service';
import { PermissionGuard } from '../guards/permission.guard';
import { ProjectAccess } from "./project.decorator";

export function Auth(permission?: string) {
  return applyDecorators(
    UseGuards(AuthGuard, PermissionGuard),
    ApiBearerAuth(),
    UseInterceptors(AuthUserInterceptor),
    ApiUnauthorizedResponse({ description: 'Unauthorized' }),
    SetMetadata('permission', permission)
  );
}

export function UUIDParam(
  property: string,
  ...pipes: (Type<PipeTransform> | PipeTransform)[]
): ParameterDecorator {
  return Param(property, new ParseUUIDPipe({ version: '4' }), ...pipes);
}
