import { Router } from "express";

import { DeleteUserController } from "../controllers/delete-user/delete-user-controller";
import { EnsureAuthenticated } from "../middlewares/ensure-authenticated-middleware";

export const deleteUserRoute = Router();

deleteUserRoute.delete(
  "/users/delete-user/:id",
  new EnsureAuthenticated().handle,
  async (request, response) => {
    await new DeleteUserController().execute(request, response);
  }
);
