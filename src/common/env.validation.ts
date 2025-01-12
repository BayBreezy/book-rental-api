import { plainToInstance, Transform } from "class-transformer";
import {
  Contains,
  IsDefined,
  IsEmail,
  IsEnum,
  IsIn,
  IsNumber,
  IsOptional,
  IsString,
  IsStrongPassword,
  Max,
  MaxLength,
  Min,
  validateSync,
} from "class-validator";

enum Environment {
  Development = "development",
  Production = "production",
}

class EnvironmentVariables {
  @IsDefined()
  @IsEnum(Environment)
  NODE_ENV: Environment;

  @IsNumber()
  @Min(0)
  @Max(65535)
  PORT: number;

  @IsDefined()
  @Contains("mysql")
  DATABASE_URL: string;

  @IsDefined()
  JWT_SECRET: string;

  @IsDefined()
  @IsString()
  COOKIE_SECRET: string;

  @IsDefined()
  @IsString()
  CLD_API_KEY: string;

  @IsDefined()
  @IsString()
  CLD_API_SECRET: string;

  @IsDefined()
  @IsString()
  CLD_CLOUD_NAME: string;

  @IsDefined()
  @IsString()
  SMTP_FROM: string;

  @IsString()
  SMTP_HOST: string;

  @IsString()
  SMTP_PASS: string;

  @Transform(({ value }) => parseInt(value, 10))
  @IsNumber()
  @IsIn([25, 465, 587])
  SMTP_PORT: number;

  @IsEmail({ allow_underscores: true })
  SMTP_USER: string;

  @IsOptional()
  @IsEmail()
  ADMIN_EMAIL: string;

  @IsOptional()
  @IsStrongPassword({
    minLength: 8,
    minLowercase: 1,
    minUppercase: 1,
    minNumbers: 1,
    minSymbols: 1,
  })
  ADMIN_PASSWORD: string;

  @IsOptional()
  @IsString()
  @MaxLength(50)
  ADMIN_FIRST_NAME: string;

  @IsOptional()
  @IsString()
  @MaxLength(50)
  ADMIN_LAST_NAME: string;

  @IsDefined()
  PUBLIC_URL: string;
}

/**
 * Validate the environment variables
 *
 * Any missing or invalid environment variables will throw an error on application startup
 */
export function validate(config: Record<string, unknown>) {
  const validatedConfig = plainToInstance(EnvironmentVariables, config, {
    enableImplicitConversion: true,
  });
  const errors = validateSync(validatedConfig, { skipMissingProperties: false });

  if (errors.length > 0) {
    throw new Error(errors.toString());
  }
  return validatedConfig;
}
