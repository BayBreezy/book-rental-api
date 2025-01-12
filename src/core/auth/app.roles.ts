import { Role } from "@prisma/client";
import { RolesBuilder } from "nest-access-control";

export const roles: RolesBuilder = new RolesBuilder();

roles
  .grant(Role.USER)
  .update("profile")
  .read("profile")
  .read("author")
  .read("book")
  .read("upload")
  .delete("upload")
  .readOwn("late-returns")
  .readOwn("rental")
  .grant(Role.ADMIN)
  .extend(Role.USER)
  .create("author")
  .update("author")
  .delete("author")
  .create("book")
  .update("book")
  .delete("book")
  .create("rental")
  .update("rental")
  .delete("rental")
  .create("late-returns")
  .update("late-returns")
  .delete("late-returns")
  .create("user")
  .update("user")
  .delete("user")
  .read("user");
