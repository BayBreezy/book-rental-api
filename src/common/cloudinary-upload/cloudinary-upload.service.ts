import { Injectable, Logger, NotFoundException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { Prisma } from "@prisma/client";
import { v2 as cloudinary, ConfigOptions, UploadApiOptions } from "cloudinary";
import { PrismaService } from "nestjs-prisma";
import { paginate } from "../helpers";
import { PaginationArgs } from "../shared.entity";
import { CloudinaryUpload } from "./entity/cloudinary-upload.entity";

@Injectable()
export class CloudinaryUploadService {
  private readonly logger = new Logger(CloudinaryUploadService.name);

  constructor(
    private readonly configService: ConfigService,
    private readonly prisma: PrismaService,
  ) {
    const cloudinaryConfig: ConfigOptions = {
      cloud_name: this.configService.get<string>("CLD_CLOUD_NAME"),
      api_key: this.configService.get<string>("CLD_API_KEY"),
      api_secret: this.configService.get<string>("CLD_API_SECRET"),
    };

    cloudinary.config(cloudinaryConfig);

    // Verify Cloudinary configuration
    const isProduction = this.configService.get<string>("NODE_ENV") === "production";
    if (isProduction) {
      cloudinary.api.ping((error) => {
        if (error) {
          this.logger.error("Cloudinary configuration error: " + error.message);
          throw new Error("Cloudinary configuration error: " + error.message);
        }
        this.logger.log("Cloudinary configuration verified");
      });
    }
  }

  // Expose the cloudinary instance
  getInstance() {
    return cloudinary;
  }

  // Get all upload records
  async getUploads(args?: PaginationArgs) {
    return await paginate<CloudinaryUpload, Prisma.CloudinaryUploadFindManyArgs>(
      this.prisma.cloudinaryUpload,
      {
        where: args?.search
          ? {
              OR: [{ public_id: { contains: args?.search } }],
            }
          : {},
      },
      { page: args.page, perPage: args.perPage },
    );
  }

  //  Upload a file
  async uploadFile(filePath: string, options: UploadApiOptions = {}) {
    try {
      const result = await cloudinary.uploader.upload(filePath, options);
      // Create a new record in the database
      return await this.prisma.cloudinaryUpload.create({
        data: result,
      });
    } catch (error) {
      this.logger.error("File upload error: " + error.message);
      throw new Error(error.message);
    }
  }

  // Delete a file by ID
  async deleteFile(id: number) {
    try {
      const record = await this.prisma.cloudinaryUpload.findUnique({
        where: { id },
      });
      if (!record) throw new NotFoundException("File not found");
      await cloudinary.uploader.destroy(record.public_id);
      return await this.prisma.cloudinaryUpload.delete({
        where: { id },
      });
    } catch (error) {
      this.logger.error("File deletion error: " + error.message);
      throw new Error(error.message);
    }
  }
}
