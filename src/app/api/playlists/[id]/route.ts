import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const playlist = await prisma.playlist.findUnique({
      where: { id },
      include: {
        songs: {
          include: {
            song: {
              include: {
                artist: true,
              },
            },
          },
          orderBy: { position: "asc" },
        },
        user: {
          select: {
            id: true,
            username: true,
            displayName: true,
          },
        },
        _count: {
          select: { songs: true },
        },
      },
    });

    if (!playlist) {
      return NextResponse.json(
        { success: false, error: "Playlist not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: playlist,
    });
  } catch (error) {
    console.error("Error fetching playlist:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch playlist" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { name, description, isPublic } = body;

    const playlist = await prisma.playlist.update({
      where: { id },
      data: {
        name,
        description,
        isPublic,
      },
      include: {
        songs: {
          include: {
            song: {
              include: {
                artist: true,
              },
            },
          },
          orderBy: { position: "asc" },
        },
        _count: {
          select: { songs: true },
        },
      },
    });

    return NextResponse.json({
      success: true,
      data: playlist,
    });
  } catch (error) {
    console.error("Error updating playlist:", error);
    return NextResponse.json(
      { success: false, error: "Failed to update playlist" },
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
    await prisma.playlist.delete({
      where: { id },
    });

    return NextResponse.json({
      success: true,
      message: "Playlist deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting playlist:", error);
    return NextResponse.json(
      { success: false, error: "Failed to delete playlist" },
      { status: 500 }
    );
  }
}
