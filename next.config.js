/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  compiler: {
    removeConsole: process.env.NEXT_PUBLIC_NODE_ENV === "test",
  },
};

module.exports = nextConfig;