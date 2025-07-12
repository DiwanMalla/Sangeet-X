"use client";

import { useEffect, useState, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import GuestNavbar from "@/components/common/guest-navbar";
import { Play, Clock, Eye, Calendar, Music } from "lucide-react";
import Image from "next/image";

interface Song {
  id: string;
  title: string;
  album?: string;
  genre: string;
  year?: number;
  duration: number;
  coverUrl?: string;
  audioUrl: string;
  playCount: number;
  isLiked: boolean;
}

interface Artist {
  id: string;
  name: string;
  avatar?: string;
  bio?: string;
  songs: Song[];
  totalPlays: number;
  _count: {
    songs: number;
  };
}

interface ArtistData {
  artist: Artist;
}

export default function GuestArtistPage() {
  const params = useParams();
  const router = useRouter();
  const [artistData, setArtistData] = useState<ArtistData | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchArtist = useCallback(async () => {
    try {
      const response = await fetch(`/api/guest/artists/${params.id}`);
      const data = await response.json();

      if (data.success) {
        setArtistData(data.data);
      }
    } catch (error) {
      console.error("Error fetching artist:", error);
    } finally {
      setLoading(false);
    }
  }, [params.id]);

  useEffect(() => {
    fetchArtist();
  }, [fetchArtist]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const handleSongClick = (songId: string) => {
    router.push(`/guest/songs/${songId}`);
  };

  const getTotalDuration = () => {
    if (!artistData?.artist.songs) return 0;
    return artistData.artist.songs.reduce(
      (total, song) => total + song.duration,
      0
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!artistData) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-foreground mb-4">
            Artist not found
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

  const { artist } = artistData;

  return (
    <div className="min-h-screen bg-background">
      <GuestNavbar showBackButton={true} />
      <div className="container mx-auto px-4 py-8">
        {/* Artist Header */}
        <div className="bg-card backdrop-blur-sm rounded-xl p-6 mb-8">
          <div className="flex flex-col md:flex-row items-center md:items-start space-y-6 md:space-y-0 md:space-x-8">
            <Image
              src={
                artist.avatar ||
                "https://via.placeholder.com/200x200/06b6d4/ffffff?text=" +
                  encodeURIComponent(artist.name.charAt(0))
              }
              alt={artist.name}
              width={200}
              height={200}
              className="rounded-full shadow-2xl"
            />

            <div className="flex-1 text-center md:text-left">
              <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
                {artist.name}
              </h1>

              {artist.bio && (
                <p className="text-muted-foreground text-lg mb-6 leading-relaxed">
                  {artist.bio}
                </p>
              )}

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                <div className="bg-muted/50 rounded-lg p-4">
                  <div className="flex items-center justify-center mb-2">
                    <Music className="text-primary" size={20} />
                  </div>
                  <p className="text-2xl font-bold text-foreground">
                    {artist._count.songs}
                  </p>
                  <p className="text-muted-foreground text-sm">Songs</p>
                </div>

                <div className="bg-muted/50 rounded-lg p-4">
                  <div className="flex items-center justify-center mb-2">
                    <Eye className="text-primary" size={20} />
                  </div>
                  <p className="text-2xl font-bold text-foreground">
                    {artist.totalPlays.toLocaleString()}
                  </p>
                  <p className="text-muted-foreground text-sm">Total Plays</p>
                </div>

                <div className="bg-muted/50 rounded-lg p-4">
                  <div className="flex items-center justify-center mb-2">
                    <Clock className="text-primary" size={20} />
                  </div>
                  <p className="text-2xl font-bold text-foreground">
                    {formatTime(getTotalDuration())}
                  </p>
                  <p className="text-muted-foreground text-sm">
                    Total Duration
                  </p>
                </div>

                <div className="bg-muted/50 rounded-lg p-4">
                  <div className="flex items-center justify-center mb-2">
                    <Calendar className="text-primary" size={20} />
                  </div>
                  <p className="text-2xl font-bold text-foreground">
                    {artist.songs.length > 0
                      ? Math.min(...artist.songs.map((s) => s.year || 2024))
                      : "N/A"}
                  </p>
                  <p className="text-muted-foreground text-sm">Since</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Songs List */}
        <div className="bg-card backdrop-blur-sm rounded-xl p-6">
          <h2 className="text-2xl font-bold text-foreground mb-6">
            Songs by {artist.name}
          </h2>

          {artist.songs.length === 0 ? (
            <div className="text-center py-12">
              <Music className="mx-auto text-muted-foreground mb-4" size={48} />
              <p className="text-muted-foreground text-lg">
                No songs available
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {artist.songs.map((song, index) => (
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
                    <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                      {song.album && <span>{song.album}</span>}
                      {song.album && song.year && <span>•</span>}
                      {song.year && <span>{song.year}</span>}
                      {(song.album || song.year) && <span>•</span>}
                      <span>{song.genre}</span>
                    </div>
                  </div>

                  {/* Play Count */}
                  <div className="hidden md:flex items-center space-x-1 text-muted-foreground">
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
        </div>

        {/* Back Button */}
        <div className="mt-8 text-center">
          <button
            onClick={() => router.push("/landing")}
            className="px-6 py-3 bg-muted text-foreground rounded-lg hover:bg-muted/80 transition-colors"
          >
            Back to Home
          </button>
        </div>
      </div>
    </div>
  );
}
