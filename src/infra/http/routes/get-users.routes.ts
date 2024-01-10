import { Router } from "express";

import { GetUsersController } from "../controllers/get-users/get-users-controller";
import { EnsureAuthenticated } from "../middlewares/ensure-authenticated-middleware";

export const getUsersRoute = Router();

getUsersRoute.get(
  "/users/get-users/:id",
  new EnsureAuthenticated().handle,
  async (request, response) => {
    await new GetUsersController().execute(request, response);
  }
);
