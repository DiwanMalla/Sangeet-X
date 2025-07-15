"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import GuestNavbar from "@/components/common/guest-navbar";
import UpNextComponent from "@/components/ui/up-next-component";
import {
  Play,
  Pause,
  Heart,
  Share2,
  SkipBack,
  SkipForward,
  LogIn,
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
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [autoPlay, setAutoPlay] = useState(true);
  const currentAudioUrl = useRef<string | null>(null);

  // Load autoplay setting from localStorage on component mount
  useEffect(() => {
    const savedAutoPlay = localStorage.getItem("songAutoPlay");
    if (savedAutoPlay !== null) {
      setAutoPlay(savedAutoPlay === "true");
    }
  }, []);

  // Save autoplay setting to localStorage when it changes
  useEffect(() => {
    localStorage.setItem("songAutoPlay", autoPlay.toString());
  }, [autoPlay]);

  const fetchSong = useCallback(async () => {
    try {
      // Fetch song data - we only need the main song data here
      // Components will fetch their own related songs/playlist data
      const response = await fetch(
        `/api/guest/songs/${params.id}?autoplay=false`
      );
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
  }, [fetchSong]);

  // Simple navigation functions - components will handle playlist logic
  const playNextSong = useCallback(() => {
    // This will be handled by the playlist component
    console.log("Next song - handled by playlist component");
  }, []);

  const playPreviousSong = useCallback(() => {
    // This will be handled by the playlist component
    console.log("Previous song - handled by playlist component");
  }, []);

  // For now, disable navigation buttons since components handle their own navigation
  const canPlayNext = false;
  const canPlayPrevious = false;

  // Create audio element when song URL changes
  useEffect(() => {
    if (
      songData?.song.audioUrl &&
      currentAudioUrl.current !== songData.song.audioUrl
    ) {
      // Clean up previous audio
      if (audio) {
        audio.pause();
        audio.removeEventListener("loadedmetadata", () => {});
        audio.removeEventListener("timeupdate", () => {});
        audio.removeEventListener("canplaythrough", () => {});
      }

      // Create new audio element
      const audioElement = new Audio(songData.song.audioUrl);
      currentAudioUrl.current = songData.song.audioUrl;

      audioElement.addEventListener("loadedmetadata", () => {
        setDuration(audioElement.duration);
      });

      audioElement.addEventListener("timeupdate", () => {
        setCurrentTime(audioElement.currentTime);
      });

      // Auto-start playing when song loads (YouTube-like behavior)
      audioElement.addEventListener("canplaythrough", () => {
        audioElement
          .play()
          .then(() => {
            setIsPlaying(true);
          })
          .catch((error) => {
            console.log("Auto-play prevented by browser:", error);
          });
      });

      setAudio(audioElement);

      // Cleanup function
      return () => {
        audioElement.pause();
        audioElement.removeEventListener("loadedmetadata", () => {});
        audioElement.removeEventListener("timeupdate", () => {});
        audioElement.removeEventListener("canplaythrough", () => {});
      };
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [songData?.song.audioUrl]); // Intentionally excluding 'audio' to prevent infinite loop

  // Separate effect for handling song ended event
  useEffect(() => {
    if (audio) {
      const handleEnded = () => {
        setIsPlaying(false);
        setCurrentTime(0);

        // Auto-play next song if autoplay is enabled
        if (autoPlay) {
          // Check if Up Next component has exposed auto-advance function
          const autoAdvance = (
            window as Window & { playlistAutoAdvance?: () => void }
          ).playlistAutoAdvance;
          if (autoAdvance) {
            autoAdvance();
          }
        }
      };

      audio.addEventListener("ended", handleEnded);

      return () => {
        audio.removeEventListener("ended", handleEnded);
      };
    }
  }, [audio, autoPlay]);

  const handleAutoAdvance = useCallback(
    (nextSongId: string) => {
      setIsTransitioning(true);
      router.push(`/guest/songs/${nextSongId}`);
    },
    [router]
  );

  const togglePlay = () => {
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
    } else {
      audio
        .play()
        .then(() => {
          setIsPlaying(true);
        })
        .catch((error) => {
          console.log("Play failed:", error);
        });
    }
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

  const toggleAutoPlay = () => {
    setAutoPlay((prev) => !prev);
  };

  if (loading || isTransitioning) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white text-lg">
            {isTransitioning ? "Loading next song..." : "Loading..."}
          </p>
        </div>
      </div>
    );
  }

  if (!songData) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-8">
          <h1 className="text-2xl font-bold text-white mb-4">Song not found</h1>
          <button
            onClick={() => router.push("/landing")}
            className="px-6 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  const { song } = songData;

  return (
    <div className="min-h-screen bg-gray-900">
      <GuestNavbar showBackButton={true} />

      {/* Auto-play notification */}
      {canPlayNext && (
        <div className="fixed top-20 right-4 z-40 bg-primary/90 backdrop-blur-sm text-white px-4 py-2 rounded-lg shadow-lg border border-white/20">
          <div className="flex items-center space-x-2 text-sm">
            <div
              className={`w-2 h-2 rounded-full ${
                autoPlay ? "bg-green-400 animate-pulse" : "bg-gray-400"
              }`}
            ></div>
            <span>
              {autoPlay
                ? "Auto-play enabled • Next song ready"
                : "Auto-play disabled"}
            </span>
          </div>
        </div>
      )}

      {/* Auto-play Control */}
      <div className="fixed top-20 left-4 z-40">
        <button
          onClick={toggleAutoPlay}
          className={`flex items-center space-x-2 px-3 py-2 rounded-lg shadow-lg border transition-all duration-200 ${
            autoPlay
              ? "bg-green-600/90 border-green-500/50 text-white"
              : "bg-gray-600/90 border-gray-500/50 text-gray-200"
          } backdrop-blur-sm hover:scale-105`}
        >
          <div
            className={`w-2 h-2 rounded-full ${
              autoPlay ? "bg-green-300" : "bg-gray-400"
            }`}
          ></div>
          <span className="text-sm font-medium">
            {autoPlay ? "Auto-play ON" : "Auto-play OFF"}
          </span>
        </button>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Song Section */}
          <div className="lg:col-span-2">
            {/* Song Image and Controls */}
            <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-6 mb-6 shadow-2xl">
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
                <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 bg-black/70 backdrop-blur-md rounded-lg p-3 w-4/5 max-w-md border border-white/20">
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
                    <button
                      onClick={playPreviousSong}
                      disabled={!canPlayPrevious}
                      className={`p-1.5 transition-colors ${
                        canPlayPrevious
                          ? "text-white/80 hover:text-white"
                          : "text-white/30 cursor-not-allowed"
                      }`}
                    >
                      <SkipBack size={18} />
                    </button>
                    <button
                      onClick={togglePlay}
                      className="p-2.5 bg-white/20 backdrop-blur-sm text-white rounded-full hover:bg-white/30 transition-colors"
                    >
                      {isPlaying ? <Pause size={20} /> : <Play size={20} />}
                    </button>
                    <button
                      onClick={playNextSong}
                      disabled={!canPlayNext}
                      className={`p-1.5 transition-colors ${
                        canPlayNext
                          ? "text-white/80 hover:text-white"
                          : "text-white/30 cursor-not-allowed"
                      }`}
                    >
                      <SkipForward size={18} />
                    </button>
                  </div>
                </div>
              </div>

              {/* Artist Info */}
              <div className="grid grid-cols-1 gap-6">
                <div>
                  <h3 className="text-lg font-semibold text-white mb-2">
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
                      className="rounded-full border-2 border-white/20"
                    />
                    <div>
                      <p className="text-white font-medium group-hover:text-purple-300 transition-colors">
                        {song.artist.name}
                      </p>
                      <p className="text-purple-200/70 text-sm">Artist</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Song Details */}
            <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-6 shadow-2xl">
              <h1 className="text-3xl font-bold text-white mb-2">
                {song.title}
              </h1>
              <p className="text-xl text-purple-300 mb-4">{song.artist.name}</p>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                {song.album && (
                  <div>
                    <p className="text-purple-200/70">Album</p>
                    <p className="text-white">{song.album}</p>
                  </div>
                )}
                <div>
                  <p className="text-purple-200/70">Genre</p>
                  <p className="text-white">{song.genre}</p>
                </div>
                {song.year && (
                  <div>
                    <p className="text-purple-200/70">Year</p>
                    <p className="text-white">{song.year}</p>
                  </div>
                )}
                <div>
                  <p className="text-purple-200/70">Duration</p>
                  <p className="text-white">{formatTime(song.duration)}</p>
                </div>
              </div>

              <div className="flex items-center space-x-4 mt-6 pt-6 border-t border-white/20">
                <div className="flex items-center space-x-2 text-purple-200/70">
                  <Eye size={16} />
                  <span>{song.playCount.toLocaleString()} plays</span>
                </div>
                <button className="flex items-center space-x-2 text-purple-200/70 hover:text-white transition-colors">
                  <Heart size={16} />
                  <span>Like</span>
                </button>
                <button className="flex items-center space-x-2 text-purple-200/70 hover:text-white transition-colors">
                  <Share2 size={16} />
                  <span>Share</span>
                </button>
              </div>
            </div>

            {/* Share Your Thoughts */}
            <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-6 shadow-2xl">
              <h3 className="text-lg font-semibold text-white mb-4">
                Share Your Thoughts
              </h3>
              <div className="space-y-3">
                <textarea
                  value={thought}
                  onChange={(e) => setThought(e.target.value)}
                  placeholder="What do you think about this song?"
                  className="w-full p-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-purple-200/50 focus:outline-none focus:border-purple-400 resize-none backdrop-blur-sm"
                  rows={4}
                />
                <button
                  onClick={handleLoginRedirect}
                  className="flex items-center space-x-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors"
                >
                  <LogIn size={16} />
                  <span>Login to Share</span>
                </button>
              </div>
            </div>
          </div>

          {/* Related Songs Sidebar */}
          <div className="lg:col-span-1">
            {/* Subtitles Section */}
            <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-6 mb-6 shadow-2xl">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-white">Subtitles</h3>
                <button
                  onClick={() => setIsSynced(!isSynced)}
                  className={`px-3 py-1 rounded-lg transition-colors text-sm flex items-center gap-2 ${
                    isSynced
                      ? "bg-purple-600 text-white"
                      : "bg-white/20 text-purple-200 hover:bg-white/30"
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
                <div className="flex gap-1 p-1 bg-white/10 rounded-lg">
                  <button
                    onClick={() => setSubtitleLanguage("english")}
                    className={`flex-1 px-3 py-2 rounded-md transition-all duration-200 text-sm font-medium ${
                      subtitleLanguage === "english"
                        ? "bg-purple-600 text-white shadow-md transform scale-105 ring-2 ring-purple-500/20"
                        : "text-purple-200 hover:text-white hover:bg-white/10"
                    }`}
                  >
                    English
                  </button>
                  <button
                    onClick={() => setSubtitleLanguage("nepali")}
                    className={`flex-1 px-3 py-2 rounded-md transition-all duration-200 text-sm font-medium ${
                      subtitleLanguage === "nepali"
                        ? "bg-purple-600 text-white shadow-md transform scale-105 ring-2 ring-purple-500/20"
                        : "text-purple-200 hover:text-white hover:bg-white/10"
                    }`}
                  >
                    नेपाली
                  </button>
                </div>

                {/* Subtitle Display */}
                <div className="bg-white/5 border border-white/10 rounded-lg p-4 min-h-[120px]">
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

            {/* Up Next Component - Shows all available songs with autoplay */}
            <UpNextComponent
              currentSongId={params.id as string}
              onSongClick={handleSongClick}
              formatTime={formatTime}
              autoPlay={autoPlay}
              onAutoAdvance={handleAutoAdvance}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
