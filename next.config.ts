import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  cacheComponents: true,
  partialPrefetching: true,
  experimental: {
    serverActions: {
      // Studio uploads and inspiration photos are compressed in the browser first.
      bodySizeLimit: "4mb",
    },
  },
  images: {
    // Portfolio photos are stored in Vercel Blob.
    remotePatterns: [{ protocol: "https", hostname: "*.public.blob.vercel-storage.com" }],
  },
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
  async redirects() {
    // Earlier URLs, kept working for links already shared.
    return [
      { source: "/collections/:path*", destination: "/portfolio", permanent: true },
      { source: "/styles/:path*", destination: "/portfolio", permanent: true },
      { source: "/looks/:path*", destination: "/portfolio", permanent: true },
      { source: "/style-finder", destination: "/portfolio", permanent: true },
      { source: "/atelier", destination: "/about", permanent: true },
    ];
  },
};

export default nextConfig;
