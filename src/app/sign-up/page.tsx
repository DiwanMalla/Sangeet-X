"use client";

import React from "react";
import { SignUp } from "@clerk/nextjs";
import { Card, CardContent } from "@/components/ui/card";
import {
  Music,
  ArrowLeft,
  Users,
  Shield,
  Zap,
  Headphones,
  Play,
  Heart,
} from "lucide-react";
import Link from "next/link";

export default function SignUpPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
      {/* Custom CSS for Clerk components */}
      <style jsx global>{`
        .cl-footerAction,
        .cl-footerActionText,
        .cl-footerActionLink,
        .cl-footer,
        .cl-footerPages,
        .cl-footerPageLink,
        .cl-footerText {
          color: rgb(196 181 253) !important; /* purple-200 */
        }

        .cl-footerActionLink:hover,
        .cl-footerPageLink:hover {
          color: rgb(255 255 255) !important; /* white */
        }

        .cl-footerPages a {
          color: rgb(196 181 253) !important; /* purple-200 */
        }

        .cl-footerPages a:hover {
          color: rgb(255 255 255) !important; /* white */
        }
      `}</style>
      {/* Animated Background Effects */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl animate-pulse"></div>
        <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl animate-pulse delay-1000"></div>
        <div className="absolute bottom-1/4 left-1/2 w-96 h-96 bg-cyan-500 rounded-full mix-blend-multiply filter blur-xl animate-pulse delay-2000"></div>
      </div>

      {/* Floating Music Icons */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-20 left-20 animate-bounce delay-1000">
          <Headphones className="w-8 h-8 text-purple-400 opacity-60" />
        </div>
        <div className="absolute top-32 right-32 animate-bounce delay-2000">
          <Play className="w-6 h-6 text-pink-400 opacity-60" />
        </div>
        <div className="absolute bottom-32 left-32 animate-bounce delay-3000">
          <Heart className="w-7 h-7 text-cyan-400 opacity-60" />
        </div>
        <div className="absolute bottom-20 right-20 animate-bounce">
          <Music className="w-9 h-9 text-purple-300 opacity-60" />
        </div>
      </div>

      <div className="relative w-full max-w-6xl grid lg:grid-cols-2 gap-8 items-center">
        {/* Left Side - Benefits */}
        <div className="hidden lg:block space-y-8 pl-8">
          <div className="space-y-6">
            <div className="flex items-center space-x-4">
              <div className="w-20 h-20 bg-gradient-to-r from-purple-500 to-pink-500 rounded-3xl flex items-center justify-center shadow-2xl">
                <Music className="w-10 h-10 text-white" />
              </div>
              <div>
                <h1 className="text-6xl font-bold text-white">SangeetX</h1>
                <p className="text-xl text-purple-300">Join the Revolution</p>
              </div>
            </div>

            <div className="space-y-4 text-white/90">
              <h2 className="text-3xl font-semibold">
                Start Your Musical Journey
              </h2>
              <p className="text-lg leading-relaxed text-purple-200">
                Join millions of music lovers and discover your new favorite
                songs. Create playlists, follow artists, and enjoy high-quality
                audio streaming.
              </p>
            </div>

            {/* Features */}
            <div className="space-y-6">
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-purple-500/20 rounded-xl flex items-center justify-center">
                  <Users className="w-6 h-6 text-purple-400" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-white mb-2">
                    Connect with Artists
                  </h3>
                  <p className="text-purple-200">
                    Follow your favorite artists and get notified about new
                    releases and exclusive content.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-pink-500/20 rounded-xl flex items-center justify-center">
                  <Shield className="w-6 h-6 text-pink-400" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-white mb-2">
                    Secure & Private
                  </h3>
                  <p className="text-purple-200">
                    Your data is protected with industry-standard security
                    measures. Your privacy is our priority.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-cyan-500/20 rounded-xl flex items-center justify-center">
                  <Zap className="w-6 h-6 text-cyan-400" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-white mb-2">
                    Lightning Fast
                  </h3>
                  <p className="text-purple-200">
                    Experience instant music playback with our optimized
                    streaming technology.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Sign Up Form */}
        <div className="w-full max-w-md mx-auto lg:mx-0">
          {/* Back Button */}
          <div className="mb-6">
            <Link
              href="/landing"
              className="inline-flex items-center space-x-2 text-purple-300 hover:text-white transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to home</span>
            </Link>
          </div>

          <Card className="bg-white/10 backdrop-blur-md border-white/20 shadow-2xl">
            <CardContent className="p-8">
              {/* Mobile Title */}
              <div className="text-center mb-8 lg:hidden">
                <div className="flex items-center justify-center space-x-3 mb-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center">
                    <Music className="w-6 h-6 text-white" />
                  </div>
                  <h1 className="text-3xl font-bold text-white">SangeetX</h1>
                </div>
                <p className="text-purple-300">
                  Create your account to get started
                </p>
              </div>

              {/* Desktop Title */}
              <div className="text-center mb-8 hidden lg:block">
                <h1 className="text-3xl font-bold text-white mb-2">
                  Create Account
                </h1>
                <p className="text-purple-300">
                  Join the music revolution today
                </p>
              </div>

              {/* Clerk Sign Up Component */}
              <div className="flex justify-center">
                <SignUp
                  appearance={{
                    elements: {
                      formButtonPrimary:
                        "bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-semibold rounded-lg transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/25",
                      card: "bg-transparent shadow-none",
                      headerTitle: "text-white text-2xl font-bold",
                      headerSubtitle: "text-purple-300",
                      socialButtonsBlockButton:
                        "border-white/20 text-white hover:bg-white/10 transition-all duration-200",
                      socialButtonsBlockButtonText: "text-white font-medium",
                      formFieldInput:
                        "bg-white/10 border-white/20 text-white placeholder-purple-300 focus:border-purple-500 focus:ring-purple-500 rounded-lg",
                      formFieldLabel: "text-white font-medium",
                      footerActionLink:
                        "text-purple-300 hover:text-white transition-colors !important",
                      footerActionText:
                        "text-purple-200 font-medium !important",
                      footerAction: "text-purple-200 !important",
                      dividerLine: "bg-white/20",
                      dividerText: "text-purple-300",
                      formFieldInputShowPasswordButton:
                        "text-purple-400 hover:text-white",
                      identityPreviewText: "text-white",
                      identityPreviewEditButton:
                        "text-purple-300 hover:text-white",
                      footer: "text-purple-200 !important",
                      footerPages: "text-purple-200 !important",
                      footerPageLink:
                        "text-purple-300 hover:text-white !important",
                      footerText: "text-purple-200 !important",
                      modalCloseButton: "text-white",
                      alternativeMethodsBlockButton:
                        "text-purple-300 hover:text-white",
                      alternativeMethodsBlockButtonText: "text-purple-300",
                      userButtonPopoverText: "text-purple-200",
                      userButtonPopoverActionButton:
                        "text-purple-300 hover:text-white",
                    },
                    layout: {
                      socialButtonsVariant: "blockButton",
                      socialButtonsPlacement: "top",
                    },
                  }}
                  redirectUrl="/"
                />
              </div>

              {/* Features */}
              <div className="mt-8 pt-6 border-t border-white/10">
                <div className="grid grid-cols-2 gap-4 text-center">
                  <div className="text-center">
                    <div className="w-12 h-12 bg-purple-500/20 rounded-xl mx-auto mb-2 flex items-center justify-center">
                      <Users className="w-6 h-6 text-purple-400" />
                    </div>
                    <p className="text-sm text-purple-200">Connect</p>
                  </div>
                  <div className="text-center">
                    <div className="w-12 h-12 bg-pink-500/20 rounded-xl mx-auto mb-2 flex items-center justify-center">
                      <Shield className="w-6 h-6 text-pink-400" />
                    </div>
                    <p className="text-sm text-purple-200">Secure</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
