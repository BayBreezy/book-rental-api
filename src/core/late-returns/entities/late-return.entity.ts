import { MetaEntity } from "@/common/shared.entity";
import { Rental } from "@core/rentals/entities/rental.entity";
import { User } from "@core/users/entities/user.entity";
import { Field, ObjectType } from "@nestjs/graphql";
import { PositiveFloatResolver, PositiveIntResolver } from "graphql-scalars";

@ObjectType()
export class LateReturn extends MetaEntity {
  @Field(() => PositiveIntResolver, { description: "The number of days the rental was late" })
  lateDays: number;

  @Field(() => PositiveFloatResolver, { description: "The cost of the late return" })
  cost: number;

  @Field(() => PositiveIntResolver, { description: "The ID of the rental" })
  rentalId: number;

  @Field(() => Rental, { description: "The rental that was returned late" })
  rental: Rental;

  @Field(() => User, { description: "The user who returned the rental late" })
  user: User;

  @Field(() => PositiveIntResolver, {
    description: "The ID of the user who returned the rental late",
  })
  userId: number;
}
