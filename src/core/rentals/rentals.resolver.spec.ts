import { Test, TestingModule } from "@nestjs/testing";
import { RentalsResolver } from "./rentals.resolver";
import { RentalsService } from "./rentals.service";

describe("RentalsResolver", () => {
  let resolver: RentalsResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RentalsResolver, RentalsService],
    }).compile();

    resolver = module.get<RentalsResolver>(RentalsResolver);
  });

  it("should be defined", () => {
    expect(resolver).toBeDefined();
  });
});
