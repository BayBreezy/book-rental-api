import { faker } from "@faker-js/faker";
import { PrismaClient } from "@prisma/client";
import * as bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  await prisma.author.deleteMany();
  await prisma.book.deleteMany();
  await prisma.user.deleteMany();

  // create dummy books with authors and all
  for (let i = 0; i < 10; i++) {
    await prisma.book.create({
      data: {
        title: faker.book.title(),
        isbn: faker.commerce.isbn(),
        available: faker.helpers.arrayElement([true, false]),
        cost: faker.number.float({ min: 0, max: 1000, fractionDigits: 2 }),
        costPerLateDay: faker.number.float({ min: 0, max: 100, fractionDigits: 2 }),
        description: faker.lorem.paragraph(2),
        author: {
          create: {
            firstName: faker.person.firstName(),
            lastName: faker.person.lastName(),
            bio: faker.lorem.paragraph(2),
          },
        },
      },
    });
  }
  for (let i = 0; i < 5; i++) {
    await prisma.user.create({
      data: {
        firstName: faker.person.firstName(),
        lastName: faker.person.lastName(),
        email: faker.internet.email(),
        password: await bcrypt.hash("P@$$w0rd123", 12),
        role: faker.helpers.arrayElement(["ADMIN", "USER"]),
      },
    });
  }

  console.log("Books & Users created successfully");
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
