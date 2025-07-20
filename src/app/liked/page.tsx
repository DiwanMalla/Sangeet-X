"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Navbar from "@/components/layout/navbar";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { usePlayHistory } from "@/lib/use-play-history";
import {
  Heart,
  Play,
  Pause,
  Shuffle,
  Download,
  Share2,
  Clock,
  Calendar,
  Loader2,
  Trash2,
  Search,
} from "lucide-react";
import { Song } from "@/lib/types";
import { formatTime } from "@/lib/utils";
import Image from "next/image";

interface FavoriteWithSong {
  id: string;
  createdAt: string;
  song: Song;
}

export default function LikedSongsPage() {
  const { user, isLoaded } = useUser();
  const router = useRouter();
  const { trackPlay } = usePlayHistory();

  const [isPlaying, setIsPlaying] = useState(false);
  const [currentlyPlaying, setCurrentlyPlaying] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<"recent" | "artist" | "title">("recent");
  const [favorites, setFavorites] = useState<FavoriteWithSong[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Redirect to login if not authenticated
  useEffect(() => {
    if (isLoaded && !user) {
      router.push("/login");
    }
  }, [isLoaded, user, router]);

  // Fetch favorites when user is loaded
  useEffect(() => {
    const fetchFavorites = async () => {
      if (!user?.id) return;

      try {
        setLoading(true);
        setError(null);

        const response = await fetch(`/api/favorites?userId=${user.id}`);
        const data = await response.json();

        if (data.success) {
          setFavorites(data.data);
        } else {
          setError(data.error || "Failed to fetch favorites");
        }
      } catch (error) {
        console.error("Error fetching favorites:", error);
        setError("Failed to load your liked songs");
      } finally {
        setLoading(false);
      }
    };

    fetchFavorites();
  }, [user?.id]);

  const removeFavorite = async (songId: string) => {
    try {
      const response = await fetch(
        `/api/favorites?userId=${user?.id}&songId=${songId}`,
        {
          method: "DELETE",
        }
      );

      const data = await response.json();

      if (data.success) {
        // Remove from local state
        setFavorites(favorites.filter((fav) => fav.song.id !== songId));
      } else {
        alert("Failed to remove from favorites");
      }
    } catch (error) {
      console.error("Error removing favorite:", error);
      alert("Failed to remove from favorites");
    }
  };

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const handlePlaySong = (songId: string) => {
    setCurrentlyPlaying(songId);
    setIsPlaying(true);
    // Track the play
    trackPlay(songId);
    // You can also integrate with your audio player here
    router.push(`/song/${songId}`);
  };

  // Sort favorites based on selected criteria
  const sortedFavorites = [...favorites].sort((a, b) => {
    switch (sortBy) {
      case "recent":
        return (
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
      case "artist":
        return (a.song.artist?.name || "").localeCompare(
          b.song.artist?.name || ""
        );
      case "title":
        return a.song.title.localeCompare(b.song.title);
      default:
        return 0;
    }
  });

  const totalDuration = favorites.reduce(
    (acc, fav) => acc + fav.song.duration,
    0
  );
  const totalHours = Math.floor(totalDuration / 3600);
  const totalMinutes = Math.floor((totalDuration % 3600) / 60);

  const formatRelativeTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInDays = Math.floor(
      (now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24)
    );

    if (diffInDays === 0) return "Today";
    if (diffInDays === 1) return "Yesterday";
    if (diffInDays < 7) return `${diffInDays} days ago`;
    if (diffInDays < 30) return `${Math.floor(diffInDays / 7)} weeks ago`;
    if (diffInDays < 365) return `${Math.floor(diffInDays / 30)} months ago`;
    return `${Math.floor(diffInDays / 365)} years ago`;
  };

  // Show loading state
  if (!isLoaded || loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-red-900 to-slate-900">
        <Navbar />
        <main className="lg:ml-72 p-8 flex items-center justify-center">
          <div className="text-center">
            <Loader2 className="w-12 h-12 text-red-400 animate-spin mx-auto mb-4" />
            <p className="text-red-300">Loading your liked songs...</p>
          </div>
        </main>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-red-900 to-slate-900">
        <Navbar />
        <main className="lg:ml-72 p-8 flex items-center justify-center">
          <div className="text-center">
            <Heart className="w-16 h-16 text-red-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-white mb-2">Oops!</h2>
            <p className="text-red-300 mb-4">{error}</p>
            <Button
              onClick={() => window.location.reload()}
              className="bg-red-500 hover:bg-red-600"
            >
              Try Again
            </Button>
          </div>
        </main>
      </div>
    );
  }

  // Show empty state
  if (favorites.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-red-900 to-slate-900">
        <Navbar />
        <main className="lg:ml-72 p-8 flex items-center justify-center">
          <div className="text-center max-w-md">
            <div className="w-32 h-32 bg-gradient-to-br from-red-500/20 to-pink-600/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <Heart className="w-16 h-16 text-red-400" />
            </div>
            <h2 className="text-3xl font-bold text-white mb-4">
              No Liked Songs Yet
            </h2>
            <p className="text-red-300 mb-6">
              Start exploring and liking songs to build your personal
              collection.
            </p>
            <Button
              onClick={() => router.push("/search")}
              className="bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600"
            >
              <Search className="w-4 h-4 mr-2" />
              Discover Music
            </Button>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-red-900 to-slate-900">
      <Navbar />
      <main className="lg:ml-72 p-8 pb-24 lg:pb-32">
        {/* Hero Section */}
        <div className="relative mb-12 overflow-hidden">
          {/* Animated Hearts Background */}
          <div className="absolute inset-0 opacity-10">
            {[...Array(6)].map((_, i) => (
              <Heart
                key={i}
                className={`absolute w-16 h-16 text-red-500 fill-current animate-pulse`}
                style={{
                  top: `${Math.random() * 100}%`,
                  left: `${Math.random() * 100}%`,
                  animationDelay: `${i * 500}ms`,
                  animationDuration: "3s",
                }}
              />
            ))}
          </div>

          <div className="relative z-10">
            <div className="flex flex-col md:flex-row items-start md:items-end space-y-6 md:space-y-0 md:space-x-8">
              {/* Large Heart Icon */}
              <div className="relative">
                <div className="w-48 h-48 bg-gradient-to-br from-red-500 to-pink-600 rounded-3xl flex items-center justify-center shadow-2xl">
                  <Heart className="w-24 h-24 text-white fill-current" />
                </div>
                <div className="absolute inset-0 bg-gradient-to-br from-red-400 to-pink-500 rounded-3xl blur opacity-50 -z-10 animate-pulse"></div>
              </div>

              {/* Playlist Info */}
              <div className="flex-1">
                <p className="text-red-400 text-sm font-medium mb-2 uppercase tracking-wide">
                  Playlist
                </p>
                <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">
                  Liked Songs
                </h1>
                <p className="text-red-200 text-lg mb-4">
                  Your favorite tracks, all in one place
                </p>
                <div className="flex items-center space-x-6 text-red-300">
                  <span className="flex items-center">
                    <Heart className="w-4 h-4 mr-2 fill-current" />
                    {favorites.length} songs
                  </span>
                  <span className="flex items-center">
                    <Clock className="w-4 h-4 mr-2" />
                    {totalHours}h {totalMinutes}m
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 mb-10">
          <div className="flex flex-wrap items-center gap-4">
            <Button
              onClick={handlePlayPause}
              className="w-16 h-16 bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 rounded-full shadow-xl hover:shadow-red-500/30 transition-all duration-300 hover:scale-110 group"
            >
              {isPlaying ? (
                <Pause className="w-7 h-7 text-white group-hover:scale-110 transition-transform" />
              ) : (
                <Play className="w-7 h-7 text-white ml-1 group-hover:scale-110 transition-transform" />
              )}
            </Button>

            <Button
              variant="outline"
              className="border-red-400/50 text-red-300 hover:bg-red-500/20 hover:border-red-400 hover:text-white px-6 py-3 rounded-xl font-medium transition-all duration-300 hover:scale-105"
            >
              <Shuffle className="w-5 h-5 mr-2" />
              Shuffle Play
            </Button>

            <Button
              variant="outline"
              className="border-red-400/50 text-red-300 hover:bg-red-500/20 hover:border-red-400 hover:text-white px-6 py-3 rounded-xl font-medium transition-all duration-300 hover:scale-105"
            >
              <Download className="w-5 h-5 mr-2" />
              Download All
            </Button>

            <Button
              variant="outline"
              className="border-red-400/50 text-red-300 hover:bg-red-500/20 hover:border-red-400 hover:text-white px-6 py-3 rounded-xl font-medium transition-all duration-300 hover:scale-105"
            >
              <Share2 className="w-5 h-5 mr-2" />
              Share Playlist
            </Button>
          </div>

          {/* Sort Options */}
          <div className="flex items-center gap-3">
            <span className="text-red-300 text-sm font-medium">Sort by:</span>
            <div className="flex items-center bg-white/5 rounded-xl p-1 border border-red-500/20">
              <Button
                variant={sortBy === "recent" ? "default" : "ghost"}
                size="sm"
                onClick={() => setSortBy("recent")}
                className={`rounded-lg px-4 py-2 text-sm font-medium transition-all duration-200 ${
                  sortBy === "recent"
                    ? "bg-red-500 hover:bg-red-600 text-white shadow-lg"
                    : "text-red-300 hover:text-white hover:bg-red-500/20"
                }`}
              >
                <Calendar className="w-4 h-4 mr-2" />
                Recent
              </Button>
              <Button
                variant={sortBy === "artist" ? "default" : "ghost"}
                size="sm"
                onClick={() => setSortBy("artist")}
                className={`rounded-lg px-4 py-2 text-sm font-medium transition-all duration-200 ${
                  sortBy === "artist"
                    ? "bg-red-500 hover:bg-red-600 text-white shadow-lg"
                    : "text-red-300 hover:text-white hover:bg-red-500/20"
                }`}
              >
                Artist
              </Button>
              <Button
                variant={sortBy === "title" ? "default" : "ghost"}
                size="sm"
                onClick={() => setSortBy("title")}
                className={`rounded-lg px-4 py-2 text-sm font-medium transition-all duration-200 ${
                  sortBy === "title"
                    ? "bg-red-500 hover:bg-red-600 text-white shadow-lg"
                    : "text-red-300 hover:text-white hover:bg-red-500/20"
                }`}
              >
                Title
              </Button>
            </div>
          </div>
        </div>

        {/* Songs List Header */}
        <div className="bg-gradient-to-r from-red-500/5 to-pink-500/5 rounded-xl p-4 mb-4 border border-red-500/10">
          <div className="hidden md:grid grid-cols-12 gap-4 text-red-300 text-sm font-semibold uppercase tracking-wider">
            <div className="col-span-1 text-center">#</div>
            <div className="col-span-5">Title & Artist</div>
            <div className="col-span-3">Album</div>
            <div className="col-span-2">Date Added</div>
            <div className="col-span-1 text-right">
              <Clock className="w-4 h-4 ml-auto" />
            </div>
          </div>
        </div>

        {/* Songs List */}
        <div className="space-y-3">
          {sortedFavorites.map((favorite, index) => {
            const song = favorite.song;
            const isCurrentlyPlayingSong = currentlyPlaying === song.id;

            return (
              <Card
                key={favorite.id}
                className="group bg-gradient-to-r from-white/5 to-red-500/5 border-white/10 hover:from-red-500/10 hover:to-pink-500/10 hover:border-red-400/30 transition-all duration-300 cursor-pointer rounded-xl backdrop-blur-sm"
              >
                <CardContent className="p-5">
                  <div className="grid grid-cols-12 gap-4 items-center">
                    {/* Track Number / Play Button */}
                    <div className="col-span-1">
                      <div className="relative w-10 h-10 flex items-center justify-center">
                        <span
                          className={`text-red-300 group-hover:opacity-0 transition-opacity font-medium ${
                            isCurrentlyPlayingSong ? "opacity-0" : ""
                          }`}
                        >
                          {index + 1}
                        </span>
                        <div
                          className={`absolute inset-0 flex items-center justify-center transition-opacity ${
                            isCurrentlyPlayingSong
                              ? "opacity-100"
                              : "opacity-0 group-hover:opacity-100"
                          }`}
                        >
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handlePlaySong(song.id)}
                            className="w-10 h-10 rounded-full bg-red-500 hover:bg-red-600 text-white hover:scale-110 transition-all duration-200"
                          >
                            <Play className="w-4 h-4 ml-0.5" />
                          </Button>
                        </div>
                        {isCurrentlyPlayingSong && (
                          <div className="absolute -top-1 -right-1">
                            <div className="w-3 h-3 bg-red-400 rounded-full animate-pulse shadow-lg shadow-red-400/50"></div>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Song Info */}
                    <div className="col-span-5 flex items-center space-x-4">
                      <div className="relative w-14 h-14 rounded-xl overflow-hidden flex-shrink-0 shadow-lg">
                        <Image
                          src={song.coverUrl}
                          alt={song.title}
                          fill
                          className="object-cover transition-transform group-hover:scale-110 duration-300"
                          onError={(e) => {
                            // Fallback to gradient if image fails to load
                            const target = e.target as HTMLImageElement;
                            target.style.display = "none";
                            target.parentElement!.classList.add(
                              "bg-gradient-to-br",
                              "from-red-500",
                              "to-pink-500"
                            );
                            const musicIcon = document.createElement("div");
                            musicIcon.className =
                              "absolute inset-0 flex items-center justify-center";
                            musicIcon.innerHTML =
                              '<svg class="w-6 h-6 text-white/70" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3"></path></svg>';
                            target.parentElement!.appendChild(musicIcon);
                          }}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <h3
                          className={`font-semibold truncate text-lg transition-colors ${
                            isCurrentlyPlayingSong
                              ? "text-red-400"
                              : "text-white group-hover:text-red-300"
                          }`}
                        >
                          {song.title}
                        </h3>
                        <p className="text-red-300/80 text-sm truncate group-hover:text-red-200 transition-colors">
                          {song.artist?.name || "Unknown Artist"}
                        </p>
                      </div>
                    </div>

                    {/* Album */}
                    <div className="col-span-3 hidden md:block">
                      <span className="text-red-300/80 text-sm truncate group-hover:text-red-200 transition-colors">
                        {song.album || "Unknown Album"}
                      </span>
                    </div>

                    {/* Date Added */}
                    <div className="col-span-2 hidden md:block">
                      <span className="text-red-300/80 text-sm group-hover:text-red-200 transition-colors">
                        {formatRelativeTime(favorite.createdAt)}
                      </span>
                    </div>

                    {/* Duration & Actions */}
                    <div className="col-span-1 flex items-center justify-end space-x-3">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={(e) => {
                          e.stopPropagation();
                          removeFavorite(song.id);
                        }}
                        className="w-8 h-8 text-red-400/60 hover:text-red-300 hover:bg-red-500/20 opacity-0 group-hover:opacity-100 transition-all duration-200 rounded-lg"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                      <span className="text-red-300/80 text-sm min-w-[3rem] text-right group-hover:text-red-200 transition-colors">
                        {formatTime(song.duration)}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Collection Stats */}
        <div className="mt-16 mb-8">
          <div className="bg-gradient-to-r from-red-500/10 via-pink-500/10 to-purple-500/10 rounded-3xl p-8 border border-red-500/20 backdrop-blur-sm">
            <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
              {/* Main Stats */}
              <div className="flex flex-col sm:flex-row gap-8 lg:gap-12">
                <div className="text-center">
                  <div className="relative">
                    <div className="text-5xl font-bold bg-gradient-to-r from-red-400 to-pink-400 bg-clip-text text-transparent mb-3">
                      {favorites.length}
                    </div>
                    <div className="absolute -top-2 -right-2">
                      <Heart className="w-6 h-6 text-red-400 fill-current animate-pulse" />
                    </div>
                  </div>
                  <div className="text-red-200 font-medium">Loved Songs</div>
                  <div className="text-red-400 text-sm mt-1">
                    in your collection
                  </div>
                </div>

                <div className="text-center">
                  <div className="relative">
                    <div className="text-5xl font-bold bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent mb-3">
                      {totalHours}h
                    </div>
                    <div className="text-2xl font-semibold text-purple-300 -mt-2">
                      {totalMinutes}m
                    </div>
                  </div>
                  <div className="text-red-200 font-medium">Listening Time</div>
                  <div className="text-red-400 text-sm mt-1">of pure music</div>
                </div>

                <div className="text-center">
                  <div className="text-5xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent mb-3">
                    {Math.round(
                      favorites.length > 0
                        ? favorites.reduce(
                            (acc: number, fav: FavoriteWithSong) =>
                              acc + fav.song.playCount,
                            0
                          ) / favorites.length
                        : 0
                    )}
                  </div>
                  <div className="text-red-200 font-medium">Avg Plays</div>
                  <div className="text-red-400 text-sm mt-1">per song</div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col gap-3">
                <Button
                  onClick={() => router.push("/search")}
                  className="bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white font-semibold px-6 py-3 rounded-xl shadow-lg hover:shadow-red-500/25 transition-all duration-300 hover:scale-105"
                >
                  <Heart className="w-5 h-5 mr-2" />
                  Discover More
                </Button>
                <Button
                  variant="outline"
                  className="border-red-400/50 text-red-300 hover:bg-red-500/10 hover:border-red-400 px-6 py-3 rounded-xl font-medium transition-all duration-300"
                >
                  <Download className="w-5 h-5 mr-2" />
                  Export Playlist
                </Button>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="mt-8 pt-6 border-t border-red-500/20">
              <div className="flex items-center justify-between mb-3">
                <span className="text-red-200 text-sm font-medium">
                  Collection Progress
                </span>
                <span className="text-red-400 text-sm">
                  {favorites.length}/100 songs
                </span>
              </div>
              <div className="w-full bg-red-900/30 rounded-full h-2">
                <div
                  className="bg-gradient-to-r from-red-500 to-pink-500 h-2 rounded-full transition-all duration-1000 ease-out"
                  style={{
                    width: `${Math.min((favorites.length / 100) * 100, 100)}%`,
                  }}
                />
              </div>
              <p className="text-red-400 text-xs mt-2 text-center">
                {favorites.length < 100
                  ? `${
                      100 - favorites.length
                    } more songs to complete your first 100!`
                  : "🎉 You've reached 100 songs! Keep growing your collection!"}
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
