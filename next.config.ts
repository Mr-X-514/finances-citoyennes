import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  ...(process.env.FINANCES_STATIC_EXPORT === "1"
    ? {
        output: "export",
        basePath: process.env.NEXT_PUBLIC_BASE_PATH || "",
        trailingSlash: true,
        images: { unoptimized: true },
      }
    : {}),
};

export default nextConfig;
