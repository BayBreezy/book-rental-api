import { Field, InputType, Int, PartialType } from "@nestjs/graphql";
import { IsDefined, IsInt, Min } from "class-validator";
import { CreateAuthorInputWithNoBooks } from "./create-author.input";

@InputType()
export class UpdateAuthorInput extends PartialType(CreateAuthorInputWithNoBooks) {
  @Field(() => Int, { description: "Author's ID" })
  @IsDefined()
  @IsInt()
  @Min(1)
  id: number;
}
