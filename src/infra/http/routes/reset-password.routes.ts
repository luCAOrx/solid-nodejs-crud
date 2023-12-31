import { Router } from "express";

import { ResetPasswordController } from "../controllers/reset-password/reset-password-controller";

export const resetPasswordRoute = Router();

resetPasswordRoute.post(
  "/reset-password",
  new ResetPasswordController().handle
);
