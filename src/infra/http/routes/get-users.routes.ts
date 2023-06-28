import { Router } from "express";

import { GetUsersController } from "../controllers/get-users/get-users-controller";

export const getUsersRoute = Router();

getUsersRoute.get("/users/get-users", new GetUsersController().handle);
