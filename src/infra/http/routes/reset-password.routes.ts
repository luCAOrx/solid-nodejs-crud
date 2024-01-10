import { Router } from "express";

import { ResetPasswordController } from "../controllers/reset-password/reset-password-controller";

export const resetPasswordRoute = Router();

resetPasswordRoute.post("/reset-password", async (request, response) => {
  await new ResetPasswordController().execute(request, response);
});
