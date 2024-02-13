import { execSync } from "node:child_process";

import { prisma } from "@infra/http/libs/prisma-client";

export class PrismaTestEnvironment {
  async setup(): Promise<void> {
    execSync("npm run prisma:migrate");
    execSync("npm run prisma:seed");
  }

  async teardown(): Promise<void> {
    await prisma.user.deleteMany();
  }
}
