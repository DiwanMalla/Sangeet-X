"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Navbar from "@/components/layout/navbar";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import {
  Music2,
  Heart,
  List,
  Clock,
  Download,
  Plus,
  Grid3X3,
  MoreHorizontal,
  PlayCircle,
  Filter,
  Loader2,
} from "lucide-react";
import { Song } from "@/lib/types";
import { formatTime } from "@/lib/utils";
import Image from "next/image";
import CreatePlaylistModal from "@/components/ui/create-playlist-modal";
import { useAudio } from "@/components/layout/app-layout";
import { usePlayHistory } from "@/lib/use-play-history";

interface Playlist {
  id: string;
  name: string;
  description: string | null;
  isPublic: boolean;
  coverUrl: string | null;
  createdAt: string;
  updatedAt: string;
  songs: PlaylistSong[];
  _count: {
    songs: number;
  };
}

interface PlaylistSong {
  id: string;
  position: number;
  addedAt: string;
  song: Song;
}

interface PlayHistoryEntry {
  id: string;
  playedAt: string;
  completedPercentage: number;
  song: Song;
}

export default function LibraryPage() {
  const { user, isLoaded } = useUser();
  const router = useRouter();
  const audio = useAudio();
  const { trackPlay } = usePlayHistory();
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [filterType, setFilterType] = useState<
    "all" | "playlists" | "artists" | "albums"
  >("all");

  // State for real data
  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const [playHistory, setPlayHistory] = useState<PlayHistoryEntry[]>([]);
  const [favorites, setFavorites] = useState<{ id: string; song: Song }[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);

  // Redirect to login if not authenticated
  useEffect(() => {
    if (isLoaded && !user) {
      router.push("/login");
    }
  }, [isLoaded, user, router]);

  // Fetch user's library data
  useEffect(() => {
    const fetchLibraryData = async () => {
      if (!user?.id) return;

      try {
        setLoading(true);
        setError(null);

        // Fetch playlists
        const playlistsResponse = await fetch(
          `/api/playlists?userId=${user.id}`
        );
        const playlistsData = await playlistsResponse.json();

        // Fetch play history
        const historyResponse = await fetch(
          `/api/play-history?userId=${user.id}&limit=20`
        );
        const historyData = await historyResponse.json();

        // Fetch favorites count
        const favoritesResponse = await fetch(
          `/api/favorites?userId=${user.id}`
        );
        const favoritesData = await favoritesResponse.json();

        if (playlistsData.success) {
          setPlaylists(playlistsData.data);
        }

        if (historyData.success) {
          setPlayHistory(historyData.data);
        }

        if (favoritesData.success) {
          setFavorites(favoritesData.data);
        }
      } catch (error) {
        console.error("Error fetching library data:", error);
        setError("Failed to load your library");
      } finally {
        setLoading(false);
      }
    };

    fetchLibraryData();

    // Refresh data when the user comes back to the tab/window
    const handleFocus = () => {
      if (user?.id) {
        fetchLibraryData();
      }
    };

    // Listen for song play events to refresh data in real-time
    const handleSongPlayed = () => {
      if (user?.id) {
        fetchLibraryData();
      }
    };

    window.addEventListener("focus", handleFocus);
    window.addEventListener("songPlayed", handleSongPlayed);

    return () => {
      window.removeEventListener("focus", handleFocus);
      window.removeEventListener("songPlayed", handleSongPlayed);
    };
  }, [user?.id]);

  const formatRelativeTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMs = now.getTime() - date.getTime();
    const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
    const diffInDays = Math.floor(diffInHours / 24);

    if (diffInHours === 0) return "Just now";
    if (diffInHours < 24) return `${diffInHours}h ago`;
    if (diffInDays === 1) return "Yesterday";
    if (diffInDays < 7) return `${diffInDays} days ago`;
    if (diffInDays < 30) return `${Math.floor(diffInDays / 7)} weeks ago`;
    return `${Math.floor(diffInDays / 30)} months ago`;
  };

  const calculatePlaylistDuration = (songs: PlaylistSong[]) => {
    const totalSeconds = songs.reduce(
      (acc, item) => acc + item.song.duration,
      0
    );
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);

    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }
    return `${minutes}m`;
  };

  const handleClearPlayHistory = async () => {
    if (!user?.id) return;

    try {
      const response = await fetch(`/api/play-history?userId=${user.id}`, {
        method: "DELETE",
      });

      const data = await response.json();

      if (data.success) {
        setPlayHistory([]);
      } else {
        alert("Failed to clear play history");
      }
    } catch (error) {
      console.error("Error clearing play history:", error);
      alert("Failed to clear play history");
    }
  };

  const handlePlaylistCreated = (newPlaylist: Playlist) => {
    setPlaylists([newPlaylist, ...playlists]);
  };

  const handlePlaySong = (song: Song) => {
    if (audio && song) {
      audio.onPlaySong(song);
      trackPlay(song.id);
    }
  };

  // Show loading state
  if (!isLoaded || loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-violet-900 to-slate-900">
        <Navbar />
        <main className="lg:ml-72 p-6 flex items-center justify-center">
          <div className="text-center">
            <Loader2 className="w-12 h-12 text-violet-400 animate-spin mx-auto mb-4" />
            <p className="text-violet-300">Loading your library...</p>
          </div>
        </main>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-violet-900 to-slate-900">
        <Navbar />
        <main className="lg:ml-72 p-6 flex items-center justify-center">
          <div className="text-center">
            <Music2 className="w-16 h-16 text-violet-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-white mb-2">Oops!</h2>
            <p className="text-violet-300 mb-4">{error}</p>
            <Button
              onClick={() => window.location.reload()}
              className="bg-violet-500 hover:bg-violet-600"
            >
              Try Again
            </Button>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-violet-900 to-slate-900">
      <Navbar />
      <main className="lg:ml-72 p-6 pb-24 lg:pb-32">
        {/* Responsive padding for audio player space */}
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Your Library</h1>
            <p className="text-violet-300">
              Your playlists, liked songs, and recently played
            </p>
          </div>

          {/* Controls */}
          <div className="flex items-center space-x-3">
            <Button
              onClick={() => setViewMode(viewMode === "grid" ? "list" : "grid")}
              variant="ghost"
              size="sm"
              className="text-violet-300 hover:text-white hover:bg-white/10"
            >
              <Grid3X3 className="w-4 h-4" />
            </Button>

            <Button
              variant="outline"
              onClick={() => setShowCreateModal(true)}
              className="border-violet-400 text-violet-400 hover:bg-violet-400 hover:text-white"
            >
              <Plus className="w-4 h-4 mr-2" />
              Create Playlist
            </Button>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="flex items-center space-x-1 mb-6">
          {(["all", "playlists", "artists", "albums"] as const).map((type) => (
            <Button
              key={type}
              variant={filterType === type ? "default" : "ghost"}
              size="sm"
              onClick={() => setFilterType(type)}
              className={
                filterType === type
                  ? "bg-white text-black hover:bg-gray-200"
                  : "text-violet-300 hover:text-white hover:bg-white/10"
              }
            >
              {type.charAt(0).toUpperCase() + type.slice(1)}
            </Button>
          ))}

          <Button
            variant="ghost"
            size="sm"
            className="text-violet-300 hover:text-white hover:bg-white/10 ml-4"
          >
            <Filter className="w-4 h-4" />
          </Button>
        </div>

        {/* Quick Access */}
        <section className="mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Liked Songs Quick Access */}
            <Card className="group bg-white/5 border-white/10 hover:bg-white/10 transition-all duration-300">
              <CardContent className="p-4">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-pink-500 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Heart className="w-6 h-6 text-white fill-current" />
                  </div>
                  <div
                    className="flex-1 min-w-0 cursor-pointer"
                    onClick={() => router.push("/liked")}
                  >
                    <h3 className="text-white font-semibold">Liked Songs</h3>
                    <p className="text-violet-300 text-sm">
                      {favorites.length} songs
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      if (favorites.length > 0) {
                        handlePlaySong(favorites[0].song);
                      }
                    }}
                    className="opacity-0 group-hover:opacity-100 transition-opacity p-2 h-10 w-10 text-violet-400 hover:text-white hover:bg-white/10"
                    disabled={favorites.length === 0}
                  >
                    <PlayCircle className="w-6 h-6" />
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Downloaded Music - Placeholder for future feature */}
            <Card className="group bg-white/5 border-white/10 hover:bg-white/10 transition-all duration-300 cursor-pointer opacity-75">
              <CardContent className="p-4">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-500 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Download className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-white font-semibold">Downloaded</h3>
                    <p className="text-violet-300 text-sm">Coming soon</p>
                  </div>
                  <PlayCircle className="w-6 h-6 text-violet-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              </CardContent>
            </Card>

            {/* Recently Played */}
            <Card className="group bg-white/5 border-white/10 hover:bg-white/10 transition-all duration-300">
              <CardContent className="p-4">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-violet-500 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Clock className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1 min-w-0 cursor-pointer">
                    <h3 className="text-white font-semibold">
                      Recently Played
                    </h3>
                    <p className="text-violet-300 text-sm">
                      {playHistory.length > 0
                        ? `Last played ${formatRelativeTime(
                            playHistory[0].playedAt
                          )}`
                        : "No recent plays"}
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      if (playHistory.length > 0) {
                        handlePlaySong(playHistory[0].song);
                      }
                    }}
                    className="opacity-0 group-hover:opacity-100 transition-opacity p-2 h-10 w-10 text-violet-400 hover:text-white hover:bg-white/10"
                    disabled={playHistory.length === 0}
                  >
                    <PlayCircle className="w-6 h-6" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Made by You */}
        <section className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-white">Made by you</h2>
            <Button
              variant="ghost"
              size="sm"
              className="text-violet-300 hover:text-white"
            >
              Show all
            </Button>
          </div>

          {playlists.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-24 h-24 bg-gradient-to-br from-violet-500/20 to-purple-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <List className="w-12 h-12 text-violet-400" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">
                No playlists yet
              </h3>
              <p className="text-violet-300 mb-4">
                Create your first playlist to get started
              </p>
              <Button
                className="bg-violet-500 hover:bg-violet-600"
                onClick={() => setShowCreateModal(true)}
              >
                <Plus className="w-4 h-4 mr-2" />
                Create Playlist
              </Button>
            </div>
          ) : (
            <div
              className={
                viewMode === "grid"
                  ? "grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4"
                  : "space-y-2"
              }
            >
              {playlists.map((playlist) => (
                <Card
                  key={playlist.id}
                  className="group bg-white/5 border-white/10 hover:bg-white/10 transition-all duration-300 cursor-pointer"
                  onClick={() => router.push(`/playlist/${playlist.id}`)}
                >
                  <CardContent className={viewMode === "grid" ? "p-4" : "p-3"}>
                    {viewMode === "grid" ? (
                      <div>
                        <div className="w-full aspect-square bg-gradient-to-br from-violet-500 to-purple-500 rounded-lg mb-4 flex items-center justify-center relative overflow-hidden">
                          {playlist.coverUrl ? (
                            <Image
                              src={playlist.coverUrl}
                              alt={playlist.name}
                              fill
                              className="object-cover"
                            />
                          ) : (
                            <List className="w-12 h-12 text-white" />
                          )}
                          <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 rounded-lg transition-opacity flex items-center justify-center">
                            <PlayCircle className="w-12 h-12 text-white" />
                          </div>
                        </div>
                        <h3 className="text-white font-semibold mb-1 truncate">
                          {playlist.name}
                        </h3>
                        <p className="text-violet-300 text-sm mb-1 truncate">
                          {playlist.description || "No description"}
                        </p>
                        <p className="text-violet-400 text-xs">
                          {playlist._count.songs} songs •{" "}
                          {calculatePlaylistDuration(playlist.songs)}
                        </p>
                      </div>
                    ) : (
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-violet-500 to-purple-500 rounded-lg flex items-center justify-center flex-shrink-0 overflow-hidden">
                          {playlist.coverUrl ? (
                            <Image
                              src={playlist.coverUrl}
                              alt={playlist.name}
                              width={48}
                              height={48}
                              className="object-cover rounded-lg"
                            />
                          ) : (
                            <List className="w-6 h-6 text-white" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="text-white font-semibold truncate">
                            {playlist.name}
                          </h3>
                          <p className="text-violet-300 text-sm truncate">
                            {playlist.description || "No description"} •{" "}
                            {playlist._count.songs} songs
                          </p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <PlayCircle className="w-5 h-5 text-violet-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                          <MoreHorizontal className="w-5 h-5 text-violet-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </section>

        {/* Recently Played */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-white">
              Recently played
            </h2>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleClearPlayHistory}
              className="text-violet-300 hover:text-white"
            >
              Clear all
            </Button>
          </div>

          {playHistory.length === 0 ? (
            <div className="text-center py-8">
              <Clock className="w-16 h-16 text-violet-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-white mb-2">
                No recent plays
              </h3>
              <p className="text-violet-300">Songs you play will appear here</p>
            </div>
          ) : (
            <div className="max-h-96 overflow-y-auto space-y-2 scrollbar-thin scrollbar-track-transparent scrollbar-thumb-violet-400/30 hover:scrollbar-thumb-violet-400/50">
              {playHistory.map((entry) => (
                <Card
                  key={entry.id}
                  className="group bg-white/5 border-white/10 hover:bg-white/10 transition-all duration-300"
                >
                  <CardContent className="p-3">
                    <div className="flex items-center space-x-4">
                      <div className="relative w-10 h-10 rounded-lg overflow-hidden flex-shrink-0">
                        <Image
                          src={entry.song.coverUrl}
                          alt={entry.song.title}
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
                              '<svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3"></path></svg>';
                            target.parentElement!.appendChild(musicIcon);
                          }}
                        />
                      </div>
                      <div
                        className="flex-1 min-w-0 cursor-pointer"
                        onClick={() => router.push(`/song/${entry.song.id}`)}
                      >
                        <h3 className="text-white font-medium truncate">
                          {entry.song.title}
                        </h3>
                        <p className="text-violet-300 text-sm truncate">
                          {entry.song.artist?.name || "Unknown Artist"} •{" "}
                          {formatRelativeTime(entry.playedAt)}
                        </p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="text-violet-400 text-sm">
                          {formatTime(entry.song.duration)}
                        </span>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            handlePlaySong(entry.song);
                          }}
                          className="opacity-0 group-hover:opacity-100 transition-opacity p-1 h-8 w-8 text-violet-400 hover:text-white hover:bg-white/10"
                        >
                          <PlayCircle className="w-5 h-5" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </section>
      </main>

      {/* Create Playlist Modal */}
      <CreatePlaylistModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onPlaylistCreated={handlePlaylistCreated}
      />
    </div>
  );
}
