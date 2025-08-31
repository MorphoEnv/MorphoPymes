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
  eslint: { ignoreDuringBuilds: true },
  env: {
    NEXT_PUBLIC_THIRDWEB_CLIENT_ID: process.env.NEXT_PUBLIC_THIRDWEB_CLIENT_ID,
    NEXT_PUBLIC_CHAIN_ID: process.env.NEXT_PUBLIC_CHAIN_ID,
    NEXT_PUBLIC_BASE_SEPOLIA_RPC_URL: process.env.NEXT_PUBLIC_BASE_SEPOLIA_RPC_URL,
    NEXT_PUBLIC_MANAGER_CONTRACT_ADDRESS: process.env.NEXT_PUBLIC_MANAGER_CONTRACT_ADDRESS,
    NEXT_PUBLIC_MOPY_TOKEN_ADDRESS: process.env.NEXT_PUBLIC_MOPY_TOKEN_ADDRESS,
  },
};

export default nextConfig;
