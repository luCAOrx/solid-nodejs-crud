import { Router } from "express";

import { ForgotPasswordController } from "../controllers/forgot-password/forgot-password-controller";

export const forgotPasswordRoute = Router();

forgotPasswordRoute.post(
  "/forgot-password",
  new ForgotPasswordController().handle
);
