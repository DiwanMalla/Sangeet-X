"use client";

import React, { useState } from "react";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Heart } from "lucide-react";
import { cn } from "@/lib/utils";

interface LikeButtonProps {
  songId: string;
  initialLiked?: boolean;
  onLikeChange?: (isLiked: boolean) => void;
  size?: "sm" | "md" | "lg";
  variant?: "button" | "icon";
  className?: string;
  showText?: boolean;
}

export default function LikeButton({
  songId,
  initialLiked = false,
  onLikeChange,
  size = "md",
  variant = "button",
  className,
  showText = true,
}: LikeButtonProps) {
  const { user } = useUser();
  const router = useRouter();
  const [isLiked, setIsLiked] = useState(initialLiked);
  const [isLoading, setIsLoading] = useState(false);

  const handleLikeToggle = async (e?: React.MouseEvent) => {
    // Prevent event bubbling if used inside a clickable parent
    if (e) {
      e.stopPropagation();
    }

    if (!user?.id) {
      router.push("/login");
      return;
    }

    if (isLoading) return;

    try {
      setIsLoading(true);

      if (isLiked) {
        // Remove from favorites
        const response = await fetch(
          `/api/favorites?userId=${user.id}&songId=${songId}`,
          {
            method: "DELETE",
          }
        );

        if (response.ok) {
          setIsLiked(false);
          onLikeChange?.(false);
        } else {
          console.error("Failed to remove from favorites");
        }
      } else {
        // Add to favorites
        const response = await fetch("/api/favorites", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            userId: user.id,
            songId,
            userEmail: user.emailAddresses[0]?.emailAddress,
            userDisplayName: user.fullName || user.firstName || "User",
          }),
        });

        if (response.ok) {
          setIsLiked(true);
          onLikeChange?.(true);
        } else {
          console.error("Failed to add to favorites");
        }
      }
    } catch (error) {
      console.error("Error toggling like:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const iconSizes = {
    sm: "h-3 w-3",
    md: "h-4 w-4",
    lg: "h-5 w-5",
  };

  const buttonSizes = {
    sm: "text-xs px-2 py-1",
    md: "text-sm px-3 py-2",
    lg: "text-base px-4 py-2",
  };

  if (variant === "icon") {
    return (
      <button
        onClick={handleLikeToggle}
        disabled={isLoading}
        className={cn(
          "p-2 rounded-full transition-all duration-200 hover:bg-gray-100 dark:hover:bg-gray-800",
          isLiked ? "text-red-500" : "text-gray-500 hover:text-red-500",
          isLoading && "opacity-50 cursor-not-allowed",
          className
        )}
        title={isLiked ? "Remove from favorites" : "Add to favorites"}
      >
        <Heart className={cn(iconSizes[size], isLiked && "fill-current")} />
      </button>
    );
  }

  return (
    <Button
      variant={isLiked ? "default" : "outline"}
      size="sm"
      onClick={handleLikeToggle}
      disabled={isLoading}
      className={cn(
        buttonSizes[size],
        isLiked
          ? "bg-red-500 hover:bg-red-600 text-white border-red-500"
          : "border-red-500 text-red-500 hover:bg-red-50 dark:hover:bg-red-950",
        isLoading && "opacity-50 cursor-not-allowed",
        className
      )}
    >
      <Heart
        className={cn(
          iconSizes[size],
          showText ? "mr-2" : "",
          isLiked ? "fill-current" : ""
        )}
      />
      {showText && (isLiked ? "Liked" : "Like")}
    </Button>
  );
}
