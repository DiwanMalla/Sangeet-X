"use client";

import { useState } from "react";
import { useUser } from "@clerk/nextjs";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Card } from "../../components/ui/card";
import { Shield, CheckCircle, AlertCircle } from "lucide-react";

export default function AdminSetupPage() {
  const { user } = useUser();
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleSetAdmin = async () => {
    if (!email) {
      setError("Please enter an email address");
      return;
    }

    setIsLoading(true);
    setError("");
    setMessage("");

    try {
      const response = await fetch("/api/users/set-admin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, isAdmin: true }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage(`Successfully set ${email} as admin!`);
        setEmail("");
      } else {
        setError(data.error || "Failed to set admin status");
      }
    } catch (err) {
      console.error("Error setting admin:", err);
      setError("An error occurred while setting admin status");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-indigo-900 to-blue-900 flex items-center justify-center p-4">
      <Card className="w-full max-w-md p-8 bg-white/10 backdrop-blur-xl border border-white/20">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-br from-purple-600 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <Shield className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-white mb-2">Admin Setup</h1>
          <p className="text-gray-300 text-sm">
            Set admin privileges for SangeetX
          </p>
        </div>

        <div className="space-y-6">
          {user && (
            <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
              <p className="text-blue-300 text-sm">
                Currently logged in as:{" "}
                <strong>{user.emailAddresses[0]?.emailAddress}</strong>
              </p>
            </div>
          )}

          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-300 mb-2"
            >
              Email Address to Make Admin
            </label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="malladipin@gmail.com"
              className="bg-white/5 border-white/20 text-white placeholder-gray-400"
              disabled={isLoading}
            />
          </div>

          {error && (
            <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4 flex items-center">
              <AlertCircle className="w-5 h-5 text-red-400 mr-3" />
              <p className="text-red-300 text-sm">{error}</p>
            </div>
          )}

          {message && (
            <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4 flex items-center">
              <CheckCircle className="w-5 h-5 text-green-400 mr-3" />
              <p className="text-green-300 text-sm">{message}</p>
            </div>
          )}

          <Button
            onClick={handleSetAdmin}
            disabled={isLoading || !email}
            className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white"
          >
            {isLoading ? "Setting Admin..." : "Set as Admin"}
          </Button>

          <div className="text-center">
            <p className="text-xs text-gray-400">
              This will grant admin access to the specified email address
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
}
