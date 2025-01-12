import { IdArgsType, PaginationArgs } from "@/common/shared.entity";
import { Args, Mutation, Parent, Query, ResolveField, Resolver } from "@nestjs/graphql";
import { UseRoles } from "nest-access-control";
import { Rental } from "../rentals/entities/rental.entity";
import { RentalsService } from "../rentals/rentals.service";
import { CreateLateReturnInput, PaginatedLateReturns } from "./dto/create-late-return.input";
import { UpdateLateReturnInput } from "./dto/update-late-return.input";
import { LateReturn } from "./entities/late-return.entity";
import { LateReturnsService } from "./late-returns.service";

@Resolver(() => LateReturn)
export class LateReturnsResolver {
  constructor(
    private readonly lateReturnsService: LateReturnsService,
    private readonly rentalsService: RentalsService,
  ) {}

  @ResolveField("rental", () => Rental, { description: "The rental that was returned late" })
  async getRental(@Parent() lateReturn: LateReturn) {
    return this.rentalsService.findOne(lateReturn.rentalId);
  }

  @Mutation(() => LateReturn, { name: "createLateReturn", description: "Create a new late return" })
  @UseRoles({ resource: "late-returns", action: "create" })
  createLateReturn(@Args("input") dto: CreateLateReturnInput) {
    return this.lateReturnsService.create(dto);
  }

  @Query(() => PaginatedLateReturns, {
    name: "getLateReturns",
    description: "Find all late returns",
  })
  @UseRoles({ resource: "late-returns", action: "read" })
  findAll(@Args() args: PaginationArgs) {
    return this.lateReturnsService.findAll(args);
  }

  @Query(() => LateReturn, { name: "getLateReturn", nullable: true })
  @UseRoles({ resource: "late-returns", action: "read" })
  findOne(@Args() { id }: IdArgsType) {
    return this.lateReturnsService.findOne(id);
  }

  @Mutation(() => LateReturn, {
    name: "updateLateReturn",
    description: "Update a late return by id",
  })
  @UseRoles({ resource: "late-returns", action: "update" })
  updateLateReturn(@Args("input") dto: UpdateLateReturnInput) {
    return this.lateReturnsService.update(dto.id, dto);
  }

  @Mutation(() => LateReturn, {
    name: "removeLateReturn",
    description: "Remove a late return by id",
  })
  @UseRoles({ resource: "late-returns", action: "delete" })
  removeLateReturn(@Args() { id }: IdArgsType) {
    return this.lateReturnsService.remove(id);
  }
}
