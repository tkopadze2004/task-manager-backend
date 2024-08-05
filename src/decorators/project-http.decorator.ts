import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const HeaderProject = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    return request.project;
  },
);
