import { Field, InputType } from "@nestjs/graphql";
import { Role } from "@prisma/client";
import {
  IsBoolean,
  IsDefined,
  IsEmail,
  IsEnum,
  IsOptional,
  IsStrongPassword,
  MaxLength,
  MinLength,
} from "class-validator";

@InputType({ description: "The data required to create a new user" })
export class CreateUserInput {
  @Field({ description: "The email of the user" })
  @IsEmail()
  email: string;

  @Field({ description: "The password of the user", nullable: true })
  @IsOptional()
  @IsStrongPassword({
    minLength: 8,
    minLowercase: 1,
    minUppercase: 1,
    minNumbers: 1,
    minSymbols: 1,
  })
  password?: string;

  @Field({ description: "The first name of the user" })
  @IsDefined()
  @MinLength(2)
  @MaxLength(50)
  firstName: string;

  @Field({ description: "The last name of the user" })
  @IsDefined()
  @MinLength(2)
  @MaxLength(50)
  lastName: string;

  @Field(() => Role, {
    description: "The role of the user",
    nullable: true,
    defaultValue: Role.USER,
  })
  @IsOptional()
  @IsEnum(Role)
  role?: Role;

  @Field({ description: "Whether the user is active or not", defaultValue: true })
  @IsOptional()
  @IsBoolean()
  active?: boolean;
}
