import { useState, useEffect } from 'react';
import { 
  useAddress, 
  useConnectionStatus, 
  useConnect, 
  useDisconnect, 
  metamaskWallet,
  walletConnect,
  coinbaseWallet
} from '@thirdweb-dev/react';
import { authService } from '@/services/authService';

export interface User {
  id: string;
  address: string;
  email?: string;
  username?: string;
  createdAt: Date;
}

export const useWeb3Auth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const address = useAddress();
  const connectionStatus = useConnectionStatus();
  const connect = useConnect();
  const disconnect = useDisconnect();

  // Wallets disponibles
  const metamask = metamaskWallet();
  const walletConnectV2 = walletConnect();
  const coinbase = coinbaseWallet();

  const wallets = [metamask, walletConnectV2, coinbase];

  // Efecto para manejar cambios de conexión
  useEffect(() => {
    if (address && connectionStatus === 'connected') {
      handleUserLogin(address);
    } else if (connectionStatus === 'disconnected') {
      setUser(null);
    }
  }, [address, connectionStatus]);

  const handleUserLogin = async (walletAddress: string) => {
    try {
      setIsLoading(true);
      setError(null);
      
      const userData = await authService.loginOrRegister(walletAddress);
      setUser(userData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al autenticar usuario');
      console.error('Error en login:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const connectWallet = async (walletType: 'metamask' | 'walletconnect' | 'coinbase' = 'metamask') => {
    try {
      setIsLoading(true);
      setError(null);

      let selectedWallet;
      switch (walletType) {
        case 'metamask':
          selectedWallet = metamask;
          break;
        case 'walletconnect':
          selectedWallet = walletConnectV2;
          break;
        case 'coinbase':
          selectedWallet = coinbase;
          break;
        default:
          selectedWallet = metamask;
      }

      // TypeScript workaround para múltiples tipos de wallet
      await (connect as (wallet: unknown) => Promise<void>)(selectedWallet);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al conectar wallet');
      console.error('Error conectando wallet:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const disconnectWallet = async () => {
    try {
      setIsLoading(true);
      await disconnect();
      setUser(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al desconectar wallet');
    } finally {
      setIsLoading(false);
    }
  };

  const updateUserProfile = async (profileData: { email?: string; username?: string }) => {
    if (!user) return;

    try {
      setIsLoading(true);
      setError(null);
      
      const updatedUser = await authService.updateProfile(user.id, profileData);
      setUser(updatedUser);
      
      return updatedUser;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al actualizar perfil');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    // Estados
    user,
    isConnected: connectionStatus === 'connected',
    isLoading,
    error,
    address,
    connectionStatus,
    
    // Métodos
    connectWallet,
    disconnectWallet,
    updateUserProfile,
    clearError: () => setError(null),
    
    // Wallets disponibles
    wallets
  };
};