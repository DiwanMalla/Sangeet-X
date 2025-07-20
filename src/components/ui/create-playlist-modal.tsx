"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { useUser } from "@clerk/nextjs";
import { X, Music2, Lock, Globe, Loader2 } from "lucide-react";
import { Song } from "@/lib/types";

interface PlaylistSong {
  id: string;
  position: number;
  addedAt: string;
  song: Song;
}

interface Playlist {
  id: string;
  name: string;
  description: string | null;
  isPublic: boolean;
  coverUrl: string | null;
  createdAt: string;
  updatedAt: string;
  songs: PlaylistSong[];
  _count: {
    songs: number;
  };
}

interface CreatePlaylistModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPlaylistCreated: (playlist: Playlist) => void;
}

export default function CreatePlaylistModal({
  isOpen,
  onClose,
  onPlaylistCreated,
}: CreatePlaylistModalProps) {
  const { user } = useUser();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [isPublic, setIsPublic] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?.id || !name.trim()) return;

    try {
      setIsLoading(true);

      const response = await fetch("/api/playlists", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: user.id,
          name: name.trim(),
          description: description.trim() || null,
          isPublic,
        }),
      });

      const data = await response.json();

      if (data.success) {
        onPlaylistCreated(data.data);
        handleClose();
      } else {
        alert("Failed to create playlist");
      }
    } catch (error) {
      console.error("Error creating playlist:", error);
      alert("Failed to create playlist");
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setName("");
    setDescription("");
    setIsPublic(false);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-slate-900 border-slate-700">
        <CardContent className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-white">Create Playlist</h2>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleClose}
              className="text-gray-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </Button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Playlist Icon */}
            <div className="flex justify-center mb-6">
              <div className="w-24 h-24 bg-gradient-to-br from-violet-500 to-purple-500 rounded-lg flex items-center justify-center">
                <Music2 className="w-12 h-12 text-white" />
              </div>
            </div>

            {/* Name Input */}
            <div>
              <label className="text-sm font-medium text-gray-300 mb-2 block">
                Playlist Name *
              </label>
              <Input
                type="text"
                placeholder="My Awesome Playlist"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="bg-slate-800 border-slate-600 text-white placeholder-gray-400 focus:border-violet-500"
                maxLength={50}
                required
              />
              <div className="text-xs text-gray-400 mt-1">
                {name.length}/50 characters
              </div>
            </div>

            {/* Description Input */}
            <div>
              <label className="text-sm font-medium text-gray-300 mb-2 block">
                Description (Optional)
              </label>
              <textarea
                placeholder="Tell people what this playlist is about..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-3 py-2 bg-slate-800 border border-slate-600 rounded-md text-white placeholder-gray-400 focus:border-violet-500 focus:outline-none resize-none"
                rows={3}
                maxLength={200}
              />
              <div className="text-xs text-gray-400 mt-1">
                {description.length}/200 characters
              </div>
            </div>

            {/* Privacy Setting */}
            <div>
              <label className="text-sm font-medium text-gray-300 mb-3 block">
                Privacy
              </label>
              <div className="space-y-2">
                <div
                  className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                    !isPublic
                      ? "border-violet-500 bg-violet-500/10"
                      : "border-slate-600 hover:border-slate-500"
                  }`}
                  onClick={() => setIsPublic(false)}
                >
                  <div className="flex items-center space-x-3">
                    <Lock className="w-5 h-5 text-gray-400" />
                    <div>
                      <div className="text-white font-medium">Private</div>
                      <div className="text-sm text-gray-400">
                        Only you can see this playlist
                      </div>
                    </div>
                  </div>
                </div>

                <div
                  className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                    isPublic
                      ? "border-violet-500 bg-violet-500/10"
                      : "border-slate-600 hover:border-slate-500"
                  }`}
                  onClick={() => setIsPublic(true)}
                >
                  <div className="flex items-center space-x-3">
                    <Globe className="w-5 h-5 text-gray-400" />
                    <div>
                      <div className="text-white font-medium">Public</div>
                      <div className="text-sm text-gray-400">
                        Anyone can see this playlist
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Buttons */}
            <div className="flex space-x-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={handleClose}
                className="flex-1 border-slate-600 text-gray-300 hover:bg-slate-800"
                disabled={isLoading}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="flex-1 bg-violet-500 hover:bg-violet-600"
                disabled={!name.trim() || isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Creating...
                  </>
                ) : (
                  "Create Playlist"
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
