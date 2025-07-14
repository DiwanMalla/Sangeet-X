"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Eye, EyeOff, Lock, User } from "lucide-react";

// Custom CSS for animations
const styles = `
  @keyframes grid {
    0% { transform: translate(0, 0); }
    100% { transform: translate(50px, 50px); }
  }
  
  @keyframes spin-slow {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }
  
  @keyframes fade-in {
    from { opacity: 0; transform: translateY(20px); }
    to { opacity: 1; transform: translateY(0); }
  }
  
  @keyframes shake {
    0%, 100% { transform: translateX(0); }
    25% { transform: translateX(-5px); }
    75% { transform: translateX(5px); }
  }
  
  @keyframes float {
    0%, 100% { transform: translateY(0px); }
    50% { transform: translateY(-10px); }
  }
  
  .animate-spin-slow {
    animation: spin-slow 8s linear infinite;
  }
  
  .animate-fade-in {
    animation: fade-in 0.8s ease-out forwards;
  }
  
  .animation-delay-200 {
    animation-delay: 0.2s;
  }
  
  .animation-delay-300 {
    animation-delay: 0.3s;
  }
  
  .animation-delay-500 {
    animation-delay: 0.5s;
  }
  
  .animate-shake {
    animation: shake 0.5s ease-in-out;
  }
  
  .animate-float {
    animation: float 3s ease-in-out infinite;
  }
  
  .perspective-1000 {
    perspective: 1000px;
  }
  
  .transform-gpu {
    transform: translateZ(0);
  }
  
  .hover\\:rotate-y-2:hover {
    transform: rotateY(2deg);
  }
`;

interface AdminAuthProps {
  children: React.ReactNode;
}

const ADMIN_CREDENTIALS = {
  email: "malladipin@gmail.com",
  password: "DiwanMalla@0612",
};

