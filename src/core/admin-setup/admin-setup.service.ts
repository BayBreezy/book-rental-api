import { Injectable, Logger } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { Prisma, Role } from "@prisma/client";
import * as bcrypt from "bcryptjs";
import { PrismaService } from "nestjs-prisma";

@Injectable()
export class AdminSetupService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly config: ConfigService,
  ) {}

  async setupAdmin() {
    const email = this.config.get<string>("ADMIN_EMAIL");
    const password = this.config.get<string>("ADMIN_PASSWORD");
    const firstName = this.config.get<string>("ADMIN_FIRST_NAME");
    const lastName = this.config.get<string>("ADMIN_LAST_NAME");
    if (!email || !password || !firstName || !lastName) {
      return;
    }

    const admin: Prisma.UserCreateInput = {
      email,
      password: await bcrypt.hash(password, 12),
      firstName,
      lastName,
      role: "ADMIN" as Role,
      active: true,
      verified: true,
    };

    await this.prisma.user.upsert({
      where: { email },
      update: admin,
      create: admin,
    });
    Logger.log("Admin user updated", "AdminSetupService");
  }
}
