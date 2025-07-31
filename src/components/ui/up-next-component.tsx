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

interface UpNextComponentProps {
  currentSongId?: string;
  onSongClick: (songId: string) => void;
  formatTime: (seconds: number) => string;
  autoPlay: boolean;
  onAutoAdvance?: (nextSongId: string) => void;
}

export default function UpNextComponent({
  currentSongId,
  onSongClick,
  formatTime,
  autoPlay,
  onAutoAdvance,
}: UpNextComponentProps) {
  const [songs, setSongs] = useState<Song[]>([]);
  const [loading, setLoading] = useState(false);
  const [currentSongIndex, setCurrentSongIndex] = useState(0);

  // Expose auto-advance function globally
  useEffect(() => {
    if (autoPlay && onAutoAdvance && songs.length > 1) {
      const nextSong = () => {
        const nextIndex = (currentSongIndex + 1) % songs.length;
        return songs[nextIndex];
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
  }, [songs, currentSongIndex, autoPlay, onAutoAdvance]);

  useEffect(() => {
    const fetchAllSongs = async () => {
      console.log("Fetching all songs for Up Next");
      setLoading(true);
      try {
        // Use the existing songs API to fetch all songs
        const response = await fetch("/api/songs");
        const data = await response.json();

        console.log("Up Next API Response:", data);

        if (data.success) {
          // Don't filter out the current song - include all songs
          const allSongs = data.data;

          // Reorganize songs with current song at top, next songs after, and previous songs at bottom
          if (currentSongId) {
            const currentIndex = allSongs.findIndex(
              (song: Song) => song.id === currentSongId
            );
            if (currentIndex >= 0) {
              // Create new order: current song first, then remaining songs in loop order
              const reorderedSongs = [
                allSongs[currentIndex], // Current song at top
                ...allSongs.slice(currentIndex + 1), // Songs after current
                ...allSongs.slice(0, currentIndex), // Songs before current (moved to bottom)
              ];

              console.log(
                "Up Next songs reordered with current song at top:",
                reorderedSongs.length
              );
              setSongs(reorderedSongs);
              setCurrentSongIndex(0); // Current song is always at index 0 now
            } else {
              setSongs(allSongs);
              setCurrentSongIndex(0);
            }
          } else {
            setSongs(allSongs);
            setCurrentSongIndex(0);
          }
        } else {
          console.error("Up Next API Error:", data.error);
        }
      } catch (error) {
        console.error("Error fetching songs for Up Next:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAllSongs();
  }, [currentSongId]);

  if (loading) {
    return (
      <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-6 shadow-2xl">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-white flex items-center gap-2">
            <Music className="w-5 h-5" />
            Up Next
          </h3>
        </div>
        <div className="flex items-center justify-center py-8">
          <div className="w-8 h-8 border-2 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      </div>
    );
  }

  if (songs.length === 0) {
    return (
      <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-6 shadow-2xl">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-white flex items-center gap-2">
            <Music className="w-5 h-5" />
            Up Next
          </h3>
        </div>
        <div className="text-center py-8">
          <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <Music className="w-8 h-8 text-purple-200/50" />
          </div>
          <p className="text-white font-medium">No songs available</p>
          <p className="text-purple-200/70 text-sm mt-1">
            Check back later for new music
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-6 shadow-2xl">
      {" "}
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-white flex items-center gap-2">
          <Music className="w-5 h-5" />
          Up Next
        </h3>
        <div className="text-sm text-purple-200/70">
          <div className="text-right">
            <div>
              {currentSongIndex + 1} of {songs.length}
            </div>
            <div className="text-xs text-purple-200/50">
              {autoPlay ? "Autoplay ON" : "Autoplay OFF"}
            </div>
          </div>
        </div>
      </div>
      <div className="space-y-3 max-h-96 overflow-y-auto scrollbar-thin scrollbar-thumb-white/20 scrollbar-track-transparent">
        {songs.map((song, index) => {
          const isCurrentSong = index === currentSongIndex; // Current song is always at index 0
          const isNextSong = index === currentSongIndex + 1; // Next song is at index 1

          return (
            <div
              key={song.id}
              className={`flex items-center space-x-3 p-3 rounded-lg hover:bg-white/10 cursor-pointer transition-all duration-300 group ${
                isCurrentSong
                  ? "bg-green-600/20 border border-green-500/30"
                  : isNextSong
                  ? "bg-purple-600/20 border border-purple-500/30"
                  : ""
              }`}
              onClick={() => onSongClick(song.id)}
            >
              <div className="relative">
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
                  {song.title}
                </p>
                <p className="text-purple-200/70 text-sm truncate">
                  {song.artist.name}
                </p>
                <div className="flex items-center space-x-2 text-xs text-purple-200/50 mt-1">
                  <Eye size={12} />
                  <span>{song.playCount.toLocaleString()}</span>
                  <Clock size={12} />
                  <span>{formatTime(song.duration)}</span>
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
      </div>
    </div>
  );
}
