"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Navbar from "@/components/layout/navbar";
import LikeButton from "@/components/ui/like-button";
import { useUser } from "@clerk/nextjs";
import { usePlayHistory } from "@/lib/use-play-history";
import {
  Play,
  Pause,
  Shuffle,
  MoreHorizontal,
  Clock,
  Calendar,
  Loader2,
  ArrowLeft,
  Trash2,
  Edit3,
  Share2,
  Download,
  Music2,
} from "lucide-react";
import { Song } from "@/lib/types";
import { formatTime } from "@/lib/utils";
import Image from "next/image";

interface PlaylistSong {
  id: string;
  position: number;
  addedAt: string;
  song: Song;
}

interface Playlist {
  id: string;
  name: string;
  description: string | null;
  isPublic: boolean;
  coverUrl: string | null;
  createdAt: string;
  updatedAt: string;
  userId: string;
  songs: PlaylistSong[];
  _count: {
    songs: number;
  };
}

export default function PlaylistPage() {
  const params = useParams();
  const router = useRouter();
  const { user, isLoaded } = useUser();
  const { trackPlay } = usePlayHistory();
  const playlistId = params.id as string;

  const [playlist, setPlaylist] = useState<Playlist | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentlyPlaying, setCurrentlyPlaying] = useState<string | null>(null);

  // Redirect to login if not authenticated
  useEffect(() => {
    if (isLoaded && !user) {
      router.push("/login");
    }
  }, [isLoaded, user, router]);

  // Fetch playlist data
  useEffect(() => {
    const fetchPlaylist = async () => {
      if (!playlistId) return;

      try {
        setLoading(true);
        setError(null);

        const response = await fetch(`/api/playlists/${playlistId}`);
        const data = await response.json();

        if (data.success) {
          setPlaylist(data.data);
        } else {
          setError(data.error || "Failed to fetch playlist");
        }
      } catch (error) {
        console.error("Error fetching playlist:", error);
        setError("Failed to load playlist");
      } finally {
        setLoading(false);
      }
    };

    fetchPlaylist();
  }, [playlistId]);

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const handlePlaySong = (songId: string) => {
    setCurrentlyPlaying(songId);
    setIsPlaying(true);
    // Track the play
    trackPlay(songId);
    router.push(`/song/${songId}`);
  };

  const removeSongFromPlaylist = async (playlistSongId: string) => {
    try {
      const response = await fetch(`/api/playlists/${playlistId}/songs`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ playlistSongId }),
      });

      const data = await response.json();

      if (data.success) {
        setPlaylist((prev) =>
          prev
            ? {
                ...prev,
                songs: prev.songs.filter((item) => item.id !== playlistSongId),
                _count: { songs: prev._count.songs - 1 },
              }
            : null
        );
      } else {
        alert("Failed to remove song from playlist");
      }
    } catch (error) {
      console.error("Error removing song:", error);
      alert("Failed to remove song from playlist");
    }
  };

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

  const calculateTotalDuration = () => {
    if (!playlist?.songs) return { hours: 0, minutes: 0 };

    const totalSeconds = playlist.songs.reduce(
      (acc, item) => acc + item.song.duration,
      0
    );
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);

    return { hours, minutes };
  };

  // Show loading state
  if (!isLoaded || loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-violet-900 to-slate-900">
        <Navbar />
        <main className="lg:ml-72 p-8 pb-24 lg:pb-32 flex items-center justify-center">
          <div className="text-center">
            <Loader2 className="w-12 h-12 text-violet-400 animate-spin mx-auto mb-4" />
            <p className="text-violet-300">Loading playlist...</p>
          </div>
        </main>
      </div>
    );
  }

  // Show error state
  if (error || !playlist) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-violet-900 to-slate-900">
        <Navbar />
        <main className="lg:ml-72 p-8 pb-24 lg:pb-32 flex items-center justify-center">
          <div className="text-center">
            <Music2 className="w-16 h-16 text-violet-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-white mb-2">
              Playlist Not Found
            </h2>
            <p className="text-violet-300 mb-4">
              {error ||
                "This playlist doesn't exist or you don't have access to it."}
            </p>
            <Button
              onClick={() => router.push("/library")}
              className="bg-violet-500 hover:bg-violet-600"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Library
            </Button>
          </div>
        </main>
      </div>
    );
  }

  const { hours, minutes } = calculateTotalDuration();
  const isOwner = user?.id === playlist.userId;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-violet-900 to-slate-900">
      <Navbar />
      <main className="lg:ml-72 p-8 pb-24 lg:pb-32">
        {/* Back Button */}
        <Button
          variant="ghost"
          onClick={() => router.back()}
          className="text-violet-300 hover:text-white mb-6"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>

        {/* Hero Section */}
        <div className="flex flex-col md:flex-row items-start md:items-end space-y-6 md:space-y-0 md:space-x-8 mb-8">
          {/* Playlist Cover */}
          <div className="relative">
            <div className="w-48 h-48 bg-gradient-to-br from-violet-500 to-purple-500 rounded-3xl flex items-center justify-center shadow-2xl overflow-hidden">
              {playlist.coverUrl ? (
                <Image
                  src={playlist.coverUrl}
                  alt={playlist.name}
                  fill
                  className="object-cover"
                />
              ) : (
                <Music2 className="w-24 h-24 text-white" />
              )}
            </div>
          </div>

          {/* Playlist Info */}
          <div className="flex-1">
            <p className="text-violet-400 text-sm font-medium mb-2 uppercase tracking-wide">
              {playlist.isPublic ? "Public Playlist" : "Private Playlist"}
            </p>
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">
              {playlist.name}
            </h1>
            {playlist.description && (
              <p className="text-violet-200 text-lg mb-4">
                {playlist.description}
              </p>
            )}
            <div className="flex items-center space-x-6 text-violet-300">
              <span className="flex items-center">
                <Music2 className="w-4 h-4 mr-2" />
                {playlist._count.songs} songs
              </span>
              <span className="flex items-center">
                <Clock className="w-4 h-4 mr-2" />
                {hours > 0 ? `${hours}h ${minutes}m` : `${minutes}m`}
              </span>
              <span className="flex items-center">
                <Calendar className="w-4 h-4 mr-2" />
                {formatRelativeTime(playlist.createdAt)}
              </span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <Button
              onClick={handlePlayPause}
              disabled={playlist._count.songs === 0}
              className="w-14 h-14 bg-gradient-to-r from-violet-500 to-purple-500 hover:from-violet-600 hover:to-purple-600 rounded-full shadow-lg hover:shadow-violet-500/25 transition-all duration-300 hover:scale-105"
            >
              {isPlaying ? (
                <Pause className="w-6 h-6 text-white" />
              ) : (
                <Play className="w-6 h-6 text-white ml-1" />
              )}
            </Button>

            <Button
              variant="outline"
              disabled={playlist._count.songs === 0}
              className="border-violet-400 text-violet-400 hover:bg-violet-400 hover:text-white"
            >
              <Shuffle className="w-4 h-4 mr-2" />
              Shuffle
            </Button>

            <Button
              variant="outline"
              className="border-violet-400 text-violet-400 hover:bg-violet-400 hover:text-white"
            >
              <Share2 className="w-4 h-4 mr-2" />
              Share
            </Button>

            {isOwner && (
              <>
                <Button
                  variant="outline"
                  className="border-violet-400 text-violet-400 hover:bg-violet-400 hover:text-white"
                >
                  <Edit3 className="w-4 h-4 mr-2" />
                  Edit
                </Button>

                <Button
                  variant="outline"
                  className="border-violet-400 text-violet-400 hover:bg-violet-400 hover:text-white"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Download
                </Button>
              </>
            )}
          </div>

          <Button
            variant="ghost"
            size="icon"
            className="text-violet-400 hover:text-white"
          >
            <MoreHorizontal className="w-6 h-6" />
          </Button>
        </div>

        {/* Empty State */}
        {playlist._count.songs === 0 ? (
          <div className="text-center py-16">
            <Music2 className="w-24 h-24 text-violet-400 mx-auto mb-6" />
            <h3 className="text-2xl font-bold text-white mb-4">
              This playlist is empty
            </h3>
            <p className="text-violet-300 mb-6">
              Add some songs to get started
            </p>
            <Button className="bg-violet-500 hover:bg-violet-600">
              Add Songs
            </Button>
          </div>
        ) : (
          <>
            {/* Songs List Header */}
            <div className="hidden md:grid grid-cols-12 gap-4 px-4 py-3 border-b border-violet-500/20 text-violet-300 text-sm font-medium">
              <div className="col-span-1">#</div>
              <div className="col-span-5">TITLE</div>
              <div className="col-span-3">ALBUM</div>
              <div className="col-span-2">DATE ADDED</div>
              <div className="col-span-1 text-right">
                <Clock className="w-4 h-4 ml-auto" />
              </div>
            </div>

            {/* Songs List */}
            <div className="space-y-2">
              {playlist.songs.map((item, index) => {
                const song = item.song;
                const isCurrentlyPlayingSong = currentlyPlaying === song.id;

                return (
                  <Card
                    key={item.id}
                    className="group bg-white/5 border-white/10 hover:bg-violet-500/10 transition-all duration-300 cursor-pointer"
                  >
                    <CardContent className="p-4">
                      <div className="grid grid-cols-12 gap-4 items-center">
                        {/* Track Number / Play Button */}
                        <div className="col-span-1">
                          <div className="relative w-8 h-8 flex items-center justify-center">
                            <span
                              className={`text-violet-300 group-hover:opacity-0 transition-opacity ${
                                isCurrentlyPlayingSong ? "opacity-0" : ""
                              }`}
                            >
                              {index + 1}
                            </span>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handlePlaySong(song.id)}
                              className={`absolute w-8 h-8 text-white hover:bg-violet-500 transition-opacity ${
                                isCurrentlyPlayingSong
                                  ? "opacity-100"
                                  : "opacity-0 group-hover:opacity-100"
                              }`}
                            >
                              <Play className="w-4 h-4" />
                            </Button>
                            {isCurrentlyPlayingSong && (
                              <div className="absolute inset-0 flex items-center justify-center">
                                <div className="w-1 h-1 bg-violet-400 rounded-full animate-ping"></div>
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Song Info */}
                        <div className="col-span-5 flex items-center space-x-4">
                          <div className="relative w-12 h-12 rounded-lg overflow-hidden flex-shrink-0">
                            <Image
                              src={song.coverUrl}
                              alt={song.title}
                              fill
                              className="object-cover"
                              onError={(e) => {
                                const target = e.target as HTMLImageElement;
                                target.style.display = "none";
                                target.parentElement!.classList.add(
                                  "bg-gradient-to-br",
                                  "from-violet-500",
                                  "to-purple-500"
                                );
                                const musicIcon = document.createElement("div");
                                musicIcon.className =
                                  "absolute inset-0 flex items-center justify-center";
                                musicIcon.innerHTML =
                                  '<svg class="w-6 h-6 text-white/70" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3"></path></svg>';
                                target.parentElement!.appendChild(musicIcon);
                              }}
                            />
                          </div>
                          <div className="min-w-0 flex-1">
                            <h3
                              className={`font-semibold truncate ${
                                isCurrentlyPlayingSong
                                  ? "text-violet-400"
                                  : "text-white"
                              }`}
                            >
                              {song.title}
                            </h3>
                            <p className="text-violet-300 text-sm truncate">
                              {song.artist?.name || "Unknown Artist"}
                            </p>
                          </div>
                        </div>

                        {/* Album */}
                        <div className="col-span-3 hidden md:block">
                          <span className="text-violet-300 text-sm truncate">
                            {song.album || "Unknown Album"}
                          </span>
                        </div>

                        {/* Date Added */}
                        <div className="col-span-2 hidden md:block">
                          <span className="text-violet-300 text-sm">
                            {formatRelativeTime(item.addedAt)}
                          </span>
                        </div>

                        {/* Duration & Actions */}
                        <div className="col-span-1 flex items-center justify-end space-x-3">
                          <LikeButton
                            songId={song.id}
                            variant="icon"
                            size="sm"
                          />
                          {isOwner && (
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={(e) => {
                                e.stopPropagation();
                                removeSongFromPlaylist(item.id);
                              }}
                              className="w-6 h-6 text-violet-400 opacity-0 group-hover:opacity-100 transition-opacity hover:text-red-400"
                            >
                              <Trash2 className="w-3 h-3" />
                            </Button>
                          )}
                          <span className="text-violet-300 text-sm">
                            {formatTime(song.duration)}
                          </span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </>
        )}
      </main>
    </div>
  );
}
