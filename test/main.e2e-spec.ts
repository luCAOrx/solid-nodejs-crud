import { describe, before, after } from "node:test";
import { PrismaTestEnvironment } from "prisma/prismaTestEnvironment";

import { app } from "@infra/http/app";
import { authenticateUserControllerEndToEndTests } from "@infra/http/controllers/authenticate-user/authenticate-user-controller.e2e-spec";
import { deleteUserControllerEndToEndTests } from "@infra/http/controllers/delete-user/delete-user-controller.e2e-spec";
import { getUserControllerEndToEndTests } from "@infra/http/controllers/get-user/get-user-controller.e2e-spec";
import { getUsersControllerEndToEndTests } from "@infra/http/controllers/get-users/get-users-controller.e2e-spec";
import { registerUserControllerEndToEndTests } from "@infra/http/controllers/register-user/register-user-controller.e2e-spec";
import { updateUserControllerEndToEndTests } from "@infra/http/controllers/update-user/update-user-controller.e2e-spec";
import { pageNotFoundErrorEndToEndTests } from "@infra/http/errors/page-not-found/page-not-found-error.e2e-spec";
import { ensureAuthenticatedMiddlewareEndToEndTests } from "@infra/http/middlewares/ensure-authenticated-middleware.e2e-spec";

const prismaTestEnvironment = new PrismaTestEnvironment();
const server = app.listen(process.env.TEST_SERVER_PORT);

describe("End to end (E2E) tests", () => {
  before(async () => {
    console.log("Up database and run migrations");
    await prismaTestEnvironment.setup();
    await new Promise((resolve) => server.once("listening", resolve));
  });

  authenticateUserControllerEndToEndTests();
  deleteUserControllerEndToEndTests();
  getUserControllerEndToEndTests();
  getUsersControllerEndToEndTests();
  registerUserControllerEndToEndTests();
  updateUserControllerEndToEndTests();
  pageNotFoundErrorEndToEndTests();
  ensureAuthenticatedMiddlewareEndToEndTests();

  after(async () => {
    server.close();
    await prismaTestEnvironment.teardown();
  });
});
