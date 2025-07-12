import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const artist = await prisma.artist.findUnique({
      where: { id },
      include: {
        songs: {
          orderBy: { createdAt: "desc" },
        },
        _count: {
          select: { songs: true },
        },
      },
    });

    if (!artist) {
      return NextResponse.json({ error: "Artist not found" }, { status: 404 });
    }

    return NextResponse.json({ artist });
  } catch (error) {
    console.error("Error fetching artist:", error);
    return NextResponse.json(
      { error: "Failed to fetch artist" },
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
    const { name, bio, avatar, coverImage, website, socialLinks } = body;

    const artist = await prisma.artist.update({
      where: { id },
      data: {
        name,
        bio,
        avatar,
        coverImage,
        website,
        socialLinks,
      },
    });

    return NextResponse.json({ artist });
  } catch (error) {
    console.error("Error updating artist:", error);
    return NextResponse.json(
      { error: "Failed to update artist" },
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
    // Check if artist has songs
    const songCount = await prisma.song.count({
      where: { artistId: id },
    });

    if (songCount > 0) {
      return NextResponse.json(
        { error: "Cannot delete artist with existing songs" },
        { status: 400 }
      );
    }

    await prisma.artist.delete({
      where: { id },
    });

    return NextResponse.json({ message: "Artist deleted successfully" });
  } catch (error) {
    console.error("Error deleting artist:", error);
    return NextResponse.json(
      { error: "Failed to delete artist" },
      { status: 500 }
    );
  }
}
