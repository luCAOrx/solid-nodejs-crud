-- DropForeignKey
ALTER TABLE "refresh-token" DROP CONSTRAINT "refresh-token_user_id_fkey";

-- AddForeignKey
ALTER TABLE "refresh-token" ADD CONSTRAINT "refresh-token_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;
