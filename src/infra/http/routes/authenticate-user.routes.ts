import { Router } from "express";

import { AuthenticateUserController } from "../controllers/authenticate-user/authenticate-user-controller";

export const authenticateUserRoute = Router();

authenticateUserRoute.post("/users/authenticate", async (request, response) => {
  await new AuthenticateUserController().execute(request, response);
});
