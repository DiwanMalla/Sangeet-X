"use client";

import React, { useState, useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { Shield, AlertTriangle } from "lucide-react";

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

export default function AdminAuth({ children }: AdminAuthProps) {
  const { user, isLoaded } = useUser();
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  // Inject custom styles
  useEffect(() => {
    const styleElement = document.createElement("style");
    styleElement.textContent = styles;
    document.head.appendChild(styleElement);

    return () => {
      document.head.removeChild(styleElement);
    };
  }, []);

  // Check admin status when user is loaded
  useEffect(() => {
    const checkAdminStatus = async () => {
      if (!isLoaded) return;

      if (!user) {
        setIsAdmin(false);
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        const response = await fetch("/api/users/admin-status", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (response.ok) {
          const data = await response.json();
          setIsAdmin(data.isAdmin);
        } else {
          setIsAdmin(false);
          setError("Failed to verify admin status");
        }
      } catch (error) {
        console.error("Error checking admin status:", error);
        setIsAdmin(false);
        setError("Error verifying admin access");
      } finally {
        setIsLoading(false);
      }
    };

    checkAdminStatus();
  }, [user, isLoaded]);

  // Loading state
  if (!isLoaded || isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-indigo-900 to-blue-900 flex items-center justify-center">
        <div className="text-center">
          <div className="relative w-20 h-20 mx-auto mb-6">
            <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full blur-md opacity-60 animate-spin-slow"></div>
            <div className="relative w-full h-full bg-gradient-to-br from-purple-600 to-blue-600 rounded-full flex items-center justify-center shadow-2xl">
              <Shield className="w-10 h-10 text-white" />
            </div>
          </div>
          <h2 className="text-xl text-white font-semibold mb-2">
            Verifying Access
          </h2>
          <p className="text-gray-300">Checking admin permissions...</p>
        </div>
      </div>
    );
  }

  // Not logged in
  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-indigo-900 to-blue-900 flex items-center justify-center p-4">
        <div className="text-center max-w-md">
          <div className="relative w-20 h-20 mx-auto mb-6">
            <div className="absolute inset-0 bg-gradient-to-r from-red-500 to-orange-500 rounded-full blur-md opacity-60"></div>
            <div className="relative w-full h-full bg-gradient-to-br from-red-600 to-orange-600 rounded-full flex items-center justify-center shadow-2xl">
              <AlertTriangle className="w-10 h-10 text-white" />
            </div>
          </div>
          <h2 className="text-2xl text-white font-bold mb-4">
            Authentication Required
          </h2>
          <p className="text-gray-300 mb-6">
            You must be logged in to access the admin panel.
          </p>
          <Button
            onClick={() => (window.location.href = "/login")}
            className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-8 py-3 rounded-xl transition-all duration-300 transform hover:scale-105"
          >
            Go to Login
          </Button>
        </div>
      </div>
    );
  }

  // Not admin
  if (isAdmin === false) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-indigo-900 to-blue-900 flex items-center justify-center p-4">
        <div className="text-center max-w-md">
          <div className="relative w-20 h-20 mx-auto mb-6">
            <div className="absolute inset-0 bg-gradient-to-r from-red-500 to-orange-500 rounded-full blur-md opacity-60"></div>
            <div className="relative w-full h-full bg-gradient-to-br from-red-600 to-orange-600 rounded-full flex items-center justify-center shadow-2xl">
              <AlertTriangle className="w-10 h-10 text-white" />
            </div>
          </div>
          <h2 className="text-2xl text-white font-bold mb-4">Access Denied</h2>
          <p className="text-gray-300 mb-2">
            You don&apos;t have admin privileges.
          </p>
          <p className="text-gray-400 text-sm mb-6">
            Contact an administrator if you believe this is an error.
          </p>
          {error && (
            <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4 mb-6">
              <p className="text-red-300 text-sm">{error}</p>
            </div>
          )}
          <Button
            onClick={() => (window.location.href = "/")}
            className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-8 py-3 rounded-xl transition-all duration-300 transform hover:scale-105"
          >
            Return to Home
          </Button>
        </div>
      </div>
    );
  }

  // Render authenticated content
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">{children}</div>
  );
}
