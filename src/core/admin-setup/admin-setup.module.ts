import { Module, OnModuleInit } from "@nestjs/common";
import { AdminSetupService } from "./admin-setup.service";

@Module({
  providers: [AdminSetupService],
  exports: [AdminSetupService],
})
export class AdminSetupModule implements OnModuleInit {
  constructor(private readonly adminSetupService: AdminSetupService) {}
  async onModuleInit() {
    await this.adminSetupService.setupAdmin();
  }
}
