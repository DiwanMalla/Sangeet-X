"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import SimpleLyricEditor from "@/components/admin/simple-lyric-editor";
import {
  Plus,
  Edit,
  Trash2,
  Search,
  Music,
  Languages,
  Clock,
  Save,
  X,
  Headphones,
} from "lucide-react";
import { Song } from "@/lib/types";
import { formatTime } from "@/lib/utils";

interface Subtitle {
  id: string;
  songId: string;
  language: string;
  text: string;
  startTime: number;
  endTime: number;
  song?: Song;
}

interface SubtitleFormData {
  songId: string;
  language: string;
  text: string;
  startTime: number;
  endTime: number;
}

export default function AdminSubtitlesPage() {
  const [subtitles, setSubtitles] = useState<Subtitle[]>([]);
  const [songs, setSongs] = useState<Song[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSong, setSelectedSong] = useState<string>("");
  const [selectedLanguage, setSelectedLanguage] = useState<string>("");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingSubtitle, setEditingSubtitle] = useState<Subtitle | null>(null);
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [editorSong, setEditorSong] = useState<Song | null>(null);
  const [editorLanguage, setEditorLanguage] = useState<string>("english");
  const [expandedSongs, setExpandedSongs] = useState<Set<string>>(new Set());
  const [formData, setFormData] = useState<SubtitleFormData>({
    songId: "",
    language: "english",
    text: "",
    startTime: 0,
    endTime: 0,
  });

  const languages = [
    { code: "english", name: "English" },
    { code: "nepali", name: "नेपाली" },
    { code: "hindi", name: "हिन्दी" },
  ];

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [subtitlesResponse, songsResponse] = await Promise.all([
        fetch("/api/subtitles"),
        fetch("/api/songs"),
      ]);

      if (subtitlesResponse.ok) {
        const subtitlesData = await subtitlesResponse.json();
        if (subtitlesData.success) {
          setSubtitles(subtitlesData.data);
        }
      }

      if (songsResponse.ok) {
        const songsData = await songsResponse.json();
        if (songsData.success) {
          setSongs(songsData.data);
        }
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      setError("Failed to load data");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const url = editingSubtitle
        ? `/api/subtitles/${editingSubtitle.id}`
        : "/api/subtitles";

      const method = editingSubtitle ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        await fetchData();
        setIsFormOpen(false);
        setEditingSubtitle(null);
        setFormData({
          songId: "",
          language: "english",
          text: "",
          startTime: 0,
          endTime: 0,
        });
      } else {
        throw new Error("Failed to save subtitle");
      }
    } catch (error) {
      console.error("Error saving subtitle:", error);
      setError("Failed to save subtitle");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this subtitle?")) return;

    try {
      const response = await fetch(`/api/subtitles/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        await fetchData();
      } else {
        throw new Error("Failed to delete subtitle");
      }
    } catch (error) {
      console.error("Error deleting subtitle:", error);
      setError("Failed to delete subtitle");
    }
  };

  const handleOpenEditor = (song: Song, language: string) => {
    setEditorSong(song);
    setEditorLanguage(language);
    setIsEditorOpen(true);
  };

  const handleEditorSave = async () => {
    await fetchData(); // Refresh the data
    setIsEditorOpen(false);
    setEditorSong(null);
  };

  const handleEdit = (subtitle: Subtitle) => {
    setEditingSubtitle(subtitle);
    setFormData({
      songId: subtitle.songId,
      language: subtitle.language,
      text: subtitle.text,
      startTime: subtitle.startTime,
      endTime: subtitle.endTime,
    });
    setIsFormOpen(true);
  };

  const handleTimeInput = (value: string, field: "startTime" | "endTime") => {
    // Convert MM:SS or HH:MM:SS to seconds
    const parts = value.split(":").map((p) => parseInt(p) || 0);
    let seconds = 0;

    if (parts.length === 2) {
      // MM:SS
      seconds = parts[0] * 60 + parts[1];
    } else if (parts.length === 3) {
      // HH:MM:SS
      seconds = parts[0] * 3600 + parts[1] * 60 + parts[2];
    }

    setFormData((prev) => ({ ...prev, [field]: seconds }));
  };

  const formatTimeInput = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  // Group subtitles by song and language
  const groupedSubtitles = subtitles.reduce(
    (acc, subtitle) => {
      const songId = subtitle.songId;
      const language = subtitle.language;

      if (!acc[songId]) {
        acc[songId] = {
          song: subtitle.song,
          languages: {},
        };
      }

      if (!acc[songId].languages[language]) {
        acc[songId].languages[language] = [];
      }

      acc[songId].languages[language].push(subtitle);
      return acc;
    },
    {} as Record<
      string,
      {
        song?: Song;
        languages: Record<string, Subtitle[]>;
      }
    >
  );

  // Filter grouped subtitles
  const filteredGroupedSubtitles = Object.entries(groupedSubtitles).filter(
    ([songId, data]) => {
      const matchesSong = !selectedSong || songId === selectedSong;
      const matchesLanguage =
        !selectedLanguage ||
        Object.keys(data.languages).includes(selectedLanguage);
      const matchesSearch =
        !searchQuery ||
        data.song?.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        data.song?.artist?.name
          .toLowerCase()
          .includes(searchQuery.toLowerCase()) ||
        Object.values(data.languages)
          .flat()
          .some((sub) =>
            sub.text.toLowerCase().includes(searchQuery.toLowerCase())
          );

      return matchesSong && matchesLanguage && matchesSearch;
    }
  );

  const toggleSongExpansion = (songId: string) => {
    setExpandedSongs((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(songId)) {
        newSet.delete(songId);
      } else {
        newSet.add(songId);
      }
      return newSet;
    });
  };

  if (loading) {
    return (
      <div className="p-8">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Subtitle Management
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Manage song subtitles and lyrics
          </p>
        </div>
        <div className="flex space-x-2">
          <Button
            onClick={() => setIsFormOpen(true)}
            className="bg-purple-600 hover:bg-purple-700"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Subtitle
          </Button>
          <Button
            onClick={() => {
              // Open editor with first song and english by default
              if (songs.length > 0) {
                handleOpenEditor(songs[0], "english");
              }
            }}
            className="bg-green-600 hover:bg-green-700"
          >
            <Headphones className="h-4 w-4 mr-2" />
            Live Lyrics Editor
          </Button>
        </div>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            type="text"
            placeholder="Search subtitles..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        <select
          value={selectedSong}
          onChange={(e) => setSelectedSong(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
        >
          <option value="">All Songs</option>
          {songs.map((song) => (
            <option key={song.id} value={song.id}>
              {song.title} - {song.artist?.name}
            </option>
          ))}
        </select>

        <select
          value={selectedLanguage}
          onChange={(e) => setSelectedLanguage(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
        >
          <option value="">All Languages</option>
          {languages.map((lang) => (
            <option key={lang.code} value={lang.code}>
              {lang.name}
            </option>
          ))}
        </select>
        <div className="text-sm text-gray-600 dark:text-gray-400 flex items-center">
          <Languages className="h-4 w-4 mr-1" />
          {filteredGroupedSubtitles.length} songs with subtitles
        </div>
      </div>

      {/* Subtitles List */}
      <div className="grid gap-4">
        {filteredGroupedSubtitles.map(([songId, data]) => (
          <Card key={songId}>
            <CardContent className="p-4">
              {/* Song Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    <Music className="h-5 w-5 text-purple-600" />
                    <span className="font-medium text-lg text-gray-900 dark:text-white">
                      {data.song?.title || "Unknown Song"}
                    </span>
                    <span className="text-sm text-gray-500">
                      by {data.song?.artist?.name || "Unknown Artist"}
                    </span>
                  </div>

                  <div className="flex items-center space-x-4">
                    {Object.entries(data.languages).map(([language, subs]) => (
                      <div
                        key={language}
                        className="flex items-center space-x-1"
                      >
                        <Languages className="h-4 w-4 text-gray-500" />
                        <span className="text-sm text-gray-600 dark:text-gray-400">
                          {languages.find((l) => l.code === language)?.name ||
                            language}
                          : {subs.length} lines
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex items-center space-x-2 ml-4">
                  {Object.keys(data.languages).map((language) => (
                    <Button
                      key={language}
                      variant="ghost"
                      size="sm"
                      onClick={() =>
                        data.song && handleOpenEditor(data.song, language)
                      }
                      className="text-green-600 hover:text-green-700"
                      title={`Edit ${language} lyrics`}
                    >
                      <Headphones className="h-4 w-4 mr-1" />
                      {languages.find((l) => l.code === language)?.name ||
                        language}
                    </Button>
                  ))}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => toggleSongExpansion(songId)}
                    className="text-blue-600 hover:text-blue-700"
                  >
                    {expandedSongs.has(songId) ? "Collapse" : "Expand"}
                  </Button>
                </div>
              </div>

              {/* Expanded Subtitle Lines */}
              {expandedSongs.has(songId) && (
                <div className="mt-4 space-y-2 border-t pt-4">
                  {Object.entries(data.languages).map(([language, subs]) => (
                    <div key={language} className="mb-4">
                      <h4 className="font-medium text-gray-900 dark:text-white mb-2 flex items-center">
                        <Languages className="h-4 w-4 mr-2" />
                        {languages.find((l) => l.code === language)?.name ||
                          language}{" "}
                        ({subs.length} lines)
                      </h4>
                      <div className="space-y-1 pl-6">
                        {subs
                          .sort((a, b) => a.startTime - b.startTime)
                          .map((subtitle) => (
                            <div
                              key={subtitle.id}
                              className="flex items-start justify-between bg-gray-50 dark:bg-gray-800 p-3 rounded"
                            >
                              <div className="flex-1">
                                <div className="flex items-center space-x-2 mb-1">
                                  <Clock className="h-3 w-3 text-gray-500" />
                                  <span className="text-xs text-gray-600 dark:text-gray-400">
                                    {formatTime(subtitle.startTime)} -{" "}
                                    {formatTime(subtitle.endTime)}
                                  </span>
                                </div>
                                <p className="text-sm text-gray-800 dark:text-gray-200">
                                  {subtitle.text}
                                </p>
                              </div>
                              <div className="flex items-center space-x-1 ml-2">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleEdit(subtitle)}
                                  className="h-6 w-6 p-0"
                                >
                                  <Edit className="h-3 w-3" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleDelete(subtitle.id)}
                                  className="text-red-600 hover:text-red-700 h-6 w-6 p-0"
                                >
                                  <Trash2 className="h-3 w-3" />
                                </Button>
                              </div>
                            </div>
                          ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        ))}

        {filteredGroupedSubtitles.length === 0 && (
          <div className="text-center py-12">
            <Languages className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 dark:text-gray-400">
              No songs with subtitles found. Create your first subtitle!
            </p>
          </div>
        )}
      </div>

      {/* Add/Edit Form Modal */}
      {isFormOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                {editingSubtitle ? "Edit Subtitle" : "Add New Subtitle"}
              </h2>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setIsFormOpen(false);
                  setEditingSubtitle(null);
                  setFormData({
                    songId: "",
                    language: "english",
                    text: "",
                    startTime: 0,
                    endTime: 0,
                  });
                }}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Song
                </label>
                <select
                  value={formData.songId}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, songId: e.target.value }))
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                  required
                >
                  <option value="">Select a song</option>
                  {songs.map((song) => (
                    <option key={song.id} value={song.id}>
                      {song.title} - {song.artist?.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Language
                </label>
                <select
                  value={formData.language}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      language: e.target.value,
                    }))
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                  required
                >
                  {languages.map((lang) => (
                    <option key={lang.code} value={lang.code}>
                      {lang.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Start Time (MM:SS)
                  </label>
                  <Input
                    type="text"
                    placeholder="01:30"
                    value={formatTimeInput(formData.startTime)}
                    onChange={(e) =>
                      handleTimeInput(e.target.value, "startTime")
                    }
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    End Time (MM:SS)
                  </label>
                  <Input
                    type="text"
                    placeholder="01:45"
                    value={formatTimeInput(formData.endTime)}
                    onChange={(e) => handleTimeInput(e.target.value, "endTime")}
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Text
                </label>
                <textarea
                  value={formData.text}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, text: e.target.value }))
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                  rows={3}
                  placeholder="Enter subtitle text..."
                  required
                />
              </div>

              <div className="flex justify-end space-x-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setIsFormOpen(false);
                    setEditingSubtitle(null);
                  }}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="bg-purple-600 hover:bg-purple-700"
                >
                  <Save className="h-4 w-4 mr-2" />
                  {editingSubtitle ? "Update" : "Create"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Live Lyric Editor */}
      {isEditorOpen && editorSong && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg w-full max-w-6xl max-h-[95vh] overflow-y-auto">
            <SimpleLyricEditor
              song={editorSong}
              language={editorLanguage}
              onSave={handleEditorSave}
              onCancel={() => setIsEditorOpen(false)}
            />
          </div>
        </div>
      )}
    </div>
  );
}
