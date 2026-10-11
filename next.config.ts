import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      // YouTube channel avatars (Data API and Holodex).
      new URL("https://yt3.ggpht.com/**"),
      new URL("https://yt3.googleusercontent.com/**"),
      // YouTube video thumbnails.
      new URL("https://i.ytimg.com/vi/**"),
    ],
  },
};

export default nextConfig;
