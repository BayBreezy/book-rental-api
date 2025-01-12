import { Test, TestingModule } from "@nestjs/testing";
import { LateReturnsResolver } from "./late-returns.resolver";
import { LateReturnsService } from "./late-returns.service";

describe("LateReturnsResolver", () => {
  let resolver: LateReturnsResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [LateReturnsResolver, LateReturnsService],
    }).compile();

    resolver = module.get<LateReturnsResolver>(LateReturnsResolver);
  });

  it("should be defined", () => {
    expect(resolver).toBeDefined();
  });
});
