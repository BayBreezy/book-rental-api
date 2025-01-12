import { PaginatedResponseType } from "@/common/shared.entity";
import { ObjectType } from "@nestjs/graphql";
import { FileSystemStoredFile, IsFile, MaxFileSize } from "nestjs-form-data";
import { CloudinaryUpload } from "../entity/cloudinary-upload.entity";

export class CloudinaryUploadDto {
  @IsFile()
  @MaxFileSize(10e7) // 100MB - Change this based on your requirements
  file: FileSystemStoredFile;
}

@ObjectType()
export class PaginatedCloudinaryUploads extends PaginatedResponseType(
  CloudinaryUpload,
  "A list of uploaded records from the DB",
) {}