export default function AdminAuth({ children }: AdminAuthProps) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Inject custom styles
  useEffect(() => {
    const styleElement = document.createElement("style");
    styleElement.textContent = styles;
    document.head.appendChild(styleElement);

    return () => {
      document.head.removeChild(styleElement);
    };
  }, []);

  useEffect(() => {
    const authStatus = localStorage.getItem("admin_authenticated");
    const authTime = localStorage.getItem("admin_auth_time");

    if (authStatus === "true" && authTime) {
      const timeDiff = Date.now() - parseInt(authTime);
      const hoursInMs = 24 * 60 * 60 * 1000;

      if (timeDiff < hoursInMs) {
        setIsAuthenticated(true);
      } else {
        localStorage.removeItem("admin_authenticated");
        localStorage.removeItem("admin_auth_time");
      }
    }
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    await new Promise((resolve) => setTimeout(resolve, 500));

    if (
      email === ADMIN_CREDENTIALS.email &&
      password === ADMIN_CREDENTIALS.password
    ) {
      setIsAuthenticated(true);
      localStorage.setItem("admin_authenticated", "true");
      localStorage.setItem("admin_auth_time", Date.now().toString());
      setError("");
    } else {
      setError("Invalid email or password. Please try again.");
    }

    setIsLoading(false);
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen relative overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900 via-indigo-900 to-blue-900">
          {/* Floating Orbs */}
          <div className="absolute top-20 left-10 w-32 h-32 bg-purple-500/20 rounded-full blur-xl animate-pulse"></div>
          <div className="absolute top-40 right-20 w-24 h-24 bg-blue-500/20 rounded-full blur-lg animate-bounce"></div>
          <div className="absolute bottom-20 left-1/4 w-40 h-40 bg-indigo-500/15 rounded-full blur-2xl animate-pulse"></div>
          <div className="absolute bottom-40 right-1/3 w-28 h-28 bg-pink-500/20 rounded-full blur-xl animate-bounce"></div>

          {/* Animated Grid */}
          <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:50px_50px] animate-[grid_20s_linear_infinite]"></div>
        </div>

        {/* Main Container */}
        <div className="relative z-10 min-h-screen flex items-center justify-center p-4">
          <div className="w-full max-w-md">
            {/* 3D Card Container */}
            <div className="relative group perspective-1000">
              {/* Glow Effect */}
              <div className="absolute -inset-4 bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 rounded-3xl blur-xl opacity-30 group-hover:opacity-50 animate-pulse"></div>

              {/* Main Card */}
              <div className="relative bg-white/10 dark:bg-gray-900/20 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 transform-gpu transition-all duration-500 hover:scale-105 hover:rotate-y-2">
                {/* Inner Glow */}
                <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 via-transparent to-blue-500/10 rounded-3xl"></div>

                <div className="relative p-8">
                  {/* Header */}
                  <div className="text-center mb-8">
                    {/* 3D Logo Container */}
                    <div className="relative mx-auto w-20 h-20 mb-6">
                      {/* Outer Glow Ring */}
                      <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full blur-md opacity-60 animate-spin-slow"></div>

                      {/* Main Icon Container */}
                      <div className="relative w-full h-full bg-gradient-to-br from-purple-600 to-blue-600 rounded-full flex items-center justify-center shadow-2xl transform-gpu transition-all duration-300 hover:scale-110 hover:rotate-12">
                        {/* Inner Highlight */}
                        <div className="absolute inset-1 bg-gradient-to-br from-white/20 to-transparent rounded-full"></div>
                        <Lock className="relative w-10 h-10 text-white drop-shadow-lg" />
                      </div>

                      {/* Floating Particles */}
                      <div className="absolute -top-2 -right-2 w-3 h-3 bg-purple-400 rounded-full animate-ping"></div>
                      <div className="absolute -bottom-2 -left-2 w-2 h-2 bg-blue-400 rounded-full animate-ping animation-delay-300"></div>
                    </div>

                    <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent mb-3 animate-fade-in">
                      Admin Access
                    </h1>
                    <p className="text-gray-300 font-medium animate-fade-in animation-delay-200">
                      Welcome to the SangeetX Command Center
                    </p>
                  </div>

                  {/* Login Form */}
                  <form onSubmit={handleLogin} className="space-y-6">
                    {/* Email Input */}
                    <div className="relative group">
                      <label
                        htmlFor="email"
                        className="block text-sm font-medium text-gray-300 mb-3 transition-colors group-focus-within:text-purple-400"
                      >
                        Email Address
                      </label>
                      <div className="relative">
                        {/* Input Glow */}
                        <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl blur opacity-0 group-focus-within:opacity-30 transition-opacity"></div>

                        {/* Input Container */}
                        <div className="relative bg-white/5 border border-white/20 rounded-xl transition-all duration-300 focus-within:border-purple-500/50 focus-within:bg-white/10 hover:bg-white/10">
                          <User className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 group-focus-within:text-purple-400 w-5 h-5 transition-colors" />
                          <Input
                            id="email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Enter your admin email"
                            className="pl-12 pr-4 h-14 bg-transparent border-0 text-white placeholder-gray-400 focus:ring-0 focus:outline-none"
                            required
                            disabled={isLoading}
                          />
                        </div>
                      </div>
                    </div>

                    {/* Password Input */}
                    <div className="relative group">
                      <label
                        htmlFor="password"
                        className="block text-sm font-medium text-gray-300 mb-3 transition-colors group-focus-within:text-purple-400"
                      >
                        Password
                      </label>
                      <div className="relative">
                        {/* Input Glow */}
                        <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl blur opacity-0 group-focus-within:opacity-30 transition-opacity"></div>

                        {/* Input Container */}
                        <div className="relative bg-white/5 border border-white/20 rounded-xl transition-all duration-300 focus-within:border-purple-500/50 focus-within:bg-white/10 hover:bg-white/10">
                          <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 group-focus-within:text-purple-400 w-5 h-5 transition-colors" />
                          <Input
                            id="password"
                            type={showPassword ? "text" : "password"}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Enter your admin password"
                            className="pl-12 pr-16 h-14 bg-transparent border-0 text-white placeholder-gray-400 focus:ring-0 focus:outline-none"
                            required
                            disabled={isLoading}
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-purple-400 transition-colors p-1 rounded-lg hover:bg-white/10"
                            disabled={isLoading}
                          >
                            {showPassword ? (
                              <EyeOff className="w-5 h-5" />
                            ) : (
                              <Eye className="w-5 h-5" />
                            )}
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Error Message */}
                    {error && (
                      <div className="relative overflow-hidden bg-red-500/10 border border-red-500/30 rounded-xl p-4 animate-shake">
                        <div className="absolute inset-0 bg-gradient-to-r from-red-500/5 to-transparent"></div>
                        <p className="relative text-sm text-red-300 flex items-center">
                          <span className="w-2 h-2 bg-red-500 rounded-full mr-3 animate-pulse"></span>
                          {error}
                        </p>
                      </div>
                    )}

                    {/* Submit Button */}
                    <div className="relative group">
                      {/* Button Glow */}
                      <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 rounded-xl blur-lg opacity-70 group-hover:opacity-100 transition-opacity animate-pulse"></div>

                      <Button
                        type="submit"
                        className="relative w-full h-14 bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 hover:from-purple-700 hover:via-pink-700 hover:to-blue-700 text-white font-semibold rounded-xl transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none shadow-xl"
                        disabled={isLoading}
                      >
                        {isLoading ? (
                          <div className="flex items-center justify-center">
                            <div className="relative">
                              <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                              <div className="absolute inset-0 w-6 h-6 border-2 border-transparent border-t-purple-300 rounded-full animate-ping"></div>
                            </div>
                            <span className="ml-3">Authenticating...</span>
                          </div>
                        ) : (
                          <span className="flex items-center justify-center">
                            <Lock className="w-5 h-5 mr-2" />
                            Access Admin Panel
                          </span>
                        )}
                      </Button>
                    </div>
                  </form>

                  {/* Footer */}
                  <div className="mt-8 text-center">
                    <div className="flex items-center justify-center space-x-2 mb-4">
                      <div className="w-8 h-px bg-gradient-to-r from-transparent via-purple-400 to-transparent"></div>
                      <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse"></div>
                      <div className="w-8 h-px bg-gradient-to-r from-transparent via-purple-400 to-transparent"></div>
                    </div>
                    <p className="text-xs text-gray-400 animate-fade-in animation-delay-500">
                      🔒 Secure Access • All activities are monitored
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {children}
    </div>
  );
}
