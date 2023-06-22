import { Router } from "express";

import { RegisterUserController } from "../controllers/register-user/register-user-controller";

export const registerUserRoute = Router();

registerUserRoute.post("/users/register", new RegisterUserController().handle);
