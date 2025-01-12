import { Field, InputType, PartialType } from "@nestjs/graphql";
import { IsDefined, IsPositive } from "class-validator";
import { PositiveIntResolver } from "graphql-scalars";
import { CreateLateReturnInput } from "./create-late-return.input";

@InputType()
export class UpdateLateReturnInput extends PartialType(CreateLateReturnInput) {
  @Field(() => PositiveIntResolver, { description: "The ID of the late return" })
  @IsDefined()
  @IsPositive()
  id: number;
}
