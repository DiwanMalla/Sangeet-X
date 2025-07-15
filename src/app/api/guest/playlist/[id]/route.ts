import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const currentSongId = id;

    console.log(`Playlist API: Fetching playlist for song ${currentSongId}`);

    // First, get the current song to understand its context
    const currentSong = await prisma.song.findUnique({
      where: { id: currentSongId },
      include: {
        artist: true,
      },
    });

    if (!currentSong) {
      console.log(`Playlist API: Song ${currentSongId} not found`);
      return NextResponse.json(
        { success: false, error: "Song not found" },
        { status: 404 }
      );
    }

    console.log(
      `Playlist API: Found current song ${currentSong.title} by ${currentSong.artist.name}`
    );

    // Get all related songs (same artist or genre) - no limit for playlist
    const relatedSongs = await prisma.song.findMany({
      where: {
        OR: [{ artistId: currentSong.artistId }, { genre: currentSong.genre }],
        NOT: { id: currentSongId },
      },
      include: {
        artist: true,
      },
      orderBy: { playCount: "desc" },
    });

    console.log(`Playlist API: Found ${relatedSongs.length} related songs`);

    // Create the full playlist with current song at the beginning
    const playlist = [currentSong, ...relatedSongs];

    console.log(`Playlist API: Created playlist with ${playlist.length} songs`);

    return NextResponse.json({
      success: true,
      data: {
        playlist,
        currentSongIndex: 0, // Current song is always at index 0
        totalSongs: playlist.length,
      },
    });
  } catch (error) {
    console.error("Playlist API Error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch playlist" },
      { status: 500 }
    );
  }
}
