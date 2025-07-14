"use client";

import React, { useState, useEffect, useRef } from "react";
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
  X,
  Save,
  Loader2,
  ImagePlus,
  ImageIcon,
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

interface EditSongData {
  title: string;
  artistId: string;
  album: string;
  genre: string;
  year: number | null;
  duration: number;
  coverUrl: string;
  audioUrl: string;
}

interface Artist {
  id: string;
  name: string;
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

  // Edit modal states
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingSong, setEditingSong] = useState<Song | null>(null);
  const [editFormData, setEditFormData] = useState<EditSongData>({
    title: "",
    artistId: "",
    album: "",
    genre: "",
    year: null,
    duration: 0,
    coverUrl: "",
    audioUrl: "",
  });
  const [artists, setArtists] = useState<Artist[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

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

  const fetchArtists = async () => {
    try {
      const response = await fetch("/api/artists");
      if (response.ok) {
        const data = await response.json();
        setArtists(data.data || []);
      }
    } catch (error) {
      console.error("Error fetching artists:", error);
    }
  };

  const filterAndSortSongs = React.useCallback(() => {
    let filtered = [...songs];

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(
        (song) =>
          song.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          song.artist?.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
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
          aValue = a.artist?.name.toLowerCase() || "";
          bValue = b.artist?.name.toLowerCase() || "";
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

  useEffect(() => {
    fetchSongs();
    fetchArtists();
  }, []);

  useEffect(() => {
    filterAndSortSongs();
  }, [filterAndSortSongs]);

  const handleEditSong = (song: Song) => {
    setEditingSong(song);
    setEditFormData({
      title: song.title,
      artistId: song.artist?.id || "",
      album: song.album || "",
      genre: song.genre || "",
      year: song.year || null,
      duration: song.duration,
      coverUrl: song.coverUrl,
      audioUrl: song.audioUrl,
    });
    setImagePreview(song.coverUrl);
    setImageFile(null);
    setIsEditModalOpen(true);
  };

  const handleCloseEditModal = () => {
    setIsEditModalOpen(false);
    setEditingSong(null);
    setEditFormData({
      title: "",
      artistId: "",
      album: "",
      genre: "",
      year: null,
      duration: 0,
      coverUrl: "",
      audioUrl: "",
    });
    setImagePreview(null);
    setImageFile(null);
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setImageFile(null);
    setImagePreview(null);
    setEditFormData((prev) => ({ ...prev, coverUrl: "" }));
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const uploadImageToCloudinary = async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append("file", file);

    const response = await fetch("/api/upload/image", {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Failed to upload image");
    }

    const data = await response.json();
    return data.data.url;
  };

  const handleSaveEdit = async () => {
    if (!editingSong) return;

    setIsSubmitting(true);
    try {
      let coverUrl = editFormData.coverUrl;

      // Upload new image if selected
      if (imageFile) {
        try {
          coverUrl = await uploadImageToCloudinary(imageFile);
        } catch (uploadError) {
          console.error("Image upload error:", uploadError);
          alert(
            `Failed to upload image: ${
              uploadError instanceof Error
                ? uploadError.message
                : "Unknown error"
            }`
          );
          setIsSubmitting(false);
          return;
        }
      }

      const updateData = {
        ...editFormData,
        coverUrl,
        year: editFormData.year || null,
      };

      const response = await fetch(`/api/songs/${editingSong.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updateData),
      });

      if (response.ok) {
        const updatedSong = await response.json();
        setSongs((prev) =>
          prev.map((song) =>
            song.id === editingSong.id ? updatedSong.data : song
          )
        );
        handleCloseEditModal();
        // Show success message
        alert("Song updated successfully!");
      } else {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to update song");
      }
    } catch (error) {
      console.error("Error updating song:", error);
      alert(
        `Failed to update song: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    } finally {
      setIsSubmitting(false);
    }
  };

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
                        {song.artist?.name}
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
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => handleEditSong(song)}
                    >
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

      {/* Edit Song Modal */}
      {isEditModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-900 rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                  Edit Song
                </h2>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleCloseEditModal}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X className="h-5 w-5" />
                </Button>
              </div>
            </div>

            <div className="p-6 space-y-6">
              {/* Cover Image Section */}
              <div className="space-y-4">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Cover Image
                </label>

                {/* Image Preview */}
                <div className="flex items-start space-x-4">
                  <div className="relative">
                    <div className="w-32 h-32 rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-800 border-2 border-dashed border-gray-300 dark:border-gray-600">
                      {imagePreview ? (
                        <Image
                          src={imagePreview}
                          alt="Cover preview"
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <ImageIcon className="h-8 w-8 text-gray-400" />
                        </div>
                      )}
                    </div>
                    {imagePreview && (
                      <Button
                        variant="ghost"
                        size="icon"
                        className="absolute -top-2 -right-2 h-6 w-6 rounded-full bg-red-500 hover:bg-red-600 text-white"
                        onClick={handleRemoveImage}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    )}
                  </div>

                  {/* Upload Options */}
                  <div className="flex-1 space-y-3">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => fileInputRef.current?.click()}
                      className="w-full"
                    >
                      <ImagePlus className="h-4 w-4 mr-2" />
                      {imagePreview ? "Change Image" : "Upload Image"}
                    </Button>

                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                    />

                    <div className="text-center text-sm text-gray-500 dark:text-gray-400">
                      or
                    </div>

                    <Input
                      value={editFormData.coverUrl}
                      onChange={(e) => {
                        setEditFormData((prev) => ({
                          ...prev,
                          coverUrl: e.target.value,
                        }));
                        setImagePreview(e.target.value);
                        setImageFile(null);
                      }}
                      placeholder="Enter image URL"
                      className="text-sm"
                    />

                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Upload a file or enter an image URL. Recommended:
                      300x300px, JPEG or PNG
                    </p>
                  </div>
                </div>
              </div>

              {/* Form Fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Song Title *
                  </label>
                  <Input
                    value={editFormData.title}
                    onChange={(e) =>
                      setEditFormData((prev) => ({
                        ...prev,
                        title: e.target.value,
                      }))
                    }
                    placeholder="Enter song title"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Artist *
                  </label>
                  <select
                    value={editFormData.artistId}
                    onChange={(e) =>
                      setEditFormData((prev) => ({
                        ...prev,
                        artistId: e.target.value,
                      }))
                    }
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                    required
                  >
                    <option value="">Select an artist</option>
                    {artists.map((artist) => (
                      <option key={artist.id} value={artist.id}>
                        {artist.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Album
                  </label>
                  <Input
                    value={editFormData.album}
                    onChange={(e) =>
                      setEditFormData((prev) => ({
                        ...prev,
                        album: e.target.value,
                      }))
                    }
                    placeholder="Enter album name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Genre
                  </label>
                  <select
                    value={editFormData.genre}
                    onChange={(e) =>
                      setEditFormData((prev) => ({
                        ...prev,
                        genre: e.target.value,
                      }))
                    }
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                  >
                    <option value="">Select genre</option>
                    {genres
                      .filter((g) => g !== "all")
                      .map((genre) => (
                        <option key={genre} value={genre}>
                          {genre}
                        </option>
                      ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Year
                  </label>
                  <Input
                    type="number"
                    value={editFormData.year || ""}
                    onChange={(e) =>
                      setEditFormData((prev) => ({
                        ...prev,
                        year: e.target.value ? parseInt(e.target.value) : null,
                      }))
                    }
                    placeholder="Enter release year"
                    min="1900"
                    max={new Date().getFullYear()}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Duration (seconds) *
                  </label>
                  <Input
                    type="number"
                    value={editFormData.duration}
                    onChange={(e) =>
                      setEditFormData((prev) => ({
                        ...prev,
                        duration: parseInt(e.target.value) || 0,
                      }))
                    }
                    placeholder="Enter duration in seconds"
                    min="1"
                    required
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Audio URL *
                  </label>
                  <Input
                    value={editFormData.audioUrl}
                    onChange={(e) =>
                      setEditFormData((prev) => ({
                        ...prev,
                        audioUrl: e.target.value,
                      }))
                    }
                    placeholder="Enter audio file URL"
                    required
                  />
                </div>
              </div>
            </div>

            <div className="p-6 border-t border-gray-200 dark:border-gray-700 flex justify-end space-x-3">
              <Button
                variant="outline"
                onClick={handleCloseEditModal}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button
                onClick={handleSaveEdit}
                disabled={
                  isSubmitting ||
                  !editFormData.title ||
                  !editFormData.artistId ||
                  !editFormData.audioUrl
                }
                className="min-w-[100px]"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    Save Changes
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
