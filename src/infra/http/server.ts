import { deleteUserAfterThirtyMinutes } from "prisma/deleteUserAfterThirtyMinutes";

import { app } from "./app";

app.listen(process.env.PORT ?? process.env.SERVER_PORT, async () => {
  await deleteUserAfterThirtyMinutes();

  setInterval(async () => {
    await deleteUserAfterThirtyMinutes();
  }, 30 * 60 * 1000);
});
