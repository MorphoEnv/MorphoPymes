// NOTE: Do NOT import or call dotenv in client-side code.
// Next.js exposes NEXT_PUBLIC_* environment variables to the browser automatically
// and calling dotenv.config() here causes runtime errors in the client (process.stdin / isTTY undefined).

// Blockchain configuration constants for MorphoPymes
// IMPORTANT: This file must NOT contain sensitive secrets (private keys, secret API keys).
// Store sensitive values (e.g. THIRDWEB_SECRET_KEY) on the server (e.g. Next.js API routes or server env) and call them through secure API endpoints.

export const BLOCKCHAIN_CONFIG = {
  // Public Network Configuration - Base Sepolia Testnet (from apps/web/.env)
  CHAIN_ID: parseInt(process.env.NEXT_PUBLIC_CHAIN_ID || '84532'),
  CHAIN_NAME: process.env.NEXT_PUBLIC_CHAIN_NAME || 'Base Sepolia Testnet',

  // RPC URL - prefer NEXT_PUBLIC_ variable; if empty, frontend should call server proxy
  // NOTE: If your RPC requires a private key, never expose it here. Proxy requests via /api/config/rpc.
  RPC_URL: process.env.NEXT_PUBLIC_BASE_SEPOLIA_RPC_URL || '',

  // Contract Addresses (public)
  MANAGER_CONTRACT_ADDRESS: process.env.NEXT_PUBLIC_MANAGER_CONTRACT_ADDRESS || '0xC72dA51bBC839C460E11fA16F93AE6E3Efa0d63d',
  MOPY_TOKEN_ADDRESS: process.env.NEXT_PUBLIC_MOPY_TOKEN_ADDRESS || '0xf3DD33ddb68A08b5c520D8cc3BB0A72f08431551',

  // Native Currency
  NATIVE_CURRENCY: {
    name: process.env.NEXT_PUBLIC_NATIVE_CURRENCY_NAME || 'Ethereum',
    symbol: process.env.NEXT_PUBLIC_NATIVE_CURRENCY_SYMBOL || 'ETH',
    decimals: parseInt(process.env.NEXT_PUBLIC_NATIVE_CURRENCY_DECIMALS || '18'),
  },

  // Explorer URL
  BLOCK_EXPLORER_URL: process.env.NEXT_PUBLIC_BLOCK_EXPLORER_URL || 'https://sepolia.basescan.org',

  // Contract Constants (from smart contract)
  TOKEN_RATE: 100, // 100 MoPy tokens per 1 ETH
  MAX_RETURN_PERCENTAGE: 10000, // 100.00% maximum return (in basis points)

  // Gas Configuration
  DEFAULT_GAS_LIMIT: 300000,

  // Wallet Types (public)
  SUPPORTED_WALLETS: ["metamask", "walletconnect", "coinbase"] as const,

  // Thirdweb client id (public) - safe to expose
  CLIENT_ID: process.env.NEXT_PUBLIC_THIRDWEB_CLIENT_ID || '3fb238b2e45cfe057ff5609ef406b378',
} as const;

export type SupportedWallet = typeof BLOCKCHAIN_CONFIG.SUPPORTED_WALLETS[number];

// Helper functions for contract constants
export const CONTRACT_HELPERS = {
  /**
   * Convert percentage to basis points for contract calls
   */
  percentageToBasisPoints: (percentage: number): number => Math.round(percentage * 100),

  /**
   * Convert basis points to percentage for display
   */
  basisPointsToPercentage: (basisPoints: number): number => basisPoints / 100,

  /**
   * Validate return percentage doesn't exceed maximum
   */
  isValidReturnPercentage: (percentage: number): boolean => {
    const basisPoints = CONTRACT_HELPERS.percentageToBasisPoints(percentage);
    return basisPoints <= BLOCKCHAIN_CONFIG.MAX_RETURN_PERCENTAGE;
  },

  /**
   * Calculate MoPy tokens to receive for ETH investment
   */
  calculateMopyTokens: (ethAmount: string): string => {
    const eth = parseFloat(ethAmount);
    const tokens = eth * BLOCKCHAIN_CONFIG.TOKEN_RATE;
    return tokens.toString();
  },
};

/**
 * Fetch RPC URL from server-side secure endpoint.
 * The server endpoint should read the real RPC URL from server environment
 * and return it to the frontend over HTTPS (or proxy requests server-side).
 */
export async function fetchRpcUrl(): Promise<string> {
  try {
    const res = await fetch('/api/config/rpc');
    if (!res.ok) return '';
    const json = await res.json();
    return json?.rpcUrl || '';
  } catch (error) {
    console.error('Failed to fetch RPC URL from server:', error);
    return '';
  }
}

// Error messages for better UX
export const BLOCKCHAIN_ERRORS = {
  WALLET_NOT_CONNECTED: "Please connect your wallet first",
  WRONG_NETWORK: "Please switch to Base Sepolia network",
  INSUFFICIENT_BALANCE: "Insufficient balance for this transaction",
  CONTRACT_NOT_INITIALIZED: "Smart contract not initialized",
  TRANSACTION_REJECTED: "Transaction was rejected by user",
  COMPANY_NOT_FOUND: "Company not found",
  CAMPAIGN_NOT_FOUND: "Campaign not found",
  CAMPAIGN_INACTIVE: "Campaign is not active",
  GOAL_ALREADY_REACHED: "Campaign goal has already been reached",
  INVESTMENT_TOO_LOW: "Investment amount is below minimum",
  UNAUTHORIZED: "You are not authorized to perform this action",
  INVALID_AMOUNT: "Invalid amount specified",
} as const;
