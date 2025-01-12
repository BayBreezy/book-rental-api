import { MetaEntity } from "@/common/shared.entity";
import { Field, Float, ObjectType } from "@nestjs/graphql";

@ObjectType({ description: "The cloudinary upload model" })
export class CloudinaryUpload extends MetaEntity {
  @Field({ description: "The public id of the file" })
  public_id: string;

  @Field({ description: "The format of the file", nullable: true })
  format?: string;

  @Field({ description: "The resource type of the file", nullable: true })
  resource_type?: string;

  @Field(() => Float, { description: "The size of the file in bytes", nullable: true })
  bytes?: number;

  @Field(() => Float, { description: "The width of the file in pixels", nullable: true })
  width?: number;

  @Field(() => Float, { description: "The height of the file in pixels", nullable: true })
  height?: number;

  @Field({ description: "The URL of the file" })
  url: string;

  @Field({ description: "The secure URL of the file" })
  secure_url: string;
}
