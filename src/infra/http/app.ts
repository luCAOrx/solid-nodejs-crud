import "dotenv/config";

import "express-async-errors";

import cors from "cors";
import express from "express";

import { registerUserRoute } from "./routes/register-user.routes";

export const app = express();

app.use(cors());
app.use(express.json());
app.use(registerUserRoute);
