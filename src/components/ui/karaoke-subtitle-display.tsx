"use client";

import React, { useEffect, useState, useRef } from "react";
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

// Add custom CSS for animation delays
const customStyles = `
  .animation-delay-0 { animation-delay: 0ms; }
  .animation-delay-500 { animation-delay: 500ms; }
  .animation-delay-1000 { animation-delay: 1000ms; }
  .animation-delay-1500 { animation-delay: 1500ms; }
  .animation-delay-2000 { animation-delay: 2000ms; }
  .animation-delay-2500 { animation-delay: 2500ms; }
  .animation-delay-3000 { animation-delay: 3000ms; }
`;

export default function KaraokeSubtitleDisplay({
  subtitles,
  currentTime,
  isSynced,
  onSeek,
}: KaraokeSubtitleDisplayProps) {
  const [scrollPosition, setScrollPosition] = useState(0);
  const subtitleRefs = useRef<(HTMLDivElement | null)[]>([]); // Store refs for each subtitle

  // Inject custom styles for animation delays
  useEffect(() => {
    if (typeof document !== "undefined") {
      const styleId = "karaoke-custom-styles";
      if (!document.getElementById(styleId)) {
        const style = document.createElement("style");
        style.id = styleId;
        style.textContent = customStyles;
        document.head.appendChild(style);
      }
    }
  }, []);

  const getCurrentSubtitleIndex = () => {
    return subtitles.findIndex(
      (subtitle) =>
        currentTime >= subtitle.time && currentTime <= subtitle.endTime
    );
  };

  const currentIndex = getCurrentSubtitleIndex();

  // Auto-scroll logic
  useEffect(() => {
    if (isSynced && currentIndex !== -1) {
      const containerHeight = 280; // Container height
      let targetPosition = 0;

      // Calculate cumulative height of subtitles up to currentIndex
      for (let i = 0; i < currentIndex; i++) {
        const subtitleElement = subtitleRefs.current[i];
        targetPosition += subtitleElement?.offsetHeight || 30; // Fallback to 30px if ref unavailable
      }

      // Center the active subtitle by offsetting by half its height
      const currentSubtitleHeight =
        subtitleRefs.current[currentIndex]?.offsetHeight || 30;
      targetPosition += currentSubtitleHeight / 2;

      // Adjust to keep the active subtitle centered in the container
      const offsetToCenter = containerHeight / 2;
      targetPosition -= offsetToCenter;

      // Calculate max scroll to prevent overscrolling
      let totalContentHeight = 0;
      subtitleRefs.current.forEach((ref) => {
        totalContentHeight += ref?.offsetHeight || 30;
      });
      const maxScroll = Math.max(0, totalContentHeight - containerHeight);
      const clampedPosition = Math.max(0, Math.min(targetPosition, maxScroll));

      setScrollPosition(clampedPosition);
    }
  }, [currentIndex, isSynced, subtitles.length]);

  // Word-by-word highlighting
  const renderHighlightedText = (subtitle: Subtitle, isActive: boolean) => {
    if (!isActive || !isSynced) {
      return subtitle.text;
    }

    const words = subtitle.text.split(" ");
    const progressInSubtitle = currentTime - subtitle.time;
    const totalDuration = subtitle.endTime - subtitle.time;
    const progress = Math.max(
      0,
      Math.min(1, progressInSubtitle / totalDuration)
    );

    const currentWordIndex = Math.floor(progress * words.length);

    return words.map((word, index) => (
      <span
        key={index}
        className={cn(
          "transition-all duration-200",
          index === currentWordIndex
            ? "text-yellow-400 font-semibold"
            : index < currentWordIndex
            ? "text-blue-400"
            : "inherit"
        )}
      >
        {word}
        {index < words.length - 1 && " "}
      </span>
    ));
  };

  if (subtitles.length === 0) {
    return (
      <div className="h-[280px] flex items-center justify-center bg-gradient-to-br from-slate-100 via-slate-50 to-slate-200 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 rounded-lg border border-slate-200 dark:border-slate-700 relative overflow-hidden">
        {/* Animated background particles */}
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-blue-400/30 rounded-full animate-ping animation-delay-0"></div>
          <div className="absolute top-3/4 right-1/4 w-1 h-1 bg-purple-400/30 rounded-full animate-ping animation-delay-1000"></div>
          <div className="absolute bottom-1/4 left-3/4 w-1.5 h-1.5 bg-green-400/30 rounded-full animate-ping animation-delay-2000"></div>
          <div className="absolute top-1/2 right-1/2 w-1 h-1 bg-yellow-400/30 rounded-full animate-ping animation-delay-3000"></div>
        </div>

        {/* Glowing orb behind icon */}
        <div className="absolute w-32 h-32 bg-gradient-to-r from-blue-400/20 to-purple-400/20 rounded-full blur-xl animate-pulse"></div>

        {/* Main content */}
        <div className="text-center text-slate-500 dark:text-slate-400 relative z-10">
          <div className="relative">
            {/* Musical note with glow */}
            <div className="text-6xl mb-4 text-transparent bg-clip-text bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 animate-pulse filter drop-shadow-lg">
              ♪
            </div>
            {/* Rotating glow ring around icon */}
            <div className="absolute top-1/2 left-1/2 w-20 h-20 -translate-x-1/2 -translate-y-1/2 border-2 border-gradient-to-r from-blue-400/50 to-purple-400/50 rounded-full animate-spin opacity-30"></div>
          </div>

          {/* Text with typing animation */}
          <div className="relative">
            <p className="text-lg font-medium bg-gradient-to-r from-slate-600 to-slate-400 dark:from-slate-300 dark:to-slate-500 bg-clip-text text-transparent animate-pulse">
              No lyrics available
            </p>
            {/* Underline animation */}
            <div className="absolute bottom-0 left-1/2 w-0 h-0.5 bg-gradient-to-r from-blue-400 to-purple-400 animate-pulse group-hover:w-full transition-all duration-1000 -translate-x-1/2"></div>
          </div>

          {/* Floating music notes */}
          <div className="absolute -top-4 -right-4 text-2xl text-blue-400/40 animate-bounce animation-delay-500">
            ♫
          </div>
          <div className="absolute -bottom-4 -left-4 text-xl text-purple-400/40 animate-bounce animation-delay-1500">
            ♪
          </div>
          <div className="absolute top-0 left-0 text-lg text-pink-400/40 animate-bounce animation-delay-2500">
            ♬
          </div>
        </div>

        {/* Subtle gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-transparent via-transparent to-white/5 dark:to-black/5 pointer-events-none"></div>
      </div>
    );
  }

  return (
    <div className="relative">
      <div className="h-[360px] bg-slate-50 dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-700 overflow-hidden relative">
        {/* Scrollable lyrics - only show when synced */}
        {isSynced && (
          <div
            className="relative px-4 py-3"
            style={{
              transform: isSynced ? `translateY(-${scrollPosition}px)` : "none",
              transition: isSynced ? "transform 0.3s ease-out" : "none",
            }}
          >
            <div className="space-y-1">
              {subtitles.map((subtitle, index) => {
                const isActive = index === currentIndex;

                return (
                  <div
                    key={index}
                    ref={(el) => {
                      subtitleRefs.current[index] = el;
                    }} // Assign ref to each subtitle
                    className={cn(
                      "text-base leading-tight text-center cursor-pointer transition-all duration-300 py-1 px-3 rounded-md min-h-[30px] flex items-center justify-center",
                      isActive && isSynced
                        ? "text-white bg-blue-500/20 shadow-lg scale-105"
                        : "text-slate-700 dark:text-slate-300 hover:bg-white/50 dark:hover:bg-slate-800/50"
                    )}
                    onClick={() => onSeek(subtitle.time)}
                  >
                    <div className="w-full">
                      <p className="font-medium text-sm">
                        {renderHighlightedText(subtitle, isActive)}
                      </p>
                      {isActive && isSynced && (
                        <div className="mt-1 text-xs text-blue-300 opacity-75">
                          {Math.floor(subtitle.time / 60)}:
                          {String(Math.floor(subtitle.time % 60)).padStart(
                            2,
                            "0"
                          )}
                          <div className="mt-0.5 w-full bg-blue-300/20 rounded-full h-0.5">
                            <div
                              className="h-full bg-blue-400 rounded-full transition-all duration-300"
                              style={{
                                width: `${Math.max(
                                  0,
                                  Math.min(
                                    100,
                                    ((currentTime - subtitle.time) /
                                      (subtitle.endTime - subtitle.time)) *
                                      100
                                  )
                                )}%`,
                              }}
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
        <div className="absolute top-0 left-0 right-0 h-12 bg-gradient-to-b from-slate-50 dark:from-slate-900 to-transparent pointer-events-none z-20"></div>
        <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-slate-50 dark:from-slate-900 to-transparent pointer-events-none z-20"></div>
        {!isSynced && (
          <div className="absolute inset-0 overflow-y-auto">
            <div className="px-4 py-3 space-y-1">
              {subtitles.map((subtitle, index) => {
                const isActive = index === currentIndex;

                return (
                  <div
                    key={index}
                    className={cn(
                      "text-base leading-tight text-center cursor-pointer transition-all duration-300 py-1 px-3 rounded-md min-h-[30px] flex items-center justify-center",
                      isActive
                        ? "text-white bg-blue-500/20 shadow-lg scale-105"
                        : "text-slate-700 dark:text-slate-300 hover:bg-white/50 dark:hover:bg-slate-800/50"
                    )}
                    onClick={() => onSeek(subtitle.time)}
                  >
                    <div className="w-full">
                      <p className="font-medium text-sm">{subtitle.text}</p>
                      {isActive && (
                        <div className="mt-1 text-xs text-blue-300 opacity-75">
                          {Math.floor(subtitle.time / 60)}:
                          {String(Math.floor(subtitle.time % 60)).padStart(
                            2,
                            "0"
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
      <div className="mt-4 flex items-center justify-between p-3 bg-white/80 dark:bg-slate-800/80 backdrop-blur rounded-lg border border-slate-200/50 dark:border-slate-700/50">
        <div className="flex items-center space-x-3">
          {isSynced ? (
            <div className="flex items-center space-x-2 px-3 py-1 bg-green-100 dark:bg-green-900/30 rounded-full">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-sm text-green-700 dark:text-green-300">
                Live Sync
              </span>
            </div>
          ) : (
            <div className="flex items-center space-x-2 px-3 py-1 bg-amber-100 dark:bg-amber-900/30 rounded-full">
              <div className="w-2 h-2 bg-amber-500 rounded-full"></div>
              <span className="text-sm text-amber-700 dark:text-amber-300">
                Manual
              </span>
            </div>
          )}
        </div>
        <div className="text-sm text-slate-500 dark:text-slate-400">
          {currentIndex >= 0 ? `${currentIndex + 1} / ` : ""}
          {subtitles.length} lyrics
        </div>
      </div>
    </div>
  );
}
