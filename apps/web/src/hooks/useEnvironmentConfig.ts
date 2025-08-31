// Environment variables hook for client-side access
// This ensures variables are available even if Next.js injection fails

import { useEffect, useState } from 'react';

export interface EnvironmentConfig {
  THIRDWEB_CLIENT_ID: string;
  CHAIN_ID: number;
  BASE_SEPOLIA_RPC_URL: string;
  MANAGER_CONTRACT_ADDRESS: string;
  MOPY_TOKEN_ADDRESS: string;
}

// Default configuration from .env file
const DEFAULT_CONFIG: EnvironmentConfig = {
  THIRDWEB_CLIENT_ID: "3fb238b2e45cfe057ff5609ef406b378",
  CHAIN_ID: 84532,
  BASE_SEPOLIA_RPC_URL: "https://base-sepolia.g.alchemy.com/v2/aUefkS7jYcwMZWmhsvnt3FjV3kHoOc5r",
  MANAGER_CONTRACT_ADDRESS: "0xC72dA51bBC839C460E11fA16F93AE6E3Efa0d63d",
  MOPY_TOKEN_ADDRESS: "0xf3DD33ddb68A08b5c520D8cc3BB0A72f08431551",
};

/**
 * Hook to get environment configuration
 * Falls back to default values if Next.js env injection fails
 */
export const useEnvironmentConfig = (): EnvironmentConfig => {
  const [config, setConfig] = useState<EnvironmentConfig>(DEFAULT_CONFIG);

  useEffect(() => {
    // Try to get values from Next.js environment variables
    const nextConfig: EnvironmentConfig = {
      THIRDWEB_CLIENT_ID: process.env.NEXT_PUBLIC_THIRDWEB_CLIENT_ID || DEFAULT_CONFIG.THIRDWEB_CLIENT_ID,
      CHAIN_ID: parseInt(process.env.NEXT_PUBLIC_CHAIN_ID || DEFAULT_CONFIG.CHAIN_ID.toString()),
      BASE_SEPOLIA_RPC_URL: process.env.NEXT_PUBLIC_BASE_SEPOLIA_RPC_URL || DEFAULT_CONFIG.BASE_SEPOLIA_RPC_URL,
      MANAGER_CONTRACT_ADDRESS: process.env.NEXT_PUBLIC_MANAGER_CONTRACT_ADDRESS || DEFAULT_CONFIG.MANAGER_CONTRACT_ADDRESS,
      MOPY_TOKEN_ADDRESS: process.env.NEXT_PUBLIC_MOPY_TOKEN_ADDRESS || DEFAULT_CONFIG.MOPY_TOKEN_ADDRESS,
    };

    setConfig(nextConfig);
  }, []);

  return config;
};

/**
 * Static function to get environment config (for use in services)
 * This uses the default config since services run before React hooks
 */
export const getEnvironmentConfig = (): EnvironmentConfig => {
  // In a real Next.js app, these would be injected at build time
  if (typeof window !== 'undefined') {
    // Check if Next.js has injected the variables
    const injectedConfig = (window as any).__NEXT_DATA__?.env;
    if (injectedConfig) {
      return {
        THIRDWEB_CLIENT_ID: injectedConfig.NEXT_PUBLIC_THIRDWEB_CLIENT_ID || DEFAULT_CONFIG.THIRDWEB_CLIENT_ID,
        CHAIN_ID: parseInt(injectedConfig.NEXT_PUBLIC_CHAIN_ID || DEFAULT_CONFIG.CHAIN_ID.toString()),
        BASE_SEPOLIA_RPC_URL: injectedConfig.NEXT_PUBLIC_BASE_SEPOLIA_RPC_URL || DEFAULT_CONFIG.BASE_SEPOLIA_RPC_URL,
        MANAGER_CONTRACT_ADDRESS: injectedConfig.NEXT_PUBLIC_MANAGER_CONTRACT_ADDRESS || DEFAULT_CONFIG.MANAGER_CONTRACT_ADDRESS,
        MOPY_TOKEN_ADDRESS: injectedConfig.NEXT_PUBLIC_MOPY_TOKEN_ADDRESS || DEFAULT_CONFIG.MOPY_TOKEN_ADDRESS,
      };
    }
  }
  
  return DEFAULT_CONFIG;
};
