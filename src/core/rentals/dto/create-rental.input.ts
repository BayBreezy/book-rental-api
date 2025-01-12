import { Field, InputType } from "@nestjs/graphql";
import { Transform } from "class-transformer";
import { IsDate, IsDefined, IsOptional, Min } from "class-validator";
import { PositiveIntResolver } from "graphql-scalars";

@InputType()
export class CreateRentalInput {
  @Field({ description: "The date the book was rented", nullable: true })
  @IsOptional()
  @Transform(({ value }) => (value ? new Date(value) : null))
  @IsDate()
  rentedAt?: Date;

  @Field({ description: "The date the book was returned", nullable: true })
  @IsOptional()
  @Transform(({ value }) => (value ? new Date(value) : null))
  @IsDate()
  returnedAt?: Date;

  @Field(() => PositiveIntResolver, { description: "The user ID who rented the book" })
  @IsDefined()
  @Min(1)
  userId: number;

  @Field(() => PositiveIntResolver, { description: "The book ID that was rented" })
  @IsDefined()
  @Min(1)
  bookId: number;
  // lateReturn: string;
}
