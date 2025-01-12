import { paginate } from "@/common/helpers";
import { PaginationArgs } from "@/common/shared.entity";
import { Injectable, NotFoundException } from "@nestjs/common";
import { LateReturn, Prisma } from "@prisma/client";
import { PrismaService } from "nestjs-prisma";
import { CreateLateReturnInput } from "./dto/create-late-return.input";
import { UpdateLateReturnInput } from "./dto/update-late-return.input";

@Injectable()
export class LateReturnsService {
  constructor(private readonly prisma: PrismaService) {}

  create(dto: CreateLateReturnInput) {
    return this.prisma.lateReturn.create({ data: dto });
  }

  async findAll(args?: PaginationArgs) {
    return paginate<LateReturn, Prisma.LateReturnFindManyArgs>(
      this.prisma.lateReturn,
      {
        where: args.search
          ? {
              OR: [
                {
                  user: {
                    OR: [
                      { email: { contains: args.search } },
                      { firstName: { contains: args.search } },
                      { lastName: { contains: args.search } },
                    ],
                  },
                },
              ],
            }
          : {},
      },
      {
        page: args?.page,
        perPage: args?.perPage,
      },
    );
  }

  async findOne(id: number) {
    const record = await this.prisma.lateReturn.findUnique({ where: { id } });
    if (!record) throw new NotFoundException(`Late return with ID ${id} not found`);
    return record;
  }

  async update(id: number, dto: UpdateLateReturnInput) {
    await this.findOne(id);
    return this.prisma.lateReturn.update({ where: { id }, data: dto });
  }

  async remove(id: number) {
    await this.findOne(id);
    return this.prisma.lateReturn.delete({ where: { id } });
  }
}
