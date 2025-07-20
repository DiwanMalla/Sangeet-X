import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");
    const limit = parseInt(searchParams.get("limit") || "10");

    if (!userId) {
      return NextResponse.json(
        { success: false, error: "User ID is required" },
        { status: 400 }
      );
    }

    // Ensure user exists in database (create if doesn't exist)
    await prisma.user.upsert({
      where: { id: userId },
      update: {}, // Don't update if exists
      create: {
        id: userId,
        email: `${userId}@clerk.dev`, // Fallback email
        isAdmin: false,
      },
    });

    const playHistory = await prisma.playHistory.findMany({
      where: { userId },
      include: {
        song: {
          include: {
            artist: true,
          },
        },
      },
      orderBy: { playedAt: "desc" },
      take: limit,
    });

    return NextResponse.json({
      success: true,
      data: playHistory,
    });
  } catch (error) {
    console.error("Error fetching play history:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch play history" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      userId,
      songId,
      completedPercentage = 0,
      userEmail,
      userDisplayName,
    } = body;

    if (!userId || !songId) {
      return NextResponse.json(
        { success: false, error: "User ID and Song ID are required" },
        { status: 400 }
      );
    }

    // Ensure user exists in database (create if doesn't exist)
    await prisma.user.upsert({
      where: { id: userId },
      update: {}, // Don't update if exists
      create: {
        id: userId,
        email: userEmail || `${userId}@clerk.dev`,
        displayName: userDisplayName || "User",
        isAdmin: false,
      },
    });

    // Check if there's already a play history entry for this user and song
    const existingEntry = await prisma.playHistory.findFirst({
      where: {
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

    let playHistoryEntry;

    if (existingEntry) {
      // Update the existing entry's playedAt timestamp
      playHistoryEntry = await prisma.playHistory.update({
        where: { id: existingEntry.id },
        data: {
          playedAt: new Date(),
          completedPercentage,
        },
        include: {
          song: {
            include: {
              artist: true,
            },
          },
        },
      });
    } else {
      // Create new play history entry
      playHistoryEntry = await prisma.playHistory.create({
        data: {
          userId,
          songId,
          completedPercentage,
        },
        include: {
          song: {
            include: {
              artist: true,
            },
          },
        },
      });
    }

    return NextResponse.json({
      success: true,
      data: playHistoryEntry,
    });
  } catch (error) {
    console.error("Error adding to play history:", error);
    return NextResponse.json(
      { success: false, error: "Failed to add to play history" },
      { status: 500 }
    );
  }
}
