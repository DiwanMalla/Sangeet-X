import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const artistId = params.id;

    const artist = await prisma.artist.findUnique({
      where: { id: artistId },
      include: {
        songs: {
          orderBy: [{ playCount: "desc" }, { createdAt: "desc" }],
        },
        _count: {
          select: { songs: true },
        },
      },
    });

    if (!artist) {
      return NextResponse.json(
        { success: false, error: "Artist not found" },
        { status: 404 }
      );
    }

    // Get total play count for this artist
    const totalPlays = artist.songs.reduce(
      (sum, song) => sum + song.playCount,
      0
    );

    return NextResponse.json({
      success: true,
      data: {
        artist: {
          ...artist,
          totalPlays,
        },
      },
    });
  } catch (error) {
    console.error("Error fetching artist for guest:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch artist" },
      { status: 500 }
    );
  }
}
