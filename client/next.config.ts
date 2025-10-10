import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.prod.website-files.com",
        pathname: "/5e51c674258ffe10d286d30a/5e532a5133d3686ff53d2a74_peep-2.png"
      }
    ]
  }
};

export default nextConfig;
