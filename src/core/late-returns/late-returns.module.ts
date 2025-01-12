import { Module } from "@nestjs/common";
import { RentalsModule } from "../rentals/rentals.module";
import { LateReturnsResolver } from "./late-returns.resolver";
import { LateReturnsService } from "./late-returns.service";

@Module({
  imports: [RentalsModule],
  providers: [LateReturnsResolver, LateReturnsService],
})
export class LateReturnsModule {}
