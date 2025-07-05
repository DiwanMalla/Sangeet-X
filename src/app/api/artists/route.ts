import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const artists = await prisma.artist.findMany({
      orderBy: { name: "asc" },
      include: {
        _count: {
          select: { songs: true },
        },
      },
    });

    return NextResponse.json({ artists });
  } catch (error) {
    console.error("Error fetching artists:", error);
    return NextResponse.json(
      { error: "Failed to fetch artists" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, bio, avatar, coverImage, website, socialLinks } = body;

    if (!name) {
      return NextResponse.json(
        { error: "Artist name is required" },
        { status: 400 }
      );
    }

    const existingArtist = await prisma.artist.findUnique({
      where: { name },
    });

    if (existingArtist) {
      return NextResponse.json(
        { error: "Artist already exists" },
        { status: 409 }
      );
    }

    const artist = await prisma.artist.create({
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
    console.error("Error creating artist:", error);
    return NextResponse.json(
      { error: "Failed to create artist" },
      { status: 500 }
    );
  }
}
