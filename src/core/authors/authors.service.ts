import { paginate } from "@/common/helpers";
import { PaginationArgs } from "@/common/shared.entity";
import { Injectable, NotFoundException } from "@nestjs/common";
import { Author, Prisma } from "@prisma/client";
import { PrismaService } from "nestjs-prisma";
import { CreateAuthorInput } from "./dto/create-author.input";
import { UpdateAuthorInput } from "./dto/update-author.input";

@Injectable()
export class AuthorsService {
  constructor(private readonly prisma: PrismaService) {}
  async create(dto: CreateAuthorInput) {
    const { firstName, lastName, bio, books } = dto;
    return await this.prisma.author.create({
      data: {
        firstName,
        lastName,
        bio,
        books: {
          createMany: {
            data: books,
          },
        },
      },
      include: { books: true },
    });
  }

  async findAuthorBooksById(id: number) {
    return this.prisma.author.findUnique({ where: { id } }).books();
  }
  async findAll(args?: PaginationArgs) {
    return paginate<Author, Prisma.AuthorFindManyArgs>(
      this.prisma.author,
      {
        where: args?.search
          ? {
              OR: [
                { firstName: { contains: args?.search } },
                { lastName: { contains: args?.search } },
                { bio: { contains: args?.search } },
              ],
            }
          : {},
      },
      {
        page: args.page,
        perPage: args.perPage,
      },
    );
  }

  async findOne(id: number) {
    const record = await this.prisma.author.findUnique({
      where: { id },
    });
    if (!record) throw new NotFoundException(`Author #${id} not found`);
    return record;
  }

  async update(id: number, dto: UpdateAuthorInput) {
    await this.findOne(id);
    return await this.prisma.author.update({
      where: { id },
      data: dto,
    });
  }

  async remove(id: number) {
    await this.findOne(id);
    return this.prisma.author.delete({
      where: { id },
    });
  }
}
