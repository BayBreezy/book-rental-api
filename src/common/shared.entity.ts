import { ArgsType, Field, ID, Int, ObjectType, registerEnumType } from "@nestjs/graphql";
import { Role } from "@prisma/client";
import { IsDefined, IsOptional, IsString, Max, Min } from "class-validator";
import { PositiveIntResolver } from "graphql-scalars";

@ObjectType({ description: "Meta information about the record" })
export class MetaEntity {
  @Field(() => ID, { description: "Id of the record" })
  id: number;

  @Field({ description: "Date the record was created" })
  createdAt: Date;

  @Field({ description: "Date the record was last updated" })
  updatedAt: Date;
}

@ArgsType()
export class IdArgsType {
  @Field(() => PositiveIntResolver, { description: "The id of the record" })
  @IsDefined()
  id: number;
}

@ArgsType()
export class PaginationArgs {
  @Field(() => PositiveIntResolver, {
    description: "The page number",
    nullable: true,
    defaultValue: 1,
  })
  @IsOptional()
  @Min(1)
  page: number = 1;

  @Field(() => PositiveIntResolver, {
    description: "The number of records per page",
    nullable: true,
    defaultValue: 20,
  })
  @IsOptional()
  @Min(1)
  @Max(500)
  perPage: number = 20;

  @Field({ description: "The search term", nullable: true })
  @IsOptional()
  @IsString()
  search?: string;
}

registerEnumType(Role, {
  name: "Role", // This is the name that will appear in the GraphQL schema
  description: "The roles available in the system", // Optional description
});

@ObjectType({ description: "Pagination metadata" })
export class PaginationMeta {
  @Field(() => Int, { description: "The total number of records" })
  total: number;

  @Field(() => Int, { description: "The last page number" })
  lastPage: number;

  @Field(() => Int, { description: "The current page number" })
  currentPage: number;

  @Field(() => Int, { description: "The number of records per page" })
  perPage: number;

  @Field(() => Int, { nullable: true, description: "The previous page number" })
  prev: number | null;

  @Field(() => Int, { nullable: true, description: "The next page number" })
  next: number | null;
}

/**
 * A helper function to create a paginated response type
 */
export function PaginatedResponseType<T>(
  classRef: T,
  dataDescription: string = "The list of records",
): any {
  @ObjectType({ isAbstract: true })
  abstract class PaginatedResponse {
    @Field(() => [classRef as any], { description: dataDescription })
    data: T[];

    @Field(() => PaginationMeta, { description: "The pagination metadata" })
    meta: PaginationMeta;
  }
  return PaginatedResponse;
}
