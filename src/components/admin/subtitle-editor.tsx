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
  Edit3,
  Check,
  X,
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
  isEditing?: boolean;
}

interface SubtitleEditorProps {
  song: Song;
  language: string;
  onSave: (subtitles: Subtitle[]) => void;
  onCancel: () => void;
}

export default function SubtitleEditor({
  song,
  language,
  onSave,
  onCancel,
}: SubtitleEditorProps) {
  const [subtitles, setSubtitles] = useState<Subtitle[]>([]);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.7);
  const [loading, setLoading] = useState(true);
  const [newSubtitleText, setNewSubtitleText] = useState("");

  const audioRef = useRef<HTMLAudioElement>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

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
            data.data.map((sub: Subtitle) => ({
              ...sub,
              isNew: false,
              isEditing: false,
            }))
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
  }, [song.id, language, fetchSubtitles]);

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

  const handleTimeSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const time = parseFloat(e.target.value);
    handleSeek(time);
  };

  const addSubtitle = () => {
    if (newSubtitleText.trim()) {
      const newSubtitle: Subtitle = {
        songId: song.id,
        language,
        text: newSubtitleText,
        startTime: Math.floor(currentTime),
        endTime: Math.floor(currentTime) + 5, // Default 5 seconds duration
        isNew: true,
        isEditing: false,
      };

      setSubtitles((prev) =>
        [...prev, newSubtitle].sort((a, b) => a.startTime - b.startTime)
      );
      setNewSubtitleText("");
    }
  };

  const removeSubtitle = (index: number) => {
    setSubtitles((prev) => prev.filter((_, i) => i !== index));
  };

  const updateSubtitle = (index: number, updates: Partial<Subtitle>) => {
    setSubtitles((prev) =>
      prev.map((sub, i) => (i === index ? { ...sub, ...updates } : sub))
    );
  };

  const startEditing = (index: number) => {
    setSubtitles((prev) =>
      prev.map((sub, i) => (i === index ? { ...sub, isEditing: true } : sub))
    );
  };

  const stopEditing = (index: number) => {
    setSubtitles((prev) =>
      prev.map((sub, i) => (i === index ? { ...sub, isEditing: false } : sub))
    );
  };

  const handleSave = async () => {
    onSave(subtitles);
  };

  const getCurrentSubtitle = () => {
    return subtitles.find(
      (sub) => currentTime >= sub.startTime && currentTime <= sub.endTime
    );
  };

  const jumpToSubtitle = (subtitle: Subtitle) => {
    handleSeek(subtitle.startTime);
  };

  const setSubtitleStartTime = (index: number) => {
    updateSubtitle(index, { startTime: Math.floor(currentTime) });
  };

  const setSubtitleEndTime = (index: number) => {
    updateSubtitle(index, { endTime: Math.floor(currentTime) });
  };

  const formatTimeInput = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  const parseTimeInput = (timeString: string) => {
    const [mins, secs] = timeString.split(":").map(Number);
    return (mins || 0) * 60 + (secs || 0);
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
            <span>Audio Player - {song.title}</span>
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
                Save All
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
              size="sm"
              onClick={handlePlayPause}
              className="bg-purple-600 hover:bg-purple-700"
            >
              {isPlaying ? (
                <Pause className="h-5 w-5" />
              ) : (
                <Play className="h-5 w-5" />
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
              onChange={handleTimeSeek}
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
              {currentSubtitle ? currentSubtitle.text : "♪ ♪ ♪"}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Add New Subtitle */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Plus className="h-5 w-5" />
            <span>Add Subtitle at {formatTime(currentTime)}</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex space-x-2">
            <Input
              value={newSubtitleText}
              onChange={(e) => setNewSubtitleText(e.target.value)}
              placeholder="Enter subtitle text..."
              className="flex-1"
              onKeyPress={(e) => e.key === "Enter" && addSubtitle()}
            />
            <Button onClick={addSubtitle} disabled={!newSubtitleText.trim()}>
              Add
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Subtitles List */}
      <Card>
        <CardHeader>
          <CardTitle>Subtitles ({subtitles.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {subtitles.map((subtitle, index) => (
              <div
                key={index}
                className={`p-3 rounded-lg border ${
                  currentTime >= subtitle.startTime &&
                  currentTime <= subtitle.endTime
                    ? "bg-purple-100 border-purple-300"
                    : "bg-gray-50 border-gray-200"
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <Clock className="h-4 w-4 text-gray-500" />
                      <div className="flex items-center space-x-2">
                        <Input
                          type="text"
                          value={formatTimeInput(subtitle.startTime)}
                          onChange={(e) =>
                            updateSubtitle(index, {
                              startTime: parseTimeInput(e.target.value),
                            })
                          }
                          className="w-20 text-sm"
                        />
                        <span>-</span>
                        <Input
                          type="text"
                          value={formatTimeInput(subtitle.endTime)}
                          onChange={(e) =>
                            updateSubtitle(index, {
                              endTime: parseTimeInput(e.target.value),
                            })
                          }
                          className="w-20 text-sm"
                        />
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setSubtitleStartTime(index)}
                          title="Set start time to current"
                        >
                          Start
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setSubtitleEndTime(index)}
                          title="Set end time to current"
                        >
                          End
                        </Button>
                      </div>
                    </div>

                    {subtitle.isEditing ? (
                      <div className="flex items-center space-x-2">
                        <Input
                          value={subtitle.text}
                          onChange={(e) =>
                            updateSubtitle(index, { text: e.target.value })
                          }
                          className="flex-1"
                          onKeyPress={(e) => {
                            if (e.key === "Enter") {
                              stopEditing(index);
                            }
                            if (e.key === "Escape") {
                              stopEditing(index);
                            }
                          }}
                          autoFocus
                        />
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => stopEditing(index)}
                        >
                          <Check className="h-4 w-4" />
                        </Button>
                      </div>
                    ) : (
                      <p
                        className="text-gray-800 cursor-pointer hover:bg-gray-100 p-1 rounded"
                        onClick={() => jumpToSubtitle(subtitle)}
                      >
                        {subtitle.text}
                      </p>
                    )}
                  </div>

                  <div className="flex items-center space-x-1 ml-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => startEditing(index)}
                    >
                      <Edit3 className="h-4 w-4" />
                    </Button>
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
                No subtitles added yet. Add your first subtitle using the form
                above.
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
