import { CurrentUser } from "@/common/decorators/current-user.decorator";
import { PublicRoute } from "@/common/decorators/public-route.decorator";
import { UseGuards } from "@nestjs/common";
import { Args, Mutation, Query, Resolver } from "@nestjs/graphql";
import { UseRoles } from "nest-access-control";
import { User } from "../users/entities/user.entity";
import { AuthService } from "./auth.service";
import {
  ForgotPasswordInput,
  LocalLoginResponse,
  LoginInput,
  RegisterInput,
  ResetPasswordInput,
  UpdateCurrentUserInput,
  UserResponse,
} from "./dto/auth.input";
import { GqlLocalAuthGuard } from "./guards";

@Resolver()
export class AuthResolver {
  constructor(private readonly authService: AuthService) {}

  @Mutation(() => LocalLoginResponse, {
    name: "login",
    description: "Logs a user in with email and password",
  })
  @PublicRoute()
  @UseGuards(GqlLocalAuthGuard)
  async login(@Args("input") dto: LoginInput) {
    return this.authService.login(dto);
  }

  @Mutation(() => UserResponse, {
    name: "register",
    description: "Registers a new user",
  })
  @PublicRoute()
  async register(@Args("input") dto: RegisterInput) {
    return await this.authService.register(dto);
  }

  @Query(() => UserResponse, { name: "me", description: "Get the current user" })
  @UseRoles({ resource: "profile", action: "read" })
  async getMe(@CurrentUser() user: User) {
    return user;
  }

  @Mutation(() => UserResponse, { name: "updateMe", description: "Update the current user" })
  @UseRoles({ resource: "profile", action: "update" })
  async updateMe(@CurrentUser() user: User, @Args("input") input: UpdateCurrentUserInput) {
    return this.authService.updateMe(user, input);
  }

  @Mutation(() => String, { name: "forgotPassword", description: "Forgot password" })
  @PublicRoute()
  async forgotPassword(@Args("input") dto: ForgotPasswordInput) {
    await this.authService.forgotPassword(dto);
    return "Please check your email for further instructions";
  }

  @Mutation(() => String, { name: "resetPassword", description: "Reset password" })
  @PublicRoute()
  async resetPassword(@Args("input") dto: ResetPasswordInput) {
    await this.authService.resetPassword(dto);
    return "Password reset successfully";
  }
}
