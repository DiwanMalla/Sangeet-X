"use client";

import React, { useState } from "react";
import Link from "next/link";
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
} from "lucide-react";
import { Button } from "@/components/ui/button";

const navigation = [
  { name: "Home", href: "/", icon: Home },
  { name: "Search", href: "/search", icon: Search },
  { name: "Your Library", href: "/library", icon: Library },
  { name: "Liked Songs", href: "/liked", icon: Heart },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

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
                  {navigation.map((item) => {
                    const isActive = pathname === item.href;
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
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsOpen(!isOpen)}
            className="text-white hover:bg-gray-800"
          >
            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </Button>
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
                {navigation.map((item) => {
                  const isActive = pathname === item.href;
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
            </nav>
          </div>
        )}
      </div>
    </>
  );
}
