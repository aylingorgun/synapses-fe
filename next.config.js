/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  compiler: {
    removeConsole: process.env.NEXT_PUBLIC_NODE_ENV === "test",
  },
  // Empty turbopack config to silence the warning
  // CSV files are fetched at runtime from public folder, no special loader needed
  turbopack: {},
};

module.exports = nextConfig;
