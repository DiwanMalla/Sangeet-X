"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Navbar from "@/components/layout/navbar";
import {
  Heart,
  Play,
  Pause,
  Music,
  PlayCircle,
  Shuffle,
  Download,
  Share2,
  Clock,
  Calendar,
} from "lucide-react";

// Demo liked songs data
const demoLikedSongs = [
  {
    id: "1",
    title: "Resham Firiri",
    artist: "Traditional",
    album: "Folk Collection",
    duration: 245,
    coverUrl: "/demo-covers/resham.jpg",
    likedAt: "2 days ago",
    plays: "2.3M",
  },
  {
    id: "2",
    title: "Yo Mann Ta Mero",
    artist: "Narayan Gopal",
    album: "Classic Hits",
    duration: 312,
    coverUrl: "/demo-covers/mann.jpg",
    likedAt: "1 week ago",
    plays: "1.8M",
  },
  {
    id: "3",
    title: "Malai Nasodha",
    artist: "Arjun Pokharel",
    album: "Modern Nepali",
    duration: 198,
    coverUrl: "/demo-covers/malai.jpg",
    likedAt: "2 weeks ago",
    plays: "1.2M",
  },
  {
    id: "4",
    title: "Pirai Kanchha",
    artist: "1974 AD",
    album: "Rock Collection",
    duration: 276,
    coverUrl: "/demo-covers/pirai.jpg",
    likedAt: "3 weeks ago",
    plays: "890K",
  },
  {
    id: "5",
    title: "Samjhana Birsana",
    artist: "Deepak Bajracharya",
    album: "Memories",
    duration: 289,
    coverUrl: "/demo-covers/samjhana.jpg",
    likedAt: "1 month ago",
    plays: "756K",
  },
  {
    id: "6",
    title: "Kasam Hajur Ko",
    artist: "Udit Narayan",
    album: "Bollywood Hits",
    duration: 267,
    coverUrl: "/demo-covers/kasam.jpg",
    likedAt: "1 month ago",
    plays: "643K",
  },
];

