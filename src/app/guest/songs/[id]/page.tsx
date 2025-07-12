"use client";

import { useEffect, useState, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import GuestNavbar from "@/components/common/guest-navbar";
import {
  Play,
  Pause,
  Heart,
  Share2,
  SkipBack,
  SkipForward,
  LogIn,
  Clock,
  Eye,
} from "lucide-react";
import Image from "next/image";
import KaraokeSubtitleDisplay from "@/components/ui/karaoke-subtitle-display";

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

interface Subtitle {
  id: string;
  songId: string;
  language: string;
  text: string;
  startTime: number;
  endTime: number;
}

interface SongData {
  song: Song;
  relatedSongs: Song[];
}

export default function GuestSongPage() {
  const params = useParams();
  const router = useRouter();
  const [songData, setSongData] = useState<SongData | null>(null);
  const [subtitles, setSubtitles] = useState<Subtitle[]>([]);
  const [loading, setLoading] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [subtitleLanguage, setSubtitleLanguage] = useState("english");
  const [isSynced, setIsSynced] = useState(true);
  const [thought, setThought] = useState("");
  const [audio, setAudio] = useState<HTMLAudioElement | null>(null);

  const fetchSong = useCallback(async () => {
    try {
      // Fetch song data
      const response = await fetch(`/api/guest/songs/${params.id}`);
      const data = await response.json();

      if (data.success) {
        setSongData(data.data);

        // Fetch subtitles for this song
        const subtitleResponse = await fetch(
          `/api/subtitles?songId=${params.id}`
        );
        const subtitleData = await subtitleResponse.json();

        if (subtitleData.success) {
          setSubtitles(subtitleData.data);
        }
      }
    } catch (error) {
      console.error("Error fetching song:", error);
    } finally {
      setLoading(false);
    }
  }, [params.id]);

  useEffect(() => {
    fetchSong();
  }, [params.id, fetchSong]);

  useEffect(() => {
    if (songData?.song.audioUrl) {
      const audioElement = new Audio(songData.song.audioUrl);

      audioElement.addEventListener("loadedmetadata", () => {
        setDuration(audioElement.duration);
      });

      audioElement.addEventListener("timeupdate", () => {
        setCurrentTime(audioElement.currentTime);
      });

      audioElement.addEventListener("ended", () => {
        setIsPlaying(false);
        setCurrentTime(0);
      });

      setAudio(audioElement);

      return () => {
        audioElement.pause();
        audioElement.removeEventListener("loadedmetadata", () => {});
        audioElement.removeEventListener("timeupdate", () => {});
        audioElement.removeEventListener("ended", () => {});
      };
    }
  }, [songData?.song.audioUrl]);

  const togglePlay = () => {
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
    } else {
      audio.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!audio) return;
    const newTime = parseFloat(e.target.value);
    audio.currentTime = newTime;
    setCurrentTime(newTime);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const handleLoginRedirect = () => {
    router.push("/login");
  };

  const handleSongClick = (songId: string) => {
    router.push(`/guest/songs/${songId}`);
  };

  const handleArtistClick = (artistId: string) => {
    router.push(`/guest/artists/${artistId}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!songData) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-foreground mb-4">
            Song not found
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

  const { song, relatedSongs } = songData;

  return (
    <div className="min-h-screen bg-background">
      <GuestNavbar showBackButton={true} />
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Song Section */}
          <div className="lg:col-span-2">
            {/* Song Image and Controls */}
            <div className="bg-card border rounded-xl p-6 mb-6">
              <div className="relative mb-6">
                <Image
                  src={
                    song.coverUrl ||
                    "https://via.placeholder.com/400x400/6b46c1/ffffff?text=No+Cover"
                  }
                  alt={song.title}
                  width={600}
                  height={400} // this value doesn't matter much with Tailwind styling
                  className="w-full h-98 rounded-lg shadow-2xl object-cover"
                />

                {/* Audio Controls - Overlay on Image */}
                <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 bg-black/60 backdrop-blur-md rounded-lg p-3 w-4/5 max-w-md">
                  {/* Progress Bar */}
                  <div className="mb-2">
                    <input
                      type="range"
                      min="0"
                      max={duration || 0}
                      value={currentTime}
                      onChange={handleSeek}
                      className="w-full h-1.5 bg-white/20 rounded-lg appearance-none cursor-pointer slider"
                    />
                    <div className="flex justify-between text-xs text-white/80 mt-1">
                      <span>{formatTime(currentTime)}</span>
                      <span>{formatTime(duration)}</span>
                    </div>
                  </div>

                  {/* Control Buttons */}
                  <div className="flex items-center justify-center space-x-3">
                    <button className="p-1.5 text-white/80 hover:text-white transition-colors">
                      <SkipBack size={18} />
                    </button>
                    <button
                      onClick={togglePlay}
                      className="p-2.5 bg-white/20 backdrop-blur-sm text-white rounded-full hover:bg-white/30 transition-colors"
                    >
                      {isPlaying ? <Pause size={20} /> : <Play size={20} />}
                    </button>
                    <button className="p-1.5 text-white/80 hover:text-white transition-colors">
                      <SkipForward size={18} />
                    </button>
                  </div>
                </div>
              </div>

              {/* Artist Info and Share Thoughts */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Artist Info */}
                <div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">
                    Artist
                  </h3>
                  <div
                    className="flex items-center space-x-3 cursor-pointer group"
                    onClick={() => handleArtistClick(song.artist.id)}
                  >
                    <Image
                      src={
                        song.artist.avatar ||
                        "https://via.placeholder.com/60x60/06b6d4/ffffff?text=" +
                          encodeURIComponent(song.artist.name.charAt(0))
                      }
                      alt={song.artist.name}
                      width={60}
                      height={60}
                      className="rounded-full"
                    />
                    <div>
                      <p className="text-foreground font-medium group-hover:text-primary transition-colors">
                        {song.artist.name}
                      </p>
                      <p className="text-muted-foreground text-sm">Artist</p>
                    </div>
                  </div>
                </div>

                {/* Share Thoughts */}
                <div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">
                    Share Your Thoughts
                  </h3>
                  <div className="space-y-3">
                    <textarea
                      value={thought}
                      onChange={(e) => setThought(e.target.value)}
                      placeholder="What do you think about this song?"
                      className="w-full p-3 bg-muted/50 border border-border rounded-lg text-foreground placeholder-muted-foreground focus:outline-none focus:border-primary resize-none"
                      rows={3}
                    />
                    <button
                      onClick={handleLoginRedirect}
                      className="flex items-center space-x-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
                    >
                      <LogIn size={16} />
                      <span>Login to Share</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Song Details */}
            <div className="bg-card backdrop-blur-sm rounded-xl p-6">
              <h1 className="text-3xl font-bold text-foreground mb-2">
                {song.title}
              </h1>
              <p className="text-xl text-primary mb-4">{song.artist.name}</p>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                {song.album && (
                  <div>
                    <p className="text-muted-foreground">Album</p>
                    <p className="text-foreground">{song.album}</p>
                  </div>
                )}
                <div>
                  <p className="text-muted-foreground">Genre</p>
                  <p className="text-foreground">{song.genre}</p>
                </div>
                {song.year && (
                  <div>
                    <p className="text-muted-foreground">Year</p>
                    <p className="text-foreground">{song.year}</p>
                  </div>
                )}
                <div>
                  <p className="text-muted-foreground">Duration</p>
                  <p className="text-foreground">{formatTime(song.duration)}</p>
                </div>
              </div>

              <div className="flex items-center space-x-4 mt-6 pt-6 border-t border-border">
                <div className="flex items-center space-x-2 text-muted-foreground">
                  <Eye size={16} />
                  <span>{song.playCount.toLocaleString()} plays</span>
                </div>
                <button className="flex items-center space-x-2 text-muted-foreground hover:text-foreground transition-colors">
                  <Heart size={16} />
                  <span>Like</span>
                </button>
                <button className="flex items-center space-x-2 text-muted-foreground hover:text-foreground transition-colors">
                  <Share2 size={16} />
                  <span>Share</span>
                </button>
              </div>
            </div>
          </div>

          {/* Related Songs Sidebar */}
          <div className="lg:col-span-1">
            {/* Subtitles Section */}
            <div className="bg-card backdrop-blur-sm rounded-xl p-6 mb-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-foreground">
                  Subtitles
                </h3>
                <button
                  onClick={() => setIsSynced(!isSynced)}
                  className={`px-3 py-1 rounded-lg transition-colors text-sm flex items-center gap-2 ${
                    isSynced
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-muted-foreground hover:bg-muted/80"
                  }`}
                >
                  <div
                    className={`w-2 h-2 rounded-full ${
                      isSynced ? "bg-green-400" : "bg-gray-400"
                    }`}
                  />
                  {isSynced ? "Synced" : "Sync Off"}
                </button>
              </div>

              <div className="space-y-4">
                {/* Language Selection Tabs */}
                <div className="flex gap-1 p-1 bg-muted rounded-lg">
                  <button
                    onClick={() => setSubtitleLanguage("english")}
                    className={`flex-1 px-3 py-2 rounded-md transition-all duration-200 text-sm font-medium ${
                      subtitleLanguage === "english"
                        ? "bg-primary text-primary-foreground shadow-md transform scale-105 ring-2 ring-primary/20"
                        : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                    }`}
                  >
                    English
                  </button>
                  <button
                    onClick={() => setSubtitleLanguage("nepali")}
                    className={`flex-1 px-3 py-2 rounded-md transition-all duration-200 text-sm font-medium ${
                      subtitleLanguage === "nepali"
                        ? "bg-primary text-primary-foreground shadow-md transform scale-105 ring-2 ring-primary/20"
                        : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                    }`}
                  >
                    नेपाली
                  </button>
                </div>

                {/* Subtitle Display */}
                <div className="bg-muted/50 rounded-lg p-4 min-h-[120px]">
                  <KaraokeSubtitleDisplay
                    subtitles={subtitles
                      .filter((sub) => sub.language === subtitleLanguage)
                      .map((sub) => ({
                        time: sub.startTime,
                        text: sub.text,
                        endTime: sub.endTime,
                      }))
                      .sort((a, b) => a.time - b.time)}
                    currentTime={currentTime}
                    isPlaying={isPlaying}
                    isSynced={isSynced}
                    onSeek={(time) => {
                      if (audio && isSynced) {
                        audio.currentTime = time;
                        setCurrentTime(time);
                      }
                    }}
                  />
                </div>
              </div>
            </div>

            {/* Related Songs */}
            <div className="bg-card backdrop-blur-sm rounded-xl p-6">
              <h2 className="text-xl font-bold text-foreground mb-6">
                Related Songs
              </h2>
              <div className="space-y-4">
                {relatedSongs.map((relatedSong) => (
                  <div
                    key={relatedSong.id}
                    className="flex items-center space-x-3 p-3 rounded-lg hover:bg-muted/50 cursor-pointer transition-colors group"
                    onClick={() => handleSongClick(relatedSong.id)}
                  >
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
                    <div className="flex-1 min-w-0">
                      <p className="text-foreground font-medium truncate group-hover:text-primary transition-colors">
                        {relatedSong.title}
                      </p>
                      <p className="text-muted-foreground text-sm truncate">
                        {relatedSong.artist.name}
                      </p>
                      <div className="flex items-center space-x-2 text-xs text-muted-foreground mt-1">
                        <Eye size={12} />
                        <span>{relatedSong.playCount.toLocaleString()}</span>
                        <Clock size={12} />
                        <span>{formatTime(relatedSong.duration)}</span>
                      </div>
                    </div>
                  </div>
                ))}

                {relatedSongs.length === 0 && (
                  <p className="text-muted-foreground text-center py-8">
                    No related songs found
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
