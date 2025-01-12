import { Field, InputType, PartialType } from "@nestjs/graphql";
import { IsDefined, Min } from "class-validator";
import { PositiveIntResolver } from "graphql-scalars";
import { CreateRentalInput } from "./create-rental.input";

@InputType()
export class UpdateRentalInput extends PartialType(CreateRentalInput) {
  @Field(() => PositiveIntResolver, { description: "The ID of the rental to update" })
  @IsDefined()
  @Min(1)
  id: number;
}
