import { Global, Module } from "@nestjs/common";
import { CloudinaryUploadController } from "./cloudinary-upload.controller";
import { CloudinaryUploadResolver } from "./cloudinary-upload.resolver";
import { CloudinaryUploadService } from "./cloudinary-upload.service";

@Global()
@Module({
  controllers: [CloudinaryUploadController],
  providers: [CloudinaryUploadService, CloudinaryUploadResolver],
  exports: [CloudinaryUploadService],
})
export class CloudinaryUploadModule {}
