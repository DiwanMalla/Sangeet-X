"use client";

import React, { useState, useEffect, createContext, useContext } from "react";
import AudioPlayer from "@/components/layout/audio-player";
import { Song } from "@/lib/types";

interface AudioContextType {
  // State
  currentSong: Song | null;
  isPlaying: boolean;
  volume: number;
  currentTime: number;
  duration: number;
  isShuffling: boolean;
  isRepeating: "none" | "one" | "all";
  queue: Song[];
  currentIndex: number;

  // Handlers
  onPlaySong: (song: Song) => void;
  onPlayPause: () => void;
  onNext: () => void;
  onPrevious: () => void;
  onSeek: (time: number) => void;
  onVolumeChange: (volume: number) => void;
  onToggleShuffle: () => void;
  onToggleRepeat: () => void;
  onToggleLike: () => void;
  setQueue: (songs: Song[]) => void;
}

const AudioContext = createContext<AudioContextType | null>(null);

export const useAudio = () => {
  const context = useContext(AudioContext);
  if (!context) {
    throw new Error("useAudio must be used within an AudioProvider");
  }
  return context;
};

interface AppLayoutProps {
  children: React.ReactNode;
}

export default function AppLayout({ children }: AppLayoutProps) {
  const [currentSong, setCurrentSong] = useState<Song | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.7);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isShuffling, setIsShuffling] = useState(false);
  const [isRepeating, setIsRepeating] = useState<"none" | "one" | "all">(
    "none"
  );
  const [queue, setQueue] = useState<Song[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  const handlePlaySong = (song: Song) => {
    setCurrentSong(song);
    setIsPlaying(true);
    setQueue(queue.length > 0 ? queue : [song]);
    setCurrentIndex(queue.findIndex((s) => s.id === song.id));
  };

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const handleNext = () => {
    if (queue.length > 0) {
      const nextIndex = (currentIndex + 1) % queue.length;
      setCurrentIndex(nextIndex);
      setCurrentSong(queue[nextIndex]);
    }
  };

  const handlePrevious = () => {
    if (queue.length > 0) {
      const prevIndex = (currentIndex - 1 + queue.length) % queue.length;
      setCurrentIndex(prevIndex);
      setCurrentSong(queue[prevIndex]);
    }
  };

  const handleSeek = (time: number) => {
    setCurrentTime(time);
  };

  const handleVolumeChange = (newVolume: number) => {
    setVolume(newVolume);
  };

  const handleToggleShuffle = () => {
    setIsShuffling(!isShuffling);
  };

  const handleToggleRepeat = () => {
    const modes: Array<"none" | "one" | "all"> = ["none", "one", "all"];
    const currentModeIndex = modes.indexOf(isRepeating);
    const nextMode = modes[(currentModeIndex + 1) % modes.length];
    setIsRepeating(nextMode);
  };

  const handleToggleLike = () => {
    if (currentSong) {
      setCurrentSong({
        ...currentSong,
        isLiked: !currentSong.isLiked,
      });
    }
  };

  // Set duration when song changes
  useEffect(() => {
    if (currentSong) {
      setDuration(currentSong.duration);
      setCurrentTime(0);
    }
  }, [currentSong]);

  const audioContextValue: AudioContextType = {
    currentSong,
    isPlaying,
    volume,
    currentTime,
    duration,
    isShuffling,
    isRepeating,
    queue,
    currentIndex,
    onPlaySong: handlePlaySong,
    onPlayPause: handlePlayPause,
    onNext: handleNext,
    onPrevious: handlePrevious,
    onSeek: handleSeek,
    onVolumeChange: handleVolumeChange,
    onToggleShuffle: handleToggleShuffle,
    onToggleRepeat: handleToggleRepeat,
    onToggleLike: handleToggleLike,
    setQueue,
  };

  return (
    <AudioContext.Provider value={audioContextValue}>
      {children}

      {/* Audio Player - shown on all pages */}
      <AudioPlayer
        currentSong={currentSong}
        isPlaying={isPlaying}
        volume={volume}
        currentTime={currentTime}
        duration={duration}
        onPlayPause={handlePlayPause}
        onNext={handleNext}
        onPrevious={handlePrevious}
        onSeek={handleSeek}
        onVolumeChange={handleVolumeChange}
        onToggleShuffle={handleToggleShuffle}
        onToggleRepeat={handleToggleRepeat}
        onToggleLike={handleToggleLike}
        isShuffling={isShuffling}
        isRepeating={isRepeating}
      />
    </AudioContext.Provider>
  );
}
