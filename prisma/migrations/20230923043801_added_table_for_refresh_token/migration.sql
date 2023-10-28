-- CreateTable
CREATE TABLE "refresh-token" (
    "id" TEXT NOT NULL,
    "expires_in" INTEGER NOT NULL,
    "user_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "refresh-token_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "refresh-token" ADD CONSTRAINT "refresh-token_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
