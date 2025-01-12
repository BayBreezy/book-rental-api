import { User } from "@core/users/entities/user.entity";
import { createParamDecorator, ExecutionContext } from "@nestjs/common";
import { GqlExecutionContext } from "@nestjs/graphql";

/**
 * Custom decorator to get the current user from the request object
 */
export const CurrentUser = createParamDecorator((data: keyof User, context: ExecutionContext) => {
  const ctx = GqlExecutionContext.create(context);
  const user = ctx.getContext().req.user;
  return data ? user[data] : user;
});
