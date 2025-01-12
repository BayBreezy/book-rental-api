import { Module } from "@nestjs/common";
import { TerminusModule } from "@nestjs/terminus";
import { EmailHealthIndicator } from "../email/email-health-indicator";
import { HealthController } from "./health.controller";

@Module({
  controllers: [HealthController],
  imports: [TerminusModule.forRoot({ errorLogStyle: "pretty" })],
  providers: [EmailHealthIndicator],
})
export class HealthModule {}
