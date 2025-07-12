import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      return NextResponse.json(
        { success: false, error: "User ID is required" },
        { status: 400 }
      );
    }

    const playlists = await prisma.playlist.findMany({
      where: { userId },
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
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({
      success: true,
      data: playlists,
    });
  } catch (error) {
    console.error("Error fetching playlists:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch playlists" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, description, userId, isPublic = false } = body;

    if (!name || !userId) {
      return NextResponse.json(
        { success: false, error: "Name and User ID are required" },
        { status: 400 }
      );
    }

    const playlist = await prisma.playlist.create({
      data: {
        name,
        description,
        userId,
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
    console.error("Error creating playlist:", error);
    return NextResponse.json(
      { success: false, error: "Failed to create playlist" },
      { status: 500 }
    );
  }
}
