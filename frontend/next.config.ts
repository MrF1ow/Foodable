import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: ["www.kroger.com"],
  },
  experimental: {
    serverActions: {
      bodySizeLimit: '5mb',
    },
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
