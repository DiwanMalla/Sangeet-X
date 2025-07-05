import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const songId = params.id;

    // Find the song first to get the URLs for Cloudinary cleanup
    const song = await prisma.song.findUnique({
      where: { id: songId },
      select: {
        id: true,
        title: true,
        artist: true,
        audioUrl: true,
        coverUrl: true,
      },
    });

    if (!song) {
      return NextResponse.json(
        { success: false, error: "Song not found" },
        { status: 404 }
      );
    }

    // Delete the song from the database
    await prisma.song.delete({
      where: { id: songId },
    });

    // TODO: Optional - Delete files from Cloudinary
    // You can add Cloudinary deletion logic here if needed
    // const cloudinary = require('cloudinary').v2;
    // await cloudinary.uploader.destroy(public_id);

    return NextResponse.json({
      success: true,
      message: `Song "${song.title}" by ${song.artist} deleted successfully`,
    });
  } catch (error) {
    console.error("Error deleting song:", error);
    return NextResponse.json(
      { success: false, error: "Failed to delete song" },
      { status: 500 }
    );
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const songId = params.id;

    const song = await prisma.song.findUnique({
      where: { id: songId },
    });

    if (!song) {
      return NextResponse.json(
        { success: false, error: "Song not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: song,
    });
  } catch (error) {
    console.error("Error fetching song:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch song" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const songId = params.id;
    const updateData = await request.json();

    // Check if song exists
    const existingSong = await prisma.song.findUnique({
      where: { id: songId },
    });

    if (!existingSong) {
      return NextResponse.json(
        { success: false, error: "Song not found" },
        { status: 404 }
      );
    }

    // Update the song
    const updatedSong = await prisma.song.update({
      where: { id: songId },
      data: {
        title: updateData.title || existingSong.title,
        artist: updateData.artist || existingSong.artist,
        album: updateData.album || existingSong.album,
        genre: updateData.genre || existingSong.genre,
        year: updateData.year || existingSong.year,
        duration: updateData.duration || existingSong.duration,
        coverUrl: updateData.coverUrl || existingSong.coverUrl,
        audioUrl: updateData.audioUrl || existingSong.audioUrl,
        popularity: updateData.popularity ?? existingSong.popularity,
        playCount: updateData.playCount ?? existingSong.playCount,
        isLiked: updateData.isLiked ?? existingSong.isLiked,
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
