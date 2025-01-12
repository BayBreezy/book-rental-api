import { Field, InputType, Int, OmitType } from "@nestjs/graphql";
import { IsDefined, IsInt, Min } from "class-validator";
import { CreateUserInput } from "./create-user.input";

@InputType({ description: "The data required to update a user" })
export class UpdateUserInput extends OmitType(CreateUserInput, ["password"] as const) {
  @Field(() => Int, { description: "The id of the user" })
  @IsDefined()
  @IsInt()
  @Min(1)
  id: number;
}
