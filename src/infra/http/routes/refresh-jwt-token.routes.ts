import { Router } from "express";

import { RefreshJwtTokenController } from "../controllers/refresh-jwt-token/refresh-jwt-token-controller";

export const refreshJwtTokenRoute = Router();

refreshJwtTokenRoute.post(
  "/users/refresh-token",
  new RefreshJwtTokenController().handle
);
