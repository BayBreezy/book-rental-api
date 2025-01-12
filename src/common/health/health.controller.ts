import { Controller, Get } from "@nestjs/common";
import { HealthCheck, HealthCheckService, PrismaHealthIndicator } from "@nestjs/terminus";
import { PrismaClient } from "@prisma/client";
import { PublicRoute } from "../decorators/public-route.decorator";
import { EmailHealthIndicator } from "../email/email-health-indicator";

const prismaClient = new PrismaClient();

@Controller("health")
export class HealthController {
  constructor(
    private health: HealthCheckService,
    private prisma: PrismaHealthIndicator,
    private email: EmailHealthIndicator,
  ) {}

  @Get()
  @HealthCheck()
  @PublicRoute()
  check() {
    return this.health.check([
      () => this.prisma.pingCheck("prisma", prismaClient),
      () => this.email.isHealthy("email"),
    ]);
  }
}
