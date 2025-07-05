"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import {
  Search,
  Plus,
  Edit,
  Trash2,
  Music,
  Users,
  Upload,
  X,
  Save,
  Loader2,
  CheckCircle,
  AlertCircle,
} from "lucide-react";

interface Artist {
  id: string;
  name: string;
  bio?: string;
  avatar?: string;
  coverImage?: string;
  website?: string;
  socialLinks?: {
    instagram?: string;
    twitter?: string;
    spotify?: string;
    youtube?: string;
    [key: string]: string | undefined;
  };
  verified: boolean;
  songCount: number;
  playCount: number;
  createdAt: string;
  updatedAt: string;
  _count: {
    songs: number;
  };
}

interface ArtistFormData {
  name: string;
  bio: string;
  avatar: File | null;
  coverImage: File | null;
  website: string;
  socialLinks: {
    instagram?: string;
    twitter?: string;
    spotify?: string;
    youtube?: string;
  };
}

export default function AdminArtistsPage() {
  const searchParams = useSearchParams();
  const [artists, setArtists] = useState<Artist[]>([]);
  const [filteredArtists, setFilteredArtists] = useState<Artist[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingArtist, setEditingArtist] = useState<Artist | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<
    "idle" | "success" | "error"
  >("idle");
  const [submitMessage, setSubmitMessage] = useState("");

  const [formData, setFormData] = useState<ArtistFormData>({
    name: "",
    bio: "",
    avatar: null,
    coverImage: null,
    website: "",
    socialLinks: {},
  });

  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [coverPreview, setCoverPreview] = useState<string | null>(null);

  const filterArtists = React.useCallback(() => {
    let filtered = [...artists];

    if (searchQuery) {
      filtered = filtered.filter(
        (artist) =>
          artist.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          artist.bio?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setFilteredArtists(filtered);
  }, [artists, searchQuery]);

  useEffect(() => {
    fetchArtists();
  }, []);

  useEffect(() => {
    filterArtists();
  }, [filterArtists]);

  // Check for mode=add query parameter
  useEffect(() => {
    const mode = searchParams.get("mode");
    if (mode === "add") {
      setShowForm(true);
    }
  }, [searchParams]);

  const fetchArtists = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/artists");
      if (response.ok) {
        const data = await response.json();
        setArtists(data.artists || []);
      }
    } catch (error) {
      console.error("Error fetching artists:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: keyof ArtistFormData, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSocialLinksChange = (platform: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      socialLinks: {
        ...prev.socialLinks,
        [platform]: value,
      },
    }));
  };

  const handleFileChange = (
    field: "avatar" | "coverImage",
    file: File | null
  ) => {
    if (!file) {
      setFormData((prev) => ({ ...prev, [field]: null }));
      if (field === "avatar") setAvatarPreview(null);
      if (field === "coverImage") setCoverPreview(null);
      return;
    }

    setFormData((prev) => ({ ...prev, [field]: file }));
    const url = URL.createObjectURL(file);
    if (field === "avatar") {
      setAvatarPreview(url);
    } else {
      setCoverPreview(url);
    }
  };

  const uploadToCloudinary = async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append(
      "upload_preset",
      process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || "sangeetx_preset"
    );
    formData.append("resource_type", "image");
    formData.append("folder", "sangeetx/artists");

    const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
    if (!cloudName) {
      throw new Error("Cloudinary cloud name not configured");
    }

    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
      {
        method: "POST",
        body: formData,
      }
    );

    if (!response.ok) {
      throw new Error("Failed to upload image");
    }

    const data = await response.json();
    return data.secure_url;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus("idle");

    try {
      let avatarUrl = editingArtist?.avatar || "";
      let coverImageUrl = editingArtist?.coverImage || "";

      if (formData.avatar) {
        avatarUrl = await uploadToCloudinary(formData.avatar);
      }

      if (formData.coverImage) {
        coverImageUrl = await uploadToCloudinary(formData.coverImage);
      }

      const artistData = {
        name: formData.name,
        bio: formData.bio,
        avatar: avatarUrl,
        coverImage: coverImageUrl,
        website: formData.website,
        socialLinks: formData.socialLinks,
      };

      const response = await fetch(
        editingArtist ? `/api/artists/${editingArtist.id}` : "/api/artists",
        {
          method: editingArtist ? "PUT" : "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(artistData),
        }
      );

      if (response.ok) {
        setSubmitStatus("success");
        setSubmitMessage(
          editingArtist
            ? "Artist updated successfully!"
            : "Artist created successfully!"
        );
        await fetchArtists();
        resetForm();
      } else {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to save artist");
      }
    } catch (error) {
      setSubmitStatus("error");
      setSubmitMessage(
        error instanceof Error ? error.message : "Failed to save artist"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = (artist: Artist) => {
    setEditingArtist(artist);
    setFormData({
      name: artist.name,
      bio: artist.bio || "",
      avatar: null,
      coverImage: null,
      website: artist.website || "",
      socialLinks: artist.socialLinks || {},
    });
    setAvatarPreview(artist.avatar || null);
    setCoverPreview(artist.coverImage || null);
    setShowForm(true);
  };

  const handleDelete = async (artistId: string) => {
    if (confirm("Are you sure you want to delete this artist?")) {
      try {
        const response = await fetch(`/api/artists/${artistId}`, {
          method: "DELETE",
        });

        if (response.ok) {
          await fetchArtists();
        } else {
          const errorData = await response.json();
          alert(errorData.error || "Failed to delete artist");
        }
      } catch (error) {
        console.error("Error deleting artist:", error);
      }
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      bio: "",
      avatar: null,
      coverImage: null,
      website: "",
      socialLinks: {},
    });
    setAvatarPreview(null);
    setCoverPreview(null);
    setEditingArtist(null);
    setShowForm(false);
    setSubmitStatus("idle");
    setSubmitMessage("");
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/4" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="h-64 bg-gray-200 dark:bg-gray-700 rounded-lg"
              />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Artists Management
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Manage artists and their profiles
          </p>
        </div>
        <Button
          onClick={() => setShowForm(true)}
          className="bg-purple-600 hover:bg-purple-700"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Artist
        </Button>
      </div>

      {/* Search */}
      <div className="flex items-center space-x-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            type="text"
            placeholder="Search artists..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Artists Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredArtists.map((artist) => (
          <Card key={artist.id} className="overflow-hidden">
            <div className="relative h-48 bg-gray-200 dark:bg-gray-700">
              {artist.coverImage ? (
                <Image
                  src={artist.coverImage}
                  alt={artist.name}
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="flex items-center justify-center h-full">
                  <Music className="h-12 w-12 text-gray-400" />
                </div>
              )}
            </div>
            <CardContent className="p-4">
              <div className="flex items-center space-x-3 mb-3">
                <div className="relative w-12 h-12 rounded-full overflow-hidden bg-gray-200 dark:bg-gray-700">
                  {artist.avatar ? (
                    <Image
                      src={artist.avatar}
                      alt={artist.name}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full">
                      <Users className="h-6 w-6 text-gray-400" />
                    </div>
                  )}
                </div>
                <div className="flex-1">
                  <h3 className="font-medium text-gray-900 dark:text-white">
                    {artist.name}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {artist._count.songs} songs
                  </p>
                </div>
              </div>

              {artist.bio && (
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">
                  {artist.bio}
                </p>
              )}

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleEdit(artist)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDelete(artist.id)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
                <span className="text-xs text-gray-500">
                  {new Date(artist.createdAt).toLocaleDateString()}
                </span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredArtists.length === 0 && (
        <div className="text-center py-12">
          <div className="w-24 h-24 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
            <Users className="h-8 w-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            No artists found
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            {searchQuery
              ? "Try adjusting your search"
              : "Get started by adding your first artist"}
          </p>
          <Button onClick={() => setShowForm(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Add Artist
          </Button>
        </div>
      )}

      {/* Artist Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                  {editingArtist ? "Edit Artist" : "Add New Artist"}
                </h2>
                <Button variant="ghost" size="sm" onClick={resetForm}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              {/* Artist Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Artist Name *
                </label>
                <Input
                  type="text"
                  value={formData.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  placeholder="Enter artist name"
                  required
                />
              </div>

              {/* Bio */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Bio
                </label>
                <textarea
                  value={formData.bio}
                  onChange={(e) => handleInputChange("bio", e.target.value)}
                  placeholder="Tell us about the artist..."
                  rows={4}
                  className="w-full p-3 border border-gray-300 rounded-md dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                />
              </div>

              {/* Avatar Upload */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Avatar
                </label>
                <div className="flex items-center space-x-4">
                  <div className="relative w-20 h-20 rounded-full overflow-hidden bg-gray-200 dark:bg-gray-700">
                    {avatarPreview ? (
                      <Image
                        src={avatarPreview}
                        alt="Avatar preview"
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="flex items-center justify-center h-full">
                        <Users className="h-8 w-8 text-gray-400" />
                      </div>
                    )}
                  </div>
                  <div>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() =>
                        document.getElementById("avatar-input")?.click()
                      }
                    >
                      <Upload className="h-4 w-4 mr-2" />
                      Upload Avatar
                    </Button>
                    <input
                      id="avatar-input"
                      type="file"
                      accept="image/*"
                      onChange={(e) =>
                        handleFileChange("avatar", e.target.files?.[0] || null)
                      }
                      className="hidden"
                    />
                  </div>
                </div>
              </div>

              {/* Cover Image Upload */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Cover Image
                </label>
                <div className="space-y-4">
                  {coverPreview && (
                    <div className="relative w-full h-32 rounded-lg overflow-hidden bg-gray-200 dark:bg-gray-700">
                      <Image
                        src={coverPreview}
                        alt="Cover preview"
                        fill
                        className="object-cover"
                      />
                    </div>
                  )}
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() =>
                      document.getElementById("cover-input")?.click()
                    }
                  >
                    <Upload className="h-4 w-4 mr-2" />
                    Upload Cover
                  </Button>
                  <input
                    id="cover-input"
                    type="file"
                    accept="image/*"
                    onChange={(e) =>
                      handleFileChange(
                        "coverImage",
                        e.target.files?.[0] || null
                      )
                    }
                    className="hidden"
                  />
                </div>
              </div>

              {/* Website */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Website
                </label>
                <Input
                  type="url"
                  value={formData.website}
                  onChange={(e) => handleInputChange("website", e.target.value)}
                  placeholder="https://artist-website.com"
                />
              </div>

              {/* Social Links */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Social Links
                </label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    type="url"
                    value={formData.socialLinks.instagram || ""}
                    onChange={(e) =>
                      handleSocialLinksChange("instagram", e.target.value)
                    }
                    placeholder="Instagram URL"
                  />
                  <Input
                    type="url"
                    value={formData.socialLinks.twitter || ""}
                    onChange={(e) =>
                      handleSocialLinksChange("twitter", e.target.value)
                    }
                    placeholder="Twitter URL"
                  />
                  <Input
                    type="url"
                    value={formData.socialLinks.spotify || ""}
                    onChange={(e) =>
                      handleSocialLinksChange("spotify", e.target.value)
                    }
                    placeholder="Spotify URL"
                  />
                  <Input
                    type="url"
                    value={formData.socialLinks.youtube || ""}
                    onChange={(e) =>
                      handleSocialLinksChange("youtube", e.target.value)
                    }
                    placeholder="YouTube URL"
                  />
                </div>
              </div>

              {/* Submit Status */}
              {submitStatus !== "idle" && (
                <div className="rounded-lg bg-gray-50 dark:bg-gray-800 p-4">
                  <div className="flex items-center space-x-3">
                    {submitStatus === "success" && (
                      <CheckCircle className="h-5 w-5 text-green-500" />
                    )}
                    {submitStatus === "error" && (
                      <AlertCircle className="h-5 w-5 text-red-500" />
                    )}
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      {submitMessage}
                    </p>
                  </div>
                </div>
              )}

              {/* Form Actions */}
              <div className="flex justify-end space-x-3">
                <Button type="button" variant="outline" onClick={resetForm}>
                  Cancel
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4 mr-2" />
                      {editingArtist ? "Update Artist" : "Create Artist"}
                    </>
                  )}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
