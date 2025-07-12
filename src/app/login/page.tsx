"use client";

import React from "react";
import { SignIn } from "@clerk/nextjs";
import { Card, CardContent } from "@/components/ui/card";
import { Music, ArrowLeft, Shield, Zap, Users } from "lucide-react";
import Link from "next/link";

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
      {/* Animated Background Effects */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl animate-pulse"></div>
        <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl animate-pulse delay-1000"></div>
        <div className="absolute bottom-1/4 left-1/2 w-96 h-96 bg-cyan-500 rounded-full mix-blend-multiply filter blur-xl animate-pulse delay-2000"></div>
      </div>

      <div className="relative w-full max-w-6xl grid lg:grid-cols-2 gap-8 items-center">
        {/* Left Side - Welcome Back */}
        <div className="text-white space-y-8 lg:pr-8">
          {/* Back to Home */}
          <Link
            href="/landing"
            className="inline-flex items-center space-x-2 text-purple-300 hover:text-white transition-colors group"
          >
            <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
            <span>Back to Home</span>
          </Link>

          {/* Brand */}
          <div className="flex items-center space-x-3">
            <div className="relative">
              <Music className="h-10 w-10 text-purple-400" />
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-pink-500 rounded-full animate-ping"></div>
            </div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              SangeetX
            </h1>
          </div>

          {/* Welcome Message */}
          <div className="space-y-4">
            <h2 className="text-4xl lg:text-5xl font-bold leading-tight">
              Welcome Back to
              <br />
              <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                Your Music
              </span>
            </h2>
            <p className="text-xl text-gray-300 leading-relaxed">
              Sign in to continue your musical journey. Access your playlists,
              discover new tracks, and enjoy unlimited streaming.
            </p>
          </div>

          {/* Features */}
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <div className="flex-shrink-0 w-8 h-8 bg-purple-500/20 rounded-lg flex items-center justify-center">
                <Shield className="h-4 w-4 text-purple-400" />
              </div>
              <span className="text-gray-300">Secure & Private</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="flex-shrink-0 w-8 h-8 bg-pink-500/20 rounded-lg flex items-center justify-center">
                <Zap className="h-4 w-4 text-pink-400" />
              </div>
              <span className="text-gray-300">Lightning Fast</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="flex-shrink-0 w-8 h-8 bg-cyan-500/20 rounded-lg flex items-center justify-center">
                <Users className="h-4 w-4 text-cyan-400" />
              </div>
              <span className="text-gray-300">Community Driven</span>
            </div>
          </div>

          {/* Social Proof */}
          <div className="pt-8 border-t border-gray-700">
            <p className="text-gray-400 text-sm">
              Join over{" "}
              <span className="text-purple-400 font-semibold">10,000+</span>{" "}
              music lovers already using SangeetX
            </p>
            <div className="flex items-center space-x-2 mt-3">
              <div className="flex -space-x-2">
                {[1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className="w-8 h-8 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full border-2 border-slate-900"
                  />
                ))}
              </div>
              <span className="text-gray-400 text-sm">and many more...</span>
            </div>
          </div>
        </div>

        {/* Right Side - Sign In Form */}
        <div className="flex flex-col items-center justify-center">
          <Card className="w-full max-w-md bg-white/10 backdrop-blur-lg border-white/20 shadow-2xl">
            <CardContent className="p-8">
              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold text-white mb-2">Sign In</h3>
                <p className="text-gray-300">
                  Enter your credentials to access your account
                </p>
              </div>

              {/* Clerk Sign In Component */}
              <div className="flex justify-center">
                <SignIn
                  appearance={{
                    elements: {
                      rootBox: "w-full",
                      card: "bg-transparent shadow-none",
                      headerTitle: "hidden",
                      headerSubtitle: "hidden",
                      socialButtonsBlockButton:
                        "bg-white/10 border-white/20 text-white hover:bg-white/20",
                      formButtonPrimary:
                        "bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700",
                      formFieldInput:
                        "bg-white/10 border-white/20 text-white placeholder:text-gray-400",
                      formFieldLabel: "text-gray-300",
                      dividerLine: "bg-white/20",
                      dividerText: "text-gray-400",
                      footerActionLink: "text-purple-400 hover:text-purple-300",
                      identityPreviewText: "text-white",
                      formResendCodeLink:
                        "text-purple-400 hover:text-purple-300",
                    },
                  }}
                  redirectUrl="/"
                />
              </div>

              <div className="mt-6 text-center">
                <p className="text-gray-400 text-sm">
                  Don&apos;t have an account?{" "}
                  <Link
                    href="/sign-up"
                    className="text-purple-400 hover:text-purple-300 font-medium"
                  >
                    Sign up here
                  </Link>
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Terms */}
          <p className="text-gray-400 text-xs mt-6 text-center max-w-md">
            By signing in, you agree to our{" "}
            <Link href="#" className="text-purple-400 hover:text-purple-300">
              Terms of Service
            </Link>{" "}
            and{" "}
            <Link href="#" className="text-purple-400 hover:text-purple-300">
              Privacy Policy
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
