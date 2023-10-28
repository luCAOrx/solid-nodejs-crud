/*
  Warnings:

  - A unique constraint covering the columns `[user_id]` on the table `refresh-token` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "refresh-token_user_id_key" ON "refresh-token"("user_id");
