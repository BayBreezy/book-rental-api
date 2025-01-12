import { Args, Int, Mutation, Parent, Query, ResolveField, Resolver } from "@nestjs/graphql";
import { UseRoles } from "nest-access-control";
import { LateReturn } from "../late-returns/entities/late-return.entity";
import { Rental } from "../rentals/entities/rental.entity";
import { CreateUserInput } from "./dto/create-user.input";
import { UpdateUserInput } from "./dto/update-user.input";
import { User } from "./entities/user.entity";
import { UsersService } from "./users.service";

@Resolver(() => User)
export class UsersResolver {
  constructor(private readonly usersService: UsersService) {}

  @ResolveField("rentals", () => [Rental], { description: "The rentals of the user" })
  async getUserRentals(@Parent() user: User) {
    return this.usersService.getUserRentals(user.id);
  }
  @ResolveField("lateReturns", () => [LateReturn], {
    description: "The late returns of the user",
  })
  async getUserLateReturns(@Parent() user: User) {
    return this.usersService.getUserLateReturns(user.id);
  }

  @Mutation(() => User, { name: "createUser", description: "Create a new user" })
  @UseRoles({ resource: "user", action: "create" })
  createUser(@Args("input") dto: CreateUserInput) {
    return this.usersService.create(dto);
  }

  @Query(() => [User], { name: "getUsers", description: "Find all users" })
  @UseRoles({ resource: "user", action: "read" })
  findAll() {
    return this.usersService.findAll();
  }

  @Query(() => User, { name: "getUser", description: "Find a user by id" })
  @UseRoles({ resource: "user", action: "read" })
  findOne(@Args("id", { type: () => Int }) id: number) {
    return this.usersService.findOne(id);
  }

  @Mutation(() => User, { name: "updateUser", description: "Update a user by id" })
  @UseRoles({ resource: "user", action: "update" })
  updateUser(@Args("updateUserInput") updateUserInput: UpdateUserInput) {
    return this.usersService.update(updateUserInput.id, updateUserInput);
  }

  @Mutation(() => User, { name: "removeUser", description: "Remove a user by id" })
  @UseRoles({ resource: "user", action: "delete" })
  removeUser(@Args("id", { type: () => Int }) id: number) {
    return this.usersService.remove(id);
  }
}
