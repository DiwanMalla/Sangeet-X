import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { Song } from "@/lib/types";

export async function GET() {
  try {
    const songs = await prisma.song.findMany({
      orderBy: { createdAt: 'desc' }
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
    const requiredFields = ["title", "artist", "audioUrl", "coverUrl"];
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
        artist: songData.artist,
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
      coverUrl: songData.coverUrl,
      audioUrl: songData.audioUrl,
      popularity: 0,
      isLiked: false,
      playCount: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    // In a real app, save to database
    songs.push(newSong);

    // Here you would typically:
    // 1. Save to database (PostgreSQL, MongoDB, etc.)
    // 2. Update search indices
    // 3. Trigger background jobs for processing
    // 4. Send notifications to users

    return NextResponse.json({
      success: true,
      data: newSong,
      message: "Song uploaded successfully",
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

    // Find and update song
    const songIndex = songs.findIndex((song) => song.id === id);
    if (songIndex === -1) {
      return NextResponse.json(
        { success: false, error: "Song not found" },
        { status: 404 }
      );
    }

    songs[songIndex] = {
      ...songs[songIndex],
      ...songData,
      updatedAt: new Date(),
    };

    return NextResponse.json({
      success: true,
      data: songs[songIndex],
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

    // Find and delete song
    const songIndex = songs.findIndex((song) => song.id === id);
    if (songIndex === -1) {
      return NextResponse.json(
        { success: false, error: "Song not found" },
        { status: 404 }
      );
    }

    const deletedSong = songs.splice(songIndex, 1)[0];

    return NextResponse.json({
      success: true,
      data: deletedSong,
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
