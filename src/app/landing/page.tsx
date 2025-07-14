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
  Users,
  Play,
  Github,
  Linkedin,
  Globe,
  MapPin,
  Code,
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
  const [loading, setLoading] = useState({
    songs: true,
    artists: true,
    genres: true,
  });

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
      {/* Guest Navbar */}
      <GuestNavbar currentPage="home" />

      {/* Hero Section */}
      <section id="home" className="relative py-20 lg:py-32 overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl animate-pulse"></div>
          <div className="absolute top-0 right-1/4 w-96 h-96 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl animate-pulse delay-1000"></div>
          <div className="absolute bottom-0 left-1/2 w-96 h-96 bg-cyan-500 rounded-full mix-blend-multiply filter blur-xl animate-pulse delay-2000"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full mb-8 shadow-2xl">
            <Headphones className="w-10 h-10 text-white animate-bounce" />
          </div>

          <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-white via-purple-200 to-cyan-200 bg-clip-text text-transparent">
            Welcome to SangeetX
          </h1>

          <p className="text-xl md:text-2xl text-purple-200 mb-8 max-w-3xl mx-auto">
            Discover, stream, and enjoy your favorite Nepali music. Experience
            the best of traditional and modern Nepali songs in one place.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6">
            <Link href="/sign-up">
              <Button className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white text-lg px-8 py-4 rounded-xl shadow-lg hover:shadow-purple-500/25 transition-all duration-300">
                <Play className="w-5 h-5 mr-2" />
                Get Started Free
              </Button>
            </Link>

            <Link href="/login">
              <Button
                variant="outline"
                className="border-white/20 text-white hover:bg-white/10 text-lg px-8 py-4 rounded-xl"
              >
                <Users className="w-5 h-5 mr-2" />
                Sign In
              </Button>
            </Link>
          </div>

          {/* Features Preview */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-red-500 to-pink-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                <Heart className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">
                Like Your Favorites
              </h3>
              <p className="text-purple-300">
                Save and organize your favorite tracks
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                <Library className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">
                Personal Library
              </h3>
              <p className="text-purple-300">
                Create playlists and manage your collection
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                <Search className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">
                Discover Music
              </h3>
              <p className="text-purple-300">
                Find new artists and trending songs
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Genres Section */}
      <section id="features" className="py-16 bg-black/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-white mb-4">
              Explore Genres
            </h2>
            <p className="text-xl text-purple-300">
              Discover music across different genres
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {loading.genres ? (
              // Loading skeletons for genres
              Array.from({ length: 6 }).map((_, index) => (
                <Card
                  key={index}
                  className="bg-white/5 border-white/10 animate-pulse"
                >
                  <CardContent className="p-4 text-center">
                    <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-purple-500/50 to-violet-500/50 rounded-2xl flex items-center justify-center">
                      <Music className="w-8 h-8 text-white/50" />
                    </div>
                    <div className="h-5 bg-white/10 rounded mb-2"></div>
                    <div className="h-4 bg-white/5 rounded w-16 mx-auto"></div>
                  </CardContent>
                </Card>
              ))
            ) : availableGenres.length > 0 ? (
              availableGenres.map((genre) => (
                <Card
                  key={genre.name}
                  className="group cursor-pointer bg-white/5 border-white/10 hover:bg-white/10 transition-all duration-300 hover:scale-105"
                  onClick={() =>
                    router.push(
                      `/guest/genres?genre=${encodeURIComponent(genre.name)}`
                    )
                  }
                >
                  <CardContent className="p-4 text-center">
                    <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-purple-500 to-violet-500 rounded-2xl flex items-center justify-center shadow-lg group-hover:shadow-2xl transition-all duration-300">
                      <Music className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-white font-semibold mb-1">
                      {genre.name}
                    </h3>
                    <p className="text-purple-300 text-sm">
                      {genre.count} songs
                    </p>
                  </CardContent>
                </Card>
              ))
            ) : (
              <div className="col-span-full text-center py-12">
                <Music className="mx-auto text-slate-600 mb-4" size={48} />
                <p className="text-slate-400 text-lg">
                  No genres available yet
                </p>
                <p className="text-slate-500 text-sm">
                  Add some songs to see genres here
                </p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Discover Section */}
      <section id="discover" className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Popular Songs */}
            <div>
              <div className="flex items-center mb-8">
                <Star className="w-8 h-8 text-yellow-400 mr-3" />
                <h2 className="text-3xl font-bold text-white">Popular Songs</h2>
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
                          {/* Duration skeleton */}
                          <div className="w-10 h-4 bg-white/5 rounded"></div>
                          {/* Play count skeleton */}
                          <div className="w-8 h-4 bg-white/5 rounded hidden sm:block"></div>
                          {/* Play button skeleton */}
                          <div className="w-6 h-6 bg-white/5 rounded-full"></div>
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
                              <Play className="w-4 h-4 text-white" />
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

                          {/* Duration */}
                          <div className="text-purple-400 text-sm font-mono">
                            {Math.floor(song.duration / 60)}:
                            {(song.duration % 60).toString().padStart(2, "0")}
                          </div>

                          {/* Play Count */}
                          <div className="text-purple-400 text-sm hidden sm:block">
                            {song.playCount >= 1000
                              ? `${Math.floor(song.playCount / 1000)}K`
                              : song.playCount}
                          </div>

                          {/* Play Button */}
                          <PlayCircle className="w-6 h-6 text-purple-400 hover:text-white transition-colors opacity-70 group-hover:opacity-100" />
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
            <div>
              <div className="flex items-center mb-8">
                <Users className="w-8 h-8 text-cyan-400 mr-3" />
                <h2 className="text-3xl font-bold text-white">
                  Discover Artists
                </h2>
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
