import { PaginatedResponseType } from "@/common/shared.entity";
import { CreateBookInputNoAuthor } from "@core/books/dto/create-book.input";
import { Field, InputType, ObjectType, OmitType } from "@nestjs/graphql";
import { Type } from "class-transformer";
import { IsDefined, IsOptional, MaxLength, MinLength, ValidateNested } from "class-validator";
import { Author } from "../entities/author.entity";

@InputType()
export class CreateAuthorInput {
  @Field(() => String, { description: "Author's first name" })
  @IsDefined()
  @MinLength(2)
  @MaxLength(50)
  firstName: string;

  @Field(() => String, { description: "Author's last name" })
  @IsDefined()
  @MinLength(2)
  @MaxLength(50)
  lastName: string;

  @Field(() => String, { description: "Author's bio", nullable: true })
  @IsOptional()
  @MinLength(10)
  bio?: string;

  @Field(() => [CreateBookInputNoAuthor], {
    description: "Books written by the author",
    nullable: "itemsAndList",
  })
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => CreateBookInputNoAuthor)
  books?: CreateBookInputNoAuthor[];
}

@InputType()
export class CreateAuthorInputWithNoBooks extends OmitType(CreateAuthorInput, ["books"] as const) {}

@ObjectType()
export class PaginatedAuthors extends PaginatedResponseType(Author) {}
