import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "nestjs-prisma";
import { CreateRentalInput } from "./dto/create-rental.input";
import { UpdateRentalInput } from "./dto/update-rental.input";

@Injectable()
export class RentalsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateRentalInput) {
    return await this.prisma.rental.create({
      data: dto,
    });
  }

  async findRentalLateReturns(id: number) {
    return this.prisma.lateReturn.findMany({
      where: { rentalId: id },
    });
  }

  async findAll() {
    return this.prisma.rental.findMany();
  }

  async findOne(id: number) {
    const record = await this.prisma.rental.findUnique({
      where: { id },
    });
    if (!record) {
      throw new NotFoundException(`Rental with id ${id} not found`);
    }
    return record;
  }

  async update(id: number, dto: UpdateRentalInput) {
    await this.findOne(id);
    return this.prisma.rental.update({
      where: { id },
      data: dto,
    });
  }

  async remove(id: number) {
    await this.findOne(id);
    return this.prisma.rental.delete({
      where: { id },
    });
  }
}
