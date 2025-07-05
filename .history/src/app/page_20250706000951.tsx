"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import CopyrightNotice, { EducationalFooter } from '@/components/common/copyright-notice'
import Navbar from "@/components/layout/navbar";
import AudioPlayer from "@/components/layout/audio-player";
import {
  Play,
  Search,
  Clock,
  Heart,
  TrendingUp,
  Music2,
  PlayCircle,
} from "lucide-react";
import { Song } from "@/lib/types";
import { mockSongs, getPopularSongs } from "@/data/songs";
import { getPopularGenres } from "@/data/genres";
import { cn, formatTime } from "@/lib/utils";

export default function HomePage() {
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

  const popularSongs = getPopularSongs();
  const popularGenres = getPopularGenres();

  const handlePlaySong = (song: Song) => {
    setCurrentSong(song);
    setIsPlaying(true);
    setQueue(mockSongs);
    setCurrentIndex(mockSongs.findIndex((s) => s.id === song.id));
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

  // Mock audio time updates
  useEffect(() => {
    if (isPlaying && currentSong) {
      const interval = setInterval(() => {
        setCurrentTime((prev) => {
          if (prev >= duration) {
            return 0;
          }
          return prev + 1;
        });
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [isPlaying, currentSong, duration]);

  // Set mock duration when song changes
  useEffect(() => {
    if (currentSong) {
      setDuration(currentSong.duration);
      setCurrentTime(0);
    }
  }, [currentSong]);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <CopyrightNotice />
      <Navbar />

      <main className="lg:ml-72 pb-24 pt-16">
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
                      className="pl-10 bg-white/10 border-white/20 text-white placeholder-purple-100"
                    />
                  </div>
                  <Button className="ml-2 bg-white text-purple-600 hover:bg-gray-100">
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
            {/* Popular Songs */}
            <section className="mb-12">
              <div className="flex items-center space-x-2 mb-6">
                <TrendingUp className="h-6 w-6 text-purple-600" />
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                  Popular Right Now
                </h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {popularSongs.slice(0, 6).map((song) => (
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
                          <h3 className="font-semibold text-gray-900 dark:text-white truncate">
                            {song.title}
                          </h3>
                          <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                            {song.artist}
                          </p>
                          <div className="flex items-center space-x-2 mt-2">
                            <Clock className="h-3 w-3 text-gray-400" />
                            <span className="text-xs text-gray-400">
                              {formatTime(song.duration)}
                            </span>
                            <Heart
                              className={cn(
                                "h-3 w-3",
                                song.isLiked
                                  ? "text-red-500 fill-red-500"
                                  : "text-gray-400"
                              )}
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
                {popularGenres.map((genre) => (
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
                {mockSongs.slice(0, 5).map((song, index) => (
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
                      <h3 className="font-medium text-gray-900 dark:text-white truncate">
                        {song.title}
                      </h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                        {song.artist}
                      </p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Heart
                        className={cn(
                          "h-4 w-4",
                          song.isLiked
                            ? "text-red-500 fill-red-500"
                            : "text-gray-400"
                        )}
                      />
                      <span className="text-sm text-gray-400">
                        {formatTime(song.duration)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </section>
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
      
      {/* Educational Footer */}
      <EducationalFooter />
    </div>
  );
}
