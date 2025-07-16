"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import Navbar from "@/components/layout/navbar";
import {
  Search,
  Music,
  PlayCircle,
  Clock,
  Play,
  User,
  Loader2,
} from "lucide-react";
import Image from "next/image";
import { formatTime } from "@/lib/utils";

interface Song {
  id: string;
  title: string;
  album?: string;
  genre?: string;
  duration: number;
  coverUrl: string;
  playCount: number;
  artist: {
    id: string;
    name: string;
    avatar?: string;
  };
}

interface Artist {
  id: string;
  name: string;
  avatar?: string;
  bio?: string;
  verified: boolean;
  _count: {
    songs: number;
  };
}

interface Genre {
  id: string;
  name: string;
  description?: string;
  color: string;
  songCount: number;
}

interface SearchResults {
  songs: Song[];
  artists: Artist[];
}

export default function SearchPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get("q") || "";

  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState<SearchResults | null>(
    null
  );
  const [searchType, setSearchType] = useState<"all" | "songs" | "artists">(
    "all"
  );
  const [hasSearched, setHasSearched] = useState(false);
  const [genres, setGenres] = useState<Genre[]>([]);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [isLoadingGenres, setIsLoadingGenres] = useState(true);

  // Load genres and recent searches when component mounts
  useEffect(() => {
    // Load genres
    const fetchGenres = async () => {
      try {
        setIsLoadingGenres(true);
        const response = await fetch("/api/genres");
        const data = await response.json();

        if (data.success) {
          setGenres(data.data);
        }
      } catch (error) {
        console.error("Error loading genres:", error);
      } finally {
        setIsLoadingGenres(false);
      }
    };

    // Load recent searches
    const loadRecentSearches = () => {
      try {
        const saved = localStorage.getItem("recentSearches");
        if (saved) {
          setRecentSearches(JSON.parse(saved));
        }
      } catch (error) {
        console.error("Error loading recent searches:", error);
      }
    };

    fetchGenres();
    loadRecentSearches();
  }, []); // Empty dependency array - run only once on mount

  const saveRecentSearch = useCallback((query: string) => {
    try {
      setRecentSearches((prev) => {
        const current = prev.filter((s) => s !== query);
        const updated = [query, ...current].slice(0, 5);
        localStorage.setItem("recentSearches", JSON.stringify(updated));
        return updated;
      });
    } catch (error) {
      console.error("Error saving recent search:", error);
    }
  }, []);

  const performSearch = useCallback(
    async (query: string) => {
      if (!query.trim()) return;

      setIsSearching(true);
      setHasSearched(true);
      saveRecentSearch(query.trim());

      try {
        console.log("Searching for:", query);
        const response = await fetch(
          `/api/search?q=${encodeURIComponent(query)}`
        );

        console.log("Response status:", response.status);

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        console.log("Search response:", data);

        if (data.success) {
          setSearchResults(data.data);
        } else {
          console.error("Search failed:", data.error);
          setSearchResults({ songs: [], artists: [] });
        }
      } catch (error) {
        console.error("Search error:", error);
        setSearchResults({ songs: [], artists: [] });
        // Show user-friendly error message
        alert("Failed to search. Please check your connection and try again.");
      } finally {
        setIsSearching(false);
      }
    },
    [saveRecentSearch]
  );

  // Perform search when component mounts with query parameter
  useEffect(() => {
    if (initialQuery) {
      performSearch(initialQuery);
    }
  }, [initialQuery, performSearch]);

  const handleSearch = () => {
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      performSearch(searchQuery.trim());
    }
  };

  const handleSongClick = (songId: string) => {
    router.push(`/song/${songId}`);
  };

  const handleArtistClick = (artistId: string) => {
    router.push(`/guest/artists/${artistId}`);
  };

  const handleGenreClick = (genreName: string) => {
    setSearchQuery(genreName);
    router.push(`/search?q=${encodeURIComponent(genreName)}`);
    performSearch(genreName);
  };

  const handleRecentSearchClick = (search: string) => {
    setSearchQuery(search);
    router.push(`/search?q=${encodeURIComponent(search)}`);
    performSearch(search);
  };

  const filteredResults = searchResults
    ? {
        songs:
          searchType === "all" || searchType === "songs"
            ? searchResults.songs
            : [],
        artists:
          searchType === "all" || searchType === "artists"
            ? searchResults.artists
            : [],
      }
    : null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <Navbar />
      <main className="lg:ml-72 p-6">
        {/* Search Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-6">Search</h1>

          {/* Main Search Bar */}
          <div className="flex gap-2 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <Input
                type="text"
                placeholder="What do you want to listen to?"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                className="pl-10 bg-white/10 border-white/20 text-white placeholder-gray-300 h-12 text-lg"
              />
            </div>
            <Button
              onClick={handleSearch}
              disabled={!searchQuery.trim() || isSearching}
              className="h-12 px-6 bg-green-500 hover:bg-green-600 text-white"
            >
              {isSearching ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <Search className="h-5 w-5" />
              )}
            </Button>
          </div>

          {/* Search Type Filters */}
          {hasSearched && (
            <div className="flex gap-2 mb-6">
              {[
                { key: "all", label: "All" },
                { key: "songs", label: "Songs" },
                { key: "artists", label: "Artists" },
              ].map((type) => (
                <Button
                  key={type.key}
                  variant={searchType === type.key ? "default" : "outline"}
                  onClick={() =>
                    setSearchType(type.key as "all" | "songs" | "artists")
                  }
                  className={`${
                    searchType === type.key
                      ? "bg-white text-black"
                      : "bg-transparent border-white/20 text-white hover:bg-white/10"
                  }`}
                >
                  {type.label}
                </Button>
              ))}
            </div>
          )}
        </div>

        {/* Search Results */}
        {isSearching && (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-white" />
            <span className="ml-2 text-white">Searching...</span>
          </div>
        )}

        {hasSearched && !isSearching && filteredResults && (
          <div className="space-y-8">
            {/* Songs Results */}
            {filteredResults.songs.length > 0 && (
              <section>
                <div className="flex items-center gap-2 mb-4">
                  <Music className="h-6 w-6 text-green-500" />
                  <h2 className="text-2xl font-bold text-white">Songs</h2>
                </div>
                <div className="space-y-2">
                  {filteredResults.songs.map((song, index) => (
                    <div
                      key={song.id}
                      className="flex items-center gap-4 p-3 rounded-lg hover:bg-white/10 cursor-pointer group transition-colors"
                      onClick={() => handleSongClick(song.id)}
                    >
                      <div className="w-8 text-center">
                        <span className="text-gray-400 group-hover:hidden">
                          {index + 1}
                        </span>
                        <Play className="h-4 w-4 text-white hidden group-hover:block" />
                      </div>
                      <Image
                        src={song.coverUrl}
                        alt={song.title}
                        width={48}
                        height={48}
                        className="rounded-md"
                      />
                      <div className="flex-1 min-w-0">
                        <h3 className="text-white font-medium truncate group-hover:text-green-400 transition-colors">
                          {song.title}
                        </h3>
                        <p className="text-gray-400 text-sm truncate">
                          {song.artist.name} {song.album && `• ${song.album}`}
                        </p>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-gray-400 text-sm">
                          {song.playCount.toLocaleString()} plays
                        </div>
                        <div className="text-gray-400 text-sm">
                          {formatTime(song.duration)}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Artists Results */}
            {filteredResults.artists.length > 0 && (
              <section>
                <div className="flex items-center gap-2 mb-4">
                  <User className="h-6 w-6 text-green-500" />
                  <h2 className="text-2xl font-bold text-white">Artists</h2>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {filteredResults.artists.map((artist) => (
                    <Card
                      key={artist.id}
                      className="bg-white/10 border-white/20 hover:bg-white/20 cursor-pointer transition-colors group"
                      onClick={() => handleArtistClick(artist.id)}
                    >
                      <CardContent className="p-4 text-center">
                        <div className="relative mx-auto mb-3 w-24 h-24">
                          <Image
                            src={
                              artist.avatar ||
                              `https://via.placeholder.com/96x96/6366f1/ffffff?text=${artist.name.charAt(
                                0
                              )}`
                            }
                            alt={artist.name}
                            width={96}
                            height={96}
                            className="rounded-full w-full h-full object-cover"
                          />
                          {artist.verified && (
                            <div className="absolute -bottom-1 -right-1 bg-blue-500 rounded-full p-1">
                              <svg
                                className="w-3 h-3 text-white"
                                fill="currentColor"
                                viewBox="0 0 20 20"
                              >
                                <path
                                  fillRule="evenodd"
                                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                  clipRule="evenodd"
                                />
                              </svg>
                            </div>
                          )}
                        </div>
                        <h3 className="text-white font-semibold truncate group-hover:text-green-400 transition-colors">
                          {artist.name}
                        </h3>
                        <p className="text-gray-400 text-sm">
                          {artist._count.songs} songs
                        </p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </section>
            )}

            {/* No Results */}
            {filteredResults.songs.length === 0 &&
              filteredResults.artists.length === 0 && (
                <div className="text-center py-12">
                  <Search className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-white mb-2">
                    No results found for &quot;{searchQuery}&quot;
                  </h3>
                  <p className="text-gray-400">
                    Try adjusting your search or browse by category below
                  </p>
                </div>
              )}
          </div>
        )}

        {/* Browse Categories - Show when no search has been performed */}
        {!hasSearched && (
          <div className="space-y-8">
            {/* Browse All */}
            <section>
              <h2 className="text-2xl font-bold text-white mb-6">Browse All</h2>
              {isLoadingGenres ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="h-6 w-6 animate-spin text-white" />
                  <span className="ml-2 text-white">Loading genres...</span>
                </div>
              ) : genres.length > 0 ? (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {genres.map((genre) => (
                    <Card
                      key={genre.id}
                      className="border-0 hover:scale-105 cursor-pointer transition-transform overflow-hidden h-32 relative group"
                      style={{
                        background: `linear-gradient(135deg, ${genre.color}dd, ${genre.color}aa)`,
                      }}
                      onClick={() => handleGenreClick(genre.name)}
                    >
                      <CardContent className="p-4 h-full flex flex-col justify-between">
                        <h3 className="text-white font-bold text-lg">
                          {genre.name}
                        </h3>
                        <div className="text-white/80 text-sm">
                          {genre.songCount} songs
                        </div>
                        <PlayCircle className="absolute bottom-2 right-2 h-12 w-12 text-white/80 group-hover:text-white group-hover:scale-110 transition-all" />
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-400">No genres available</p>
                </div>
              )}
            </section>

            {/* Recent Searches */}
            {recentSearches.length > 0 && (
              <section>
                <h2 className="text-2xl font-bold text-white mb-6">
                  Recent Searches
                </h2>
                <div className="space-y-2">
                  {recentSearches.map((search, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-3 p-3 rounded-lg hover:bg-white/10 cursor-pointer group"
                      onClick={() => handleRecentSearchClick(search)}
                    >
                      <Clock className="h-5 w-5 text-gray-400" />
                      <span className="text-white group-hover:text-green-400 transition-colors">
                        {search}
                      </span>
                    </div>
                  ))}
                </div>
              </section>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
