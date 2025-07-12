"use client";

import { useEffect, useState, useCallback } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import GuestNavbar from "@/components/common/guest-navbar";
import { Play, Clock, Eye, Music, Grid, List } from "lucide-react";
import Image from "next/image";

interface Artist {
  id: string;
  name: string;
  imageUrl?: string;
}

interface Song {
  id: string;
  title: string;
  artist: Artist;
  album?: string;
  genre: string;
  year?: number;
  duration: number;
  coverUrl?: string;
  audioUrl: string;
  playCount: number;
  isLiked: boolean;
}

interface Genre {
  name: string;
  count: number;
}

interface GenreData {
  genre?: string;
  songs?: Song[];
  genres?: Genre[];
  pagination?: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

export default function GuestGenrePage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [genreData, setGenreData] = useState<GenreData | null>(null);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [currentPage, setCurrentPage] = useState(1);

  const selectedGenre = searchParams.get("genre");

  const fetchGenreData = useCallback(async () => {
    try {
      let url = "/api/guest/genres";
      const params = new URLSearchParams();

      if (selectedGenre) {
        params.append("genre", selectedGenre);
        params.append("page", currentPage.toString());
        params.append("limit", "20");
      }

      if (params.toString()) {
        url += `?${params.toString()}`;
      }

      const response = await fetch(url);
      const data = await response.json();

      if (data.success) {
        setGenreData(data.data);
      }
    } catch (error) {
      console.error("Error fetching genre data:", error);
    } finally {
      setLoading(false);
    }
  }, [selectedGenre, currentPage]);

