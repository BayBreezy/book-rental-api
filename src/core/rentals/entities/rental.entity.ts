import { MetaEntity } from "@/common/shared.entity";
import { Book } from "@/core/books/entities/book.entity";
import { LateReturn } from "@/core/late-returns/entities/late-return.entity";
import { User } from "@/core/users/entities/user.entity";
import { Field, ObjectType } from "@nestjs/graphql";
import { PositiveIntResolver } from "graphql-scalars";

@ObjectType()
export class Rental extends MetaEntity {
  @Field({ description: "The date the book was rented" })
  rentedAt: Date;

  @Field({ description: "The date the book was returned", nullable: true })
  returnedAt?: Date;

  @Field(() => User)
  user: User;

  @Field(() => PositiveIntResolver, { description: "The user ID who rented the book" })
  userId: number;

  @Field(() => Book)
  book: Book;

  @Field(() => PositiveIntResolver, { description: "The book ID that was rented" })
  bookId: number;

  @Field(() => [LateReturn], { nullable: true })
  lateReturns?: LateReturn[];
}
