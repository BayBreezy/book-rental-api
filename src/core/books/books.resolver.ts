import { IdArgsType, PaginationArgs } from "@/common/shared.entity";
import { Args, Mutation, Parent, Query, ResolveField, Resolver } from "@nestjs/graphql";
import { UseRoles } from "nest-access-control";
import { Author } from "../authors/entities/author.entity";
import { Rental } from "../rentals/entities/rental.entity";
import { BooksService } from "./books.service";
import { CreateBookInput, PaginatedBooks } from "./dto/create-book.input";
import { UpdateBookInput } from "./dto/update-book.input";
import { Book } from "./entities/book.entity";

@Resolver(() => Book)
export class BooksResolver {
  constructor(private readonly booksService: BooksService) {}

  @ResolveField("author", () => Author, { description: "Get the author of a book", nullable: true })
  async getBookAuthor(@Parent() book: Book) {
    const { authorId } = book;
    return this.booksService.findBookAuthor(authorId);
  }

  @ResolveField("rentals", () => [Rental], {
    description: "Get the rentals of a book",
    nullable: "items",
  })
  async getBookRentals(@Parent() book: Book) {
    const { id } = book;
    return this.booksService.findBookRentals(id);
  }

  @Mutation(() => Book, { name: "createBook", description: "Create a new book" })
  @UseRoles({ resource: "book", action: "create" })
  createBook(@Args("input") dto: CreateBookInput) {
    return this.booksService.create(dto);
  }

  @Query(() => PaginatedBooks, { name: "getBooks", description: "Get all books" })
  @UseRoles({ resource: "book", action: "read" })
  findAll(@Args() args: PaginationArgs) {
    return this.booksService.findAll(args);
  }

  @Query(() => Book, { name: "getBook", description: "Get a book by id", nullable: true })
  @UseRoles({ resource: "book", action: "read" })
  findOne(@Args() args: IdArgsType) {
    return this.booksService.findOne(args.id);
  }

  @Mutation(() => Book, { description: "Update a book by id" })
  @UseRoles({ resource: "book", action: "update" })
  updateBook(@Args("input") dto: UpdateBookInput) {
    return this.booksService.update(dto.id, dto);
  }

  @Mutation(() => Book, { description: "Remove a book by id" })
  @UseRoles({ resource: "book", action: "delete" })
  removeBook(@Args() { id }: IdArgsType) {
    return this.booksService.remove(id);
  }
}
