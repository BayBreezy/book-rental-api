import { Module } from "@nestjs/common";
import { CommonModule } from "src/common/common.module";
import { AdminSetupModule } from "./admin-setup/admin-setup.module";
import { AuthModule } from "./auth/auth.module";
import { AuthorsModule } from "./authors/authors.module";
import { BooksModule } from "./books/books.module";
import { LateReturnsModule } from "./late-returns/late-returns.module";
import { RentalsModule } from "./rentals/rentals.module";
import { UsersModule } from "./users/users.module";

@Module({
  imports: [
    BooksModule,
    AuthorsModule,
    RentalsModule,
    LateReturnsModule,
    UsersModule,
    CommonModule,
    AuthModule,
    AdminSetupModule,
  ],
})
export class CoreModule {}
