import { Router } from "express";

import { GetUserController } from "../controllers/get-user/get-user-controller";
import { EnsureAuthenticated } from "../middlewares/ensure-authenticated-middleware";

export const getUserRoute = Router();

getUserRoute.get(
  "/users/get-user/:id",
  new EnsureAuthenticated().handle,
  async (request, response) => {
    await new GetUserController().execute(request, response);
  }
);
