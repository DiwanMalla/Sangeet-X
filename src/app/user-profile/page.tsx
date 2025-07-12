"use client";

import React from "react";
import { UserProfile } from "@clerk/nextjs";
import { Card, CardContent } from "@/components/ui/card";
import { Music, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function UserProfilePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-4">
      {/* Background Effects */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl animate-pulse"></div>
        <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl animate-pulse delay-1000"></div>
        <div className="absolute bottom-1/4 left-1/2 w-96 h-96 bg-cyan-500 rounded-full mix-blend-multiply filter blur-xl animate-pulse delay-2000"></div>
      </div>

      <div className="relative max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/library"
            className="inline-flex items-center text-purple-300 hover:text-white transition-colors mb-6 group"
          >
            <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
            Back to Library
          </Link>

          <div className="flex items-center space-x-4 mb-6">
            <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center shadow-lg">
              <Music className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-white">
                Account Settings
              </h1>
              <p className="text-purple-300">
                Manage your SangeetX profile and preferences
              </p>
            </div>
          </div>
        </div>

        {/* Profile Content */}
        <Card className="bg-white/10 backdrop-blur-md border-white/20 shadow-2xl">
          <CardContent className="p-8">
            <UserProfile
              appearance={{
                elements: {
                  card: "bg-transparent shadow-none",
                  navbar: "bg-gray-800/50 border-white/20",
                  navbarButton:
                    "text-gray-300 hover:text-white hover:bg-gray-700/50",
                  navbarButtonActive: "bg-purple-600 text-white",
                  headerTitle: "text-white text-2xl font-bold",
                  headerSubtitle: "text-purple-300",
                  formButtonPrimary:
                    "bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-semibold rounded-lg transition-all duration-300",
                  formFieldInput:
                    "bg-white/10 border-white/20 text-white placeholder-purple-300 focus:border-purple-500 focus:ring-purple-500 rounded-lg",
                  formFieldLabel: "text-white font-medium",
                  accordionTriggerButton: "text-white hover:text-purple-300",
                  accordionContent: "text-gray-300",
                  badge: "bg-purple-600 text-white",
                  identityPreviewText: "text-white",
                  identityPreviewEditButton: "text-purple-300 hover:text-white",
                },
              }}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
