import { PaginatedResponseType } from "@/common/shared.entity";
import { CreateAuthorInput } from "@core/authors/dto/create-author.input";
import { Field, Float, InputType, ObjectType, OmitType } from "@nestjs/graphql";
import {
  IsBoolean,
  IsDefined,
  IsISBN,
  IsNumber,
  IsOptional,
  MaxLength,
  MinLength,
} from "class-validator";
import { Book } from "../entities/book.entity";

@InputType({ description: "Input type for creating a book" })
export class CreateBookInput {
  @Field({ description: "The title of the book" })
  @IsDefined()
  @MinLength(2)
  @MaxLength(250)
  title: string;

  @Field({ description: "The description of the book", nullable: true })
  @IsOptional()
  @MinLength(10)
  @MaxLength(255)
  description?: string;

  @Field({ description: "The unique ISBN of the book" })
  @IsISBN()
  isbn: string;

  @Field({
    description: "Whether the book is available for borrowing",
    nullable: true,
    defaultValue: true,
  })
  @IsOptional()
  @IsBoolean()
  available?: boolean;

  // rentals: any[];

  @Field(() => Float, { description: "The cost of the book", nullable: true, defaultValue: 0 })
  @IsOptional()
  @IsNumber({ allowInfinity: false, allowNaN: false, maxDecimalPlaces: 2 })
  cost?: number;

  @Field(() => Float, {
    description: "The cost of the book each day it is late",
    nullable: true,
    defaultValue: 0,
  })
  @IsOptional()
  @IsNumber({ allowInfinity: false, allowNaN: false, maxDecimalPlaces: 2 })
  costPerLateDay?: number;

  @Field(() => CreateAuthorInput, { description: "The author of the book", nullable: true })
  author?: CreateAuthorInput;
}

@InputType()
export class CreateBookInputNoAuthor extends OmitType(CreateBookInput, ["author"] as const) {}

@ObjectType()
export class PaginatedBooks extends PaginatedResponseType(Book) {}
