"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  Search,
  Plus,
  Edit,
  Trash2,
  Play,
  Heart,
  Upload,
  Eye,
  Clock,
  Download,
} from "lucide-react";
import Link from "next/link";
import { Song } from "@/lib/types";
import { formatTime } from "@/lib/utils";

interface SongStats {
  totalSongs: number;
  totalPlays: number;
  totalLikes: number;
  totalSize: string;
}

export default function AdminSongsPage() {
  const [songs, setSongs] = useState<Song[]>([]);
  const [filteredSongs, setFilteredSongs] = useState<Song[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<
    "title" | "artist" | "plays" | "likes" | "createdAt"
  >("createdAt");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [selectedGenre, setSelectedGenre] = useState<string>("all");
  const [selectedSongs, setSelectedSongs] = useState<Set<string>>(new Set());
  const [stats, setStats] = useState<SongStats>({
    totalSongs: 0,
    totalPlays: 0,
    totalLikes: 0,
    totalSize: "0 MB",
  });

  const genres = [
    "all",
    "Pop",
    "Rock",
    "Hip-Hop",
    "Electronic",
    "Jazz",
    "Classical",
    "R&B",
    "Country",
  ];

  useEffect(() => {
    fetchSongs();
  }, []);

  useEffect(() => {
    filterAndSortSongs();
  }, [songs, searchQuery, sortBy, sortOrder, selectedGenre, filterAndSortSongs]);

  const fetchSongs = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/songs");
      if (response.ok) {
        const data = await response.json();
        const songs = data.data || data.songs || [];
        setSongs(songs);

        // Calculate stats
        const totalSongs = songs.length;
        const totalPlays = songs.reduce(
          (sum: number, song: Song) => sum + (song.playCount || 0),
          0
        );
        const totalLikes = songs.filter((song: Song) => song.isLiked).length;

        setStats({
          totalSongs,
          totalPlays,
          totalLikes,
          totalSize: `${Math.round(totalSongs * 4.5)} MB`, // Estimate
        });
      }
    } catch (error) {
      console.error("Error fetching songs:", error);
    } finally {
      setLoading(false);
    }
  };

  const filterAndSortSongs = React.useCallback(() => {
    let filtered = [...songs];

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(
        (song) =>
          song.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          song.artist.toLowerCase().includes(searchQuery.toLowerCase()) ||
          song.album?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Filter by genre
    if (selectedGenre !== "all") {
      filtered = filtered.filter((song) => song.genre === selectedGenre);
    }

    // Sort songs
    filtered.sort((a, b) => {
      let aValue: string | number, bValue: string | number;

      switch (sortBy) {
        case "title":
          aValue = a.title.toLowerCase();
          bValue = b.title.toLowerCase();
          break;
        case "artist":
          aValue = a.artist.toLowerCase();
          bValue = b.artist.toLowerCase();
          break;
        case "plays":
          aValue = a.playCount || 0;
          bValue = b.playCount || 0;
          break;
        case "likes":
          aValue = a.isLiked ? 1 : 0;
          bValue = b.isLiked ? 1 : 0;
          break;
        case "createdAt":
          aValue = new Date(a.createdAt || 0).getTime();
          bValue = new Date(b.createdAt || 0).getTime();
          break;
        default:
          return 0;
      }

      if (sortOrder === "asc") {
        return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
      } else {
        return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
      }
    });

    setFilteredSongs(filtered);
  }, [songs, searchQuery, sortBy, sortOrder, selectedGenre]);

  const handleDeleteSong = async (songId: string) => {
    if (confirm("Are you sure you want to delete this song?")) {
      try {
        const response = await fetch(`/api/songs/${songId}`, {
          method: "DELETE",
        });

        if (response.ok) {
          setSongs(songs.filter((song) => song.id !== songId));
          setSelectedSongs((prev) => {
            const newSet = new Set(prev);
            newSet.delete(songId);
            return newSet;
          });
        }
      } catch (error) {
        console.error("Error deleting song:", error);
      }
    }
  };

  const handleBulkDelete = async () => {
    if (selectedSongs.size === 0) return;

    if (
      confirm(`Are you sure you want to delete ${selectedSongs.size} songs?`)
    ) {
      try {
        const deletePromises = Array.from(selectedSongs).map((songId) =>
          fetch(`/api/songs/${songId}`, { method: "DELETE" })
        );

        await Promise.all(deletePromises);
        setSongs(songs.filter((song) => !selectedSongs.has(song.id)));
        setSelectedSongs(new Set());
      } catch (error) {
        console.error("Error deleting songs:", error);
      }
    }
  };

  const handleSelectAll = () => {
    if (selectedSongs.size === filteredSongs.length) {
      setSelectedSongs(new Set());
    } else {
      setSelectedSongs(new Set(filteredSongs.map((song) => song.id)));
    }
  };

  const handleSongSelect = (songId: string) => {
    const newSelected = new Set(selectedSongs);
    if (newSelected.has(songId)) {
      newSelected.delete(songId);
    } else {
      newSelected.add(songId);
    }
    setSelectedSongs(newSelected);
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/4" />
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <div
                key={i}
                className="h-24 bg-gray-200 dark:bg-gray-700 rounded-lg"
              />
            ))}
          </div>
          <div className="h-96 bg-gray-200 dark:bg-gray-700 rounded-lg" />
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
            Songs Management
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Manage your music library
          </p>
        </div>
        <Link href="/admin/upload">
          <Button className="bg-purple-600 hover:bg-purple-700">
            <Plus className="h-4 w-4 mr-2" />
            Add Song
          </Button>
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
                <Clock className="h-4 w-4 text-blue-600 dark:text-blue-300" />
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Total Songs
                </p>
                <p className="text-lg font-semibold">{stats.totalSongs}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <div className="p-2 bg-green-100 dark:bg-green-900 rounded-lg">
                <Play className="h-4 w-4 text-green-600 dark:text-green-300" />
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Total Plays
                </p>
                <p className="text-lg font-semibold">
                  {stats.totalPlays.toLocaleString()}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <div className="p-2 bg-red-100 dark:bg-red-900 rounded-lg">
                <Heart className="h-4 w-4 text-red-600 dark:text-red-300" />
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Total Likes
                </p>
                <p className="text-lg font-semibold">{stats.totalLikes}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <div className="p-2 bg-purple-100 dark:bg-purple-900 rounded-lg">
                <Download className="h-4 w-4 text-purple-600 dark:text-purple-300" />
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Storage Used
                </p>
                <p className="text-lg font-semibold">{stats.totalSize}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <div className="flex flex-col sm:flex-row gap-4 flex-1">
              <div className="relative flex-1 max-w-sm">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  type="text"
                  placeholder="Search songs, artists, albums..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>

              <select
                value={selectedGenre}
                onChange={(e) => setSelectedGenre(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md dark:border-gray-600 dark:bg-gray-700 dark:text-white"
              >
                {genres.map((genre) => (
                  <option key={genre} value={genre}>
                    {genre === "all" ? "All Genres" : genre}
                  </option>
                ))}
              </select>

              <select
                value={`${sortBy}-${sortOrder}`}
                onChange={(e) => {
                  const [newSortBy, newSortOrder] = e.target.value.split(
                    "-"
                  ) as [typeof sortBy, typeof sortOrder];
                  setSortBy(newSortBy);
                  setSortOrder(newSortOrder);
                }}
                className="px-3 py-2 border border-gray-300 rounded-md dark:border-gray-600 dark:bg-gray-700 dark:text-white"
              >
                <option value="createdAt-desc">Newest First</option>
                <option value="createdAt-asc">Oldest First</option>
                <option value="title-asc">Title A-Z</option>
                <option value="title-desc">Title Z-A</option>
                <option value="artist-asc">Artist A-Z</option>
                <option value="artist-desc">Artist Z-A</option>
                <option value="plays-desc">Most Played</option>
                <option value="plays-asc">Least Played</option>
              </select>
            </div>

            {selectedSongs.size > 0 && (
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  {selectedSongs.size} selected
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleBulkDelete}
                  className="text-red-600 hover:text-red-700 border-red-300 hover:border-red-400"
                >
                  <Trash2 className="h-4 w-4 mr-1" />
                  Delete
                </Button>
              </div>
            )}
          </div>
        </CardHeader>

        <CardContent>
          {/* Table Header */}
          <div className="flex items-center p-3 border-b border-gray-200 dark:border-gray-700 font-medium text-sm text-gray-600 dark:text-gray-400">
            <div className="w-8">
              <input
                type="checkbox"
                checked={
                  selectedSongs.size === filteredSongs.length &&
                  filteredSongs.length > 0
                }
                onChange={handleSelectAll}
                className="rounded"
              />
            </div>
            <div className="flex-1 min-w-0 px-4">Song</div>
            <div className="w-24 text-center">Plays</div>
            <div className="w-20 text-center">Likes</div>
            <div className="w-20 text-center">Duration</div>
            <div className="w-24 text-center">Date Added</div>
            <div className="w-16 text-center">Actions</div>
          </div>

          {/* Songs List */}
          <div className="space-y-2">
            {filteredSongs.map((song) => (
              <div
                key={song.id}
                className="flex items-center p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
              >
                <div className="w-8">
                  <input
                    type="checkbox"
                    checked={selectedSongs.has(song.id)}
                    onChange={() => handleSongSelect(song.id)}
                    className="rounded"
                  />
                </div>

                <div className="flex-1 min-w-0 px-4">
                  <div className="flex items-center space-x-3">
                    <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-gray-200 dark:bg-gray-700">
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
                      <p className="text-sm text-gray-600 dark:text-gray-400 truncate">
                        {song.artist}
                      </p>
                      {song.album && (
                        <p className="text-xs text-gray-500 dark:text-gray-500 truncate">
                          {song.album}
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                <div className="w-24 text-center text-sm text-gray-600 dark:text-gray-400">
                  {(song.playCount || 0).toLocaleString()}
                </div>

                <div className="w-20 text-center">
                  <Heart
                    className={`h-4 w-4 mx-auto ${
                      song.isLiked
                        ? "text-red-500 fill-red-500"
                        : "text-gray-400"
                    }`}
                  />
                </div>

                <div className="w-20 text-center text-sm text-gray-600 dark:text-gray-400">
                  {formatTime(song.duration)}
                </div>

                <div className="w-24 text-center text-sm text-gray-600 dark:text-gray-400">
                  {new Date(song.createdAt || 0).toLocaleDateString()}
                </div>

                <div className="w-16 text-center">
                  <div className="flex items-center justify-center space-x-1">
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-red-600 hover:text-red-700"
                      onClick={() => handleDeleteSong(song.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {filteredSongs.length === 0 && (
            <div className="text-center py-12">
              <div className="w-24 h-24 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="h-8 w-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                No songs found
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                {searchQuery || selectedGenre !== "all"
                  ? "Try adjusting your search or filters"
                  : "Get started by uploading your first song"}
              </p>
              <Link href="/admin/upload">
                <Button>
                  <Upload className="h-4 w-4 mr-2" />
                  Upload Song
                </Button>
              </Link>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
