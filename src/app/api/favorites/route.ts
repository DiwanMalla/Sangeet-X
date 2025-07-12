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

    const favorites = await prisma.favorite.findMany({
      where: { userId },
      include: {
        song: {
          include: {
            artist: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({
      success: true,
      data: favorites,
    });
  } catch (error) {
    console.error("Error fetching favorites:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch favorites" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, songId } = body;

    if (!userId || !songId) {
      return NextResponse.json(
        { success: false, error: "User ID and Song ID are required" },
        { status: 400 }
      );
    }

    // Check if already favorited
    const existingFavorite = await prisma.favorite.findUnique({
      where: {
        userId_songId: {
          userId,
          songId,
        },
      },
    });

    if (existingFavorite) {
      return NextResponse.json(
        { success: false, error: "Song already in favorites" },
        { status: 400 }
      );
    }

    const favorite = await prisma.favorite.create({
      data: {
        userId,
        songId,
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
      data: favorite,
    });
  } catch (error) {
    console.error("Error adding to favorites:", error);
    return NextResponse.json(
      { success: false, error: "Failed to add to favorites" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");
    const songId = searchParams.get("songId");

    if (!userId || !songId) {
      return NextResponse.json(
        { success: false, error: "User ID and Song ID are required" },
        { status: 400 }
      );
    }

    await prisma.favorite.delete({
      where: {
        userId_songId: {
          userId,
          songId,
        },
      },
    });

    return NextResponse.json({
      success: true,
      message: "Removed from favorites",
    });
  } catch (error) {
    console.error("Error removing from favorites:", error);
    return NextResponse.json(
      { success: false, error: "Failed to remove from favorites" },
      { status: 500 }
    );
  }
}
