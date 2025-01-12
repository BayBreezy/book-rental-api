import { Args, Mutation, Query, Resolver } from "@nestjs/graphql";
import { UseRoles } from "nest-access-control";
import { IdArgsType, PaginationArgs } from "../shared.entity";
import { CloudinaryUploadService } from "./cloudinary-upload.service";
import { PaginatedCloudinaryUploads } from "./dto/cloudinary-upload.dto";
import { CloudinaryUpload } from "./entity/cloudinary-upload.entity";

@Resolver(() => CloudinaryUpload)
export class CloudinaryUploadResolver {
  constructor(private readonly cloudinaryService: CloudinaryUploadService) {}

  @Query(() => PaginatedCloudinaryUploads, {
    name: "getCloudinaryUploads",
    description: "Find all uploaded file data that is stored in the DB",
  })
  @UseRoles({ resource: "upload", action: "read" })
  findAll(@Args() args: PaginationArgs) {
    return this.cloudinaryService.getUploads(args);
  }

  @Mutation(() => CloudinaryUpload, {
    name: "removeCloudinaryUpload",
    description: "Delete a file by its ID",
  })
  @UseRoles({ resource: "upload", action: "delete" })
  delete(@Args() { id }: IdArgsType) {
    return this.cloudinaryService.deleteFile(id);
  }
}
