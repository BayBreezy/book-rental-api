import { Field, InputType, Int, PartialType } from "@nestjs/graphql";
import { IsDefined, IsInt, Min } from "class-validator";
import { CreateBookInputNoAuthor } from "./create-book.input";

@InputType()
export class UpdateBookInput extends PartialType(CreateBookInputNoAuthor) {
  @Field(() => Int, { description: "The id of the book to update" })
  @IsDefined()
  @IsInt()
  @Min(1)
  id: number;
}
