"use client";

import React, { useState, useRef } from "react";
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
}: AudioPlayerProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const progressRef = useRef<HTMLDivElement>(null);
  const volumeRef = useRef<HTMLDivElement>(null);

  const handleProgressClick = (e: React.MouseEvent) => {
    if (progressRef.current && duration > 0) {
      const rect = progressRef.current.getBoundingClientRect();
      const clickX = e.clientX - rect.left;
      const percentage = clickX / rect.width;
      const newTime = percentage * duration;
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

  if (!currentSong) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-gray-900 border-t border-gray-800">
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
                {currentSong.artist}
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
              onClick={onPlayPause}
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
                className="text-white hover:bg-gray-800"
              >
                <SkipBack className="h-6 w-6" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={onPlayPause}
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
                className="text-white hover:bg-gray-800"
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
                {currentSong.artist}
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
                className="text-white hover:bg-gray-800"
              >
                <SkipBack className="h-5 w-5" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={onPlayPause}
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
                className="text-white hover:bg-gray-800"
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
    </div>
  );
}
