import "dotenv/config";

import "express-async-errors";

import cors from "cors";
import express from "express";
import { serve, setup } from "swagger-ui-express";

import { swaggerSpec } from "@doc/swagger";

import { pageNotFoundError } from "./errors/page-not-found/page-not-found-error";
import { authenticateUserRoute } from "./routes/authenticate-user.routes";
import { deleteUserRoute } from "./routes/delete-user.routes";
import { getUserRoute } from "./routes/get-user.routes";
import { getUsersRoute } from "./routes/get-users.routes";
import { refreshJwtTokenRoute } from "./routes/refresh-jwt-token.routes";
import { registerUserRoute } from "./routes/register-user.routes";
import { updateUserRoute } from "./routes/update-user.routes";

export const app = express();

app.use(cors());
app.use(express.json());
app.use(
  "/api-docs",
  serve,
  setup(swaggerSpec, {
    customSiteTitle: "SOLID Node.JS CRUD",
  })
);
app.use(registerUserRoute);
app.use(getUserRoute);
app.use(getUsersRoute);
app.use(updateUserRoute);
app.use(deleteUserRoute);
app.use(authenticateUserRoute);
app.use(refreshJwtTokenRoute);
app.all("*", pageNotFoundError);
