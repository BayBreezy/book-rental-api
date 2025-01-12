import { Injectable, NotFoundException } from "@nestjs/common";
import * as bcrypt from "bcryptjs";
import { PrismaService } from "nestjs-prisma";
import { CreateUserInput } from "./dto/create-user.input";
import { UpdateUserInput } from "./dto/update-user.input";

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async getUserRentals(userId: number) {
    return this.prisma.rental.findMany({
      where: { userId },
      include: {
        book: true,
        lateReturns: true,
        user: true,
      },
    });
  }

  async getUserLateReturns(userId: number) {
    return this.prisma.lateReturn.findMany({
      where: { userId },
      include: {
        rental: true,
        user: true,
      },
    });
  }

  async create(dto: CreateUserInput) {
    const userExists = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });
    if (userExists) throw new Error("User already exists");
    let password: string | undefined;
    if (dto.password) password = await bcrypt.hash(dto.password, 12);
    return this.prisma.user.create({
      data: {
        ...dto,
        password,
      },
    });
  }

  async findAll() {
    return this.prisma.user.findMany();
  }

  async findOne(id: number) {
    const user = await this.prisma.user.findUnique({
      where: { id },
    });
    if (!user) throw new NotFoundException(`User with id ${id} not found`);
    return user;
  }

  async update(id: number, dto: UpdateUserInput) {
    await this.findOne(id);
    return this.prisma.user.update({
      where: { id },
      data: dto,
    });
  }

  async remove(id: number) {
    await this.findOne(id);
    return this.prisma.user.delete({
      where: { id },
    });
  }
}
