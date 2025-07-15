"use client";

import { Clock, Eye, Music } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";

interface Artist {
  id: string;
  name: string;
  avatar?: string;
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

interface PlaylistComponentProps {
  currentSongId: string;
  onSongClick: (songId: string) => void;
  formatTime: (seconds: number) => string;
  autoPlay: boolean;
  onAutoAdvance?: (nextSongId: string) => void; // Callback for auto-advancing
}

export default function PlaylistComponent({
  currentSongId,
  onSongClick,
  formatTime,
  autoPlay,
  onAutoAdvance,
}: PlaylistComponentProps) {
  const [playlist, setPlaylist] = useState<Song[]>([]);
  const [currentSongIndex, setCurrentSongIndex] = useState(0);
  const [loading, setLoading] = useState(false);

  // Expose auto-advance function globally
  useEffect(() => {
    if (autoPlay && onAutoAdvance && playlist.length > 1) {
      const nextSong = () => {
        const nextIndex = (currentSongIndex + 1) % playlist.length;
        return playlist[nextIndex];
      };

      (
        window as Window & { playlistAutoAdvance?: () => void }
      ).playlistAutoAdvance = () => {
        const next = nextSong();
        if (next) {
          onAutoAdvance(next.id);
        }
      };
    }

    return () => {
      if (
        (window as Window & { playlistAutoAdvance?: () => void })
          .playlistAutoAdvance
      ) {
        delete (window as Window & { playlistAutoAdvance?: () => void })
          .playlistAutoAdvance;
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [playlist, currentSongIndex, autoPlay, onAutoAdvance]);

  useEffect(() => {
    if (!autoPlay || !currentSongId) {
      setPlaylist([]);
      return;
    }

    const fetchPlaylist = async () => {
      console.log("Fetching playlist for current song:", currentSongId);
      setLoading(true);
      try {
        // Use dedicated playlist API
        const response = await fetch(`/api/guest/playlist/${currentSongId}`);
        const data = await response.json();

        console.log("Playlist API Response:", data);

        if (data.success) {
          const { playlist: playlistData, currentSongIndex } = data.data;

          console.log("Playlist data received:", playlistData);
          setPlaylist(playlistData);
          setCurrentSongIndex(currentSongIndex);
          console.log("Current song index set to:", currentSongIndex);
        } else {
          console.error("Playlist API Error:", data.error);
        }
      } catch (error) {
        console.error("Error fetching playlist:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPlaylist();
  }, [currentSongId, autoPlay]);

  // Log playlist changes
  useEffect(() => {
    console.log("Playlist updated:", playlist);
  }, [playlist]);

  if (!autoPlay) {
    return null;
  }

  if (loading) {
    return (
      <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-6 shadow-2xl">
        <div className="flex items-center justify-center py-8">
          <div className="w-8 h-8 border-2 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      </div>
    );
  }

  if (playlist.length === 0) {
    return (
      <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-6 shadow-2xl">
        <div className="text-center py-8">
          <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <Music className="w-8 h-8 text-purple-200/50" />
          </div>
          <p className="text-white font-medium">No songs in playlist</p>
          <p className="text-purple-200/70 text-sm mt-1">
            Explore more music to find similar songs
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-6 shadow-2xl">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-white">Up Next</h2>
        <div className="text-sm text-purple-200/70">
          <div className="text-right">
            <div>
              {currentSongIndex + 1} of {playlist.length}
            </div>
            <div className="text-xs text-purple-200/50">
              All related songs loaded
            </div>
          </div>
        </div>
      </div>
      <div
        className={`space-y-3 ${
          playlist.length > 5 ? "max-h-96 overflow-y-auto custom-scrollbar" : ""
        }`}
      >
        {playlist.map((playlistSong, index) => {
          const isCurrentSong = index === currentSongIndex;
          const isNextSong = index === currentSongIndex + 1;

          return (
            <div
              key={playlistSong.id}
              className={`flex items-center space-x-3 p-3 rounded-lg hover:bg-white/10 cursor-pointer transition-all duration-300 group ${
                isCurrentSong
                  ? "bg-green-600/20 border border-green-500/30"
                  : isNextSong
                  ? "bg-purple-600/20 border border-purple-500/30"
                  : ""
              }`}
              onClick={() => onSongClick(playlistSong.id)}
            >
              <div className="relative">
                <Image
                  src={
                    playlistSong.coverUrl ||
                    "https://via.placeholder.com/50x50/6b46c1/ffffff?text=♪"
                  }
                  alt={playlistSong.title}
                  width={50}
                  height={50}
                  className="rounded-lg"
                />
                <div className="absolute -top-1 -right-1 w-5 h-5 bg-gray-700 rounded-full flex items-center justify-center border-2 border-gray-600">
                  <span className="text-white text-xs font-bold">
                    {index + 1}
                  </span>
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <p
                  className={`font-medium truncate group-hover:text-purple-300 transition-colors ${
                    isCurrentSong
                      ? "text-green-300"
                      : isNextSong
                      ? "text-purple-300"
                      : "text-white"
                  }`}
                >
                  {playlistSong.title}
                </p>
                <p className="text-purple-200/70 text-sm truncate">
                  {playlistSong.artist.name}
                </p>
                <div className="flex items-center space-x-2 text-xs text-purple-200/50 mt-1">
                  <Eye size={12} />
                  <span>{playlistSong.playCount.toLocaleString()}</span>
                  <Clock size={12} />
                  <span>{formatTime(playlistSong.duration)}</span>
                </div>
              </div>
              {isCurrentSong && (
                <div className="text-green-300 text-xs font-medium px-2 py-1 bg-green-600/20 rounded-full">
                  Playing
                </div>
              )}
              {isNextSong && (
                <div className="text-purple-300 text-xs font-medium px-2 py-1 bg-purple-600/20 rounded-full">
                  Next
                </div>
              )}
            </div>
          );
        })}

        {playlist.length === 0 && (
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Music className="w-8 h-8 text-purple-200/50" />
            </div>
            <p className="text-white font-medium">No songs in playlist</p>
            <p className="text-purple-200/70 text-sm mt-1">
              Explore more music to find similar songs
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
