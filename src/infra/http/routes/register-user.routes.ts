import { Router } from "express";

import { RegisterUserController } from "../controllers/register-user/register-user-controller";

export const registerUserRoute = Router();

registerUserRoute.post("/users/register", async (request, response) => {
  await new RegisterUserController().execute(request, response);
});
