"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  Home,
  Search,
  Library,
  Heart,
  Music,
  Headphones,
  Menu,
  X,
  PlayCircle,
  User,
  LogOut,
  Settings,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useUser, useClerk, SignedIn, SignedOut } from "@clerk/nextjs";

const navigation = [
  { name: "Home", href: "/", icon: Home },
  { name: "Search", href: "/search", icon: Search },
  { name: "Your Library", href: "/library", icon: Library },
  { name: "Liked Songs", href: "/liked", icon: Heart },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const pathname = usePathname();
  const { user } = useUser();
  const { signOut } = useClerk();

  // Check if we're on a song page
  const isSongPage = pathname?.startsWith("/song/");

  // Create dynamic navigation with "Now Playing" for song pages
  const currentNavigation = isSongPage
    ? [
        { name: "Home", href: "/", icon: Home },
        {
          name: "Now Playing",
          href: pathname,
          icon: PlayCircle,
          isActive: true,
        },
        { name: "Search", href: "/search", icon: Search },
        { name: "Your Library", href: "/library", icon: Library },
        { name: "Liked Songs", href: "/liked", icon: Heart },
      ]
    : navigation;

  return (
    <>
      {/* Desktop Navbar */}
      <nav className="hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-72 lg:flex-col">
        <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-gray-900 px-6 pb-4">
          <div className="flex h-16 shrink-0 items-center">
            <Link href="/" className="flex items-center space-x-2">
              <div className="rounded-lg bg-purple-600 p-2">
                <Music className="h-6 w-6 text-white" />
              </div>
              <span className="text-xl font-bold text-white">SangeetX</span>
            </Link>
          </div>
          <nav className="flex flex-1 flex-col">
            <ul role="list" className="flex flex-1 flex-col gap-y-7">
              <li>
                <ul role="list" className="-mx-2 space-y-1">
                  {currentNavigation.map((item) => {
                    const isActive = item.isActive || pathname === item.href;
                    return (
                      <li key={item.name}>
                        <Link
                          href={item.href}
                          className={cn(
                            "group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold transition-colors",
                            isActive
                              ? "bg-purple-600 text-white"
                              : "text-gray-300 hover:text-white hover:bg-gray-800"
                          )}
                        >
                          <item.icon className="h-6 w-6 shrink-0" />
                          {item.name}
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </li>
              <li className="mt-auto">
                <SignedIn>
                  {/* User Profile Section */}
                  <div className="relative mb-4">
                    <button
                      onClick={() => setShowUserMenu(!showUserMenu)}
                      className="w-full rounded-lg bg-gray-800 p-4 hover:bg-gray-700 transition-colors"
                    >
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 rounded-full bg-purple-600 flex items-center justify-center">
                          {user?.imageUrl ? (
                            <Image
                              src={user.imageUrl}
                              alt="Profile"
                              width={40}
                              height={40}
                              className="w-10 h-10 rounded-full"
                            />
                          ) : (
                            <User className="h-5 w-5 text-white" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0 text-left">
                          <p className="text-sm font-medium text-white truncate">
                            {user?.firstName || "User"}
                          </p>
                          <p className="text-xs text-gray-400 truncate">
                            {user?.emailAddresses[0]?.emailAddress || "Email"}
                          </p>
                        </div>
                      </div>
                    </button>

                    {/* User Menu Dropdown */}
                    {showUserMenu && (
                      <div className="absolute bottom-full left-0 right-0 mb-2 bg-gray-800 rounded-lg border border-gray-700 shadow-lg">
                        <div className="py-2">
                          <Link href="/user-profile">
                            <button
                              onClick={() => setShowUserMenu(false)}
                              className="w-full flex items-center px-4 py-2 text-sm text-gray-300 hover:text-white hover:bg-gray-700"
                            >
                              <Settings className="h-4 w-4 mr-3" />
                              Profile Settings
                            </button>
                          </Link>
                          <button
                            onClick={() => {
                              setShowUserMenu(false);
                              signOut();
                            }}
                            className="w-full flex items-center px-4 py-2 text-sm text-gray-300 hover:text-white hover:bg-gray-700"
                          >
                            <LogOut className="h-4 w-4 mr-3" />
                            Sign Out
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </SignedIn>

                <SignedOut>
                  {/* Login/Signup buttons for unauthenticated users */}
                  <div className="space-y-2">
                    <Link href="/login">
                      <Button className="w-full bg-purple-600 hover:bg-purple-700 text-white">
                        Sign In
                      </Button>
                    </Link>
                    <Link href="/sign-up">
                      <Button
                        variant="outline"
                        className="w-full border-gray-600 text-gray-300 hover:text-white hover:bg-gray-800"
                      >
                        Sign Up
                      </Button>
                    </Link>
                  </div>
                </SignedOut>

                <div className="rounded-lg bg-gray-800 p-4">
                  <div className="flex items-center space-x-3">
                    <div className="rounded-full bg-purple-600 p-2">
                      <Headphones className="h-4 w-4 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-white">Premium</p>
                      <p className="text-xs text-gray-400">
                        Upgrade for better quality
                      </p>
                    </div>
                  </div>
                </div>
              </li>
            </ul>
          </nav>
        </div>
      </nav>

      {/* Mobile Navbar */}
      <div className="lg:hidden">
        <div className="flex items-center justify-between bg-gray-900 px-4 py-2">
          <Link href="/" className="flex items-center space-x-2">
            <div className="rounded-lg bg-purple-600 p-2">
              <Music className="h-5 w-5 text-white" />
            </div>
            <span className="text-lg font-bold text-white">SangeetX</span>
          </Link>

          <div className="flex items-center space-x-2">
            <SignedIn>
              {user?.imageUrl ? (
                <Image
                  src={user.imageUrl}
                  alt="Profile"
                  width={32}
                  height={32}
                  className="w-8 h-8 rounded-full"
                />
              ) : (
                <div className="w-8 h-8 rounded-full bg-purple-600 flex items-center justify-center">
                  <User className="h-4 w-4 text-white" />
                </div>
              )}
            </SignedIn>

            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsOpen(!isOpen)}
              className="text-white hover:bg-gray-800"
            >
              {isOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </Button>
          </div>
        </div>

        {isOpen && (
          <div className="fixed inset-0 z-50 bg-gray-900 lg:hidden">
            <div className="flex items-center justify-between px-4 py-2 border-b border-gray-800">
              <Link href="/" className="flex items-center space-x-2">
                <div className="rounded-lg bg-purple-600 p-2">
                  <Music className="h-5 w-5 text-white" />
                </div>
                <span className="text-lg font-bold text-white">SangeetX</span>
              </Link>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsOpen(false)}
                className="text-white hover:bg-gray-800"
              >
                <X className="h-6 w-6" />
              </Button>
            </div>
            <nav className="px-4 py-6">
              <ul className="space-y-4">
                {currentNavigation.map((item) => {
                  const isActive = item.isActive || pathname === item.href;
                  return (
                    <li key={item.name}>
                      <Link
                        href={item.href}
                        onClick={() => setIsOpen(false)}
                        className={cn(
                          "group flex gap-x-3 rounded-md p-3 text-base leading-6 font-semibold transition-colors",
                          isActive
                            ? "bg-purple-600 text-white"
                            : "text-gray-300 hover:text-white hover:bg-gray-800"
                        )}
                      >
                        <item.icon className="h-6 w-6 shrink-0" />
                        {item.name}
                      </Link>
                    </li>
                  );
                })}
              </ul>

              {/* Mobile Auth Section */}
              <div className="mt-8 pt-6 border-t border-gray-800">
                <SignedIn>
                  <div className="space-y-4">
                    <div className="flex items-center space-x-3 px-3">
                      {user?.imageUrl ? (
                        <Image
                          src={user.imageUrl}
                          alt="Profile"
                          width={40}
                          height={40}
                          className="w-10 h-10 rounded-full"
                        />
                      ) : (
                        <div className="w-10 h-10 rounded-full bg-purple-600 flex items-center justify-center">
                          <User className="h-5 w-5 text-white" />
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-white truncate">
                          {user?.firstName || "User"}
                        </p>
                        <p className="text-xs text-gray-400 truncate">
                          {user?.emailAddresses[0]?.emailAddress || "Email"}
                        </p>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Link href="/user-profile">
                        <button
                          onClick={() => setIsOpen(false)}
                          className="w-full flex items-center gap-x-3 rounded-md p-3 text-base leading-6 font-semibold text-gray-300 hover:text-white hover:bg-gray-800"
                        >
                          <Settings className="h-6 w-6 shrink-0" />
                          Profile Settings
                        </button>
                      </Link>
                      <button
                        onClick={() => {
                          setIsOpen(false);
                          signOut();
                        }}
                        className="w-full flex items-center gap-x-3 rounded-md p-3 text-base leading-6 font-semibold text-gray-300 hover:text-white hover:bg-gray-800"
                      >
                        <LogOut className="h-6 w-6 shrink-0" />
                        Sign Out
                      </button>
                    </div>
                  </div>
                </SignedIn>

                <SignedOut>
                  <div className="space-y-2">
                    <Link href="/login" onClick={() => setIsOpen(false)}>
                      <Button className="w-full bg-purple-600 hover:bg-purple-700 text-white">
                        Sign In
                      </Button>
                    </Link>
                    <Link href="/sign-up" onClick={() => setIsOpen(false)}>
                      <Button
                        variant="outline"
                        className="w-full border-gray-600 text-gray-300 hover:text-white hover:bg-gray-800"
                      >
                        Sign Up
                      </Button>
                    </Link>
                  </div>
                </SignedOut>
              </div>
            </nav>
          </div>
        )}
      </div>
    </>
  );
}
