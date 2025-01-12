import { createParamDecorator, ExecutionContext } from "@nestjs/common";
import { GqlExecutionContext } from "@nestjs/graphql";
import { Request } from "express";

/**
 * Returns the cookies from the request object.
 *
 * An optional key can be passed to get a specific cookie value.
 */
export const Cookies = createParamDecorator((data: string, ctx: ExecutionContext) => {
  const reqType = ctx.getType().toString();
  if (reqType === "graphql") {
    const gqlCtx = GqlExecutionContext.create(ctx);
    const request = gqlCtx.getContext().req as Request;
    return data ? request.cookies?.[data] || {} : request.cookies || {};
  }
  const request = ctx.switchToHttp().getRequest<Request>();
  return data ? request.cookies?.[data] || {} : request.cookies || {};
});

/**
 * Returns the signed cookies from the request object.
 *
 * An optional key can be passed to get a specific signed cookie value.
 */
export const SignedCookies = createParamDecorator((data: string, ctx: ExecutionContext) => {
  const reqType = ctx.getType().toString();
  if (reqType === "graphql") {
    const gqlCtx = GqlExecutionContext.create(ctx);
    const request = gqlCtx.getContext().req as Request;
    return data ? request.signedCookies?.[data] || {} : request.signedCookies || {};
  }
  const request = ctx.switchToHttp().getRequest<Request>();
  return data ? request.signedCookies?.[data] || {} : request.signedCookies || {};
});
