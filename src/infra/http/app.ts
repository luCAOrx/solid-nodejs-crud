import "dotenv/config";

import "express-async-errors";

import cors from "cors";
import express from "express";

import { deleteUserRoute } from "./routes/delete-user.routes";
import { getUserRoute } from "./routes/get-user.routes";
import { getUsersRoute } from "./routes/get-users.routes";
import { registerUserRoute } from "./routes/register-user.routes";
import { updateUserRoute } from "./routes/update-user.routes";

export const app = express();

app.use(cors());
app.use(express.json());
app.use(registerUserRoute);
app.use(getUserRoute);
app.use(getUsersRoute);
app.use(updateUserRoute);
app.use(deleteUserRoute);
