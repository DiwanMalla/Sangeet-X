"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Play,
  Pause,
  Plus,
  Trash2,
  Save,
  SkipBack,
  SkipForward,
  Volume2,
  Clock,
  X,
  Mic,
  Square,
} from "lucide-react";
import { Song } from "@/lib/types";
import { formatTime } from "@/lib/utils";

interface Subtitle {
  id?: string;
  songId: string;
  language: string;
  text: string;
  startTime: number;
  endTime: number;
  isNew?: boolean;
}

interface SimpleLyricEditorProps {
  song: Song;
  language: string;
  onSave: (subtitles: Subtitle[]) => void;
  onCancel: () => void;
}

export default function SimpleLyricEditor({
  song,
  language,
  onSave,
  onCancel,
}: SimpleLyricEditorProps) {
  const [subtitles, setSubtitles] = useState<Subtitle[]>([]);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.7);
  const [loading, setLoading] = useState(true);
  const [currentLyric, setCurrentLyric] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [recordingStartTime, setRecordingStartTime] = useState(0);

  const audioRef = useRef<HTMLAudioElement>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const lyricInputRef = useRef<HTMLInputElement>(null);

  const fetchSubtitles = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `/api/subtitles?songId=${song.id}&language=${language}`
      );
      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setSubtitles(
            data.data.map((sub: Subtitle) => ({ ...sub, isNew: false }))
          );
        }
      }
    } catch (error) {
      console.error("Error fetching subtitles:", error);
    } finally {
      setLoading(false);
    }
  }, [song.id, language]);

  useEffect(() => {
    fetchSubtitles();
  }, [fetchSubtitles]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  useEffect(() => {
    if (isPlaying && audioRef.current) {
      intervalRef.current = setInterval(() => {
        if (audioRef.current) {
          setCurrentTime(audioRef.current.currentTime);
        }
      }, 100);
    } else if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isPlaying]);

  const handlePlayPause = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleSeek = (time: number) => {
    if (audioRef.current) {
      audioRef.current.currentTime = time;
      setCurrentTime(time);
    }
  };

  const startRecording = () => {
    setIsRecording(true);
    setRecordingStartTime(currentTime);
    if (lyricInputRef.current) {
      lyricInputRef.current.focus();
    }
  };

  const stopRecording = () => {
    if (currentLyric.trim() && isRecording) {
      const newSubtitle: Subtitle = {
        songId: song.id,
        language,
        text: currentLyric.trim(),
        startTime: recordingStartTime,
        endTime: currentTime,
        isNew: true,
      };

      setSubtitles((prev) =>
        [...prev, newSubtitle].sort((a, b) => a.startTime - b.startTime)
      );
      setCurrentLyric("");
      setIsRecording(false);
      setRecordingStartTime(0);
    }
  };

  const quickAddLyric = () => {
    if (currentLyric.trim()) {
      const newSubtitle: Subtitle = {
        songId: song.id,
        language,
        text: currentLyric.trim(),
        startTime: Math.max(0, currentTime - 2), // Start 2 seconds before current time
        endTime: currentTime + 3, // End 3 seconds after current time
        isNew: true,
      };

      setSubtitles((prev) =>
        [...prev, newSubtitle].sort((a, b) => a.startTime - b.startTime)
      );
      setCurrentLyric("");
    }
  };

  const removeSubtitle = (index: number) => {
    setSubtitles((prev) => prev.filter((_, i) => i !== index));
  };

  const updateSubtitleText = (index: number, newText: string) => {
    setSubtitles((prev) =>
      prev.map((sub, i) => (i === index ? { ...sub, text: newText } : sub))
    );
  };

  const adjustTiming = (
    index: number,
    field: "startTime" | "endTime",
    adjustment: number
  ) => {
    setSubtitles((prev) =>
      prev.map((sub, i) =>
        i === index
          ? { ...sub, [field]: Math.max(0, sub[field] + adjustment) }
          : sub
      )
    );
  };

  const handleSave = async () => {
    try {
      // Save all subtitles
      for (const subtitle of subtitles) {
        if (subtitle.isNew) {
          await fetch("/api/subtitles", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              songId: subtitle.songId,
              language: subtitle.language,
              text: subtitle.text,
              startTime: subtitle.startTime,
              endTime: subtitle.endTime,
            }),
          });
        }
      }
      onSave(subtitles);
    } catch (error) {
      console.error("Error saving subtitles:", error);
    }
  };

  const getCurrentSubtitle = () => {
    return subtitles.find(
      (sub) => currentTime >= sub.startTime && currentTime <= sub.endTime
    );
  };

  const jumpToSubtitle = (subtitle: Subtitle) => {
    handleSeek(subtitle.startTime);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && currentLyric.trim()) {
      if (isRecording) {
        stopRecording();
      } else {
        quickAddLyric();
      }
    } else if (e.key === " " && e.ctrlKey) {
      e.preventDefault();
      if (isRecording) {
        stopRecording();
      } else {
        startRecording();
      }
    }
  };

  const currentSubtitle = getCurrentSubtitle();

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Audio Player */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Live Lyric Editor - {song.title}</span>
            <div className="flex items-center space-x-2">
              <Button onClick={onCancel} variant="outline" size="sm">
                <X className="h-4 w-4 mr-2" />
                Cancel
              </Button>
              <Button
                onClick={handleSave}
                className="bg-green-600 hover:bg-green-700"
                size="sm"
              >
                <Save className="h-4 w-4 mr-2" />
                Save All ({subtitles.length})
              </Button>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <audio
            ref={audioRef}
            src={song.audioUrl}
            onLoadedMetadata={(e) => {
              setDuration(e.currentTarget.duration);
            }}
            onEnded={() => setIsPlaying(false)}
            preload="metadata"
          />

          {/* Transport Controls */}
          <div className="flex items-center justify-center space-x-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleSeek(Math.max(0, currentTime - 10))}
            >
              <SkipBack className="h-4 w-4" />
            </Button>
            <Button
              size="lg"
              onClick={handlePlayPause}
              className="bg-purple-600 hover:bg-purple-700"
            >
              {isPlaying ? (
                <Pause className="h-6 w-6" />
              ) : (
                <Play className="h-6 w-6" />
              )}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleSeek(Math.min(duration, currentTime + 10))}
            >
              <SkipForward className="h-4 w-4" />
            </Button>
          </div>

          {/* Progress Bar */}
          <div className="space-y-2">
            <input
              type="range"
              min="0"
              max={duration}
              value={currentTime}
              onChange={(e) => handleSeek(parseFloat(e.target.value))}
              className="w-full accent-purple-600"
            />
            <div className="flex justify-between text-sm text-gray-500">
              <span>{formatTime(currentTime)}</span>
              <span>{formatTime(duration)}</span>
            </div>
          </div>

          {/* Volume Control */}
          <div className="flex items-center space-x-2">
            <Volume2 className="h-4 w-4 text-gray-500" />
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={volume}
              onChange={(e) => setVolume(parseFloat(e.target.value))}
              className="flex-1 accent-purple-600"
            />
          </div>

          {/* Current Subtitle Display */}
          <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg min-h-[60px] flex items-center justify-center">
            <p className="text-center text-lg font-medium text-gray-900 dark:text-white">
              {currentSubtitle
                ? currentSubtitle.text
                : "♪ No lyrics at this time ♪"}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Live Lyric Input */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Mic className="h-5 w-5" />
            <span>Add Lyrics Live</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
              <p className="text-sm text-blue-700 dark:text-blue-300 mb-2">
                <strong>Quick Guide:</strong>
              </p>
              <ul className="text-sm text-blue-600 dark:text-blue-400 space-y-1">
                <li>
                  • Type lyrics and press{" "}
                  <kbd className="bg-blue-200 dark:bg-blue-800 px-1 rounded">
                    Enter
                  </kbd>{" "}
                  to add at current time
                </li>
                <li>
                  • Press{" "}
                  <kbd className="bg-blue-200 dark:bg-blue-800 px-1 rounded">
                    Start Recording
                  </kbd>{" "}
                  to capture exact timing
                </li>
                <li>
                  • Use{" "}
                  <kbd className="bg-blue-200 dark:bg-blue-800 px-1 rounded">
                    Ctrl+Space
                  </kbd>{" "}
                  to start/stop recording
                </li>
              </ul>
            </div>

            <div className="flex space-x-2">
              <Input
                ref={lyricInputRef}
                value={currentLyric}
                onChange={(e) => setCurrentLyric(e.target.value)}
                placeholder="Type lyrics here..."
                className="flex-1"
                onKeyDown={handleKeyPress}
              />

              {isRecording ? (
                <Button
                  onClick={stopRecording}
                  className="bg-red-600 hover:bg-red-700"
                  disabled={!currentLyric.trim()}
                >
                  <Square className="h-4 w-4 mr-2" />
                  Stop ({formatTime(currentTime - recordingStartTime)})
                </Button>
              ) : (
                <>
                  <Button
                    onClick={startRecording}
                    className="bg-green-600 hover:bg-green-700"
                    disabled={!currentLyric.trim()}
                  >
                    <Mic className="h-4 w-4 mr-2" />
                    Start Recording
                  </Button>
                  <Button
                    onClick={quickAddLyric}
                    disabled={!currentLyric.trim()}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Quick Add
                  </Button>
                </>
              )}
            </div>

            {isRecording && (
              <div className="bg-red-50 dark:bg-red-900/20 p-3 rounded-lg">
                <p className="text-red-700 dark:text-red-300 text-sm">
                  🔴 Recording started at {formatTime(recordingStartTime)} -
                  Type your lyrics and press Enter or Stop when the line ends
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Subtitles List */}
      <Card>
        <CardHeader>
          <CardTitle>Lyrics Timeline ({subtitles.length} lines)</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {subtitles.map((subtitle, index) => (
              <div
                key={index}
                className={`p-3 rounded-lg border transition-all ${
                  currentTime >= subtitle.startTime &&
                  currentTime <= subtitle.endTime
                    ? "bg-purple-100 dark:bg-purple-900/30 border-purple-300 dark:border-purple-600"
                    : "bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700"
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <Clock className="h-4 w-4 text-gray-500" />
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        {formatTime(subtitle.startTime)} -{" "}
                        {formatTime(subtitle.endTime)}
                      </span>
                      <div className="flex items-center space-x-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => adjustTiming(index, "startTime", -1)}
                          className="h-6 w-6 p-0"
                          title="Start -1s"
                        >
                          -
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => adjustTiming(index, "startTime", 1)}
                          className="h-6 w-6 p-0"
                          title="Start +1s"
                        >
                          +
                        </Button>
                        <span className="text-xs text-gray-400">|</span>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => adjustTiming(index, "endTime", -1)}
                          className="h-6 w-6 p-0"
                          title="End -1s"
                        >
                          -
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => adjustTiming(index, "endTime", 1)}
                          className="h-6 w-6 p-0"
                          title="End +1s"
                        >
                          +
                        </Button>
                      </div>
                    </div>

                    <Input
                      value={subtitle.text}
                      onChange={(e) =>
                        updateSubtitleText(index, e.target.value)
                      }
                      className="mb-2"
                      placeholder="Enter lyrics..."
                    />

                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => jumpToSubtitle(subtitle)}
                      className="text-xs text-blue-600 hover:text-blue-700"
                    >
                      Jump to this line
                    </Button>
                  </div>

                  <div className="flex items-center space-x-1 ml-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeSubtitle(index)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}

            {subtitles.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                <Mic className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                <p>No lyrics added yet.</p>
                <p className="text-sm">
                  Start playing the song and add lyrics as you hear them!
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
