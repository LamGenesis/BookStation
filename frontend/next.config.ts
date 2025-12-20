import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'standalone',
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'localhost',
        port: '7076',
        pathname: '/**',
      },
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '5074',
        pathname: '/**',
      },
    ],
    unoptimized: true, // Disable image optimization for development
  },
  // Disable strict mode temporarily for development
  reactStrictMode: true,
};

export default nextConfig;
