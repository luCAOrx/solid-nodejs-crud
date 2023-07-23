import { app } from "./app";

export const server = app.listen(process.env.PORT ?? process.env.SERVER_PORT);
