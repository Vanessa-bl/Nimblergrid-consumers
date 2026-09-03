import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  agentRules: false,
  images: {
    unoptimized: true,
    remotePatterns: [
      { protocol: "https", hostname: "images.prismic.io" },
      { protocol: "https", hostname: "prismic.io" },
      { protocol: "https", hostname: "ik.imagekit.io" },
      { protocol: "https", hostname: "images.unsplash.com" },
    ],
  },
};

export default nextConfig;
