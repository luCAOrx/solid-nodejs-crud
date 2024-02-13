import { prisma } from "@infra/http/libs/prisma-client";

export async function deleteUserAfterThirtyMinutes(): Promise<void> {
  const currentDate = new Date();

  const thirtyMinutesAgo = new Date(currentDate.getTime() + 30 * 60 * 1000);

  const users = await prisma.user.findMany({
    where: {
      created_at: {
        lt: thirtyMinutesAgo,
      },
    },
    select: {
      id: true,
      created_at: true,
      role: true,
    },
  });

  for (const user of users) {
    if (user.role === "COMMON") {
      await prisma.user.delete({
        where: {
          id: user.id,
        },
      });
    }
  }
}
