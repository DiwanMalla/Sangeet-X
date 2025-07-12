import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");
    const search = searchParams.get("search");

    const skip = (page - 1) * limit;

    const where: {
      name?: { contains: string; mode: "insensitive" };
    } = {};

    if (search) {
      where.name = {
        contains: search,
        mode: "insensitive",
      };
    }

    const [artists, total] = await Promise.all([
      prisma.artist.findMany({
        where,
        include: {
          _count: {
            select: { songs: true },
          },
        },
        orderBy: [{ createdAt: "desc" }],
        skip,
        take: limit,
      }),
      prisma.artist.count({ where }),
    ]);

    return NextResponse.json({
      success: true,
      data: {
        artists,
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
    console.error("Error fetching artists for guest:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch artists" },
      { status: 500 }
    );
  }
}
