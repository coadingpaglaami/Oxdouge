import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
        port: "",
        pathname: "/**", // allow all paths
      },
    ],
  },
  eslint: {
    ignoreDuringBuilds: true,
  },

  // ✅ Ignore TypeScript errors during builds
  typescript: {
    ignoreBuildErrors: true,
  },
};

/* config options here */

export default nextConfig;
