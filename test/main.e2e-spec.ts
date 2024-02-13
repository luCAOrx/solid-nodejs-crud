import { describe, before, after } from "node:test";
import { deleteUserAfterThirtyMinutesEndToEndTest } from "prisma/deleteUserAfterThirtyMinutes.e2e-spec";
import { PrismaTestEnvironment } from "prisma/prismaTestEnvironment";

import { app } from "@infra/http/app";
import { authenticateUserControllerEndToEndTests } from "@infra/http/controllers/authenticate-user/authenticate-user-controller.e2e-spec";
import { deleteUserControllerEndToEndTests } from "@infra/http/controllers/delete-user/delete-user-controller.e2e-spec";
import { forgotPasswordControllerEndToEndTests } from "@infra/http/controllers/forgot-password/forgot-password-controller.e2e-spec";
import { getUserControllerEndToEndTests } from "@infra/http/controllers/get-user/get-user-controller.e2e-spec";
import { getUsersControllerEndToEndTests } from "@infra/http/controllers/get-users/get-users-controller.e2e-spec";
import { refreshJwtTokenControllerEndToEndTests } from "@infra/http/controllers/refresh-jwt-token/refresh-jwt-token-controller.e2e-spec";
import { registerUserControllerEndToEndTests } from "@infra/http/controllers/register-user/register-user-controller.e2e-spec";
import { resetPasswordControllerEndToEndTests } from "@infra/http/controllers/reset-password/reset-password-controller.e2e-spec";
import { updateUserControllerEndToEndTests } from "@infra/http/controllers/update-user/update-user-controller.e2e-spec";
import { pageNotFoundErrorEndToEndTests } from "@infra/http/errors/page-not-found/page-not-found-error.e2e-spec";
import { ensureAuthenticatedMiddlewareEndToEndTests } from "@infra/http/middlewares/ensure-authenticated-middleware.e2e-spec";

import {
  MakeAdminUserFactory,
  MakeUserFactory,
} from "./factories/make-user-factory";

const prismaTestEnvironment = new PrismaTestEnvironment();
const server = app.listen(process.env.TEST_SERVER_PORT);

describe("End to end (E2E) tests", () => {
  before(async () => {
    process.stdout.write(
      `Uploading the database, running migrations, seeds and up the server, wait...\n`
    );

    await prismaTestEnvironment.setup();
    await new Promise((resolve) => server.once("listening", resolve));

    process.stdout.write(`Registering admin user, wait...\n`);

    await new MakeAdminUserFactory().toHttp({});

    process.stdout.write(`Registering 20 users, wait...\n`);

    for (let i = 0; i < 20; i++) {
      await new MakeUserFactory().toHttp({
        override: {
          email: `joe${i}@example.com`,
        },
      });
    }
  });

  authenticateUserControllerEndToEndTests();
  deleteUserControllerEndToEndTests();
  getUserControllerEndToEndTests();
  getUsersControllerEndToEndTests();
  registerUserControllerEndToEndTests();
  updateUserControllerEndToEndTests();
  pageNotFoundErrorEndToEndTests();
  ensureAuthenticatedMiddlewareEndToEndTests();
  refreshJwtTokenControllerEndToEndTests();
  forgotPasswordControllerEndToEndTests();
  resetPasswordControllerEndToEndTests();
  deleteUserAfterThirtyMinutesEndToEndTest();

  after(async () => {
    server.close();
    await prismaTestEnvironment.teardown();
  });
});
