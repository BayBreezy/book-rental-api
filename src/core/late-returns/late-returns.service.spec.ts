import { Test, TestingModule } from "@nestjs/testing";
import { LateReturnsService } from "./late-returns.service";

describe("LateReturnsService", () => {
  let service: LateReturnsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [LateReturnsService],
    }).compile();

    service = module.get<LateReturnsService>(LateReturnsService);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });
});
