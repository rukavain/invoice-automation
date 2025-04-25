import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "easemart.ph",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
