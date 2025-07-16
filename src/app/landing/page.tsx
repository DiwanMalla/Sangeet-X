"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import GuestNavbar from "@/components/common/guest-navbar";
import {
  Music,
  PlayCircle,
  Heart,
  Search,
  Library,
  Headphones,
  Star,
  Code,
  Users,
  Play,
  Github,
  Linkedin,
  Globe,
  MapPin,
  Briefcase,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";

interface ApiGenre {
  name: string;
  count: number;
}

interface Song {
  id: string;
  title: string;
  artist: { name: string; id: string };
  playCount: number;
  duration: number;
  coverUrl: string;
  album?: string;
  year?: number;
}

interface Artist {
  id: string;
  name: string;
  avatar?: string;
  _count: { songs: number };
}

export default function LandingPage() {
  const router = useRouter();
  const [popularSongs, setPopularSongs] = useState<Song[]>([]);
  const [popularArtists, setPopularArtists] = useState<Artist[]>([]);
  const [availableGenres, setAvailableGenres] = useState<ApiGenre[]>([]);
  const [showCopyrightNotice, setShowCopyrightNotice] = useState(false);
  const [loading, setLoading] = useState({
    songs: true,
    artists: true,
    genres: true,
  });

  // Check if copyright notice was already shown
  useEffect(() => {
    const copyrightShown = localStorage.getItem("copyright_notice_shown");
    if (!copyrightShown) {
      setShowCopyrightNotice(true);
    }
  }, []);

  const handleCopyrightContinue = () => {
    localStorage.setItem("copyright_notice_shown", "true");
    setShowCopyrightNotice(false);
  };

  useEffect(() => {
    // Fetch all data in parallel
    const fetchData = async () => {
      try {
        const [songsRes, artistsRes, genresRes] = await Promise.all([
          fetch("/api/guest/songs?limit=5"),
          fetch("/api/guest/artists?limit=6"),
          fetch("/api/guest/genres"),
        ]);

        const [songsData, artistsData, genresData] = await Promise.all([
          songsRes.json(),
          artistsRes.json(),
          genresRes.json(),
        ]);

        if (songsData.success) {
          setPopularSongs(songsData.data.songs);
        }
        setLoading((prev) => ({ ...prev, songs: false }));

        if (artistsData.success) {
          setPopularArtists(artistsData.data.artists);
        }
        setLoading((prev) => ({ ...prev, artists: false }));

        if (genresData.success) {
          setAvailableGenres(genresData.data.genres.slice(0, 6));
        }
        setLoading((prev) => ({ ...prev, genres: false }));
      } catch (error) {
        console.error("Error fetching data:", error);
        setLoading({ songs: false, artists: false, genres: false });
      }
    };

    fetchData();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* SEO Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebSite",
            "name": "SangeetX",
            "description": "Modern music streaming platform for discovering, playing, and sharing music",
            "url": "https://sangeetx.online",
            "potentialAction": {
              "@type": "SearchAction",
              "target": "https://sangeetx.online/search?q={search_term_string}",
              "query-input": "required name=search_term_string"
            },
            "sameAs": [
              "https://twitter.com/sangeetx",
              "https://facebook.com/sangeetx",
              "https://instagram.com/sangeetx"
            ]
          })
        }}
      />
      
      {/* Music Service Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Service",
            "serviceType": "Music Streaming",
            "provider": {
              "@type": "Organization",
              "name": "SangeetX"
            },
            "name": "SangeetX Music Streaming",
            "description": "Stream unlimited music, discover new artists, and create personalized playlists",
            "offers": {
              "@type": "Offer",
              "price": "0",
              "priceCurrency": "USD",
              "availability": "https://schema.org/InStock"
            }
          })
        }}
      />
      
      {/* Copyright Notice Popup */}
      {showCopyrightNotice && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm"></div>

          {/* Popup Content */}
          <div className="relative max-w-md w-full bg-gradient-to-br from-purple-900/90 to-blue-900/90 backdrop-blur-xl rounded-2xl border border-white/20 shadow-2xl">
            {/* Glow Effect */}
            <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 rounded-2xl blur opacity-30"></div>

            <div className="relative p-8 text-center">
              {/* Icon */}
              <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                <Code className="w-8 h-8 text-white" />
              </div>

              {/* Title */}
              <h2 className="text-2xl font-bold text-white mb-4">
                Educational Purpose Only
              </h2>

              {/* Content */}
              <div className="space-y-3 text-gray-200 mb-6">
                <p className="text-sm leading-relaxed">
                  This project is created for{" "}
                  <strong>educational purposes only</strong>. SangeetX is a
                  demonstration of modern web development technologies.
                </p>
                <p className="text-xs text-gray-300">
                  All content, features, and functionality are designed to
                  showcase programming skills and should not be used for
                  commercial purposes.
                </p>
              </div>

              {/* Copyright Notice */}
              <div className="bg-white/5 border border-white/10 rounded-lg p-3 mb-6">
                <p className="text-xs text-gray-300">
                  © 2025 SangeetX - Educational Demo Project
                </p>
                <p className="text-xs text-gray-400 mt-1">
                  No copyright infringement intended
                </p>
              </div>

              {/* Continue Button */}
              <Button
                onClick={handleCopyrightContinue}
                className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold py-3 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg"
              >
                I Understand - Continue
              </Button>

              {/* Footer */}
              <p className="text-xs text-gray-400 mt-4">
                This notice will only appear once
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Guest Navbar */}
      <GuestNavbar currentPage="home" />

      {/* Hero Section */}
      <section
        id="home"
        className="relative py-12 sm:py-16 lg:py-20 xl:py-32 overflow-hidden"
      >
        {/* Background Effects */}
        <div className="absolute inset-0 opacity-20 sm:opacity-30">
          <div className="absolute top-0 left-1/4 w-48 h-48 sm:w-72 sm:h-72 lg:w-96 lg:h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl animate-pulse"></div>
          <div className="absolute top-0 right-1/4 w-48 h-48 sm:w-72 sm:h-72 lg:w-96 lg:h-96 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl animate-pulse delay-1000"></div>
          <div className="absolute bottom-0 left-1/2 w-48 h-48 sm:w-72 sm:h-72 lg:w-96 lg:h-96 bg-cyan-500 rounded-full mix-blend-multiply filter blur-xl animate-pulse delay-2000"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full mb-6 sm:mb-8 shadow-2xl">
            <Headphones className="w-8 h-8 sm:w-10 sm:h-10 text-white animate-bounce" />
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold mb-4 sm:mb-6 bg-gradient-to-r from-white via-purple-200 to-cyan-200 bg-clip-text text-transparent leading-tight">
            Welcome to SangeetX
          </h1>

          <p className="text-lg sm:text-xl md:text-2xl text-purple-200 mb-6 sm:mb-8 max-w-3xl mx-auto px-4">
            Discover, stream, and enjoy your favorite Nepali music. Experience
            the best of traditional and modern Nepali songs in one place.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-4 lg:space-x-6 px-4">
            <Link href="/sign-up" className="w-full sm:w-auto">
              <Button className="w-full sm:w-auto bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white text-base sm:text-lg px-6 sm:px-8 py-3 sm:py-4 rounded-xl shadow-lg hover:shadow-purple-500/25 transition-all duration-300">
                <Play className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                Get Started Free
              </Button>
            </Link>

            <Link href="/login" className="w-full sm:w-auto">
              <Button
                variant="outline"
                className="w-full sm:w-auto border-white/20 text-white hover:bg-white/10 text-base sm:text-lg px-6 sm:px-8 py-3 sm:py-4 rounded-xl"
              >
                <Users className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                Sign In
              </Button>
            </Link>
          </div>

          {/* Features Preview */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 mt-12 sm:mt-16 px-4">
            <div className="group text-center">
              <div className="relative mb-4 sm:mb-6">
                <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-red-500 to-pink-500 rounded-2xl sm:rounded-3xl flex items-center justify-center mx-auto shadow-2xl transform group-hover:scale-110 group-hover:rotate-3 transition-all duration-500">
                  <div className="absolute -inset-1 bg-gradient-to-br from-red-600 to-pink-600 rounded-2xl sm:rounded-3xl blur opacity-30 group-hover:opacity-50 transition duration-500"></div>
                  <Heart className="w-8 h-8 sm:w-10 sm:h-10 text-white relative z-10" />
                </div>
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-white mb-2 sm:mb-3">
                Like Your Favorites
              </h3>
              <p className="text-purple-300 text-base sm:text-lg leading-relaxed">
                Save and organize your favorite tracks with smart collections
              </p>
            </div>

            <div className="group text-center">
              <div className="relative mb-4 sm:mb-6">
                <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl sm:rounded-3xl flex items-center justify-center mx-auto shadow-2xl transform group-hover:scale-110 group-hover:rotate-3 transition-all duration-500">
                  <div className="absolute -inset-1 bg-gradient-to-br from-blue-600 to-cyan-600 rounded-2xl sm:rounded-3xl blur opacity-30 group-hover:opacity-50 transition duration-500"></div>
                  <Library className="w-8 h-8 sm:w-10 sm:h-10 text-white relative z-10" />
                </div>
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-white mb-2 sm:mb-3">
                Personal Library
              </h3>
              <p className="text-purple-300 text-base sm:text-lg leading-relaxed">
                Create playlists and manage your music collection
              </p>
            </div>

            <div className="group text-center sm:col-span-2 lg:col-span-1">
              <div className="relative mb-4 sm:mb-6">
                <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-green-500 to-emerald-500 rounded-2xl sm:rounded-3xl flex items-center justify-center mx-auto shadow-2xl transform group-hover:scale-110 group-hover:rotate-3 transition-all duration-500">
                  <div className="absolute -inset-1 bg-gradient-to-br from-green-600 to-emerald-600 rounded-2xl sm:rounded-3xl blur opacity-30 group-hover:opacity-50 transition duration-500"></div>
                  <Search className="w-8 h-8 sm:w-10 sm:h-10 text-white relative z-10" />
                </div>
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-white mb-2 sm:mb-3">
                Discover Music
              </h3>
              <p className="text-purple-300 text-base sm:text-lg leading-relaxed">
                Find new artists and trending songs effortlessly
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Genres Section */}
      <section
        id="features"
        className="py-24 bg-gradient-to-b from-black/30 to-black/50 backdrop-blur-sm"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-block bg-gradient-to-r from-purple-500/20 to-violet-500/20 backdrop-blur-sm border border-white/20 rounded-full px-6 py-2 mb-6">
              <span className="text-purple-200 font-medium">
                🎼 Music Categories
              </span>
            </div>
            <h2 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-white to-purple-200 bg-clip-text text-transparent">
              Explore Genres
            </h2>
            <p className="text-2xl text-purple-300 max-w-3xl mx-auto">
              Discover music across different genres and moods
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {loading.genres ? (
              // Enhanced Loading skeletons for genres
              Array.from({ length: 6 }).map((_, index) => (
                <Card
                  key={index}
                  className="bg-white/5 border-white/10 animate-pulse backdrop-blur-sm hover:bg-white/10 transition-all duration-500"
                >
                  <CardContent className="p-6 text-center">
                    <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-purple-500/50 to-violet-500/50 rounded-3xl flex items-center justify-center">
                      <Music className="w-10 h-10 text-white/50" />
                    </div>
                    <div className="h-6 bg-white/10 rounded-lg mb-3"></div>
                    <div className="h-4 bg-white/5 rounded-lg w-20 mx-auto"></div>
                  </CardContent>
                </Card>
              ))
            ) : availableGenres.length > 0 ? (
              availableGenres.map((genre) => (
                <Card
                  key={genre.name}
                  className="group cursor-pointer bg-white/5 border-white/10 hover:bg-white/10 transition-all duration-500 hover:scale-105 hover:-translate-y-2 backdrop-blur-sm"
                  onClick={() =>
                    router.push(
                      `/guest/genres?genre=${encodeURIComponent(genre.name)}`
                    )
                  }
                >
                  <CardContent className="p-6 text-center">
                    <div className="relative mb-6">
                      <div className="w-20 h-20 mx-auto bg-gradient-to-br from-purple-500 to-violet-500 rounded-3xl flex items-center justify-center shadow-2xl group-hover:shadow-purple-500/30 transition-all duration-500 transform group-hover:scale-110">
                        <div className="absolute -inset-1 bg-gradient-to-br from-purple-600 to-violet-600 rounded-3xl blur opacity-30 group-hover:opacity-50 transition duration-500"></div>
                        <Music className="w-10 h-10 text-white relative z-10" />
                      </div>
                    </div>
                    <h3 className="text-white font-bold text-lg mb-2 group-hover:text-purple-200 transition-colors">
                      {genre.name}
                    </h3>
                    <p className="text-purple-300 text-sm">
                      {genre.count} songs
                    </p>
                  </CardContent>
                </Card>
              ))
            ) : (
              <div className="col-span-full text-center py-16">
                <div className="w-24 h-24 bg-gradient-to-br from-slate-600 to-slate-700 rounded-3xl flex items-center justify-center mx-auto mb-6">
                  <Music className="text-slate-400" size={48} />
                </div>
                <p className="text-slate-400 text-2xl font-semibold mb-2">
                  No genres available yet
                </p>
                <p className="text-slate-500 text-lg">
                  Add some songs to see genres here
                </p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Discover Section */}
      <section id="discover" className="py-24 relative">
        {/* Section Background */}
        <div className="absolute inset-0 bg-gradient-to-r from-purple-900/20 to-pink-900/20 backdrop-blur-sm"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-16">
            <div className="inline-block bg-gradient-to-r from-yellow-500/20 to-orange-500/20 backdrop-blur-sm border border-white/20 rounded-full px-6 py-2 mb-6">
              <span className="text-yellow-200 font-medium">
                🔥 Trending Now
              </span>
            </div>
            <h2 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-white to-yellow-200 bg-clip-text text-transparent">
              Discover Music
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            {/* Popular Songs */}
            <div className="backdrop-blur-sm bg-white/5 rounded-3xl p-8 border border-white/10">
              <div className="flex items-center mb-8">
                <div className="w-12 h-12 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-2xl flex items-center justify-center mr-4">
                  <Star className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-3xl font-bold text-white">Popular Songs</h3>
              </div>

              <div className="space-y-4">
                {loading.songs ? (
                  // Loading skeletons for songs
                  Array.from({ length: 5 }).map((_, index) => (
                    <Card
                      key={index}
                      className="bg-white/5 border-white/10 animate-pulse"
                    >
                      <CardContent className="p-4">
                        <div className="flex items-center space-x-4">
                          {/* Rank skeleton */}
                          <div className="w-8 h-8 bg-white/10 rounded flex items-center justify-center">
                            <span className="text-white/50 text-sm">
                              #{index + 1}
                            </span>
                          </div>
                          {/* Thumbnail skeleton */}
                          <div className="w-12 h-12 bg-white/10 rounded-lg"></div>
                          {/* Song info skeleton */}
                          <div className="flex-1">
                            <div className="h-5 bg-white/10 rounded mb-2 w-32"></div>
                            <div className="h-4 bg-white/5 rounded w-24"></div>
                          </div>
                          {/* Duration skeleton - hidden on small screens */}
                          <div className="w-10 h-4 bg-white/5 rounded hidden md:block"></div>
                          {/* Play count skeleton - hidden on smaller screens */}
                          <div className="w-8 h-4 bg-white/5 rounded hidden lg:block"></div>
                          {/* Play button skeleton - hidden on small screens */}
                          <div className="w-6 h-6 bg-white/5 rounded-full hidden sm:block"></div>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                ) : popularSongs.length > 0 ? (
                  popularSongs.map((song, index) => (
                    <Card
                      key={song.id}
                      className="bg-white/5 border-white/10 hover:bg-white/10 transition-all duration-300 cursor-pointer group"
                      onClick={() => router.push(`/guest/songs/${song.id}`)}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-center space-x-4">
                          {/* Rank Number */}
                          <div className="w-8 h-8 text-purple-400 font-bold flex items-center justify-center text-sm">
                            #{index + 1}
                          </div>

                          {/* Song Thumbnail */}
                          <div className="relative">
                            <Image
                              src={
                                song.coverUrl ||
                                "https://via.placeholder.com/48x48/6b46c1/ffffff?text=♪"
                              }
                              alt={song.title}
                              width={48}
                              height={48}
                              className="w-12 h-12 object-cover rounded-lg"
                            />
                            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center">
                              <Play className="w-4 h-4 text-white hidden sm:block" />
                            </div>
                          </div>

                          {/* Song Info */}
                          <div className="flex-1 min-w-0">
                            <h3 className="text-white font-semibold truncate">
                              {song.title}
                            </h3>
                            <p className="text-purple-300 text-sm truncate">
                              {song.artist.name}
                              {song.album && (
                                <span className="text-purple-400">
                                  {" "}
                                  • {song.album}
                                </span>
                              )}
                            </p>
                          </div>

                          {/* Duration - hidden on small screens */}
                          <div className="text-purple-400 text-sm font-mono hidden md:block">
                            {Math.floor(song.duration / 60)}:
                            {(song.duration % 60).toString().padStart(2, "0")}
                          </div>

                          {/* Play Count - hidden on smaller screens */}
                          <div className="text-purple-400 text-sm hidden lg:block">
                            {song.playCount >= 1000
                              ? `${Math.floor(song.playCount / 1000)}K`
                              : song.playCount}
                          </div>

                          {/* Play Button - hidden on small screens */}
                          <PlayCircle className="w-6 h-6 text-purple-400 hover:text-white transition-colors opacity-70 group-hover:opacity-100 hidden sm:block" />
                        </div>
                      </CardContent>
                    </Card>
                  ))
                ) : (
                  <div className="text-center py-12">
                    <Star className="mx-auto text-slate-600 mb-4" size={48} />
                    <p className="text-slate-400 text-lg">
                      No popular songs yet
                    </p>
                    <p className="text-slate-500 text-sm">
                      Add and play songs to see popular tracks here
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Discover Artists */}
            <div className="backdrop-blur-sm bg-white/5 rounded-3xl p-8 border border-white/10">
              <div className="flex items-center mb-8">
                <div className="w-12 h-12 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-2xl flex items-center justify-center mr-4">
                  <Users className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-3xl font-bold text-white">
                  Discover Artists
                </h3>
              </div>

              <div className="space-y-4">
                {loading.artists ? (
                  // Loading skeletons for artists
                  Array.from({ length: 6 }).map((_, index) => (
                    <Card
                      key={index}
                      className="bg-white/5 border-white/10 animate-pulse"
                    >
                      <CardContent className="p-4">
                        <div className="flex items-center space-x-4">
                          <div className="w-12 h-12 bg-gradient-to-br from-cyan-500/50 to-blue-500/50 rounded-full flex items-center justify-center">
                            <Music className="w-6 h-6 text-white/50" />
                          </div>
                          <div className="flex-1">
                            <div className="h-5 bg-white/10 rounded mb-2 w-32"></div>
                            <div className="h-4 bg-white/5 rounded w-20"></div>
                          </div>
                          <div className="w-16 h-8 bg-white/5 rounded"></div>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                ) : popularArtists.length > 0 ? (
                  popularArtists.map((artist) => (
                    <Card
                      key={artist.id}
                      className="bg-white/5 border-white/10 hover:bg-white/10 transition-all duration-300 cursor-pointer"
                      onClick={() => router.push(`/guest/artists/${artist.id}`)}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-center space-x-4">
                          <div className="w-12 h-12 bg-gradient-to-br from-cyan-500 to-blue-500 rounded-full flex items-center justify-center overflow-hidden">
                            {artist.avatar ? (
                              <Image
                                src={artist.avatar}
                                alt={artist.name}
                                width={48}
                                height={48}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <Music className="w-6 h-6 text-white" />
                            )}
                          </div>
                          <div className="flex-1">
                            <h3 className="text-white font-semibold">
                              {artist.name}
                            </h3>
                            <p className="text-purple-300 text-sm">
                              {artist._count.songs} songs
                            </p>
                          </div>
                          <Button
                            variant="outline"
                            size="sm"
                            className="border-cyan-400 text-cyan-400 hover:bg-cyan-400 hover:text-white"
                            onClick={(e) => {
                              e.stopPropagation();
                              router.push("/login");
                            }}
                          >
                            Explore
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                ) : (
                  <div className="text-center py-12">
                    <Users className="mx-auto text-slate-600 mb-4" size={48} />
                    <p className="text-slate-400 text-lg">
                      No artists available yet
                    </p>
                    <p className="text-slate-500 text-sm">
                      Add artists to see them here
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-16 bg-black/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-white mb-4">
              About SangeetX
            </h2>
            <p className="text-xl text-purple-300 mb-8">
              Educational Project - Built with Modern Technology
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Project Info */}
            <div>
              <Card className="bg-white/5 border-white/10 p-8">
                <CardContent className="p-0">
                  <h3 className="text-2xl font-bold text-white mb-4">
                    About This Project
                  </h3>
                  <p className="text-purple-300 mb-6">
                    SangeetX is an educational music streaming platform
                    developed to showcase modern web development practices using
                    Next.js, React, and other cutting-edge technologies. This
                    project demonstrates full-stack development capabilities
                    including authentication, database management, and
                    responsive UI design.
                  </p>

                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="text-center p-4 bg-white/5 rounded-lg">
                      <Code className="w-8 h-8 text-purple-400 mx-auto mb-2" />
                      <p className="text-white font-semibold">Full Stack</p>
                      <p className="text-purple-300 text-sm">React & Node.js</p>
                    </div>
                    <div className="text-center p-4 bg-white/5 rounded-lg">
                      <Heart className="w-8 h-8 text-red-400 mx-auto mb-2" />
                      <p className="text-white font-semibold">Open Source</p>
                      <p className="text-purple-300 text-sm">MIT License</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Developer Info */}
            <div>
              <Card className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 border-purple-500/20 p-8">
                <CardContent className="p-0">
                  <div className="flex items-center mb-6">
                    <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mr-4">
                      <Briefcase className="w-8 h-8 text-white" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-white">
                        👨‍💻 Developer Info
                      </h3>
                      <p className="text-purple-300">Full Stack Developer</p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <h4 className="text-white font-semibold mb-2">
                        Diwan Malla
                      </h4>
                      <div className="flex items-center text-purple-300 mb-2">
                        <MapPin className="w-4 h-4 mr-2" />
                        Sydney, NSW, Australia
                      </div>
                      <p className="text-purple-300">
                        Full Stack Developer (React / Next.js Focused)
                      </p>
                      <p className="text-green-400 text-sm">
                        Open to internships, part-time, or full-time roles
                      </p>
                    </div>

                    <div>
                      <h5 className="text-white font-semibold mb-2">
                        🧰 Tech Stack:
                      </h5>
                      <div className="text-sm text-purple-300 space-y-1">
                        <p>
                          <strong>Frontend:</strong> React.js, Next.js, Tailwind
                          CSS, Shadcn UI
                        </p>
                        <p>
                          <strong>Backend:</strong> Node.js, Express, Prisma
                          ORM, REST APIs
                        </p>
                        <p>
                          <strong>Database:</strong> PostgreSQL, MongoDB,
                          Supabase
                        </p>
                        <p>
                          <strong>Auth & Payments:</strong> Clerk, Auth.js,
                          Stripe
                        </p>
                      </div>
                    </div>

                    <div className="flex space-x-4 pt-4">
                      <a
                        href="https://www.diwanmalla.com.au"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center space-x-2 text-purple-300 hover:text-white transition-colors"
                      >
                        <Globe className="w-4 h-4" />
                        <span>Portfolio</span>
                      </a>
                      <a
                        href="https://github.com/diwanmalla"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center space-x-2 text-purple-300 hover:text-white transition-colors"
                      >
                        <Github className="w-4 h-4" />
                        <span>GitHub</span>
                      </a>
                      <a
                        href="https://linkedin.com/in/diwanmalla"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center space-x-2 text-purple-300 hover:text-white transition-colors"
                      >
                        <Linkedin className="w-4 h-4" />
                        <span>LinkedIn</span>
                      </a>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Copyright Footer */}
      <footer className="py-12 border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="flex items-center justify-center mb-4">
              <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center mr-3">
                <Music className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-white">SangeetX</span>
            </div>

            <p className="text-purple-300 mb-4">
              Educational music streaming platform showcasing modern web
              development
            </p>

            <div className="border-t border-white/10 pt-4 mt-4">
              <p className="text-purple-400 text-sm">
                © 2025 SangeetX. Built for educational purposes by Diwan Malla.
                All rights reserved.
              </p>
              <p className="text-purple-500 text-xs mt-2">
                This is a portfolio project developed using Next.js, React, and
                modern web technologies.
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
