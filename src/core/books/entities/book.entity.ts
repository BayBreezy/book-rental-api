import { MetaEntity } from "@/common/shared.entity";
import { Author } from "@core/authors/entities/author.entity";
import { Rental } from "@core/rentals/entities/rental.entity";
import { Field, Float, Int, ObjectType } from "@nestjs/graphql";

@ObjectType()
export class Book extends MetaEntity {
  @Field({ description: "The title of the book" })
  title: string;

  @Field({ description: "The description of the book", nullable: true })
  description?: string;

  @Field({ description: "The unique ISBN of the book" })
  isbn: string;

  @Field({
    description: "Whether the book is available for borrowing",
    nullable: true,
    defaultValue: true,
  })
  available?: boolean;

  @Field(() => Float, { description: "The cost of the book", nullable: true })
  cost?: number;

  @Field(() => Float, { description: "The cost the user will incur per late day", nullable: true })
  costPerLateDay?: number;

  @Field(() => [Rental], { description: "The rentals of the book", nullable: "items" })
  rentals?: Rental[];

  @Field(() => Author, { description: "The author of the book" })
  author: Author;

  @Field(() => Int, { description: "The author id of the book" })
  authorId: number;
}
