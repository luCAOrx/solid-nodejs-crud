import { app } from "./app";

app.listen(process.env.PORT ?? process.env.SERVER_PORT, () => {
  console.log("Express server listening on port 3333");
});
