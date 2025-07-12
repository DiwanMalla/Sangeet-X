import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { songId } = body;

    if (!songId) {
      return NextResponse.json(
        { success: false, error: "Song ID is required" },
        { status: 400 }
      );
    }

    // Check if song is already in playlist
    const existingSong = await prisma.playlistSong.findUnique({
      where: {
        playlistId_songId: {
          playlistId: id,
          songId,
        },
      },
    });

    if (existingSong) {
      return NextResponse.json(
        { success: false, error: "Song already in playlist" },
        { status: 400 }
      );
    }

    // Get the current highest position
    const lastSong = await prisma.playlistSong.findFirst({
      where: { playlistId: id },
      orderBy: { position: "desc" },
    });

    const position = lastSong ? lastSong.position + 1 : 0;

    const playlistSong = await prisma.playlistSong.create({
      data: {
        playlistId: id,
        songId,
        position,
      },
      include: {
        song: {
          include: {
            artist: true,
          },
        },
      },
    });

    return NextResponse.json({
      success: true,
      data: playlistSong,
    });
  } catch (error) {
    console.error("Error adding song to playlist:", error);
    return NextResponse.json(
      { success: false, error: "Failed to add song to playlist" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { searchParams } = new URL(request.url);
    const songId = searchParams.get("songId");

    if (!songId) {
      return NextResponse.json(
        { success: false, error: "Song ID is required" },
        { status: 400 }
      );
    }

    await prisma.playlistSong.delete({
      where: {
        playlistId_songId: {
          playlistId: id,
          songId,
        },
      },
    });

    return NextResponse.json({
      success: true,
      message: "Song removed from playlist",
    });
  } catch (error) {
    console.error("Error removing song from playlist:", error);
    return NextResponse.json(
      { success: false, error: "Failed to remove song from playlist" },
      { status: 500 }
    );
  }
}
