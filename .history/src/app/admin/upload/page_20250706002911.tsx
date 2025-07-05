"use client";
import React, { useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Upload,
  Music,
  Image as ImageIcon,
  Save,
  X,
  CheckCircle,
  AlertCircle,
  Loader2,
} from "lucide-react";
import { Song } from "@/lib/types";
import { validateFile, getAudioDuration } from "@/lib/storage";

interface UploadFormData {
  title: string;
  artist: string;
  album: string;
  genre: string;
  year: string;
  duration: string;
  coverFile: File | null;
  audioFile: File | null;
}

export default function AdminUploadPage() {
  const [formData, setFormData] = useState<UploadFormData>({
    title: "",
    artist: "",
    album: "",
    genre: "",
    year: new Date().getFullYear().toString(),
    duration: "",
    coverFile: null,
    audioFile: null,
  });

  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadStatus, setUploadStatus] = useState<
    "idle" | "uploading" | "success" | "error"
  >("idle");
  const [uploadMessage, setUploadMessage] = useState("");
  const [coverPreview, setCoverPreview] = useState<string | null>(null);
  const [audioPreview, setAudioPreview] = useState<string | null>(null);

  const genres = [
    "Pop",
    "Rock",
    "Hip-Hop",
    "Electronic",
    "Jazz",
    "Classical",
    "R&B",
    "Country",
    "Reggae",
    "Folk",
    "Blues",
    "Alternative",
    "Indie",
    "Punk",
    "Soul",
    "Metal",
  ];

  const handleInputChange = (field: keyof UploadFormData, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleFileChange = async (
    field: "coverFile" | "audioFile",
    file: File | null
  ) => {
    if (!file) {
      setFormData((prev) => ({ ...prev, [field]: null }));
      if (field === "coverFile") setCoverPreview(null);
      if (field === "audioFile") setAudioPreview(null);
      return;
    }

    try {
      // Validate file
      if (field === "coverFile") {
        validateFile(file, "image");
      } else {
        validateFile(file, "audio");
      }

      setFormData((prev) => ({ ...prev, [field]: file }));

      const url = URL.createObjectURL(file);
      if (field === "coverFile") {
        setCoverPreview(url);
      } else if (field === "audioFile") {
        setAudioPreview(url);
        // Get audio duration
        try {
          const duration = await getAudioDuration(file);
          setFormData((prev) => ({ ...prev, duration: duration.toString() }));
        } catch (error) {
          console.error("Error getting audio duration:", error);
        }
      }
    } catch (error) {
      setUploadStatus("error");
      setUploadMessage(
        error instanceof Error ? error.message : "File validation failed"
      );
    }
  };

  const validateForm = (): boolean => {
    if (!formData.title.trim()) {
      setUploadMessage("Song title is required");
      return false;
    }
    if (!formData.artist.trim()) {
      setUploadMessage("Artist name is required");
      return false;
    }
    if (!formData.audioFile) {
      setUploadMessage("Audio file is required");
      return false;
    }
    if (!formData.coverFile) {
      setUploadMessage("Cover image is required");
      return false;
    }
    return true;
  };

  const uploadToCloudinary = async (
    file: File,
    resourceType: "image" | "video"
  ): Promise<string> => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append(
      "upload_preset",
      process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || "sangeetx_preset"
    );
    formData.append("resource_type", resourceType);
    formData.append("folder", "sangeetx");

    const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
    if (!cloudName) {
      throw new Error("Cloudinary cloud name not configured");
    }

    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${cloudName}/${resourceType}/upload`,
      {
        method: "POST",
        body: formData,
      }
    );

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        `Upload failed: ${errorData.error?.message || response.statusText}`
      );
    }

    const data = await response.json();
    return data.secure_url;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      setUploadStatus("error");
      return;
    }

    setIsUploading(true);
    setUploadStatus("uploading");
    setUploadProgress(0);
    setUploadMessage("Uploading files...");

    try {
      // Upload cover image
      setUploadMessage("Uploading cover image...");
      setUploadProgress(25);
      const coverUrl = await uploadToCloudinary(formData.coverFile!, "image");

      // Upload audio file
      setUploadMessage("Uploading audio file...");
      setUploadProgress(50);
      const audioUrl = await uploadToCloudinary(formData.audioFile!, "video");

      // Save to database
      setUploadMessage("Saving to database...");
      setUploadProgress(75);

      const songData: Partial<Song> = {
        title: formData.title,
        artist: formData.artist,
        album: formData.album,
        genre: formData.genre,
        year: parseInt(formData.year),
        duration: parseInt(formData.duration),
        coverUrl,
        audioUrl,
        popularity: 0,
        isLiked: false,
        playCount: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const response = await fetch("/api/songs", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(songData),
      });

      if (!response.ok) {
        throw new Error("Failed to save song");
      }

      setUploadProgress(100);
      setUploadStatus("success");
      setUploadMessage("Song uploaded successfully!");

      // Reset form
      setTimeout(() => {
        setFormData({
          title: "",
          artist: "",
          album: "",
          genre: "",
          year: new Date().getFullYear().toString(),
          duration: "",
          coverFile: null,
          audioFile: null,
        });
        setCoverPreview(null);
        setAudioPreview(null);
        setUploadStatus("idle");
        setUploadMessage("");
      }, 2000);
    } catch (error) {
      console.error("Upload error:", error);
      setUploadStatus("error");
      setUploadMessage(
        error instanceof Error ? error.message : "Upload failed"
      );
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Upload New Song
          </h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            Add a new song to the SangeetX library
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Music className="h-5 w-5" />
              <span>Song Details</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Basic Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Song Title *
                  </label>
                  <Input
                    type="text"
                    value={formData.title}
                    onChange={(e) => handleInputChange("title", e.target.value)}
                    placeholder="Enter song title"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Artist *
                  </label>
                  <Input
                    type="text"
                    value={formData.artist}
                    onChange={(e) =>
                      handleInputChange("artist", e.target.value)
                    }
                    placeholder="Enter artist name"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Album
                  </label>
                  <Input
                    type="text"
                    value={formData.album}
                    onChange={(e) => handleInputChange("album", e.target.value)}
                    placeholder="Enter album name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Genre
                  </label>
                  <select
                    value={formData.genre}
                    onChange={(e) => handleInputChange("genre", e.target.value)}
                    className="w-full h-10 px-3 rounded-md border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-950 dark:text-white"
                  >
                    <option value="">Select genre</option>
                    {genres.map((genre) => (
                      <option key={genre} value={genre}>
                        {genre}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Year
                  </label>
                  <Input
                    type="number"
                    value={formData.year}
                    onChange={(e) => handleInputChange("year", e.target.value)}
                    placeholder="Enter release year"
                    min="1900"
                    max={new Date().getFullYear()}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Duration (seconds)
                  </label>
                  <Input
                    type="number"
                    value={formData.duration}
                    onChange={(e) =>
                      handleInputChange("duration", e.target.value)
                    }
                    placeholder="Auto-detected from audio"
                    readOnly
                  />
                </div>
              </div>

              {/* File Uploads */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Cover Image Upload */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Cover Image *
                  </label>
                  <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6 text-center">
                    {coverPreview ? (
                      <div className="relative">
                        <Image
                          src={coverPreview}
                          alt="Cover preview"
                          width={200}
                          height={200}
                          className="mx-auto rounded-lg"
                        />
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          className="mt-4"
                          onClick={() => {
                            handleFileChange("coverFile", null);
                            setCoverPreview(null);
                          }}
                        >
                          <X className="h-4 w-4 mr-2" />
                          Remove
                        </Button>
                      </div>
                    ) : (
                      <div>
                        <ImageIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                          Click to upload cover image
                        </p>
                        <p className="text-xs text-gray-500">
                          PNG, JPG up to 10MB
                        </p>
                      </div>
                    )}
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) =>
                        handleFileChange(
                          "coverFile",
                          e.target.files?.[0] || null
                        )
                      }
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    />
                  </div>
                </div>

                {/* Audio Upload */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Audio File *
                  </label>
                  <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6 text-center">
                    {audioPreview ? (
                      <div>
                        <div className="flex items-center justify-center mb-4">
                          <Music className="h-12 w-12 text-green-500" />
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                          {formData.audioFile?.name}
                        </p>
                        <audio controls className="w-full mb-4">
                          <source src={audioPreview} type="audio/mpeg" />
                          Your browser does not support the audio element.
                        </audio>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            handleFileChange("audioFile", null);
                            setAudioPreview(null);
                          }}
                        >
                          <X className="h-4 w-4 mr-2" />
                          Remove
                        </Button>
                      </div>
                    ) : (
                      <div>
                        <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                          Click to upload audio file
                        </p>
                        <p className="text-xs text-gray-500">
                          MP3, WAV up to 50MB
                        </p>
                      </div>
                    )}
                    <input
                      type="file"
                      accept="audio/*"
                      onChange={(e) =>
                        handleFileChange(
                          "audioFile",
                          e.target.files?.[0] || null
                        )
                      }
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    />
                  </div>
                </div>
              </div>

              {/* Upload Status */}
              {uploadStatus !== "idle" && (
                <div className="rounded-lg bg-gray-50 dark:bg-gray-800 p-4">
                  <div className="flex items-center space-x-3">
                    {uploadStatus === "uploading" && (
                      <Loader2 className="h-5 w-5 animate-spin text-blue-500" />
                    )}
                    {uploadStatus === "success" && (
                      <CheckCircle className="h-5 w-5 text-green-500" />
                    )}
                    {uploadStatus === "error" && (
                      <AlertCircle className="h-5 w-5 text-red-500" />
                    )}
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        {uploadMessage}
                      </p>
                      {uploadStatus === "uploading" && (
                        <div className="mt-2 w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                          <div
                            className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${uploadProgress}%` }}
                          />
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Submit Button */}
              <div className="flex justify-end">
                <Button type="submit" disabled={isUploading} className="px-8">
                  {isUploading ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Uploading...
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4 mr-2" />
                      Upload Song
                    </>
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
