import { ArgumentsHost, Catch, ExceptionFilter, ForbiddenException } from "@nestjs/common";
import { Response } from "express";
import { GraphQLError } from "graphql";

@Catch(ForbiddenException)
export class ForbiddenExceptionFilter implements ExceptionFilter {
  catch(exception: ForbiddenException, host: ArgumentsHost) {
    const contextType = host.getType().toString();

    // Handle GraphQL context
    if (contextType === "graphql") {
      throw new GraphQLError("You do not have sufficient permissions to access this resource.", {
        extensions: {
          code: "FORBIDDEN",
          originalError: exception,
        },
      });
    }

    // Handle HTTP context
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const status = exception.getStatus();

    response.status(status).json({
      statusCode: status,
      message: "You do not have sufficient permissions to access this resource.",
    });
  }
}
