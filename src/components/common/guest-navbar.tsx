"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Music } from "lucide-react";
import Link from "next/link";

interface NavbarProps {
  showBackButton?: boolean;
  currentPage?: string;
}

export default function GuestNavbar({
  showBackButton = false,
  currentPage,
}: NavbarProps) {
  const router = useRouter();

  return (
    <nav className="bg-black/20 backdrop-blur-md border-b border-white/10 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center space-x-3">
            <div
              className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center cursor-pointer"
              onClick={() => router.push("/landing")}
            >
              <Music className="w-6 h-6 text-white" />
            </div>
            <span
              className="text-2xl font-bold text-white cursor-pointer"
              onClick={() => router.push("/landing")}
            >
              SangeetX
            </span>
          </div>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-8">
            {showBackButton ? (
              <button
                onClick={() => router.back()}
                className="text-white hover:text-purple-300 transition-colors"
              >
                ← Back
              </button>
            ) : (
              <>
                <button
                  onClick={() => router.push("/landing")}
                  className={`transition-colors ${
                    currentPage === "home"
                      ? "text-purple-400"
                      : "text-white hover:text-purple-300"
                  }`}
                >
                  Home
                </button>
                <button
                  onClick={() => {
                    router.push("/landing");
                    // Small delay to ensure page loads before scrolling
                    setTimeout(() => {
                      const genresSection = document.getElementById("genres");
                      if (genresSection) {
                        genresSection.scrollIntoView({ behavior: "smooth" });
                      }
                    }, 100);
                  }}
                  className={`transition-colors ${
                    currentPage === "genres"
                      ? "text-purple-400"
                      : "text-white hover:text-purple-300"
                  }`}
                >
                  Genres
                </button>
                <button
                  onClick={() => {
                    router.push("/landing");
                    setTimeout(() => {
                      const discoverSection =
                        document.getElementById("discover");
                      if (discoverSection) {
                        discoverSection.scrollIntoView({ behavior: "smooth" });
                      }
                    }, 100);
                  }}
                  className="text-white hover:text-purple-300 transition-colors"
                >
                  Discover
                </button>
                <button
                  onClick={() => {
                    router.push("/landing");
                    setTimeout(() => {
                      const aboutSection = document.getElementById("about");
                      if (aboutSection) {
                        aboutSection.scrollIntoView({ behavior: "smooth" });
                      }
                    }, 100);
                  }}
                  className="text-white hover:text-purple-300 transition-colors"
                >
                  About
                </button>
              </>
            )}
          </div>

          {/* Login Button */}
          <Link href="/login">
            <Button className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white border-none">
              Login
            </Button>
          </Link>
        </div>
      </div>
    </nav>
  );
}
