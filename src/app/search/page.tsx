"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Navbar from "@/components/layout/navbar";
import { Search, Music, PlayCircle, Clock } from "lucide-react";

// Demo data for search
const demoGenres = [
  { id: "pop", name: "Pop", color: "from-pink-500 to-rose-500", songs: 234 },
  { id: "rock", name: "Rock", color: "from-red-500 to-orange-500", songs: 156 },
  {
    id: "folk",
    name: "Folk",
    color: "from-green-500 to-emerald-500",
    songs: 89,
  },
  {
    id: "classical",
    name: "Classical",
    color: "from-purple-500 to-violet-500",
    songs: 67,
  },
  { id: "jazz", name: "Jazz", color: "from-blue-500 to-cyan-500", songs: 45 },
  {
    id: "electronic",
    name: "Electronic",
    color: "from-teal-500 to-cyan-500",
    songs: 78,
  },
];

const demoRecentSearches = [
  "Narayan Gopal",
  "Traditional folk songs",
  "1974 AD",
  "Nepali rock",
  "Classic hits",
];

export default function SearchPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState<
    Array<{
      type: string;
      id: string;
      title?: string;
      artist?: string;
      album?: string;
      duration?: number;
      name?: string;
      followers?: string;
      verified?: boolean;
    }>
  >([]);
  const [searchType, setSearchType] = useState<
    "all" | "songs" | "artists" | "albums"
  >("all");

  const handleSearch = () => {
    setIsSearching(true);
    // Simulate search delay and results
    setTimeout(() => {
      if (searchQuery.trim()) {
        // Mock search results based on query
        setSearchResults([
          {
            type: "song",
            id: "1",
            title: searchQuery.includes("folk")
              ? "Resham Firiri"
              : "Yo Mann Ta Mero",
            artist: "Traditional Artist",
            album: "Folk Collection",
            duration: 245,
          },
          {
            type: "artist",
            id: "2",
            name: "Narayan Gopal",
            followers: "234K",
            verified: true,
          },
        ]);
      }
      setIsSearching(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <Navbar />
      <main className="lg:ml-72 p-6">
        {/* Compact Search Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-6">Search</h1>

          {/* Main Search Bar */}
          <div className="relative max-w-2xl">
            <div className="flex items-center bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/20">
              <Search className="w-5 h-5 text-purple-300 mr-3 flex-shrink-0" />
              <input
                type="text"
                placeholder="What do you want to listen to?"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1 bg-transparent text-white placeholder-purple-300 outline-none"
                onKeyPress={(e) => e.key === "Enter" && handleSearch()}
              />
              {searchQuery && (
                <Button
                  onClick={handleSearch}
                  size="sm"
                  className="bg-white text-black hover:bg-gray-200 ml-3"
                  disabled={isSearching}
                >
                  {isSearching ? (
                    <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
                  ) : (
                    "Search"
                  )}
                </Button>
              )}
            </div>
          </div>

          {/* Search Type Filters */}
          {searchQuery && (
            <div className="flex items-center space-x-2 mt-4">
              {(["all", "songs", "artists", "albums"] as const).map((type) => (
                <Button
                  key={type}
                  variant={searchType === type ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setSearchType(type)}
                  className={
                    searchType === type
                      ? "bg-white text-black hover:bg-gray-200"
                      : "text-purple-300 hover:text-white hover:bg-white/10"
                  }
                >
                  {type.charAt(0).toUpperCase() + type.slice(1)}
                </Button>
              ))}
            </div>
          )}
        </div>

        {/* Search Results */}
        {searchQuery && searchResults.length > 0 && (
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-white mb-4">
              Search Results
            </h2>
            <div className="space-y-3">
              {searchResults.map((result) => (
                <Card
                  key={result.id}
                  className="bg-white/5 border-white/10 hover:bg-white/10 transition-all duration-300 cursor-pointer"
                >
                  <CardContent className="p-4">
                    {result.type === "song" ? (
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                          <Music className="w-6 h-6 text-white" />
                        </div>
                        <div className="flex-1">
                          <h3 className="text-white font-semibold">
                            {result.title}
                          </h3>
                          <p className="text-purple-300 text-sm">
                            {result.artist} • {result.album}
                          </p>
                        </div>
                        <PlayCircle className="w-6 h-6 text-purple-400 hover:text-white transition-colors" />
                      </div>
                    ) : (
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full flex items-center justify-center">
                          <Music className="w-6 h-6 text-white" />
                        </div>
                        <div className="flex-1">
                          <h3 className="text-white font-semibold flex items-center">
                            {result.name}
                            {result.verified && (
                              <div className="w-4 h-4 bg-blue-500 rounded-full ml-2 flex items-center justify-center">
                                <div className="w-2 h-2 bg-white rounded-full"></div>
                              </div>
                            )}
                          </h3>
                          <p className="text-purple-300 text-sm">
                            Artist • {result.followers} followers
                          </p>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          className="border-purple-400 text-purple-400 hover:bg-purple-400 hover:text-white"
                        >
                          Follow
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Browse Categories - Only show when no search */}
        {!searchQuery && (
          <>
            {/* Quick Access Categories */}
            <section className="mb-8">
              <h2 className="text-xl font-semibold text-white mb-4">
                Browse all
              </h2>

              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {demoGenres.map((genre) => (
                  <Card
                    key={genre.id}
                    className="group cursor-pointer bg-white/5 border-white/10 hover:bg-white/10 transition-all duration-300 overflow-hidden"
                  >
                    <CardContent className="p-0">
                      <div
                        className={`h-24 bg-gradient-to-r ${genre.color} relative`}
                      >
                        <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-all duration-300"></div>
                        <div className="absolute bottom-2 right-2">
                          <Music className="w-8 h-8 text-white/70" />
                        </div>
                      </div>
                      <div className="p-3">
                        <h3 className="text-white font-semibold text-sm">
                          {genre.name}
                        </h3>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </section>

            {/* Recent Searches */}
            <section className="mb-8">
              <h2 className="text-xl font-semibold text-white mb-4">
                Recent searches
              </h2>

              <div className="space-y-2">
                {demoRecentSearches.slice(0, 3).map((search, index) => (
                  <Card
                    key={index}
                    className="group bg-white/5 border-white/10 hover:bg-white/10 transition-all duration-300 cursor-pointer"
                  >
                    <CardContent className="p-3">
                      <div className="flex items-center space-x-3">
                        <Clock className="w-4 h-4 text-purple-400" />
                        <span className="text-white text-sm">{search}</span>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </section>
          </>
        )}

        {/* No Results State */}
        {searchQuery && !isSearching && searchResults.length === 0 && (
          <div className="text-center py-12">
            <Search className="w-16 h-16 text-purple-400 mx-auto mb-4 opacity-50" />
            <h3 className="text-xl font-semibold text-white mb-2">
              No results found
            </h3>
            <p className="text-purple-300">
              Try searching for something else or check your spelling.
            </p>
          </div>
        )}
      </main>
    </div>
  );
}
