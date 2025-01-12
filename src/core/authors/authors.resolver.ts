import { IdArgsType, PaginationArgs } from "@/common/shared.entity";
import { Args, Mutation, Parent, Query, ResolveField, Resolver } from "@nestjs/graphql";
import { UseRoles } from "nest-access-control";
import { Book } from "../books/entities/book.entity";
import { AuthorsService } from "./authors.service";
import { CreateAuthorInput, PaginatedAuthors } from "./dto/create-author.input";
import { UpdateAuthorInput } from "./dto/update-author.input";
import { Author } from "./entities/author.entity";

@Resolver(() => Author)
export class AuthorsResolver {
  constructor(private readonly authorsService: AuthorsService) {}

  @ResolveField("books", () => [Book], {
    description: "Books written by the author",
  })
  async getAuthorBooks(@Parent() author: Author) {
    const { id } = author;
    return this.authorsService.findAuthorBooksById(id);
  }

  @Mutation(() => Author, { name: "createAuthor", description: "Create new author" })
  @UseRoles({ resource: "author", action: "create" })
  createAuthor(@Args("input") dto: CreateAuthorInput) {
    return this.authorsService.create(dto);
  }

  @Query(() => PaginatedAuthors, { name: "getAuthors", description: "Get all authors" })
  @UseRoles({ resource: "author", action: "read" })
  findAll(@Args() args: PaginationArgs) {
    return this.authorsService.findAll(args);
  }

  @Query(() => Author, { name: "getAuthor", description: "Get author by ID" })
  @UseRoles({ resource: "author", action: "read" })
  findOne(@Args() args: IdArgsType) {
    return this.authorsService.findOne(args.id);
  }

  @Mutation(() => Author, { name: "updateAuthor", description: "Update author by ID" })
  @UseRoles({ resource: "author", action: "update" })
  updateAuthor(@Args("input") dto: UpdateAuthorInput) {
    return this.authorsService.update(dto.id, dto);
  }

  @Mutation(() => Author, { name: "removeAuthor", description: "Remove author by ID" })
  @UseRoles({ resource: "author", action: "delete" })
  removeAuthor(@Args() { id }: IdArgsType) {
    return this.authorsService.remove(id);
  }
}
