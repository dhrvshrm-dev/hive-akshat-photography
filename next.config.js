/** @type {import('next').NextConfig} */
const nextConfig = {
  // So a production build can be run without trampling the .next directory a
  // dev server is live on: NEXT_DIST_DIR=.next-build npx next build
  distDir: process.env.NEXT_DIST_DIR || ".next",
  images: {
    formats: ["image/webp"],
    // YouTube thumbnails for the films section, once real video IDs are added.
    remotePatterns: [{ protocol: "https", hostname: "i.ytimg.com" }],
  },
  async redirects() {
    // The portfolio used to live at /work.
    return [{ source: "/work", destination: "/journeys", permanent: true }];
  },
};

module.exports = nextConfig;
