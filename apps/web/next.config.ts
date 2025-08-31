import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  images: {
    // Allow images served from local MinIO (127.0.0.1:9000 / localhost:9000)
    remotePatterns: [
      {
        protocol: 'http',
        hostname: '127.0.0.1',
        port: '9000',
        pathname: '/**',
      },
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '9000',
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;
