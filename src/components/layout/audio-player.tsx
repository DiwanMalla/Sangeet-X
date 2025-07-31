"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import Image from "next/image";
import { cn, formatTime } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Volume2,
  VolumeX,
  Repeat,
  Shuffle,
  Heart,
  ChevronUp,
  ChevronDown,
} from "lucide-react";
import { Song } from "@/lib/types";

interface AudioPlayerProps {
  currentSong: Song | null;
  isPlaying: boolean;
  volume: number;
  currentTime: number;
  duration: number;
  onPlayPause: () => void;
  onNext: () => void;
  onPrevious: () => void;
  onSeek: (time: number) => void;
  onVolumeChange: (volume: number) => void;
  onToggleShuffle: () => void;
  onToggleRepeat: () => void;
  onToggleLike: () => void;
  isShuffling: boolean;
  isRepeating: "none" | "one" | "all";
  queue?: Song[];
  currentIndex?: number;
}

export default function AudioPlayer({
  currentSong,
  isPlaying,
  volume,
  currentTime,
  duration,
  onPlayPause,
  onNext,
  onPrevious,
  onSeek,
  onVolumeChange,
  onToggleShuffle,
  onToggleRepeat,
  onToggleLike,
  isShuffling,
  isRepeating,
  queue = [],
  currentIndex = 0,
}: AudioPlayerProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isAudioUnlocked, setIsAudioUnlocked] = useState(false);
  const [showMobilePlayPrompt, setShowMobilePlayPrompt] = useState(false);
  const progressRef = useRef<HTMLDivElement>(null);
  const volumeRef = useRef<HTMLDivElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);

  // Detect mobile device
  const isMobile =
    typeof window !== "undefined" &&
    /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
      navigator.userAgent
    );

  // Unlock audio context on first user interaction (mobile fix)
  const unlockAudioContext = useCallback(async () => {
    const audio = audioRef.current;
    if (!audio || isAudioUnlocked) return;

    try {
      // Create a silent audio play to unlock the audio context
      const silentAudio = new Audio(
        "data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBDuBzvLZiDYIF2m98OWhTgwNVKfo6KlUFApGnt/yvmwjBDqPz/LZhzUGG2i47+OeSwsNV6Tn6KlSFAlFnt/yv2skBDuGz/LYhzQIGGi49+OSUQoOVKXl8KtRGAhCnN/xv2wkBjaOzvLZhzUGG2i59uOeSwsOV6Tl8KxQFwlFnt/yv2wkBTuEz/LZhzUGG2i49+OeSwsNVqXl8KtQFQhFnt7yv2oj"
      );
      silentAudio.volume = 0;
      await silentAudio.play();
      setIsAudioUnlocked(true);

      // Pre-load the current song
      if (currentSong && audio) {
        audio.src = currentSong.audioUrl;
        audio.load();
      }
    } catch (error) {
      console.log("Audio unlock failed:", error);
    }
  }, [isAudioUnlocked, currentSong]);

  // Mobile play attempt handler
  const handleMobilePlay = async () => {
    if (!isMobile || isAudioUnlocked) {
      onPlayPause();
      return;
    }

    try {
      await unlockAudioContext();
      setShowMobilePlayPrompt(false);
      onPlayPause();
    } catch (error) {
      console.error("Failed to start playback:", error);
      setShowMobilePlayPrompt(true);
    }
  };

  // Audio event handlers
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleTimeUpdate = () => {
      onSeek(audio.currentTime);
    };

    const handleLoadedMetadata = () => {
      // Duration will be set by the parent component
    };

    const handleEnded = () => {
      onNext();
    };

    audio.addEventListener("timeupdate", handleTimeUpdate);
    audio.addEventListener("loadedmetadata", handleLoadedMetadata);
    audio.addEventListener("ended", handleEnded);

    return () => {
      audio.removeEventListener("timeupdate", handleTimeUpdate);
      audio.removeEventListener("loadedmetadata", handleLoadedMetadata);
      audio.removeEventListener("ended", handleEnded);
    };
  }, [onSeek, onNext]);

  // Global click handler to unlock audio on first interaction (mobile)
  useEffect(() => {
    if (!isMobile || isAudioUnlocked) return;

    const handleFirstInteraction = () => {
      unlockAudioContext();
      document.removeEventListener("click", handleFirstInteraction);
      document.removeEventListener("touchend", handleFirstInteraction);
    };

    document.addEventListener("click", handleFirstInteraction);
    document.addEventListener("touchend", handleFirstInteraction);

    return () => {
      document.removeEventListener("click", handleFirstInteraction);
      document.removeEventListener("touchend", handleFirstInteraction);
    };
  }, [isMobile, isAudioUnlocked, unlockAudioContext]);

  // Update audio source when song changes
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !currentSong) return;

    audio.src = currentSong.audioUrl;
    audio.load();

    // For mobile, preload but don't autoplay
    if (isMobile && !isAudioUnlocked) {
      audio.preload = "metadata";
    }
  }, [currentSong, isMobile, isAudioUnlocked]);

  // Handle play/pause with mobile considerations
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const attemptPlay = async () => {
      if (isPlaying) {
        // On mobile, show prompt if audio isn't unlocked yet
        if (isMobile && !isAudioUnlocked) {
          setShowMobilePlayPrompt(true);
          return;
        }

        try {
          await audio.play();
          setShowMobilePlayPrompt(false);
        } catch (error) {
          console.error("Playback failed:", error);
          if (isMobile) {
            setShowMobilePlayPrompt(true);
          }
        }
      } else {
        audio.pause();
        setShowMobilePlayPrompt(false);
      }
    };

    attemptPlay();
  }, [isPlaying, isMobile, isAudioUnlocked]);

  // Handle volume changes
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    audio.volume = volume;
  }, [volume]);

  // Handle seek changes
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    // Only seek if there's a significant difference to avoid loops
    if (Math.abs(audio.currentTime - currentTime) > 1) {
      audio.currentTime = currentTime;
    }
  }, [currentTime]);

  const handleProgressClick = (e: React.MouseEvent) => {
    if (progressRef.current && duration > 0) {
      const rect = progressRef.current.getBoundingClientRect();
      const clickX = e.clientX - rect.left;
      const percentage = clickX / rect.width;
      const newTime = percentage * duration;

      // Directly set the audio time
      const audio = audioRef.current;
      if (audio) {
        audio.currentTime = newTime;
      }
      onSeek(newTime);
    }
  };

  const handleVolumeClick = (e: React.MouseEvent) => {
    if (volumeRef.current) {
      const rect = volumeRef.current.getBoundingClientRect();
      const clickX = e.clientX - rect.left;
      const percentage = Math.max(0, Math.min(1, clickX / rect.width));
      onVolumeChange(percentage);
      setIsMuted(percentage === 0);
    }
  };

  const toggleMute = () => {
    if (isMuted) {
      onVolumeChange(0.5);
      setIsMuted(false);
    } else {
      onVolumeChange(0);
      setIsMuted(true);
    }
  };

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

  // Determine if next/previous should be disabled
  const canGoNext =
    queue.length > 1 &&
    (isRepeating !== "none" || currentIndex < queue.length - 1);
  const canGoPrevious = queue.length > 1;

  if (!currentSong) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-gray-900 border-t border-gray-800">
      {/* Hidden audio element */}
      <audio ref={audioRef} preload="metadata" crossOrigin="anonymous" />

      {/* Mobile Player */}
      <div className="lg:hidden">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center space-x-3 flex-1 min-w-0">
            <div className="relative w-12 h-12 rounded-md overflow-hidden">
              <Image
                src={currentSong.coverUrl}
                alt={currentSong.title}
                fill
                className="object-cover"
              />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-white truncate">
                {currentSong.title}
              </p>
              <p className="text-xs text-gray-400 truncate">
                {currentSong.artist?.name || "Unknown Artist"}
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={onToggleLike}
              className="text-gray-400 hover:text-white"
            >
              <Heart
                className={cn(
                  "h-5 w-5",
                  currentSong.isLiked && "fill-red-500 text-red-500"
                )}
              />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleMobilePlay}
              className="text-white hover:bg-gray-800"
            >
              {isPlaying ? (
                <Pause className="h-5 w-5" />
              ) : (
                <Play className="h-5 w-5" />
              )}
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsExpanded(!isExpanded)}
              className="text-gray-400 hover:text-white"
            >
              {isExpanded ? (
                <ChevronDown className="h-5 w-5" />
              ) : (
                <ChevronUp className="h-5 w-5" />
              )}
            </Button>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="px-4 pb-2">
          <div
            ref={progressRef}
            className="relative h-1 bg-gray-700 rounded-full cursor-pointer"
            onClick={handleProgressClick}
          >
            <div
              className="absolute top-0 left-0 h-full bg-purple-600 rounded-full"
              style={{ width: `${progress}%` }}
            />
          </div>
          <div className="flex justify-between text-xs text-gray-400 mt-1">
            <span>{formatTime(currentTime)}</span>
            <span>{formatTime(duration)}</span>
          </div>
        </div>

        {/* Expanded Mobile Player */}
        {isExpanded && (
          <div className="border-t border-gray-800 p-4">
            <div className="flex items-center justify-center space-x-6 mb-4">
              <Button
                variant="ghost"
                size="icon"
                onClick={onToggleShuffle}
                className={cn(
                  "text-gray-400 hover:text-white",
                  isShuffling && "text-purple-500"
                )}
              >
                <Shuffle className="h-5 w-5" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={onPrevious}
                disabled={!canGoPrevious}
                className="text-white hover:bg-gray-800 disabled:text-gray-600 disabled:hover:bg-transparent"
              >
                <SkipBack className="h-6 w-6" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={handleMobilePlay}
                className="text-white hover:bg-gray-800 p-3"
              >
                {isPlaying ? (
                  <Pause className="h-8 w-8" />
                ) : (
                  <Play className="h-8 w-8" />
                )}
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={onNext}
                disabled={!canGoNext}
                className="text-white hover:bg-gray-800 disabled:text-gray-600 disabled:hover:bg-transparent"
              >
                <SkipForward className="h-6 w-6" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={onToggleRepeat}
                className={cn(
                  "text-gray-400 hover:text-white",
                  isRepeating !== "none" && "text-purple-500"
                )}
              >
                <Repeat className="h-5 w-5" />
              </Button>
            </div>

            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleMute}
                className="text-gray-400 hover:text-white"
              >
                {isMuted || volume === 0 ? (
                  <VolumeX className="h-5 w-5" />
                ) : (
                  <Volume2 className="h-5 w-5" />
                )}
              </Button>
              <div className="flex-1">
                <div
                  ref={volumeRef}
                  className="relative h-1 bg-gray-700 rounded-full cursor-pointer"
                  onClick={handleVolumeClick}
                >
                  <div
                    className="absolute top-0 left-0 h-full bg-purple-600 rounded-full"
                    style={{ width: `${volume * 100}%` }}
                  />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Desktop Player */}
      <div className="hidden lg:block">
        <div className="flex items-center justify-between p-4">
          {/* Song Info */}
          <div className="flex items-center space-x-4 flex-1 min-w-0">
            <div className="relative w-14 h-14 rounded-md overflow-hidden">
              <Image
                src={currentSong.coverUrl}
                alt={currentSong.title}
                fill
                className="object-cover"
              />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-white truncate">
                {currentSong.title}
              </p>
              <p className="text-xs text-gray-400 truncate">
                {currentSong.artist?.name || "Unknown Artist"}
              </p>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={onToggleLike}
              className="text-gray-400 hover:text-white"
            >
              <Heart
                className={cn(
                  "h-5 w-5",
                  currentSong.isLiked && "fill-red-500 text-red-500"
                )}
              />
            </Button>
          </div>

          {/* Player Controls */}
          <div className="flex flex-col items-center space-y-2 flex-1 max-w-2xl">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="icon"
                onClick={onToggleShuffle}
                className={cn(
                  "text-gray-400 hover:text-white",
                  isShuffling && "text-purple-500"
                )}
              >
                <Shuffle className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={onPrevious}
                disabled={!canGoPrevious}
                className="text-white hover:bg-gray-800 disabled:text-gray-600 disabled:hover:bg-transparent"
              >
                <SkipBack className="h-5 w-5" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={handleMobilePlay}
                className="text-white hover:bg-gray-800 p-3"
              >
                {isPlaying ? (
                  <Pause className="h-6 w-6" />
                ) : (
                  <Play className="h-6 w-6" />
                )}
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={onNext}
                disabled={!canGoNext}
                className="text-white hover:bg-gray-800 disabled:text-gray-600 disabled:hover:bg-transparent"
              >
                <SkipForward className="h-5 w-5" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={onToggleRepeat}
                className={cn(
                  "text-gray-400 hover:text-white",
                  isRepeating !== "none" && "text-purple-500"
                )}
              >
                <Repeat className="h-4 w-4" />
              </Button>
            </div>

            <div className="flex items-center space-x-2 w-full">
              <span className="text-xs text-gray-400">
                {formatTime(currentTime)}
              </span>
              <div
                ref={progressRef}
                className="relative h-1 bg-gray-700 rounded-full cursor-pointer flex-1"
                onClick={handleProgressClick}
              >
                <div
                  className="absolute top-0 left-0 h-full bg-purple-600 rounded-full"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <span className="text-xs text-gray-400">
                {formatTime(duration)}
              </span>
            </div>
          </div>

          {/* Volume Control */}
          <div className="flex items-center space-x-2 flex-1 justify-end">
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleMute}
              className="text-gray-400 hover:text-white"
            >
              {isMuted || volume === 0 ? (
                <VolumeX className="h-4 w-4" />
              ) : (
                <Volume2 className="h-4 w-4" />
              )}
            </Button>
            <div className="w-24">
              <div
                ref={volumeRef}
                className="relative h-1 bg-gray-700 rounded-full cursor-pointer"
                onClick={handleVolumeClick}
              >
                <div
                  className="absolute top-0 left-0 h-full bg-purple-600 rounded-full"
                  style={{ width: `${volume * 100}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Play Prompt */}
      {showMobilePlayPrompt && isMobile && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[60] p-4">
          <div className="bg-gray-800 rounded-lg p-6 max-w-sm w-full text-center border border-gray-700">
            <div className="mb-4">
              <div className="w-16 h-16 bg-purple-600 rounded-full flex items-center justify-center mx-auto mb-3">
                <Play className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">
                Tap to Start Playing
              </h3>
              <p className="text-gray-400 text-sm">
                Mobile browsers require a tap to start audio playback
              </p>
            </div>
            <div className="flex gap-3">
              <Button
                onClick={() => setShowMobilePlayPrompt(false)}
                variant="outline"
                className="flex-1 border-gray-600 text-gray-300 hover:bg-gray-700"
              >
                Cancel
              </Button>
              <Button
                onClick={handleMobilePlay}
                className="flex-1 bg-purple-600 hover:bg-purple-700 text-white"
              >
                <Play className="h-4 w-4 mr-2" />
                Play
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
