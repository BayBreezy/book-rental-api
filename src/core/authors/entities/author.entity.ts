import { MetaEntity } from "@/common/shared.entity";
import { Book } from "@core/books/entities/book.entity";
import { Field, ObjectType } from "@nestjs/graphql";

@ObjectType()
export class Author extends MetaEntity {
  @Field({ description: "Author's first name" })
  firstName: string;

  @Field({ description: "Author's last name" })
  lastName: string;

  @Field({ description: "Author's bio", nullable: true })
  bio?: string;

  @Field(() => [Book], { description: "Books written by the author", nullable: "items" })
  books: Book[];
}
