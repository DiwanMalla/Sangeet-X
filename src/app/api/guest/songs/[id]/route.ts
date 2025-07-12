import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const songId = id;

    const song = await prisma.song.findUnique({
      where: { id: songId },
      include: {
        artist: true,
      },
    });

    if (!song) {
      return NextResponse.json(
        { success: false, error: "Song not found" },
        { status: 404 }
      );
    }

    // Get related songs (same artist or genre)
    const relatedSongs = await prisma.song.findMany({
      where: {
        OR: [{ artistId: song.artistId }, { genre: song.genre }],
        NOT: { id: songId },
      },
      include: {
        artist: true,
      },
      orderBy: { playCount: "desc" },
      take: 5,
    });

    // Increment play count for analytics (guest view)
    await prisma.song.update({
      where: { id: songId },
      data: {
        playCount: {
          increment: 1,
        },
      },
    });

    return NextResponse.json({
      success: true,
      data: {
        song,
        relatedSongs,
      },
    });
  } catch (error) {
    console.error("Error fetching song for guest:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch song" },
      { status: 500 }
    );
  }
}
