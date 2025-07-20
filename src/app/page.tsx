"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import LikeButton from "@/components/ui/like-button";
import Navbar from "@/components/layout/navbar";
import AudioPlayer from "@/components/layout/audio-player";
import {
  Play,
  Search,
  Clock,
  TrendingUp,
  Music2,
  PlayCircle,
} from "lucide-react";
import { Song, Genre } from "@/lib/types";
import { formatTime } from "@/lib/utils";
import { useUser } from "@clerk/nextjs";
import { usePlayHistory } from "@/lib/use-play-history";

export default function HomePage() {
  const router = useRouter();
  const { isSignedIn, isLoaded } = useUser();
  const { trackPlay } = usePlayHistory();
  const [currentSong, setCurrentSong] = useState<Song | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.7);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isShuffling, setIsShuffling] = useState(false);
  const [isRepeating, setIsRepeating] = useState<"none" | "one" | "all">(
    "none"
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [queue, setQueue] = useState<Song[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [songs, setSongs] = useState<Song[]>([]);
  const [genres, setGenres] = useState<Genre[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Check authentication status
  useEffect(() => {
    if (!isLoaded) return; // Wait for Clerk to load

    if (!isSignedIn) {
      router.push("/landing");
    }
  }, [isSignedIn, isLoaded, router]);

  // Fetch data from API
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [popularResponse, songsResponse] = await Promise.all([
          fetch("/api/popular"),
          fetch("/api/songs"),
        ]);

        if (!popularResponse.ok || !songsResponse.ok) {
          throw new Error("Failed to fetch data");
        }

        const popularData = await popularResponse.json();
        const songsData = await songsResponse.json();

        if (popularData.success) {
          setSongs(popularData.data.songs);
          setGenres(popularData.data.genres);
        }

        if (songsData.success) {
          setQueue(songsData.data);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        setError("Failed to load data. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handlePlaySong = (song: Song) => {
    setCurrentSong(song);
    setIsPlaying(true);
    setQueue(queue.length > 0 ? queue : [song]);
    setCurrentIndex(queue.findIndex((s) => s.id === song.id));

    // Track the play
    trackPlay(song.id);
  };

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const handleNext = () => {
    if (queue.length > 0) {
      const nextIndex = (currentIndex + 1) % queue.length;
      setCurrentIndex(nextIndex);
      setCurrentSong(queue[nextIndex]);
    }
  };

  const handlePrevious = () => {
    if (queue.length > 0) {
      const prevIndex = (currentIndex - 1 + queue.length) % queue.length;
      setCurrentIndex(prevIndex);
      setCurrentSong(queue[prevIndex]);
    }
  };

  const handleSeek = (time: number) => {
    setCurrentTime(time);
  };

  const handleVolumeChange = (newVolume: number) => {
    setVolume(newVolume);
  };

  const handleToggleShuffle = () => {
    setIsShuffling(!isShuffling);
  };

  const handleToggleRepeat = () => {
    const modes: Array<"none" | "one" | "all"> = ["none", "one", "all"];
    const currentModeIndex = modes.indexOf(isRepeating);
    const nextMode = modes[(currentModeIndex + 1) % modes.length];
    setIsRepeating(nextMode);
  };

  const handleToggleLike = () => {
    if (currentSong) {
      setCurrentSong({
        ...currentSong,
        isLiked: !currentSong.isLiked,
      });
    }
  };

  const handleSearch = () => {
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  // Set duration when song changes
  useEffect(() => {
    if (currentSong) {
      setDuration(currentSong.duration);
      setCurrentTime(0);
    }
  }, [currentSong]);

  // Don't render anything until Clerk is loaded
  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  // Only render home content if authenticated
  if (!isSignedIn) {
    return null; // Will redirect to landing
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navbar />

      <main className="lg:ml-72 pb-24">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white">
          <div className="px-4 py-12 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto text-center">
              <h1 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
                Discover Your Sound
              </h1>
              <p className="mt-6 text-xl text-purple-100">
                Explore millions of songs, create playlists, and find your new
                favorite artists
              </p>
              <div className="mt-8 flex justify-center">
                <div className="flex w-full max-w-md">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input
                      type="text"
                      placeholder="Search for songs, artists, or albums..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" && searchQuery.trim()) {
                          handleSearch();
                        }
                      }}
                      className="pl-10 bg-white/10 border-white/20 text-white placeholder-purple-100"
                    />
                  </div>
                  <Button
                    className="ml-2 bg-white text-purple-600 hover:bg-gray-100"
                    onClick={handleSearch}
                    disabled={!searchQuery.trim()}
                  >
                    <Search className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="px-4 py-8 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            {/* Loading State */}
            {loading && (
              <div className="flex justify-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
              </div>
            )}

            {/* Error State */}
            {error && (
              <div className="text-center py-12">
                <p className="text-red-600 mb-4">{error}</p>
                <Button onClick={() => window.location.reload()}>
                  Try Again
                </Button>
              </div>
            )}

            {/* Content */}
            {!loading && !error && (
              <>
                {/* Popular Songs */}
                <section className="mb-12">
                  <div className="flex items-center space-x-2 mb-6">
                    <TrendingUp className="h-6 w-6 text-purple-600" />
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                      Popular Right Now
                    </h2>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {songs.slice(0, 6).map((song) => (
                      <Card
                        key={song.id}
                        className="group cursor-pointer hover:shadow-lg transition-shadow"
                      >
                        <CardContent className="p-4">
                          <div className="flex items-center space-x-4">
                            <div className="relative w-16 h-16 rounded-lg overflow-hidden">
                              <Image
                                src={song.coverUrl}
                                alt={song.title}
                                fill
                                className="object-cover group-hover:scale-105 transition-transform"
                              />
                              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => handlePlaySong(song)}
                                  className="text-white hover:bg-white/20"
                                >
                                  <Play className="h-6 w-6" />
                                </Button>
                              </div>
                            </div>
                            <div className="flex-1 min-w-0">
                              <Link href={`/song/${song.id}`} className="block">
                                <h3 className="font-semibold text-gray-900 dark:text-white truncate hover:text-purple-600 dark:hover:text-purple-400 transition-colors cursor-pointer">
                                  {song.title}
                                </h3>
                              </Link>
                              <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                                {song.artist?.name || "Unknown Artist"}
                              </p>
                              <div className="flex items-center space-x-2 mt-2">
                                <Clock className="h-3 w-3 text-gray-400" />
                                <span className="text-xs text-gray-400">
                                  {formatTime(song.duration)}
                                </span>
                                <LikeButton
                                  songId={song.id}
                                  variant="icon"
                                  size="sm"
                                />
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </section>

                {/* Browse by Genre */}
                <section className="mb-12">
                  <div className="flex items-center space-x-2 mb-6">
                    <Music2 className="h-6 w-6 text-purple-600" />
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                      Browse by Genre
                    </h2>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                    {genres.map((genre) => (
                      <Card
                        key={genre.id}
                        className="group cursor-pointer hover:shadow-lg transition-shadow"
                      >
                        <CardContent className="p-4">
                          <div className="aspect-square rounded-lg mb-3 overflow-hidden relative">
                            <div
                              className="absolute inset-0 bg-gradient-to-br opacity-80"
                              style={{
                                backgroundImage: `linear-gradient(135deg, ${genre.color}, ${genre.color}CC)`,
                              }}
                            />
                            <div className="absolute inset-0 flex items-center justify-center">
                              <PlayCircle className="h-8 w-8 text-white opacity-70 group-hover:opacity-100 transition-opacity" />
                            </div>
                          </div>
                          <h3 className="font-semibold text-gray-900 dark:text-white text-sm">
                            {genre.name}
                          </h3>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            {genre.songCount} songs
                          </p>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </section>

                {/* Recently Played */}
                <section className="mb-12">
                  <div className="flex items-center space-x-2 mb-6">
                    <Clock className="h-6 w-6 text-purple-600" />
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                      Recently Played
                    </h2>
                  </div>
                  <div className="space-y-2">
                    {queue.slice(0, 5).map((song, index) => (
                      <div
                        key={song.id}
                        className="flex items-center space-x-4 p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer group"
                        onClick={() => handlePlaySong(song)}
                      >
                        <div className="flex-shrink-0 w-8 text-center">
                          <span className="text-sm text-gray-500 dark:text-gray-400 group-hover:hidden">
                            {index + 1}
                          </span>
                          <Play className="h-4 w-4 text-gray-500 dark:text-gray-400 hidden group-hover:block" />
                        </div>
                        <div className="relative w-12 h-12 rounded-md overflow-hidden">
                          <Image
                            src={song.coverUrl}
                            alt={song.title}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <Link href={`/song/${song.id}`} className="block">
                            <h3 className="font-medium text-gray-900 dark:text-white truncate hover:text-purple-600 dark:hover:text-purple-400 transition-colors cursor-pointer">
                              {song.title}
                            </h3>
                          </Link>
                          <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                            {song.artist?.name || "Unknown Artist"}
                          </p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <LikeButton
                            songId={song.id}
                            variant="icon"
                            size="sm"
                          />
                          <span className="text-sm text-gray-400">
                            {formatTime(song.duration)}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              </>
            )}
          </div>
        </div>
      </main>

      {/* Audio Player */}
      <AudioPlayer
        currentSong={currentSong}
        isPlaying={isPlaying}
        volume={volume}
        currentTime={currentTime}
        duration={duration}
        onPlayPause={handlePlayPause}
        onNext={handleNext}
        onPrevious={handlePrevious}
        onSeek={handleSeek}
        onVolumeChange={handleVolumeChange}
        onToggleShuffle={handleToggleShuffle}
        onToggleRepeat={handleToggleRepeat}
        onToggleLike={handleToggleLike}
        isShuffling={isShuffling}
        isRepeating={isRepeating}
      />
    </div>
  );
}
