"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Navbar from "@/components/layout/navbar";
import { useAudio } from "@/components/layout/app-layout";
import KaraokeSubtitleDisplay from "@/components/ui/karaoke-subtitle-display";
import { usePlayHistory } from "@/lib/use-play-history";
import LikeButton from "@/components/ui/like-button";
import {
  Play,
  Pause,
  Languages,
  RefreshCw,
  ArrowLeft,
  MoreVertical,
  Plus,
  Music,
} from "lucide-react";
import { Song } from "@/lib/types";
import { formatTime } from "@/lib/utils";

interface SubtitleData {
  startTime: number;
  text: string;
  endTime: number;
  language: string;
}

interface GroupedSubtitles {
  time: number;
  text: string;
  endTime: number;
}

interface Playlist {
  id: string;
  name: string;
  description?: string;
  isPublic: boolean;
  coverUrl?: string;
  _count: {
    songs: number;
  };
}

export default function SongPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useUser();
  const audio = useAudio();
  const { trackPlay } = usePlayHistory();
  const [song, setSong] = useState<Song | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedSubtitleLanguage, setSelectedSubtitleLanguage] = useState<
    "english" | "nepali"
  >("english");
  const [isSubtitleSynced, setIsSubtitleSynced] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const [showCreatePlaylist, setShowCreatePlaylist] = useState(false);
  const [newPlaylistName, setNewPlaylistName] = useState("");

  // Mock user ID - in a real app, this would come from authentication
  const userId = user?.id || "mock-user-id";

  const [subtitles, setSubtitles] = useState<{
    english: Array<{ time: number; text: string; endTime: number }>;
    nepali: Array<{ time: number; text: string; endTime: number }>;
  }>({
    english: [],
    nepali: [],
  });

  useEffect(() => {
    const fetchSong = async () => {
      try {
        setLoading(true);
        const [
          songResponse,
          subtitlesResponse,
          favoritesResponse,
          playlistsResponse,
        ] = await Promise.all([
          fetch(`/api/songs/${params.id}`),
          fetch(`/api/subtitles?songId=${params.id}`),
          fetch(`/api/favorites?userId=${userId}`),
          fetch(`/api/playlists?userId=${userId}`),
        ]);

        if (!songResponse.ok) {
          throw new Error("Failed to fetch song");
        }

        const songData = await songResponse.json();
        if (songData.success) {
          setSong(songData.data);
        } else {
          throw new Error(songData.error || "Failed to fetch song");
        }

        // Fetch subtitles
        if (subtitlesResponse.ok) {
          const subtitlesData = await subtitlesResponse.json();
          if (subtitlesData.success) {
            const groupedSubtitles = subtitlesData.data.reduce(
              (acc: Record<string, GroupedSubtitles[]>, sub: SubtitleData) => {
                if (!acc[sub.language]) {
                  acc[sub.language] = [];
                }
                acc[sub.language].push({
                  time: sub.startTime,
                  text: sub.text,
                  endTime: sub.endTime,
                });
                return acc;
              },
              {} as Record<string, GroupedSubtitles[]>
            );

            setSubtitles({
              english: groupedSubtitles.english || [],
              nepali: groupedSubtitles.nepali || [],
            });
          }
        }

        // Check if song is liked
        if (favoritesResponse.ok) {
          const favoritesData = await favoritesResponse.json();
          if (favoritesData.success) {
            const isLikedSong = favoritesData.data.some(
              (fav: { songId: string }) => fav.songId === params.id
            );
            setIsLiked(isLikedSong);
          }
        }

        // Fetch user playlists
        if (playlistsResponse.ok) {
          const playlistsData = await playlistsResponse.json();
          if (playlistsData.success) {
            setPlaylists(playlistsData.data);
          }
        }
      } catch (error) {
        console.error("Error fetching song:", error);
        setError("Failed to load song. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    if (params.id) {
      fetchSong();
    }
  }, [params.id, userId]);

  const handlePlaySong = () => {
    if (song) {
      audio.onPlaySong(song);
      // Track the play
      trackPlay(song.id);
    }
  };

  const handleAddToPlaylist = async (playlistId: string) => {
    try {
      const response = await fetch(`/api/playlists/${playlistId}/songs`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ songId: params.id }),
      });
      if (response.ok) {
        setIsMenuOpen(false);
        // You could show a success message here
      }
    } catch (error) {
      console.error("Error adding to playlist:", error);
    }
  };

  const handleCreatePlaylist = async () => {
    try {
      const response = await fetch("/api/playlists", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: newPlaylistName,
          userId: userId,
          isPublic: false,
        }),
      });
      if (response.ok) {
        const result = await response.json();
        setPlaylists([result.data, ...playlists]);
        setNewPlaylistName("");
        setShowCreatePlaylist(false);
        // Automatically add current song to new playlist
        await handleAddToPlaylist(result.data.id);
      }
    } catch (error) {
      console.error("Error creating playlist:", error);
    }
  };

  const isCurrentSong = audio.currentSong?.id === song?.id;

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <Navbar />
        <main className="lg:ml-72 p-8">
          <div className="flex justify-center items-center h-96">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
          </div>
        </main>
      </div>
    );
  }

  if (error || !song) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <Navbar />
        <main className="lg:ml-72 p-8 pb-24 lg:pb-32">
          <div className="text-center">
            <p className="text-red-600 mb-4">{error || "Song not found"}</p>
            <Button onClick={() => router.back()}>Go Back</Button>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navbar />
      <main className="lg:ml-72 p-8 pb-24 lg:pb-32">
        {/* Header */}
        <div className="mb-8">
          <Button
            variant="ghost"
            onClick={() => router.back()}
            className="mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Now Playing
          </h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Side - Song Info and Image */}
          <div className="space-y-6">
            {/* Song Thumbnail with Play Button and Info Overlay */}
            <div className="relative aspect-square rounded-xl overflow-hidden shadow-2xl group">
              <Image
                src={song.coverUrl}
                alt={song.title}
                fill
                className="object-cover"
              />
              {/* Dim overlay */}
              <div className="absolute inset-0 bg-black/30 group-hover:bg-black/50 transition-all duration-300" />

              {/* Play Button in Center */}
              <div className="absolute inset-0 flex items-center justify-center">
                <Button
                  size="icon"
                  onClick={isCurrentSong ? audio.onPlayPause : handlePlaySong}
                  className="h-16 w-16 rounded-full bg-white/90 hover:bg-white text-black shadow-lg transform hover:scale-105 transition-all duration-200"
                >
                  {isCurrentSong && audio.isPlaying ? (
                    <Pause className="h-8 w-8" />
                  ) : (
                    <Play className="h-8 w-8 ml-1" />
                  )}
                </Button>
              </div>

              {/* Song Info Overlay at Top */}
              <div className="absolute top-0 left-0 right-0 bg-gradient-to-b from-black/70 to-transparent p-6">
                <h2 className="text-2xl font-bold text-white mb-2">
                  {song.title}
                </h2>
                <p className="text-lg text-white/90 mb-2">
                  {song.artist?.name || "Unknown Artist"}
                </p>
                <div className="flex items-center space-x-4 text-sm text-white/70">
                  <span>{song.album}</span>
                  <span>•</span>
                  <span>{song.year}</span>
                  <span>•</span>
                  <span>{formatTime(song.duration)}</span>
                </div>
              </div>
            </div>

            {/* Song Information and Actions */}
            <Card>
              <CardContent className="p-6">
                <div className="space-y-4">
                  {/* Song Basic Info */}
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-1">
                      {song.title}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300 mb-2">
                      by {song.artist?.name || "Unknown Artist"}
                    </p>
                    <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
                      {song.album && <span>{song.album}</span>}
                      {song.year && (
                        <>
                          <span>•</span>
                          <span>{song.year}</span>
                        </>
                      )}
                      {song.genre && (
                        <>
                          <span>•</span>
                          <span>{song.genre}</span>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
                    <div className="flex items-center space-x-3">
                      {/* Like Button */}
                      <LikeButton
                        songId={song.id}
                        initialLiked={isLiked}
                        onLikeChange={(liked: boolean) => setIsLiked(liked)}
                        size="sm"
                      />

                      {/* Play Count */}
                      <div className="flex items-center space-x-1 text-sm text-gray-500 dark:text-gray-400">
                        <Music className="h-4 w-4" />
                        <span>{song.playCount.toLocaleString()} plays</span>
                      </div>
                    </div>

                    {/* Three Dot Menu */}
                    <div className="relative">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                      >
                        <MoreVertical className="h-4 w-4" />
                      </Button>

                      {/* Dropdown Menu */}
                      {isMenuOpen && (
                        <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-50">
                          <div className="p-2">
                            <div className="text-sm font-medium text-gray-700 dark:text-gray-200 px-3 py-2 border-b border-gray-200 dark:border-gray-700">
                              Add to Playlist
                            </div>

                            {/* Create New Playlist */}
                            {!showCreatePlaylist ? (
                              <button
                                onClick={() => setShowCreatePlaylist(true)}
                                className="w-full text-left px-3 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded flex items-center"
                              >
                                <Plus className="h-4 w-4 mr-2" />
                                Create New Playlist
                              </button>
                            ) : (
                              <div className="p-3 space-y-2">
                                <input
                                  type="text"
                                  placeholder="Playlist name"
                                  value={newPlaylistName}
                                  onChange={(e) =>
                                    setNewPlaylistName(e.target.value)
                                  }
                                  className="w-full px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                                  onKeyPress={(e) => {
                                    if (
                                      e.key === "Enter" &&
                                      newPlaylistName.trim()
                                    ) {
                                      handleCreatePlaylist();
                                    }
                                  }}
                                />
                                <div className="flex space-x-2">
                                  <Button
                                    size="sm"
                                    onClick={handleCreatePlaylist}
                                    disabled={!newPlaylistName.trim()}
                                    className="text-xs"
                                  >
                                    Create
                                  </Button>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => {
                                      setShowCreatePlaylist(false);
                                      setNewPlaylistName("");
                                    }}
                                    className="text-xs"
                                  >
                                    Cancel
                                  </Button>
                                </div>
                              </div>
                            )}

                            {/* Existing Playlists */}
                            {playlists.length > 0 && (
                              <div className="border-t border-gray-200 dark:border-gray-700 mt-2 pt-2">
                                {playlists.map((playlist) => (
                                  <button
                                    key={playlist.id}
                                    onClick={() =>
                                      handleAddToPlaylist(playlist.id)
                                    }
                                    className="w-full text-left px-3 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
                                  >
                                    <div className="flex items-center justify-between">
                                      <span>{playlist.name}</span>
                                      <span className="text-xs text-gray-500">
                                        {playlist._count.songs} songs
                                      </span>
                                    </div>
                                  </button>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Side - Karaoke Style Subtitles */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Languages className="h-5 w-5" />
                    <span>Lyrics</span>
                  </div>

                  {/* Language Selection & Sync in same row */}
                  <div className="flex items-center space-x-4">
                    <div className="flex space-x-2">
                      <Button
                        variant={
                          selectedSubtitleLanguage === "english"
                            ? "default"
                            : "outline"
                        }
                        size="sm"
                        onClick={() => setSelectedSubtitleLanguage("english")}
                      >
                        English
                      </Button>
                      <Button
                        variant={
                          selectedSubtitleLanguage === "nepali"
                            ? "default"
                            : "outline"
                        }
                        size="sm"
                        onClick={() => setSelectedSubtitleLanguage("nepali")}
                      >
                        नेपाली
                      </Button>
                    </div>

                    <Button
                      variant={isSubtitleSynced ? "default" : "outline"}
                      onClick={() => setIsSubtitleSynced(!isSubtitleSynced)}
                      size="sm"
                    >
                      <RefreshCw className="h-4 w-4 mr-2" />
                      {isSubtitleSynced ? "Sync On" : "Sync Off"}
                    </Button>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <KaraokeSubtitleDisplay
                  subtitles={subtitles[selectedSubtitleLanguage]}
                  currentTime={isCurrentSong ? audio.currentTime : 0}
                  isPlaying={isCurrentSong && audio.isPlaying}
                  isSynced={isSubtitleSynced}
                  onSeek={(time: number) => isCurrentSong && audio.onSeek(time)}
                />
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
