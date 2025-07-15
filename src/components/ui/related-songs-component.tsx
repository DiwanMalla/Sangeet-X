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

interface RelatedSongsComponentProps {
  currentSongId: string;
  onSongClick: (songId: string) => void;
  formatTime: (seconds: number) => string;
  autoPlay: boolean;
}

export default function RelatedSongsComponent({
  currentSongId,
  onSongClick,
  formatTime,
  autoPlay,
}: RelatedSongsComponentProps) {
  const [relatedSongs, setRelatedSongs] = useState<Song[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (autoPlay || !currentSongId) {
      setRelatedSongs([]);
      return;
    }

    const fetchRelatedSongs = async () => {
      setLoading(true);
      try {
        // Fetch related songs (limited to 5)
        const response = await fetch(
          `/api/guest/songs/${currentSongId}?autoplay=false`
        );
        const data = await response.json();

        if (data.success) {
          setRelatedSongs(data.data.relatedSongs);
        }
      } catch (error) {
        console.error("Error fetching related songs:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRelatedSongs();
  }, [currentSongId, autoPlay]);

  if (autoPlay) {
    return null; // Don't show this when autoplay is on
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

  // Always show exactly 5 songs or all available if less than 5
  const songsToShow = relatedSongs.slice(0, 5);

  return (
    <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-6 shadow-2xl">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-white">Related Songs</h2>
        <div className="text-sm text-purple-200/70">
          <div className="text-right">
            <div>{songsToShow.length} songs</div>
            <div className="text-xs text-purple-200/50">
              Top 5 recommendations
            </div>
          </div>
        </div>
      </div>
      <div className="space-y-3">
        {songsToShow.map((relatedSong, index) => (
          <div
            key={relatedSong.id}
            className={`flex items-center space-x-3 p-3 rounded-lg hover:bg-white/10 cursor-pointer transition-all duration-300 group ${
              index === 0 ? "bg-purple-600/20 border border-purple-500/30" : ""
            }`}
            onClick={() => onSongClick(relatedSong.id)}
          >
            <div className="relative">
              <Image
                src={
                  relatedSong.coverUrl ||
                  "https://via.placeholder.com/50x50/6b46c1/ffffff?text=♪"
                }
                alt={relatedSong.title}
                width={50}
                height={50}
                className="rounded-lg"
              />
              {index === 0 && (
                <div className="absolute -top-1 -right-1 w-5 h-5 bg-purple-600 rounded-full flex items-center justify-center">
                  <span className="text-white text-xs font-bold">1</span>
                </div>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p
                className={`font-medium truncate group-hover:text-purple-300 transition-colors ${
                  index === 0 ? "text-purple-300" : "text-white"
                }`}
              >
                {relatedSong.title}
              </p>
              <p className="text-purple-200/70 text-sm truncate">
                {relatedSong.artist.name}
              </p>
              <div className="flex items-center space-x-2 text-xs text-purple-200/50 mt-1">
                <Eye size={12} />
                <span>{relatedSong.playCount.toLocaleString()}</span>
                <Clock size={12} />
                <span>{formatTime(relatedSong.duration)}</span>
              </div>
            </div>
            {index === 0 && (
              <div className="text-purple-300 text-xs font-medium px-2 py-1 bg-purple-600/20 rounded-full">
                Recommended
              </div>
            )}
          </div>
        ))}

        {songsToShow.length === 0 && (
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Music className="w-8 h-8 text-purple-200/50" />
            </div>
            <p className="text-white font-medium">No related songs</p>
            <p className="text-purple-200/70 text-sm mt-1">
              Explore more music to find similar songs
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
