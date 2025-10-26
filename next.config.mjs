/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  // 👇 important for Netlify deployment
  output: 'standalone',
  // Optional but useful if you use environment variables
  experimental: {
    typedRoutes: true,
  },
};

export default nextConfig;
