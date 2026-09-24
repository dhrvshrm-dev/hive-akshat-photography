/** @type {import('next').NextConfig} */
const nextConfig = {
  // So a production build can be run without trampling the .next directory a
  // dev server is live on: NEXT_DIST_DIR=.next-build npx next build
  distDir: process.env.NEXT_DIST_DIR || ".next",
  images: {
    // Sample photos are pulled from picsum.photos so the site looks real out of the box.
    // When you add your own photos to /public/images, you can remove this block.
    remotePatterns: [
      { protocol: "https", hostname: "picsum.photos" },
      { protocol: "https", hostname: "fastly.picsum.photos" },
    ],
  },
};

module.exports = nextConfig;
