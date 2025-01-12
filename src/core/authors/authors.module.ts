import { Module } from "@nestjs/common";
import { BooksModule } from "../books/books.module";
import { AuthorsResolver } from "./authors.resolver";
import { AuthorsService } from "./authors.service";

@Module({
  imports: [BooksModule],
  providers: [AuthorsResolver, AuthorsService],
})
export class AuthorsModule {}