  useEffect(() => {
    fetchGenreData();
  }, [fetchGenreData]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const handleSongClick = (songId: string) => {
    router.push(`/guest/songs/${songId}`);
  };

  const handleArtistClick = (artistId: string) => {
    router.push(`/guest/artists/${artistId}`);
  };

  const handleGenreClick = (genreName: string) => {
    router.push(`/guest/genres?genre=${encodeURIComponent(genreName)}`);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!genreData) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-foreground mb-4">
            No data found
          </h1>
          <button
            onClick={() => router.push("/landing")}
            className="px-6 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <GuestNavbar currentPage="genres" />
      <div className="container mx-auto px-4 py-8">
        {/* Show all genres if no specific genre is selected */}
        {!selectedGenre && genreData.genres && (
          <div className="mb-8">
            <div className="bg-card backdrop-blur-sm rounded-xl p-6">
              <h1 className="text-3xl font-bold text-foreground mb-6">
                Music Genres
              </h1>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                {genreData.genres.map((genre) => (
                  <div
                    key={genre.name}
                    className="bg-muted/50 backdrop-blur-sm rounded-lg p-6 cursor-pointer hover:bg-muted transition-all duration-300 group"
                    onClick={() => handleGenreClick(genre.name)}
                  >
                    <div className="text-center">
                      <Music
                        className="mx-auto text-primary mb-3 group-hover:scale-110 transition-transform"
                        size={40}
                      />
                      <h3 className="text-foreground font-semibold text-lg mb-2 group-hover:text-primary transition-colors">
                        {genre.name}
                      </h3>
                      <p className="text-muted-foreground text-sm">
                        {genre.count} {genre.count === 1 ? "song" : "songs"}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Show songs for selected genre */}
        {selectedGenre && genreData.songs && (
          <div>
            {/* Genre Header */}
            <div className="bg-card backdrop-blur-sm rounded-xl p-6 mb-6">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                <div>
                  <h1 className="text-3xl font-bold text-foreground mb-2">
                    {selectedGenre} Music
                  </h1>
                  <p className="text-muted-foreground">
                    {genreData.pagination?.totalItems || 0} songs found
                  </p>
                </div>

                <div className="flex items-center space-x-4 mt-4 md:mt-0">
                  <button
                    onClick={() => router.push("/guest/genres")}
                    className="px-4 py-2 bg-muted text-foreground rounded-lg hover:bg-muted/80 transition-colors"
                  >
                    All Genres
                  </button>

                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => setViewMode("grid")}
                      className={`p-2 rounded-lg transition-colors ${
                        viewMode === "grid"
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted text-muted-foreground hover:bg-muted/80"
                      }`}
                    >
                      <Grid size={16} />
                    </button>
                    <button
                      onClick={() => setViewMode("list")}
                      className={`p-2 rounded-lg transition-colors ${
                        viewMode === "list"
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted text-muted-foreground hover:bg-muted/80"
                      }`}
                    >
                      <List size={16} />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Songs Display */}
            <div className="bg-card backdrop-blur-sm rounded-xl p-6">
              {genreData.songs.length === 0 ? (
                <div className="text-center py-12">
                  <Music
                    className="mx-auto text-muted-foreground mb-4"
                    size={48}
                  />
                  <p className="text-muted-foreground text-lg">
                    No songs found in this genre
                  </p>
                </div>
              ) : (
                <>
                  {viewMode === "grid" ? (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                      {genreData.songs.map((song) => (
                        <div
                          key={song.id}
                          className="bg-muted/30 rounded-lg p-4 cursor-pointer hover:bg-muted/50 transition-all duration-300 group"
                          onClick={() => handleSongClick(song.id)}
                        >
                          <div className="relative mb-4">
                            <Image
                              src={
                                song.coverUrl ||
                                "https://via.placeholder.com/200x200/6b46c1/ffffff?text=♪"
                              }
                              alt={song.title}
                              width={200}
                              height={200}
                              className="w-full aspect-square object-cover rounded-lg"
                            />
                            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center">
                              <Play className="text-white" size={24} />
                            </div>
                          </div>

                          <h3 className="text-foreground font-medium truncate mb-1 group-hover:text-primary transition-colors">
                            {song.title}
                          </h3>
                          <p
                            className="text-muted-foreground text-sm truncate cursor-pointer hover:text-primary transition-colors"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleArtistClick(song.artist.id);
                            }}
                          >
                            {song.artist.name}
                          </p>

                          <div className="flex items-center justify-between mt-3 text-xs text-muted-foreground">
                            <div className="flex items-center space-x-1">
                              <Eye size={12} />
                              <span>{song.playCount.toLocaleString()}</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <Clock size={12} />
                              <span>{formatTime(song.duration)}</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {genreData.songs.map((song, index) => (
                        <div
                          key={song.id}
                          className="flex items-center space-x-4 p-4 rounded-lg hover:bg-muted/50 cursor-pointer transition-colors group"
                          onClick={() => handleSongClick(song.id)}
                        >
                          {/* Track Number */}
                          <div className="w-8 text-center">
                            <span className="text-muted-foreground group-hover:hidden">
                              {index + 1}
                            </span>
                            <Play
                              className="hidden group-hover:block text-foreground mx-auto"
                              size={16}
                            />
                          </div>

                          {/* Song Cover */}
                          <Image
                            src={
                              song.coverUrl ||
                              "https://via.placeholder.com/50x50/6b46c1/ffffff?text=♪"
                            }
                            alt={song.title}
                            width={50}
                            height={50}
                            className="rounded-lg"
                          />

                          {/* Song Info */}
                          <div className="flex-1 min-w-0">
                            <p className="text-foreground font-medium truncate group-hover:text-primary transition-colors">
                              {song.title}
                            </p>
                            <p
                              className="text-muted-foreground text-sm truncate cursor-pointer hover:text-primary transition-colors"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleArtistClick(song.artist.id);
                              }}
                            >
                              {song.artist.name}
                            </p>
                          </div>

                          {/* Album/Year */}
                          <div className="hidden md:block text-muted-foreground text-sm">
                            {song.album || song.year || "-"}
                          </div>

                          {/* Play Count */}
                          <div className="hidden lg:flex items-center space-x-1 text-muted-foreground">
                            <Eye size={14} />
                            <span className="text-sm">
                              {song.playCount.toLocaleString()}
                            </span>
                          </div>

                          {/* Duration */}
                          <div className="text-muted-foreground text-sm">
                            {formatTime(song.duration)}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Pagination */}
                  {genreData.pagination &&
                    genreData.pagination.totalPages > 1 && (
                      <div className="flex items-center justify-center space-x-2 mt-8">
                        <button
                          onClick={() => handlePageChange(currentPage - 1)}
                          disabled={!genreData.pagination.hasPrev}
                          className="px-4 py-2 bg-muted text-foreground rounded-lg hover:bg-muted/80 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          Previous
                        </button>

                        <span className="text-muted-foreground">
                          Page {genreData.pagination.currentPage} of{" "}
                          {genreData.pagination.totalPages}
                        </span>

                        <button
                          onClick={() => handlePageChange(currentPage + 1)}
                          disabled={!genreData.pagination.hasNext}
                          className="px-4 py-2 bg-muted text-foreground rounded-lg hover:bg-muted/80 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          Next
                        </button>
                      </div>
                    )}
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
