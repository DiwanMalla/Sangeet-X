/*
  Warnings:

  - You are about to drop the column `artist` on the `songs` table. All the data in the column will be lost.
  - Added the required column `artistId` to the `songs` table without a default value. This is not possible if the table is not empty.

*/
-- First, add the artistId column as nullable
ALTER TABLE "songs" ADD COLUMN "artistId" TEXT;

-- CreateTable
CREATE TABLE "artists" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "bio" TEXT,
    "avatar" TEXT,
    "coverImage" TEXT,
    "website" TEXT,
    "socialLinks" JSONB,
    "verified" BOOLEAN NOT NULL DEFAULT false,
    "songCount" INTEGER NOT NULL DEFAULT 0,
    "playCount" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "artists_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "artists_name_key" ON "artists"("name");

-- Migrate existing data: create artists from existing song artist names
INSERT INTO "artists" ("id", "name", "createdAt", "updatedAt")
SELECT 
    gen_random_uuid()::text,
    "artist",
    NOW(),
    NOW()
FROM "songs" 
WHERE "artist" IS NOT NULL
GROUP BY "artist";

-- Update songs to reference the new artist records
UPDATE "songs" 
SET "artistId" = "artists"."id"
FROM "artists"
WHERE "songs"."artist" = "artists"."name";

-- Make artistId required
ALTER TABLE "songs" ALTER COLUMN "artistId" SET NOT NULL;

-- Drop the old artist column
ALTER TABLE "songs" DROP COLUMN "artist";

-- AddForeignKey
ALTER TABLE "songs" ADD CONSTRAINT "songs_artistId_fkey" FOREIGN KEY ("artistId") REFERENCES "artists"("id") ON DELETE CASCADE ON UPDATE CASCADE;
