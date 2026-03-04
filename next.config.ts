import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      new URL("https://res.cloudinary.com/**"), // Example for Cloudinary
      {
        protocol: "http",
        hostname: "res.cloudinary.com",
        pathname: "/**",
      },
    ],
  },
  eslint: {
    ignoreDuringBuilds: true,
  },

  compiler: {
    removeConsole: process.env.NODE_ENV === "production",
  },

  // ✅ Ignore TypeScript errors during build
};

/* config options here */

export default nextConfig;
