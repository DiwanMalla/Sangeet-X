import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const songId = id;

    // Get autoplay parameter from URL query
    const { searchParams } = new URL(request.url);
    const autoplay = searchParams.get("autoplay") === "true";

    console.log(`API: Fetching song ${songId} with autoplay=${autoplay}`);

    const song = await prisma.song.findUnique({
      where: { id: songId },
      include: { artist: true },
    });

    if (!song) {
      console.log(`API: Song ${songId} not found`);
      return NextResponse.json(
        { success: false, error: "Song not found" },
        { status: 404 }
      );
    }

    console.log(`API: Found song ${song.title} by ${song.artist.name}`);

    // Get related songs (same artist or genre)
    const relatedSongsQuery = {
      where: {
        OR: [{ artistId: song.artistId }, { genre: song.genre }],
        NOT: { id: songId },
      },
      include: {
        artist: true,
      },
      orderBy: { playCount: "desc" as const },
    };

    // When autoplay is on, fetch all available songs
    // When autoplay is off, limit to 5 songs
    const relatedSongs = await prisma.song.findMany({
      ...relatedSongsQuery,
      ...(autoplay ? {} : { take: 5 }),
    });

    console.log(
      `API: Found ${relatedSongs.length} related songs (autoplay: ${autoplay})`
    );
    console.log(
      "API: Related songs:",
      relatedSongs.map((s) => s.title)
    );

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
