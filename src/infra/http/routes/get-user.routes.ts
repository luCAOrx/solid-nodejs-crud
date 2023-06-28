import { Router } from "express";

import { GetUserController } from "../controllers/get-user/get-user-controller";

export const getUserRoute = Router();

getUserRoute.get("/users/get-user/:id", new GetUserController().handle);
