/*
  Warnings:

  - You are about to alter the column `read_time` on the `User` table. The data in that column could be lost. The data in that column will be cast from `Decimal(65,30)` to `BigInt`.
  - Made the column `read_time` on table `User` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "User" ALTER COLUMN "read_time" SET NOT NULL,
ALTER COLUMN "read_time" SET DATA TYPE BIGINT;
