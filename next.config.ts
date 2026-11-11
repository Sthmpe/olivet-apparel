import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  cacheComponents: true,
  partialPrefetching: true,
  experimental: {
    serverActions: {
      // Booking requests can carry up to 3 inspiration photos, compressed in the browser.
      bodySizeLimit: "4mb",
    },
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
    // Earlier URL names, kept working for links already shared.
    return [
      { source: "/collections", destination: "/styles", permanent: true },
      { source: "/collections/gilded-vows", destination: "/styles/bridal", permanent: true },
      { source: "/collections/owambe-royale", destination: "/styles/owambe", permanent: true },
      { source: "/collections/after-dark", destination: "/styles/evening", permanent: true },
      { source: "/collections/everyday-couture", destination: "/styles/everyday", permanent: true },
      { source: "/atelier", destination: "/about", permanent: true },
    ];
  },
};

export default nextConfig;
