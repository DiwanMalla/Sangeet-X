import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    // Get popular songs (ordered by playCount)
    const popularSongs = await prisma.song.findMany({
      include: {
        artist: {
          select: {
            id: true,
            name: true,
            avatar: true,
          },
        },
      },
      orderBy: { playCount: "desc" },
      take: 10,
    });

    // Get popular artists (ordered by playCount)
    const popularArtists = await prisma.artist.findMany({
      orderBy: { playCount: "desc" },
      take: 8,
    });

    // Get popular genres
    const popularGenres = await prisma.genre.findMany({
      orderBy: { songCount: "desc" },
      take: 6,
    });

    return NextResponse.json({
      success: true,
      data: {
        songs: popularSongs,
        artists: popularArtists,
        genres: popularGenres,
      },
    });
  } catch (error) {
    console.error("Error fetching popular content:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch popular content" },
      { status: 500 }
    );
  }
}
