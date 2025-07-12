import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const subtitleId = id;

    const subtitle = await prisma.subtitle.findUnique({
      where: { id: subtitleId },
      include: {
        song: {
          include: {
            artist: true,
          },
        },
      },
    });

    if (!subtitle) {
      return NextResponse.json(
        { success: false, error: "Subtitle not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: subtitle,
    });
  } catch (error) {
    console.error("Error fetching subtitle:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch subtitle" },
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
    const subtitleId = id;
    const data = await request.json();
    const { songId, language, text, startTime, endTime } = data;

    // Check if subtitle exists
    const existingSubtitle = await prisma.subtitle.findUnique({
      where: { id: subtitleId },
    });

    if (!existingSubtitle) {
      return NextResponse.json(
        { success: false, error: "Subtitle not found" },
        { status: 404 }
      );
    }

    // Update subtitle
    const subtitle = await prisma.subtitle.update({
      where: { id: subtitleId },
      data: {
        songId: songId || existingSubtitle.songId,
        language: language || existingSubtitle.language,
        text: text || existingSubtitle.text,
        startTime:
          startTime !== undefined ? startTime : existingSubtitle.startTime,
        endTime: endTime !== undefined ? endTime : existingSubtitle.endTime,
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
      message: "Subtitle updated successfully",
    });
  } catch (error) {
    console.error("Error updating subtitle:", error);
    return NextResponse.json(
      { success: false, error: "Failed to update subtitle" },
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
    const subtitleId = id;

    // Check if subtitle exists
    const subtitle = await prisma.subtitle.findUnique({
      where: { id: subtitleId },
      include: {
        song: true,
      },
    });

    if (!subtitle) {
      return NextResponse.json(
        { success: false, error: "Subtitle not found" },
        { status: 404 }
      );
    }

    // Delete subtitle
    await prisma.subtitle.delete({
      where: { id: subtitleId },
    });

    return NextResponse.json({
      success: true,
      message: `Subtitle for "${subtitle.song.title}" deleted successfully`,
    });
  } catch (error) {
    console.error("Error deleting subtitle:", error);
    return NextResponse.json(
      { success: false, error: "Failed to delete subtitle" },
      { status: 500 }
    );
  }
}
