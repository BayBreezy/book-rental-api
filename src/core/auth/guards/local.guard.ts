import { ExecutionContext, Injectable } from "@nestjs/common";
import { GqlExecutionContext } from "@nestjs/graphql";
import { AuthGuard } from "@nestjs/passport";

@Injectable()
export class GqlLocalAuthGuard extends AuthGuard("local") {
  getRequest(context: ExecutionContext) {
    const gqlExecutionContext = GqlExecutionContext.create(context);
    const gqlContext = gqlExecutionContext.getContext();
    const gqlArgs = gqlExecutionContext.getArgs();

    // Extract email and password from gqlArgs.input
    const { email, password } = gqlArgs.input || {};
    // Ensure req.body exists and populate it with the extracted data
    gqlContext.req.body = {
      ...(gqlContext.req.body || {}),
      email,
      password,
      ...gqlArgs,
      ...gqlArgs.input,
    };
    return gqlContext.req;
  }
}
