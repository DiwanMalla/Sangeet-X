import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const songId = searchParams.get("songId");
    const language = searchParams.get("language");

    const where: { songId?: string; language?: string } = {};
    if (songId) where.songId = songId;
    if (language) where.language = language;

    const subtitles = await prisma.subtitle.findMany({
      where,
      include: {
        song: {
          include: {
            artist: true,
          },
        },
      },
      orderBy: [{ songId: "asc" }, { language: "asc" }, { startTime: "asc" }],
    });

    return NextResponse.json({
      success: true,
      data: subtitles,
    });
  } catch (error) {
    console.error("Error fetching subtitles:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch subtitles" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    const { songId, language, text, startTime, endTime } = data;

    // Validate required fields
    if (
      !songId ||
      !language ||
      !text ||
      startTime === undefined ||
      endTime === undefined
    ) {
      return NextResponse.json(
        { success: false, error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Check if song exists
    const song = await prisma.song.findUnique({
      where: { id: songId },
    });

    if (!song) {
      return NextResponse.json(
        { success: false, error: "Song not found" },
        { status: 404 }
      );
    }

    // Create subtitle
    const subtitle = await prisma.subtitle.create({
      data: {
        songId,
        language,
        text,
        startTime,
        endTime,
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
      data: subtitle,
      message: "Subtitle created successfully",
    });
  } catch (error) {
    console.error("Error creating subtitle:", error);
    return NextResponse.json(
      { success: false, error: "Failed to create subtitle" },
      { status: 500 }
    );
  }
}
