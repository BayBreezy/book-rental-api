import { MiddlewareConsumer, Module } from "@nestjs/common";
import { CloudinaryUploadModule } from "./cloudinary-upload/cloudinary-upload.module";
import { EmailModule } from "./email/email.module";
import { HealthModule } from "./health/health.module";
import { DevLoggerMiddleware, ProdLoggerMiddleware } from "./middleware/morgan";

@Module({
  imports: [CloudinaryUploadModule, EmailModule, HealthModule],
})
export class CommonModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(DevLoggerMiddleware, ProdLoggerMiddleware).forRoutes("*");
  }
}
