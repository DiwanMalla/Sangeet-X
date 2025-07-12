import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");
    const genre = searchParams.get("genre");
    const search = searchParams.get("search");

    const skip = (page - 1) * limit;

    const where: {
      genre?: { contains: string; mode: "insensitive" };
      OR?: Array<{
        title?: { contains: string; mode: "insensitive" };
        artist?: { name: { contains: string; mode: "insensitive" } };
      }>;
    } = {};

    if (genre) {
      where.genre = {
        contains: genre,
        mode: "insensitive",
      };
    }

    if (search) {
      where.OR = [
        {
          title: {
            contains: search,
            mode: "insensitive",
          },
        },
        {
          artist: {
            name: {
              contains: search,
              mode: "insensitive",
            },
          },
        },
      ];
    }

    const [songs, total] = await Promise.all([
      prisma.song.findMany({
        where,
        include: {
          artist: true,
        },
        orderBy: [{ playCount: "desc" }, { createdAt: "desc" }],
        skip,
        take: limit,
      }),
      prisma.song.count({ where }),
    ]);

    return NextResponse.json({
      success: true,
      data: {
        songs,
        pagination: {
          currentPage: page,
          totalPages: Math.ceil(total / limit),
          totalItems: total,
          hasNext: page * limit < total,
          hasPrev: page > 1,
        },
      },
    });
  } catch (error) {
    console.error("Error fetching songs for guest:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch songs" },
      { status: 500 }
    );
  }
}
