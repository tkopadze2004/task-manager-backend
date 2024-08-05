import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';

@Injectable()
export class PermissionGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const permission = this.reflector.get<string[]>(
      'permission',
      context.getHandler(),
    );
    if (!permission) {
      return true;
    }
    const request = context.switchToHttp().getRequest();
    const user = request.user;
    const hasRole = user.roles.find((role) => {
      return role.permissions.find((perm) => perm.key === permission);
    });
    if (user && !hasRole) {
      throw new ForbiddenException(`Permission ${permission} access denied`);
    }
    return user && hasRole;
  }
}
