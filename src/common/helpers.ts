import { paginator } from "@nodeteam/nestjs-prisma-pagination";

/**
 * Method used to perform pagination with `Prisma`
 */
export const paginate = paginator({ page: 1, perPage: 20 });
