import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: [
      "images.unsplash.com",
      "cdn.sangeetx.com",
      "localhost",
      "res.cloudinary.com",
      "img.clerk.com",
    ],
    formats: ["image/webp", "image/avif"],
  },
  experimental: {
    optimizePackageImports: ["lucide-react"],
  },
  compress: true,
  poweredByHeader: false,
};

export default nextConfig;
