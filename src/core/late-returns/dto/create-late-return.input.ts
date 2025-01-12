import { PaginatedResponseType } from "@/common/shared.entity";
import { Field, InputType, ObjectType } from "@nestjs/graphql";
import { IsNumber, IsPositive } from "class-validator";
import { PositiveFloatResolver, PositiveIntResolver } from "graphql-scalars";
import { LateReturn } from "../entities/late-return.entity";

@InputType()
export class CreateLateReturnInput {
  @Field(() => PositiveIntResolver, { description: "The number of days the rental was late" })
  @IsPositive()
  lateDays: number;

  @Field(() => PositiveFloatResolver, {
    description: "The cost the user has to pay for teh late return",
  })
  @IsNumber()
  cost: number;

  @Field(() => PositiveIntResolver, { description: "The ID of the rental" })
  @IsPositive()
  rentalId: number;

  @Field(() => PositiveIntResolver, {
    description: "The ID of the user who returned the rental late",
  })
  @IsPositive()
  userId: number;
}

@ObjectType({ description: "The paginated late returns response" })
export class PaginatedLateReturns extends PaginatedResponseType(LateReturn) {}
