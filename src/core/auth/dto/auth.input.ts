import { User } from "@core/users/entities/user.entity";
import { Field, InputType, ObjectType, OmitType, PartialType } from "@nestjs/graphql";
import {
  IsDefined,
  IsEmail,
  IsStrongPassword,
  IsUUID,
  MaxLength,
  MinLength,
} from "class-validator";
import { EmailAddressResolver, UUIDResolver } from "graphql-scalars";

@ObjectType({ description: "The user object returned to the client" })
export class UserResponse extends OmitType(User, ["password", "rentals", "lateReturns"] as const) {}

@InputType({ description: "The data required to log in a user" })
export class LoginInput {
  @Field(() => EmailAddressResolver, { description: "The email of the user" })
  @IsDefined()
  @IsEmail({ allow_underscores: true })
  email: string;

  @Field({ description: "The password of the user" })
  @IsDefined()
  @IsStrongPassword({
    minLength: 8,
    minLowercase: 1,
    minUppercase: 1,
    minNumbers: 1,
    minSymbols: 1,
  })
  password: string;
}

@InputType({ description: "The data needed to send forgot password email" })
export class ForgotPasswordInput {
  @Field(() => EmailAddressResolver, { description: "The email of the user" })
  @IsDefined()
  @IsEmail({ allow_underscores: true })
  email: string;
}

@InputType({ description: "The data needed to set a new password" })
export class ResetPasswordInput {
  @Field(() => UUIDResolver, { description: "The token needed to reset the password" })
  @IsDefined()
  @IsUUID("4", { message: "Invalid token" })
  token: string;

  @Field({ description: "The new password of the user" })
  @IsDefined()
  @IsStrongPassword({
    minLength: 8,
    minLowercase: 1,
    minUppercase: 1,
    minNumbers: 1,
    minSymbols: 1,
  })
  password: string;
}

@InputType({ description: "The data required to register" })
export class RegisterInput {
  @Field(() => EmailAddressResolver, { description: "The email of the user" })
  @IsDefined()
  @IsEmail({ allow_underscores: true })
  email: string;

  @Field({ description: "The password of the user" })
  @IsDefined()
  @IsStrongPassword({
    minLength: 8,
    minLowercase: 1,
    minUppercase: 1,
    minNumbers: 1,
    minSymbols: 1,
  })
  password: string;

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
}

@InputType({ description: "The data required to update a user" })
export class UpdateCurrentUserInput extends PartialType(
  OmitType(RegisterInput, ["password"] as const),
) {}

@ObjectType({ description: "The response when logging in a user" })
export class LocalLoginResponse {
  @Field({ description: "The token to authenticate the user" })
  token: string;

  @Field(() => UserResponse, { description: "The user that was logged in" })
  user: UserResponse;
}
