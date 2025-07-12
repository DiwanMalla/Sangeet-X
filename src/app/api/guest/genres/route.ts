import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const genre = searchParams.get("genre");
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");

    if (!genre) {
      // Get all available genres
      const genres = await prisma.song.findMany({
        select: {
          genre: true,
          _count: true,
        },
        distinct: ["genre"],
        where: {
          genre: {
            not: null,
          },
        },
      });

      // Get count for each genre
      const genresWithCount = await Promise.all(
        genres.map(async (g) => {
          const count = await prisma.song.count({
            where: { genre: g.genre },
          });
          return {
            name: g.genre,
            count,
          };
        })
      );

      return NextResponse.json({
        success: true,
        data: {
          genres: genresWithCount.sort((a, b) => b.count - a.count),
        },
      });
    }

    // Get songs by specific genre
    const skip = (page - 1) * limit;

    const [songs, total] = await Promise.all([
      prisma.song.findMany({
        where: {
          genre: {
            contains: genre,
            mode: "insensitive",
          },
        },
        include: {
          artist: true,
        },
        orderBy: [{ playCount: "desc" }, { createdAt: "desc" }],
        skip,
        take: limit,
      }),
      prisma.song.count({
        where: {
          genre: {
            contains: genre,
            mode: "insensitive",
          },
        },
      }),
    ]);

    return NextResponse.json({
      success: true,
      data: {
        genre,
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
    console.error("Error fetching genres for guest:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch genres" },
      { status: 500 }
    );
  }
}
