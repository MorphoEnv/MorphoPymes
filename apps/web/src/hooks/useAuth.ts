'use client';

import { useState, useEffect } from 'react';
import { useActiveAccount } from 'thirdweb/react';
import { apiService, User } from '@/services/apiService';

interface UseAuthReturn {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  error: string | null;
  isAuthenticated: boolean;
  needsRegistration: boolean;
  login: () => Promise<void>;
  logout: () => void;
  completeRegistration: (userData: any) => Promise<boolean>;
}

export function useAuth(): UseAuthReturn {
  const account = useActiveAccount();
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [needsRegistration, setNeedsRegistration] = useState(false);

  // Cargar token del localStorage al iniciar
  useEffect(() => {
    const storedToken = localStorage.getItem('morpho_token');
    if (storedToken) {
      setToken(storedToken);
      verifyStoredToken(storedToken);
    }
  }, []);

  // Intentar login cuando se conecta la wallet
  useEffect(() => {
    console.log('🔄 Wallet connection effect triggered');
    console.log('📱 Account address:', account?.address);
    console.log('👤 Current user:', user ? 'EXISTS' : 'NULL');
    console.log('⏳ Is loading:', isLoading);
    
    if (account?.address && !user && !isLoading) {
      console.log('🚀 Triggering login for connected wallet');
      login();
    } else if (!account?.address) {
      console.log('🚪 No wallet connected, logging out');
      logout();
    }
  }, [account?.address]);

  const verifyStoredToken = async (storedToken: string) => {
    try {
      const response = await apiService.verifyToken(storedToken);
      if (response.success && response.data) {
        setUser(response.data.user);
        setToken(storedToken);
      } else {
        localStorage.removeItem('morpho_token');
        setToken(null);
      }
    } catch (error) {
      console.error('Error verifying stored token:', error);
      localStorage.removeItem('morpho_token');
      setToken(null);
    }
  };

  const login = async () => {
    if (!account?.address) {
      console.log('❌ No account address available for login');
      return;
    }

    console.log('🔐 Starting login process for wallet:', account.address);
    setIsLoading(true);
    setError(null);
    setNeedsRegistration(false);

    try {
      console.log('📡 Calling loginWithWallet API...');
      const response = await apiService.loginWithWallet(account.address);
      console.log('📦 Login response:', response);
      
      if (response.success && response.data?.token) {
        console.log('✅ Login successful!');
        // Login exitoso
        const { token: newToken, user: userData } = response.data;
        setToken(newToken);
        setUser(userData!);
        localStorage.setItem('morpho_token', newToken);
        console.log('💾 Token saved to localStorage');
      } else if (response.code === 'REGISTRATION_REQUIRED') {
        console.log('⚠️  Registration required');
        // Necesita registro
        setNeedsRegistration(true);
        setError('Necesitas completar tu registro');
      } else {
        console.log('❌ Login failed:', response.message);
        setError(response.message || 'Error al iniciar sesión');
      }
    } catch (error) {
      console.error('💥 Error in login:', error);
      setError('Error de conexión. Intenta nuevamente.');
    } finally {
      setIsLoading(false);
    }
  };

  const completeRegistration = async (userData: {
    firstName: string;
    lastName: string;
    email?: string;
    userType: 'entrepreneur' | 'investor';
    description?: string;
  }): Promise<boolean> => {
    if (!account?.address) return false;

    setIsLoading(true);
    setError(null);

    try {
      const registrationData = {
        ...userData,
        walletAddress: account.address,
      };

      const response = await apiService.completeRegistration(registrationData);

      if (response.success && response.data?.token) {
        const { token: newToken, user: userData } = response.data;
        setToken(newToken);
        setUser(userData!);
        setNeedsRegistration(false);
        localStorage.setItem('morpho_token', newToken);
        return true;
      } else {
        setError(response.message || 'Error al completar el registro');
        return false;
      }
    } catch (error) {
      console.error('Error completing registration:', error);
      setError('Error de conexión. Intenta nuevamente.');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    setError(null);
    setNeedsRegistration(false);
    localStorage.removeItem('morpho_token');
  };

  return {
    user,
    token,
    isLoading,
    error,
    isAuthenticated: !!user && !!account && !!token,
    needsRegistration,
    login,
    logout,
    completeRegistration,
  };
}
