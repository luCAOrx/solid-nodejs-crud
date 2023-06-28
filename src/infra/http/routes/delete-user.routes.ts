import { Router } from "express";

import { DeleteUserController } from "../controllers/delete-user/delete-user-controller";

export const deleteUserRoute = Router();

deleteUserRoute.delete(
  "/users/delete-user/:id",
  new DeleteUserController().handle
);
