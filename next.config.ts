import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: "/dashboard",
        destination: "/collection",
        permanent: false,
      },
    ];
  },
};

export default nextConfig;
