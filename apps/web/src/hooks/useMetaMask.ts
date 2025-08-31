import { useState, useEffect } from 'react';

interface MetaMaskHookReturn {
  isMetaMaskInstalled: boolean;
  isConnected: boolean;
  account: string | null;
  chainId: string | null;
  connecting: boolean;
  error: string | null;
  connect: () => Promise<string | null>;
  switchToBaseSepolia: () => Promise<boolean>;
}

export const useMetaMask = (): MetaMaskHookReturn => {
  const [isMetaMaskInstalled, setIsMetaMaskInstalled] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [account, setAccount] = useState<string | null>(null);
  const [chainId, setChainId] = useState<string | null>(null);
  const [connecting, setConnecting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Base Sepolia chainId (84532 in hex)
  const BASE_SEPOLIA_CHAIN_ID = '0x14a34';

  useEffect(() => {
    const checkMetaMask = () => {
      if (typeof window !== 'undefined' && window.ethereum) {
        setIsMetaMaskInstalled(true);
        
        // Check if already connected
        window.ethereum.request({ method: 'eth_accounts' })
          .then((accounts: string[]) => {
            if (accounts.length > 0) {
              setAccount(accounts[0]);
              setIsConnected(true);
            }
          })
          .catch((err: any) => {
            console.error('Error checking accounts:', err);
          });

        // Get current chain
        window.ethereum.request({ method: 'eth_chainId' })
          .then((chain: string) => {
            setChainId(chain);
          })
          .catch((err: any) => {
            console.error('Error getting chain:', err);
          });

        // Listen for account changes
        const handleAccountsChanged = (accounts: string[]) => {
          if (accounts.length > 0) {
            setAccount(accounts[0]);
            setIsConnected(true);
          } else {
            setAccount(null);
            setIsConnected(false);
          }
        };

        // Listen for chain changes
        const handleChainChanged = (chainId: string) => {
          setChainId(chainId);
        };

        window.ethereum.on('accountsChanged', handleAccountsChanged);
        window.ethereum.on('chainChanged', handleChainChanged);

        return () => {
          if (window.ethereum.removeListener) {
            window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
            window.ethereum.removeListener('chainChanged', handleChainChanged);
          }
        };
      }
    };

    checkMetaMask();
  }, []);

  const connect = async (): Promise<string | null> => {
    if (!isMetaMaskInstalled) {
      setError('MetaMask is not installed. Please install MetaMask extension.');
      return null;
    }

    setConnecting(true);
    setError(null);

    try {
      const accounts = await window.ethereum.request({
        method: 'eth_requestAccounts',
      });

      if (accounts.length > 0) {
        setAccount(accounts[0]);
        setIsConnected(true);
        return accounts[0];
      } else {
        setError('No accounts found. Please check your MetaMask.');
        return null;
      }
    } catch (err: any) {
      if (err.code === 4001) {
        setError('Connection rejected by user.');
      } else {
        setError('Failed to connect to MetaMask.');
      }
      console.error('Error connecting to MetaMask:', err);
      return null;
    } finally {
      setConnecting(false);
    }
  };

  const switchToBaseSepolia = async (): Promise<boolean> => {
    if (!isMetaMaskInstalled) {
      setError('MetaMask is not installed.');
      return false;
    }

    try {
      // Try to switch to Base Sepolia
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: BASE_SEPOLIA_CHAIN_ID }],
      });
      return true;
    } catch (switchError: any) {
      // If the chain doesn't exist, add it
      if (switchError.code === 4902) {
        try {
          await window.ethereum.request({
            method: 'wallet_addEthereumChain',
            params: [
              {
                chainId: BASE_SEPOLIA_CHAIN_ID,
                chainName: 'Base Sepolia',
                nativeCurrency: {
                  name: 'ETH',
                  symbol: 'ETH',
                  decimals: 18,
                },
                rpcUrls: ['https://sepolia.base.org'],
                blockExplorerUrls: ['https://sepolia-explorer.base.org'],
              },
            ],
          });
          return true;
        } catch (addError) {
          console.error('Error adding Base Sepolia network:', addError);
          setError('Failed to add Base Sepolia network.');
          return false;
        }
      } else {
        console.error('Error switching to Base Sepolia:', switchError);
        setError('Failed to switch to Base Sepolia network.');
        return false;
      }
    }
  };

  return {
    isMetaMaskInstalled,
    isConnected,
    account,
    chainId,
    connecting,
    error,
    connect,
    switchToBaseSepolia,
  };
};

// Extend window object for TypeScript
declare global {
  interface Window {
    ethereum?: any;
  }
}