const formatTime = (seconds: number) => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, "0")}`;
};

export default function LikedSongsPage() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentlyPlaying, setCurrentlyPlaying] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<"recent" | "artist" | "title">("recent");

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const handlePlaySong = (songId: string) => {
    setCurrentlyPlaying(songId);
    setIsPlaying(true);
  };

  const totalDuration = demoLikedSongs.reduce(
    (acc, song) => acc + song.duration,
    0
  );
  const totalHours = Math.floor(totalDuration / 3600);
  const totalMinutes = Math.floor((totalDuration % 3600) / 60);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-red-900 to-slate-900">
      <Navbar />
      <main className="lg:ml-72 p-8">
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
                    {demoLikedSongs.length} songs
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
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <Button
              onClick={handlePlayPause}
              className="w-14 h-14 bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 rounded-full shadow-lg hover:shadow-red-500/25 transition-all duration-300 hover:scale-105"
            >
              {isPlaying ? (
                <Pause className="w-6 h-6 text-white" />
              ) : (
                <Play className="w-6 h-6 text-white ml-1" />
              )}
            </Button>

            <Button
              variant="outline"
              className="border-red-400 text-red-400 hover:bg-red-400 hover:text-white"
            >
              <Shuffle className="w-4 h-4 mr-2" />
              Shuffle
            </Button>

            <Button
              variant="outline"
              className="border-red-400 text-red-400 hover:bg-red-400 hover:text-white"
            >
              <Download className="w-4 h-4 mr-2" />
              Download
            </Button>

            <Button
              variant="outline"
              className="border-red-400 text-red-400 hover:bg-red-400 hover:text-white"
            >
              <Share2 className="w-4 h-4 mr-2" />
              Share
            </Button>
          </div>

          {/* Sort Options */}
          <div className="flex items-center space-x-2">
            <span className="text-red-300 text-sm">Sort by:</span>
            <Button
              variant={sortBy === "recent" ? "default" : "ghost"}
              size="sm"
              onClick={() => setSortBy("recent")}
              className={
                sortBy === "recent"
                  ? "bg-red-500 hover:bg-red-600"
                  : "text-red-300 hover:text-white hover:bg-red-500/20"
              }
            >
              <Calendar className="w-4 h-4 mr-2" />
              Recent
            </Button>
            <Button
              variant={sortBy === "artist" ? "default" : "ghost"}
              size="sm"
              onClick={() => setSortBy("artist")}
              className={
                sortBy === "artist"
                  ? "bg-red-500 hover:bg-red-600"
                  : "text-red-300 hover:text-white hover:bg-red-500/20"
              }
            >
              Artist
            </Button>
            <Button
              variant={sortBy === "title" ? "default" : "ghost"}
              size="sm"
              onClick={() => setSortBy("title")}
              className={
                sortBy === "title"
                  ? "bg-red-500 hover:bg-red-600"
                  : "text-red-300 hover:text-white hover:bg-red-500/20"
              }
            >
              Title
            </Button>
          </div>
        </div>

        {/* Songs List Header */}
        <div className="hidden md:grid grid-cols-12 gap-4 px-4 py-3 border-b border-red-500/20 text-red-300 text-sm font-medium">
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
          {demoLikedSongs.map((song, index) => {
            const isCurrentlyPlayingSong = currentlyPlaying === song.id;

            return (
              <Card
                key={song.id}
                className="group bg-white/5 border-white/10 hover:bg-red-500/10 transition-all duration-300 cursor-pointer"
              >
                <CardContent className="p-4">
                  <div className="grid grid-cols-12 gap-4 items-center">
                    {/* Track Number / Play Button */}
                    <div className="col-span-1">
                      <div className="relative w-8 h-8 flex items-center justify-center">
                        <span
                          className={`text-red-300 group-hover:opacity-0 transition-opacity ${
                            isCurrentlyPlayingSong ? "opacity-0" : ""
                          }`}
                        >
                          {index + 1}
                        </span>
                        <PlayCircle
                          className={`absolute w-6 h-6 text-white transition-opacity ${
                            isCurrentlyPlayingSong ||
                            "opacity-0 group-hover:opacity-100"
                          }`}
                          onClick={() => handlePlaySong(song.id)}
                        />
                        {isCurrentlyPlayingSong && (
                          <div className="absolute inset-0 flex items-center justify-center">
                            <div className="w-1 h-1 bg-red-400 rounded-full animate-ping"></div>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Song Info */}
                    <div className="col-span-5 flex items-center space-x-4">
                      <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-gradient-to-br from-red-500 to-pink-500 flex-shrink-0">
                        <div className="absolute inset-0 flex items-center justify-center">
                          <Music className="w-6 h-6 text-white/70" />
                        </div>
                      </div>
                      <div className="min-w-0 flex-1">
                        <h3
                          className={`font-semibold truncate ${
                            isCurrentlyPlayingSong
                              ? "text-red-400"
                              : "text-white"
                          }`}
                        >
                          {song.title}
                        </h3>
                        <p className="text-red-300 text-sm truncate">
                          {song.artist}
                        </p>
                      </div>
                    </div>

                    {/* Album */}
                    <div className="col-span-3 hidden md:block">
                      <span className="text-red-300 text-sm truncate">
                        {song.album}
                      </span>
                    </div>

                    {/* Date Added */}
                    <div className="col-span-2 hidden md:block">
                      <span className="text-red-300 text-sm">
                        {song.likedAt}
                      </span>
                    </div>

                    {/* Duration & Heart */}
                    <div className="col-span-1 flex items-center justify-end space-x-3">
                      <Heart className="w-4 h-4 text-red-400 fill-current opacity-0 group-hover:opacity-100 transition-opacity" />
                      <span className="text-red-300 text-sm">
                        {formatTime(song.duration)}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Footer Stats */}
        <div className="mt-12 p-6 bg-white/5 rounded-2xl border border-white/10">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
            <div>
              <div className="text-3xl font-bold text-red-400 mb-2">
                {demoLikedSongs.length}
              </div>
              <div className="text-red-300">Total Songs</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-red-400 mb-2">
                {totalHours}h {totalMinutes}m
              </div>
              <div className="text-red-300">Total Duration</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-red-400 mb-2">
                {demoLikedSongs
                  .reduce(
                    (acc, song) =>
                      acc + parseFloat(song.plays.replace(/[KM]/g, "")),
                    0
                  )
                  .toFixed(1)}
                M
              </div>
              <div className="text-red-300">Total Plays</div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
