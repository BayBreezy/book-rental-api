import { ExecutionContext, Injectable } from "@nestjs/common";
import { GqlExecutionContext } from "@nestjs/graphql";
import { ThrottlerGuard } from "@nestjs/throttler";

@Injectable()
export class GqlThrottlerGuard extends ThrottlerGuard {
  getRequestResponse(context: ExecutionContext) {
    const isHttp = context.getType() === "http";
    const isWs = context.getType() === "ws";
    const isGql = context.getType().toString() === "graphql";
    if (isHttp || isWs) {
      const ctx = context.switchToHttp();
      return { req: ctx.getRequest(), res: ctx.getResponse() };
    }
    if (isGql) {
      const gqlCtx = GqlExecutionContext.create(context);
      const ctx = gqlCtx.getContext();
      return { req: ctx.req, res: ctx.res };
    }
  }
}
