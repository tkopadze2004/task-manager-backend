import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';

import { User } from '../modules/user/entities/user.entity';
import { ContextService } from '../providers/contect.service';

@Injectable()
export class AuthUserInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const user = <User>request.user;
    ContextService.set('user_key', user);
    return next.handle();
  }
}
