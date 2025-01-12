import { paginate } from "@/common/helpers";
import { PaginationArgs } from "@/common/shared.entity";
import { Injectable, NotFoundException } from "@nestjs/common";
import { Book, Prisma } from "@prisma/client";
import { PrismaService } from "nestjs-prisma";
import { CreateBookInput } from "./dto/create-book.input";
import { UpdateBookInput } from "./dto/update-book.input";

@Injectable()
export class BooksService {
  constructor(private readonly prisma: PrismaService) {}

  async findBookAuthor(id: number) {
    return this.prisma.author.findUnique({ where: { id } });
  }

  async findBookRentals(id: number) {
    return this.prisma.rental.findMany({ where: { bookId: id } });
  }

  async create(dto: CreateBookInput) {
    return await this.prisma.book.create({
      data: {
        ...dto,
        author: {
          create: dto.author
            ? {
                firstName: dto.author.firstName,
                lastName: dto.author.lastName,
                bio: dto.author.bio,
              }
            : undefined,
        },
      },
      include: { author: true },
    });
  }

  async findAll(args?: PaginationArgs) {
    return await paginate<Book, Prisma.BookFindManyArgs>(
      this.prisma.book,
      {
        where: args?.search
          ? {
              OR: [{ title: { contains: args?.search } }, { isbn: { contains: args?.search } }],
            }
          : {},
      },
      { page: args.page, perPage: args.perPage },
    );
  }

  async findOne(id: number) {
    const book = await this.prisma.book.findUnique({ where: { id } });
    if (!book) {
      throw new NotFoundException(`Book with ID ${id} not found`);
    }
    return book;
  }

  async update(id: number, dto: UpdateBookInput) {
    await this.findOne(id);
    return await this.prisma.book.update({
      where: { id },
      data: dto,
    });
  }

  async remove(id: number) {
    await this.prisma.book.findUnique({ where: { id } });
    return this.prisma.book.delete({ where: { id } });
  }
}
