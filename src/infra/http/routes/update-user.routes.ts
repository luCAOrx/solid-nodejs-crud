import { Router } from "express";

import { UpdateUserController } from "../controllers/update-user/update-user-controller";

export const updateUserRoute = Router();

updateUserRoute.put(
  "/users/update-user/:id",
  new UpdateUserController().handle
);
