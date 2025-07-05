"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Music,
  Users,
  TrendingUp,
  Upload,
  Play,
  Heart,
  BarChart3,
  Activity,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react";
import Link from "next/link";

interface DashboardStats {
  totalSongs: number;
  totalUsers: number;
  totalPlays: number;
  totalUploads: number;
  songsGrowth: number;
  usersGrowth: number;
  playsGrowth: number;
  uploadsGrowth: number;
}

interface RecentActivity {
  id: string;
  type: "upload" | "play" | "like" | "user";
  title: string;
  description: string;
  timestamp: string;
  user?: string;
}

interface TopSong {
  id: string;
  title: string;
  artist: string;
  plays: number;
  likes: number;
  coverUrl: string;
}

interface RecentUpload {
  id: string;
  title: string;
  artist: {
    id: string;
    name: string;
  };
  createdAt: string;
}

interface RecentUser {
  id: string;
  email: string;
  username: string;
  createdAt: string;
}

interface DashboardApiResponse {
  stats: {
    totalSongs: number;
    totalUsers: number;
    totalPlays: number;
    totalUploads: number;
  };
  topSongs: Array<{
    id: string;
    title: string;
    artist: {
      id: string;
      name: string;
    };
    playCount: number;
    popularity: number;
    coverUrl: string;
  }>;
  recentUploads: RecentUpload[];
  recentUsers: RecentUser[];
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    totalSongs: 0,
    totalUsers: 0,
    totalPlays: 0,
    totalUploads: 0,
    songsGrowth: 0,
    usersGrowth: 0,
    playsGrowth: 0,
    uploadsGrowth: 0,
  });

  const [recentActivity, setRecentActivity] = useState<RecentActivity[]>([]);
  const [topSongs, setTopSongs] = useState<TopSong[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await fetch("/api/admin/dashboard");
        if (!response.ok) {
          throw new Error("Failed to fetch dashboard data");
        }

        const data: DashboardApiResponse = await response.json();

        // Set real stats (with mock growth rates for now)
        setStats({
          totalSongs: data.stats.totalSongs,
          totalUsers: data.stats.totalUsers,
          totalPlays: data.stats.totalPlays,
          totalUploads: data.stats.totalUploads,
          songsGrowth: 12.5, // TODO: Calculate actual growth
          usersGrowth: 8.3,
          playsGrowth: 23.7,
          uploadsGrowth: 5.2,
        });

        // Transform recent uploads and users into activity format
        const recentActivity: RecentActivity[] = [
          ...data.recentUploads.slice(0, 3).map((song: RecentUpload) => ({
            id: song.id,
            type: "upload" as const,
            title: "New song uploaded",
            description: `"${song.title}" by ${song.artist.name}`,
            timestamp: new Date(song.createdAt).toLocaleString(),
            user: "admin",
          })),
          ...data.recentUsers.slice(0, 2).map((user: RecentUser) => ({
            id: user.id,
            type: "user" as const,
            title: "New user registered",
            description: `${user.username} joined`,
            timestamp: new Date(user.createdAt).toLocaleString(),
          })),
        ];

        // Transform top songs
        const topSongs: TopSong[] = data.topSongs.map((song) => ({
          id: song.id,
          title: song.title,
          artist: song.artist.name,
          plays: song.playCount || 0,
          likes: song.popularity || 0,
          coverUrl: song.coverUrl,
        }));

        setRecentActivity(recentActivity);
        setTopSongs(topSongs);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const statCards = [
    {
      title: "Total Songs",
      value: stats.totalSongs.toLocaleString(),
      change: stats.songsGrowth,
      icon: Music,
      color: "text-blue-600",
    },
    {
      title: "Total Users",
      value: stats.totalUsers.toLocaleString(),
      change: stats.usersGrowth,
      icon: Users,
      color: "text-green-600",
    },
    {
      title: "Total Plays",
      value: stats.totalPlays.toLocaleString(),
      change: stats.playsGrowth,
      icon: Play,
      color: "text-purple-600",
    },
    {
      title: "This Month Uploads",
      value: stats.totalUploads.toLocaleString(),
      change: stats.uploadsGrowth,
      icon: Upload,
      color: "text-orange-600",
    },
  ];

  const getActivityIcon = (type: string) => {
    switch (type) {
      case "upload":
        return <Upload className="h-4 w-4 text-blue-500" />;
      case "play":
        return <Play className="h-4 w-4 text-green-500" />;
      case "like":
        return <Heart className="h-4 w-4 text-red-500" />;
      case "user":
        return <Users className="h-4 w-4 text-purple-500" />;
      default:
        return <Activity className="h-4 w-4 text-gray-500" />;
    }
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
            {[...Array(4)].map((_, i) => (
              <div
                key={i}
                className="h-32 bg-gray-200 dark:bg-gray-700 rounded-lg"
              />
            ))}
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="h-96 bg-gray-200 dark:bg-gray-700 rounded-lg" />
            <div className="h-96 bg-gray-200 dark:bg-gray-700 rounded-lg" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Dashboard
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Welcome back! Here&apos;s what&apos;s happening with your music
            platform.
          </p>
        </div>
        <Link href="/admin/upload">
          <Button className="bg-purple-600 hover:bg-purple-700">
            <Upload className="h-4 w-4 mr-2" />
            Upload Song
          </Button>
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, index) => {
          const Icon = stat.icon;
          const isPositive = stat.change >= 0;
          return (
            <Card key={index}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                      {stat.title}
                    </p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">
                      {stat.value}
                    </p>
                  </div>
                  <Icon className={`h-8 w-8 ${stat.color}`} />
                </div>
                <div className="flex items-center mt-4">
                  {isPositive ? (
                    <ArrowUpRight className="h-4 w-4 text-green-500 mr-1" />
                  ) : (
                    <ArrowDownRight className="h-4 w-4 text-red-500 mr-1" />
                  )}
                  <span
                    className={`text-sm font-medium ${
                      isPositive ? "text-green-500" : "text-red-500"
                    }`}
                  >
                    {Math.abs(stat.change)}%
                  </span>
                  <span className="text-sm text-gray-600 dark:text-gray-400 ml-1">
                    from last month
                  </span>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Activity className="h-5 w-5 mr-2" />
              Recent Activity
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivity.map((activity) => (
                <div
                  key={activity.id}
                  className="flex items-start space-x-3 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                >
                  <div className="flex-shrink-0 mt-1">
                    {getActivityIcon(activity.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      {activity.title}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {activity.description}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                      {activity.timestamp}
                    </p>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
              <Link href="/admin/analytics">
                <Button variant="ghost" className="w-full">
                  View All Activity
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Top Songs */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <TrendingUp className="h-5 w-5 mr-2" />
              Top Performing Songs
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {topSongs.map((song, index) => (
                <div
                  key={song.id}
                  className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                >
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 rounded-full bg-purple-100 dark:bg-purple-900 flex items-center justify-center">
                      <span className="text-sm font-medium text-purple-600 dark:text-purple-300">
                        {index + 1}
                      </span>
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                      {song.title}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {song.artist}
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center space-x-1 text-sm text-gray-600 dark:text-gray-400">
                      <Play className="h-3 w-3" />
                      <span>{song.plays.toLocaleString()}</span>
                    </div>
                    <div className="flex items-center space-x-1 text-sm text-gray-600 dark:text-gray-400">
                      <Heart className="h-3 w-3" />
                      <span>{song.likes.toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
              <Link href="/admin/songs">
                <Button variant="ghost" className="w-full">
                  View All Songs
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Link href="/admin/upload">
              <Button
                variant="outline"
                className="h-24 flex flex-col space-y-2"
              >
                <Upload className="h-6 w-6" />
                <span>Upload New Song</span>
              </Button>
            </Link>
            <Link href="/admin/songs">
              <Button
                variant="outline"
                className="h-24 flex flex-col space-y-2"
              >
                <Music className="h-6 w-6" />
                <span>Manage Songs</span>
              </Button>
            </Link>
            <Link href="/admin/analytics">
              <Button
                variant="outline"
                className="h-24 flex flex-col space-y-2"
              >
                <BarChart3 className="h-6 w-6" />
                <span>View Analytics</span>
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
