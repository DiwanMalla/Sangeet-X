-- CreateTable
CREATE TABLE "subtitles" (
    "id" TEXT NOT NULL,
    "songId" TEXT NOT NULL,
    "language" TEXT NOT NULL,
    "text" TEXT NOT NULL,
    "startTime" DOUBLE PRECISION NOT NULL,
    "endTime" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "subtitles_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "subtitles" ADD CONSTRAINT "subtitles_songId_fkey" FOREIGN KEY ("songId") REFERENCES "songs"("id") ON DELETE CASCADE ON UPDATE CASCADE;
