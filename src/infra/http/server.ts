import { app } from "./app";

app.listen(process.env.PORT ?? process.env.SERVER_PORT);
