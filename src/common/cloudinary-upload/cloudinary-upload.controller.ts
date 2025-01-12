import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Query } from "@nestjs/common";
import { FileSystemStoredFile, FormDataRequest } from "nestjs-form-data";
import { PaginationArgs } from "../shared.entity";
import { CloudinaryUploadService } from "./cloudinary-upload.service";
import { CloudinaryUploadDto } from "./dto/cloudinary-upload.dto";

@Controller("cloudinary-upload")
export class CloudinaryUploadController {
  constructor(private readonly cloudinaryUploadService: CloudinaryUploadService) {}

  @Get()
  async getUploads(@Query() args: PaginationArgs) {
    return await this.cloudinaryUploadService.getUploads(args);
  }

  @Post()
  @FormDataRequest({ storage: FileSystemStoredFile })
  async upload(@Body() dto: CloudinaryUploadDto) {
    return await this.cloudinaryUploadService.uploadFile(dto.file.path);
  }

  @Delete(":id")
  async delete(@Param("id", ParseIntPipe) id: number) {
    return await this.cloudinaryUploadService.deleteFile(id);
  }
}
