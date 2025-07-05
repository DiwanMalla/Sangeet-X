import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const genres = await prisma.genre.findMany({
      orderBy: { songCount: "desc" },
    });

    return NextResponse.json({
      success: true,
      data: genres,
    });
  } catch (error) {
    console.error("Error fetching genres:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch genres" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const genreData = await request.json();

    // Validate required fields
    if (!genreData.name || !genreData.color) {
      return NextResponse.json(
        { success: false, error: "Name and color are required" },
        { status: 400 }
      );
    }

    const newGenre = await prisma.genre.create({
      data: {
        name: genreData.name,
        description: genreData.description || null,
        color: genreData.color,
        songCount: 0,
      },
    });

    return NextResponse.json({
      success: true,
      data: newGenre,
      message: "Genre created successfully",
    });
  } catch (error) {
    console.error("Error creating genre:", error);
    return NextResponse.json(
      { success: false, error: "Failed to create genre" },
      { status: 500 }
    );
  }
}
