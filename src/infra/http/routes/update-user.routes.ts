import { Router } from "express";

import { UpdateUserController } from "../controllers/update-user/update-user-controller";
import { EnsureAuthenticated } from "../middlewares/ensure-authenticated-middleware";

export const updateUserRoute = Router();

updateUserRoute.put(
  "/users/update-user/:id",
  new EnsureAuthenticated().handle,
  new UpdateUserController().handle
);
