/*
  Warnings:

  - Added the required column `password_reset_token` to the `user` table without a default value. This is not possible if the table is not empty.
  - Added the required column `password_reset_token_expiration` to the `user` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "user" ADD COLUMN     "password_reset_token" TEXT NOT NULL,
ADD COLUMN     "password_reset_token_expiration" TIMESTAMP(3) NOT NULL;
