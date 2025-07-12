"use client";

import React, { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

interface Subtitle {
  time: number;
  text: string;
  endTime: number;
}

interface KaraokeSubtitleDisplayProps {
  subtitles: Subtitle[];
  currentTime: number;
  isPlaying: boolean;
  isSynced: boolean;
  onSeek: (time: number) => void;
}

export default function KaraokeSubtitleDisplay({
  subtitles,
  currentTime,
  isPlaying,
  isSynced,
  onSeek,
}: KaraokeSubtitleDisplayProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [visibleRange, setVisibleRange] = useState({ start: 0, end: 10 });
  const [isUserScrolling, setIsUserScrolling] = useState(false);

  const getCurrentSubtitleIndex = () => {
    return subtitles.findIndex(
      (subtitle) =>
        currentTime >= subtitle.time && currentTime <= subtitle.endTime
    );
  };

  const getUpcomingSubtitleIndex = () => {
    return subtitles.findIndex((subtitle) => currentTime < subtitle.time);
  };

  const currentIndex = getCurrentSubtitleIndex();
  const upcomingIndex = getUpcomingSubtitleIndex();

  // Initialize with first 10 subtitles
  useEffect(() => {
    if (
      subtitles.length > 0 &&
      visibleRange.start === 0 &&
      visibleRange.end === 10
    ) {
      setVisibleRange({ start: 0, end: Math.min(10, subtitles.length) });
    }
  }, [subtitles.length, visibleRange.start, visibleRange.end]);

  // Auto-scroll logic to keep current subtitle centered
  useEffect(() => {
    if (isSynced && !isUserScrolling) {
      let targetIndex = currentIndex;

      // If no current subtitle, focus on upcoming subtitle
      if (currentIndex === -1 && upcomingIndex !== -1) {
        targetIndex = upcomingIndex;
      }

      // If we have a target, center it
      if (targetIndex !== -1) {
        const centerPosition = 4; // Keep target subtitle at position 4 (center of 9 visible lines)
        const newStart = Math.max(0, targetIndex - centerPosition);
        const newEnd = Math.min(subtitles.length, newStart + 9);

        setVisibleRange({ start: newStart, end: newEnd });
      }
    }
  }, [
    currentIndex,
    upcomingIndex,
    isSynced,
    isUserScrolling,
    subtitles.length,
  ]);

  // Reset user scrolling after 3 seconds of no interaction
  useEffect(() => {
    if (isUserScrolling) {
      const timer = setTimeout(() => {
        setIsUserScrolling(false);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [isUserScrolling]);

  const getSubtitleStyle = (globalIndex: number) => {
    const isCurrentSubtitle = globalIndex === currentIndex;
    const isUpcoming = globalIndex === upcomingIndex && currentIndex === -1;

    if (!isSynced) {
      return {
        opacity: 1,
        transform: "scale(1)",
        glow: false,
        emphasis: false,
      };
    }

    const distance = Math.abs(
      globalIndex - (currentIndex !== -1 ? currentIndex : upcomingIndex)
    );

    if (isCurrentSubtitle) {
      return {
        opacity: 1,
        transform: "scale(1)",
        glow: true,
        emphasis: true,
      };
    } else if (isUpcoming) {
      return {
        opacity: 0.9,
        transform: "scale(1)",
        glow: false,
        emphasis: true,
      };
    } else if (distance === 1) {
      return {
        opacity: 0.75,
        transform: "scale(1)",
        glow: false,
        emphasis: false,
      };
    } else if (distance === 2) {
      return {
        opacity: 0.6,
        transform: "scale(1)",
        glow: false,
        emphasis: false,
      };
    } else if (distance <= 4) {
      return {
        opacity: 0.4,
        transform: "scale(1)",
        glow: false,
        emphasis: false,
      };
    } else {
      return {
        opacity: 0.25,
        transform: "scale(1)",
        glow: false,
        emphasis: false,
      };
    }
  };

  const handleManualScroll = (direction: "up" | "down") => {
    setIsUserScrolling(true);
    const scrollAmount = 3;

    if (direction === "up") {
      const newStart = Math.max(0, visibleRange.start - scrollAmount);
      setVisibleRange({ start: newStart, end: newStart + 9 });
    } else {
      const newStart = Math.min(
        subtitles.length - 9,
        visibleRange.start + scrollAmount
      );
      setVisibleRange({ start: newStart, end: newStart + 9 });
    }
  };

  const visibleSubtitles = subtitles.slice(
    visibleRange.start,
    visibleRange.end
  );

  if (subtitles.length === 0) {
    return (
      <div className="relative overflow-hidden">
        {/* Modern empty state */}
        <div className="h-[500px] flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-lg">
          <div className="text-center space-y-6 p-8">
            {/* Animated music notes */}
            <div className="relative">
              <div className="text-6xl text-blue-400 dark:text-blue-300 animate-bounce">
                ♪
              </div>
              <div className="absolute -top-2 -right-2 text-3xl text-indigo-400 dark:text-indigo-300 animate-pulse delay-300">
                ♫
              </div>
              <div className="absolute -bottom-1 -left-3 text-4xl text-purple-400 dark:text-purple-300 animate-bounce delay-500">
                ♪
              </div>
            </div>
            <div className="space-y-2">
              <h3 className="text-xl font-semibold text-slate-700 dark:text-slate-200">
                No Lyrics Available
              </h3>
              <p className="text-slate-500 dark:text-slate-400 max-w-xs">
                This song doesn&apos;t have lyrics yet. Enjoy the beautiful
                music!
              </p>
            </div>
            {/* Subtle animation */}
            <div className="flex justify-center space-x-1">
              <div className="w-2 h-2 bg-blue-400 rounded-full animate-ping"></div>
              <div className="w-2 h-2 bg-indigo-400 rounded-full animate-ping delay-100"></div>
              <div className="w-2 h-2 bg-purple-400 rounded-full animate-ping delay-200"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative overflow-hidden">
      {/* Modern karaoke display */}
      <div
        ref={containerRef}
        className={cn(
          "h-[500px] relative bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-lg",
          !isSynced ? "overflow-y-auto" : "overflow-hidden"
        )}
      >
        {/* Background pattern */}
        <div className="absolute inset-0 opacity-5 dark:opacity-10">
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-blue-500 to-purple-600"></div>
          <div
            className="absolute top-0 left-0 w-full h-full"
            style={{
              backgroundImage: `radial-gradient(circle at 25% 25%, rgba(120, 119, 198, 0.3) 0%, transparent 50%), 
                             radial-gradient(circle at 75% 75%, rgba(255, 119, 198, 0.3) 0%, transparent 50%)`,
            }}
          ></div>
        </div>

        {/* Center focus indicator - only show when synced */}
        {isSynced && (
          <div className="absolute left-4 right-4 top-1/2 transform -translate-y-1/2 h-0.5 bg-gradient-to-r from-transparent via-blue-400/30 to-transparent pointer-events-none"></div>
        )}

        {/* Lyrics container */}
        <div
          className={cn(
            "relative z-10 px-8 py-12 space-y-6",
            isSynced
              ? "flex flex-col items-center justify-center h-full"
              : "min-h-full"
          )}
        >
          {(isSynced ? visibleSubtitles : subtitles).map((subtitle, index) => {
            const globalIndex = isSynced ? visibleRange.start + index : index;
            const isCurrentSubtitle = globalIndex === currentIndex;
            const isUpcoming =
              globalIndex === upcomingIndex && currentIndex === -1;
            const style = getSubtitleStyle(globalIndex);

            return (
              <div
                key={globalIndex}
                className={cn(
                  "transition-all duration-700 ease-out cursor-pointer text-center px-6 py-3 rounded-xl backdrop-blur-sm max-w-4xl w-full group",
                  isCurrentSubtitle && isSynced
                    ? "bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-blue-500/20 dark:from-blue-400/20 dark:via-purple-400/20 dark:to-blue-400/20 shadow-xl border border-blue-200/50 dark:border-blue-400/30"
                    : isUpcoming && !isSynced
                    ? "bg-gradient-to-r from-indigo-500/10 to-blue-500/10 dark:from-indigo-400/10 dark:to-blue-400/10 border border-indigo-200/30 dark:border-indigo-400/20"
                    : "hover:bg-white/60 dark:hover:bg-slate-800/60 hover:shadow-md border border-transparent hover:border-slate-200/50 dark:hover:border-slate-600/50",
                  !isSynced && "mx-auto"
                )}
                style={
                  isSynced
                    ? {
                        opacity: style.opacity,
                        transform: style.transform,
                        filter: style.glow
                          ? "drop-shadow(0 0 20px rgba(59, 130, 246, 0.5))"
                          : "none",
                      }
                    : undefined
                }
                onClick={() => {
                  onSeek(subtitle.time);
                  if (isSynced) {
                    setIsUserScrolling(true);
                  }
                }}
              >
                <p
                  className={cn(
                    "transition-all duration-500 leading-relaxed font-medium text-lg md:text-xl",
                    isCurrentSubtitle && isSynced
                      ? "text-blue-700 dark:text-blue-300 font-bold tracking-wide"
                      : isUpcoming && !isSynced
                      ? "text-indigo-600 dark:text-indigo-300 font-semibold"
                      : !isSynced
                      ? "text-slate-700 dark:text-slate-200 font-medium"
                      : style.emphasis
                      ? "text-slate-700 dark:text-slate-200 font-medium"
                      : "text-slate-600 dark:text-slate-300"
                  )}
                >
                  {subtitle.text}
                </p>

                {/* Subtle time indicator */}
                {(isCurrentSubtitle || isUpcoming) && isSynced && (
                  <div className="mt-2 opacity-60">
                    <div className="text-xs text-slate-500 dark:text-slate-400">
                      {Math.floor(subtitle.time / 60)}:
                      {String(Math.floor(subtitle.time % 60)).padStart(2, "0")}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Enhanced gradient overlays - only when synced */}
        {isSynced && (
          <>
            <div className="absolute top-0 left-0 right-0 h-20 bg-gradient-to-b from-slate-50 via-slate-50/80 to-transparent dark:from-slate-900 dark:via-slate-900/80 pointer-events-none"></div>
            <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-slate-50 via-slate-50/80 to-transparent dark:from-slate-900 dark:via-slate-900/80 pointer-events-none"></div>
          </>
        )}
      </div>

      {/* Modern Controls */}
      <div className="mt-6 flex items-center justify-between p-4 bg-white/70 dark:bg-slate-800/70 backdrop-blur-md rounded-xl border border-slate-200/50 dark:border-slate-700/50 shadow-sm">
        <div className="flex items-center space-x-4">
          {/* Live indicator */}
          {isSynced && isPlaying && (
            <div className="flex items-center space-x-2 px-3 py-1.5 bg-green-100 dark:bg-green-900/30 rounded-full border border-green-200 dark:border-green-700">
              <div className="relative">
                <div className="w-2.5 h-2.5 bg-green-500 rounded-full animate-pulse"></div>
                <div className="absolute inset-0 w-2.5 h-2.5 bg-green-400 rounded-full animate-ping"></div>
              </div>
              <span className="text-sm font-medium text-green-700 dark:text-green-300">
                Live Sync
              </span>
            </div>
          )}

          {/* Sync status */}
          {!isSynced && (
            <div className="flex items-center space-x-2 px-3 py-1.5 bg-amber-100 dark:bg-amber-900/30 rounded-full border border-amber-200 dark:border-amber-700">
              <div className="w-2.5 h-2.5 bg-amber-500 rounded-full"></div>
              <span className="text-sm font-medium text-amber-700 dark:text-amber-300">
                Manual Mode - Scrollable
              </span>
            </div>
          )}

          {/* Manual scroll indicator */}
          {isUserScrolling && isSynced && (
            <div className="flex items-center space-x-2 px-3 py-1.5 bg-blue-100 dark:bg-blue-900/30 rounded-full border border-blue-200 dark:border-blue-700">
              <svg
                className="w-3 h-3 text-blue-600 dark:text-blue-300"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                />
              </svg>
              <span className="text-sm font-medium text-blue-700 dark:text-blue-300">
                Manual View
              </span>
            </div>
          )}
        </div>

        {/* Navigation controls - only show when synced */}
        {isSynced && (
          <div className="flex items-center space-x-2">
            <button
              onClick={() => handleManualScroll("up")}
              disabled={visibleRange.start === 0}
              className="px-4 py-2 text-sm font-medium rounded-lg bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-600 hover:bg-slate-200 dark:hover:bg-slate-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center space-x-1 group"
            >
              <svg
                className="w-4 h-4 group-hover:-translate-y-0.5 transition-transform duration-200"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 15l7-7 7 7"
                />
              </svg>
              <span>Previous</span>
            </button>

            <div className="px-3 py-2 text-xs text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-800/50 rounded-lg border border-slate-200/50 dark:border-slate-700/50">
              {visibleRange.start + 1}-
              {Math.min(visibleRange.end, subtitles.length)} of{" "}
              {subtitles.length}
            </div>

            <button
              onClick={() => handleManualScroll("down")}
              disabled={visibleRange.end >= subtitles.length}
              className="px-4 py-2 text-sm font-medium rounded-lg bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-600 hover:bg-slate-200 dark:hover:bg-slate-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center space-x-1 group"
            >
              <span>Next</span>
              <svg
                className="w-4 h-4 group-hover:translate-y-0.5 transition-transform duration-200"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </button>
          </div>
        )}

        {/* Show total subtitle count when not synced */}
        {!isSynced && (
          <div className="flex items-center space-x-2">
            <div className="px-3 py-2 text-sm text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-800/50 rounded-lg border border-slate-200/50 dark:border-slate-700/50">
              {subtitles.length} lyrics available
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
