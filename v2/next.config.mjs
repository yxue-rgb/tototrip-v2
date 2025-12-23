/** @type {import('next').NextConfig} */

const nextConfig = {
  reactStrictMode: false, // Disabled due to Leaflet map initialization issues
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
    ],
  },
};

export default nextConfig;
