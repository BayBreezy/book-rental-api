import { ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";
import { ACGuard } from "nest-access-control";

@Injectable()
export class AccessControlGuard extends ACGuard {
  protected async getUserRoles(context: ExecutionContext): Promise<string | string[]> {
    const user = await this.getUser(context);
    if (!user) throw new UnauthorizedException();
    return user["role"];
  }
}
