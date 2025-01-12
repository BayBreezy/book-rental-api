import { IdArgsType } from "@/common/shared.entity";
import { Args, Mutation, Parent, Query, ResolveField, Resolver } from "@nestjs/graphql";
import { UseRoles } from "nest-access-control";
import { BooksService } from "../books/books.service";
import { Book } from "../books/entities/book.entity";
import { LateReturn } from "../late-returns/entities/late-return.entity";
import { User } from "../users/entities/user.entity";
import { UsersService } from "../users/users.service";
import { CreateRentalInput } from "./dto/create-rental.input";
import { UpdateRentalInput } from "./dto/update-rental.input";
import { Rental } from "./entities/rental.entity";
import { RentalsService } from "./rentals.service";

@Resolver(() => Rental)
export class RentalsResolver {
  constructor(
    private readonly rentalsService: RentalsService,
    private readonly booksService: BooksService,
    private readonly userService: UsersService,
  ) {}

  @ResolveField("book", () => Book, { description: "The book that was rented" })
  async getRentalBook(@Parent() rental: Rental) {
    return this.booksService.findOne(rental.bookId);
  }

  @ResolveField("user", () => User, { description: "The user who rented the book" })
  async getRentalUser(@Parent() rental: Rental) {
    return this.userService.findOne(rental.userId);
  }

  @ResolveField("lateReturns", () => [LateReturn], {
    nullable: true,
    description: "The late returns for this rental",
  })
  async getRentalLateReturn(@Parent() rental: Rental) {
    return this.rentalsService.findRentalLateReturns(rental.id);
  }

  @Mutation(() => Rental, { name: "createRental", description: "Create a new rental" })
  @UseRoles({ resource: "rental", action: "create" })
  createRental(@Args("input") dto: CreateRentalInput) {
    return this.rentalsService.create(dto);
  }

  @Query(() => [Rental], { name: "getRentals", description: "Find all rentals", nullable: "items" })
  @UseRoles({ resource: "rental", action: "read" })
  findAll() {
    return this.rentalsService.findAll();
  }

  @Query(() => Rental, { name: "getRental", description: "Find a rental by id", nullable: true })
  @UseRoles({ resource: "rental", action: "read" })
  findOne(@Args() { id }: IdArgsType) {
    return this.rentalsService.findOne(id);
  }

  @Mutation(() => Rental, { name: "updateRental", description: "Update a rental by id" })
  @UseRoles({ resource: "rental", action: "update" })
  updateRental(@Args("input") dto: UpdateRentalInput) {
    return this.rentalsService.update(dto.id, dto);
  }

  @Mutation(() => Rental, { name: "removeRental", description: "Remove a rental by id" })
  @UseRoles({ resource: "rental", action: "delete" })
  removeRental(@Args() { id }: IdArgsType) {
    return this.rentalsService.remove(id);
  }
}
