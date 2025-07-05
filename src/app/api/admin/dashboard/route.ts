import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  // Get total songs, users, plays, uploads
  const [totalSongs, totalUsers, totalPlays] = await Promise.all([
    prisma.song.count(),
    prisma.user.count(),
    prisma.song.aggregate({ _sum: { playCount: true } }),
  ]);

  // Get top 3 songs
  const topSongs = await prisma.song.findMany({
    orderBy: { playCount: "desc" },
    take: 3,
    select: {
      id: true,
      title: true,
      artist: true,
      playCount: true,
      popularity: true,
      coverUrl: true,
      isLiked: true,
    },
  });

  // Get recent activity (last 10 uploads)
  const recentUploads = await prisma.song.findMany({
    orderBy: { createdAt: "desc" },
    take: 10,
    select: {
      id: true,
      title: true,
      artist: true,
      createdAt: true,
    },
  });

  // Get recent users (last 5)
  const recentUsers = await prisma.user.findMany({
    orderBy: { createdAt: "desc" },
    take: 5,
    select: {
      id: true,
      email: true,
      username: true,
      createdAt: true,
    },
  });

  return NextResponse.json({
    stats: {
      totalSongs,
      totalUsers,
      totalPlays: totalPlays._sum.playCount || 0,
      totalUploads: recentUploads.length,
    },
    topSongs,
    recentUploads,
    recentUsers,
  });
}
