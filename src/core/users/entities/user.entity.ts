import { Field, ObjectType } from "@nestjs/graphql";
import { Role } from "@prisma/client";
import { EmailAddressResolver } from "graphql-scalars";
import { MetaEntity } from "../../../common/shared.entity";
import { LateReturn } from "../../../core/late-returns/entities/late-return.entity";
import { Rental } from "../../../core/rentals/entities/rental.entity";

@ObjectType({ description: "The user model" })
export class User extends MetaEntity {
  @Field(() => EmailAddressResolver, { description: "The email of the user" })
  email: string;

  @Field({ description: "The password of the user", nullable: true })
  password?: string;

  @Field({ description: "The first name of the user" })
  firstName: string;

  @Field({ description: "The last name of the user" })
  lastName: string;

  @Field(() => Role, { description: "The role of the user" })
  role: Role;

  @Field({ description: "Whether the user is active or not", defaultValue: true })
  active: boolean;

  @Field(() => [Rental], { nullable: "items" })
  rentals?: Rental[];

  @Field(() => [LateReturn], { nullable: "items" })
  lateReturns: LateReturn[];
}
