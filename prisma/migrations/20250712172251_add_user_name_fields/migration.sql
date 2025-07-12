/*
  Warnings:

  - You are about to drop the column `avatar` on the `users` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "users" DROP COLUMN "avatar",
ADD COLUMN     "firstName" TEXT,
ADD COLUMN     "imageUrl" TEXT,
ADD COLUMN     "lastName" TEXT,
ALTER COLUMN "username" DROP NOT NULL,
ALTER COLUMN "displayName" DROP NOT NULL;
