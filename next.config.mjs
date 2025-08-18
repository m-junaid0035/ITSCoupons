/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**', // allows any hostname
      },
      {
        protocol: 'http',
        hostname: '**', // allows any hostname
      },
    ],
    // OR simpler but less recommended:
    // domains: [], // leaving empty might allow some external URLs
  },
};

export default nextConfig;
