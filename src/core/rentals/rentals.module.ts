import { Module } from "@nestjs/common";
import { BooksModule } from "../books/books.module";
import { UsersModule } from "../users/users.module";
import { RentalsResolver } from "./rentals.resolver";
import { RentalsService } from "./rentals.service";

@Module({
  imports: [BooksModule, UsersModule],
  providers: [RentalsResolver, RentalsService],
  exports: [RentalsService],
})
export class RentalsModule {}
