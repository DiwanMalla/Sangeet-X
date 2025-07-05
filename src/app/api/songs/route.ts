import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const songs = await prisma.song.findMany({
      include: {
        artist: {
          select: {
            id: true,
            name: true,
            avatar: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({
      success: true,
      data: songs,
      total: songs.length,
    });
  } catch (error) {
    console.error("Error fetching songs:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch songs" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const songData = await request.json();

    // Validate required fields
    const requiredFields = ["title", "artistId", "audioUrl", "coverUrl"];
    for (const field of requiredFields) {
      if (!songData[field]) {
        return NextResponse.json(
          { success: false, error: `${field} is required` },
          { status: 400 }
        );
      }
    }

    // Create new song in database
    const newSong = await prisma.song.create({
      data: {
        title: songData.title,
        artistId: songData.artistId,
        album: songData.album || null,
        duration: songData.duration || 0,
        genre: songData.genre || null,
        year: songData.year || new Date().getFullYear(),
        coverUrl: songData.coverUrl,
        audioUrl: songData.audioUrl,
        popularity: songData.popularity || 0,
        playCount: 0,
        isLiked: false,
      },
    });

    return NextResponse.json({
      success: true,
      data: newSong,
      message: "Song created successfully",
    });
  } catch (error) {
    console.error("Error creating song:", error);
    return NextResponse.json(
      { success: false, error: "Failed to create song" },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { success: false, error: "Song ID is required" },
        { status: 400 }
      );
    }

    const songData = await request.json();

    const updatedSong = await prisma.song.update({
      where: { id },
      data: {
        title: songData.title,
        artistId: songData.artistId,
        album: songData.album || null,
        duration: songData.duration,
        genre: songData.genre || null,
        year: songData.year,
        coverUrl: songData.coverUrl,
        audioUrl: songData.audioUrl,
        popularity: songData.popularity,
        playCount: songData.playCount,
        isLiked: songData.isLiked,
      },
      include: {
        artist: {
          select: {
            id: true,
            name: true,
            avatar: true,
          },
        },
      },
    });

    return NextResponse.json({
      success: true,
      data: updatedSong,
      message: "Song updated successfully",
    });
  } catch (error) {
    console.error("Error updating song:", error);
    return NextResponse.json(
      { success: false, error: "Failed to update song" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { success: false, error: "Song ID is required" },
        { status: 400 }
      );
    }

    await prisma.song.delete({
      where: { id },
    });

    return NextResponse.json({
      success: true,
      message: "Song deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting song:", error);
    return NextResponse.json(
      { success: false, error: "Failed to delete song" },
      { status: 500 }
    );
  }
}
