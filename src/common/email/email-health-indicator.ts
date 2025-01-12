import { Injectable } from "@nestjs/common";
import { HealthCheckError, HealthIndicator, HealthIndicatorResult } from "@nestjs/terminus";
import { EmailService } from "./email.service";

@Injectable()
export class EmailHealthIndicator extends HealthIndicator {
  constructor(private readonly emailService: EmailService) {
    super();
  }

  async isHealthy(key: string): Promise<HealthIndicatorResult> {
    const res = await this.emailService.healthCheckSMTP();
    const result = this.getStatus(key, res);
    if (res) return result;
    throw new HealthCheckError("SMTP server is not healthy", result);
  }
}
