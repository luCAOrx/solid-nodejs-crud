import { hash } from "bcryptjs";

import { User } from "@domain/entities/user/user";
import { prisma } from "@infra/http/libs/prisma-client";
async function main(): Promise<void> {
  const userOrNull = await prisma.user.findUnique({
    where: {
      email: String(process.env.ADMIN_EMAIL),
    },
  });

  if (userOrNull === null) {
    const {
      id,
      props: { name, job, email, password, role },
      read_time,
      password_reset_token,
      password_reset_token_expiration,
      created_at,
    } = User.create({
      name: "Admin Name",
      job: "admin",
      email: String(process.env.ADMIN_EMAIL),
      password: String(process.env.ADMIN_PASSWORD),
      role: "ADMIN",
    });

    const hashedPassword = await hash(password, 14);

    await prisma.user.create({
      data: {
        id,
        name,
        job,
        email,
        password: hashedPassword,
        role,
        password_reset_token,
        password_reset_token_expiration,
        read_time,
        created_at,
      },
    });
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    process.stdout.write(error);

    await prisma.$disconnect();
    process.exit(1);
  });
