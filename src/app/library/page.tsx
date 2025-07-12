"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Navbar from "@/components/layout/navbar";
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
} from "lucide-react";

// Demo data for user's library
const demoPlaylists = [
  {
    id: "1",
    title: "My Favorites",
    description: "Your liked songs",
    songsCount: 47,
    duration: "3h 12m",
    coverColor: "from-red-500 to-pink-500",
    type: "liked",
  },
  {
    id: "2",
    title: "Nepali Classics",
    description: "Timeless Nepali songs",
    songsCount: 23,
    duration: "1h 45m",
    coverColor: "from-green-500 to-emerald-500",
    type: "playlist",
  },
  {
    id: "3",
    title: "Rock Vibes",
    description: "Heavy beats and guitar",
    songsCount: 15,
    duration: "58m",
    coverColor: "from-orange-500 to-red-500",
    type: "playlist",
  },
  {
    id: "4",
    title: "Study Focus",
    description: "Calm and peaceful",
    songsCount: 31,
    duration: "2h 15m",
    coverColor: "from-blue-500 to-cyan-500",
    type: "playlist",
  },
];

const demoRecentlyPlayed = [
  {
    id: "1",
    title: "Resham Firiri",
    artist: "Traditional",
    playedAt: "2 hours ago",
    duration: 245,
  },
  {
    id: "2",
    title: "Yo Mann Ta Mero",
    artist: "Narayan Gopal",
    playedAt: "Yesterday",
    duration: 312,
  },
  {
    id: "3",
    title: "Malai Nasodha",
    artist: "Arjun Pokharel",
    playedAt: "2 days ago",
    duration: 198,
  },
];

export default function LibraryPage() {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [filterType, setFilterType] = useState<
    "all" | "playlists" | "artists" | "albums"
  >("all");

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-violet-900 to-slate-900">
      <Navbar />
      <main className="lg:ml-72 p-6">
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
            <Card className="group bg-white/5 border-white/10 hover:bg-white/10 transition-all duration-300 cursor-pointer">
              <CardContent className="p-4">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-pink-500 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Heart className="w-6 h-6 text-white fill-current" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-white font-semibold">Liked Songs</h3>
                    <p className="text-violet-300 text-sm">47 songs</p>
                  </div>
                  <PlayCircle className="w-6 h-6 text-violet-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              </CardContent>
            </Card>

            {/* Downloaded Music */}
            <Card className="group bg-white/5 border-white/10 hover:bg-white/10 transition-all duration-300 cursor-pointer">
              <CardContent className="p-4">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-500 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Download className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-white font-semibold">Downloaded</h3>
                    <p className="text-violet-300 text-sm">12 songs</p>
                  </div>
                  <PlayCircle className="w-6 h-6 text-violet-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              </CardContent>
            </Card>

            {/* Recently Played */}
            <Card className="group bg-white/5 border-white/10 hover:bg-white/10 transition-all duration-300 cursor-pointer">
              <CardContent className="p-4">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-violet-500 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Clock className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-white font-semibold">
                      Recently Played
                    </h3>
                    <p className="text-violet-300 text-sm">
                      Last played 2h ago
                    </p>
                  </div>
                  <PlayCircle className="w-6 h-6 text-violet-400 opacity-0 group-hover:opacity-100 transition-opacity" />
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

          <div
            className={
              viewMode === "grid"
                ? "grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4"
                : "space-y-2"
            }
          >
            {demoPlaylists.map((playlist) => (
              <Card
                key={playlist.id}
                className="group bg-white/5 border-white/10 hover:bg-white/10 transition-all duration-300 cursor-pointer"
              >
                <CardContent className={viewMode === "grid" ? "p-4" : "p-3"}>
                  {viewMode === "grid" ? (
                    <div>
                      <div
                        className={`w-full aspect-square bg-gradient-to-br ${playlist.coverColor} rounded-lg mb-4 flex items-center justify-center relative`}
                      >
                        {playlist.type === "liked" ? (
                          <Heart className="w-12 h-12 text-white fill-current" />
                        ) : (
                          <List className="w-12 h-12 text-white" />
                        )}
                        <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 rounded-lg transition-opacity flex items-center justify-center">
                          <PlayCircle className="w-12 h-12 text-white" />
                        </div>
                      </div>
                      <h3 className="text-white font-semibold mb-1 truncate">
                        {playlist.title}
                      </h3>
                      <p className="text-violet-300 text-sm mb-1 truncate">
                        {playlist.description}
                      </p>
                      <p className="text-violet-400 text-xs">
                        {playlist.songsCount} songs • {playlist.duration}
                      </p>
                    </div>
                  ) : (
                    <div className="flex items-center space-x-4">
                      <div
                        className={`w-12 h-12 bg-gradient-to-br ${playlist.coverColor} rounded-lg flex items-center justify-center flex-shrink-0`}
                      >
                        {playlist.type === "liked" ? (
                          <Heart className="w-6 h-6 text-white fill-current" />
                        ) : (
                          <List className="w-6 h-6 text-white" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-white font-semibold truncate">
                          {playlist.title}
                        </h3>
                        <p className="text-violet-300 text-sm truncate">
                          {playlist.description} • {playlist.songsCount} songs
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
              className="text-violet-300 hover:text-white"
            >
              Clear all
            </Button>
          </div>

          <div className="space-y-2">
            {demoRecentlyPlayed.map((song) => (
              <Card
                key={song.id}
                className="group bg-white/5 border-white/10 hover:bg-white/10 transition-all duration-300 cursor-pointer"
              >
                <CardContent className="p-3">
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 bg-gradient-to-br from-violet-500 to-purple-500 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Music2 className="w-5 h-5 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-white font-medium truncate">
                        {song.title}
                      </h3>
                      <p className="text-violet-300 text-sm truncate">
                        {song.artist} • {song.playedAt}
                      </p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-violet-400 text-sm">
                        {Math.floor(song.duration / 60)}:
                        {(song.duration % 60).toString().padStart(2, "0")}
                      </span>
                      <PlayCircle className="w-5 h-5 text-violet-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
