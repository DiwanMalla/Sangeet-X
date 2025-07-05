import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get("q");

    if (!query) {
      return NextResponse.json(
        { success: false, error: "Search query is required" },
        { status: 400 }
      );
    }

    // Search songs
    const songs = await prisma.song.findMany({
      where: {
        OR: [
          { title: { contains: query, mode: "insensitive" } },
          { album: { contains: query, mode: "insensitive" } },
          { genre: { contains: query, mode: "insensitive" } },
          { artist: { name: { contains: query, mode: "insensitive" } } },
        ],
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
      take: 20,
    });

    // Search artists
    const artists = await prisma.artist.findMany({
      where: {
        OR: [
          { name: { contains: query, mode: "insensitive" } },
          { bio: { contains: query, mode: "insensitive" } },
        ],
      },
      take: 10,
    });

    return NextResponse.json({
      success: true,
      data: {
        songs,
        artists,
      },
    });
  } catch (error) {
    console.error("Error searching:", error);
    return NextResponse.json(
      { success: false, error: "Failed to search" },
      { status: 500 }
    );
  }
}
