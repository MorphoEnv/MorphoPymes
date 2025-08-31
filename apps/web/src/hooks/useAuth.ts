'use client';

import { useState, useEffect } from 'react';
import { useRef } from 'react';
import { useActiveAccount } from 'thirdweb/react';
import { apiService, User } from '@/services/apiService';
import { StorageManager, STORAGE_KEYS } from '@/utils/storage';

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
  // isLoading ahora representa el estado de inicialización/verificación del auth
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [needsRegistration, setNeedsRegistration] = useState(false);

  // Cargar token del localStorage al iniciar
  useEffect(() => {
    const storedToken = StorageManager.getItem(STORAGE_KEYS.TOKEN);
    const storedUser = StorageManager.getItem(STORAGE_KEYS.USER);

    if (storedToken) {
      console.log('🔐 Found stored token, verifying...');
      setToken(storedToken);

      if (storedUser) {
        try {
          const parsedUser = JSON.parse(storedUser);
          console.log('👤 Restored user from storage:', parsedUser.firstName);
          setUser(parsedUser);
        } catch (error) {
          console.error('Error parsing stored user:', error);
          StorageManager.removeItem(STORAGE_KEYS.USER);
        }
      }

      // Verificamos el token; verifyStoredToken se encargará de limpiar isLoading
      verifyStoredToken(storedToken);
    } else {
      // No hay token almacenado — autenticación inicializada
      setIsLoading(false);
    }
  }, []);

  // Evitar verificaciones concurrentes (React StrictMode puede montar dos veces)
  const isVerifyingRef = useRef(false);

  // Intentar login solo si no hay token y usuario en localStorage
  useEffect(() => {
    console.log('🔄 Wallet connection effect triggered');
    console.log('📱 Account address:', account?.address);
    console.log('👤 Current user:', user ? 'EXISTS' : 'NULL');
    console.log('⏳ Is loading:', isLoading);

    const storedToken = StorageManager.getItem(STORAGE_KEYS.TOKEN);
    const storedUser = StorageManager.getItem(STORAGE_KEYS.USER);

    if (account?.address && !storedToken && !storedUser && !user && !isLoading) {
      console.log('🚀 Triggering login for connected wallet (no token/user in storage)');
      login();
    } else if (!account?.address) {
      console.log('🚪 No wallet connected, logging out');
      logout();
    }
  }, [account?.address]);

  const verifyStoredToken = async (storedToken: string) => {
    if (isVerifyingRef.current) {
      console.log('verifyStoredToken: already running, skipping duplicate call');
      return;
    }
    isVerifyingRef.current = true;
    setIsLoading(true);
    try {
  console.log('🔁 verifyStoredToken: calling apiService.verifyToken');
      const response = await apiService.verifyToken(storedToken);
  console.log('🔁 verifyStoredToken: response', response);
      if (response.success && response.data) {
        console.log('✅ Token verified successfully');
        setUser(response.data.user);
        setToken(storedToken);
        StorageManager.setItem(STORAGE_KEYS.USER, JSON.stringify(response.data.user));
      } else {
        console.log('❌ Token verification failed, clearing storage');
        StorageManager.removeItem(STORAGE_KEYS.TOKEN);
        StorageManager.removeItem(STORAGE_KEYS.USER);
        setToken(null);
        setUser(null);
      }
    } catch (error) {
      console.error('Error verifying stored token:', error);
      StorageManager.removeItem(STORAGE_KEYS.TOKEN);
      StorageManager.removeItem(STORAGE_KEYS.USER);
      setToken(null);
      setUser(null);
    } finally {
  setIsLoading(false);
  isVerifyingRef.current = false;
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
        StorageManager.setItem(STORAGE_KEYS.TOKEN, newToken);
        StorageManager.setItem(STORAGE_KEYS.USER, JSON.stringify(userData!));
        console.log('💾 Token and user saved to localStorage');
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

      if (response.success && response.data?.token && response.data?.user) {
        const { token: newToken, user: userData } = response.data;
        setToken(newToken);
        setUser(userData!);
        setNeedsRegistration(false);
        StorageManager.setItem(STORAGE_KEYS.TOKEN, newToken);
        StorageManager.setItem(STORAGE_KEYS.USER, JSON.stringify(userData!));
        return true;
      } else {
        setNeedsRegistration(true);
        setError(response.message || 'Error al completar el registro');
        return false;
      }
    } catch (error) {
      setNeedsRegistration(true);
      console.error('Error completing registration:', error);
      setError('Error de conexión. Intenta nuevamente.');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    console.log('🚪 Logging out user');
    setUser(null);
    setToken(null);
    setError(null);
    setNeedsRegistration(false);
    StorageManager.removeItem(STORAGE_KEYS.TOKEN);
    StorageManager.removeItem(STORAGE_KEYS.USER);
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
