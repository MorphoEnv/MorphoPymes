'use client';

import { useState } from 'react';
import { useWeb3Auth } from '@/hooks/useWeb3Auth';
import WalletConnector from '@/components/auths/WalletConnector';
import ProfileSetup from '@/components/auths/ProfileSetup';
import UserProfile from '@/components/auths/UserProfile';
import { Loader2, AlertCircle } from 'lucide-react';

export default function AuthScreen() {
  const { user, isConnected, isLoading, error, clearError } = useWeb3Auth();
  const [showProfileSetup, setShowProfileSetup] = useState(false);

  // Si está cargando
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-900 dark:to-gray-800">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-300">Conectando wallet...</p>
        </div>
      </div>
    );
  }

  // Si hay error
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-900 dark:to-gray-800">
        <div className="max-w-md w-full mx-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6">
            <div className="flex items-center space-x-3 text-red-600 dark:text-red-400 mb-4">
              <AlertCircle className="h-6 w-6" />
              <h2 className="text-lg font-semibold">Error de conexión</h2>
            </div>
            <p className="text-gray-600 dark:text-gray-300 mb-4">{error}</p>
            <button
              onClick={clearError}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
            >
              Intentar nuevamente
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Si está conectado y tiene usuario
  if (isConnected && user) {
    // Si necesita completar perfil
    if ((!user.email || !user.username) && !showProfileSetup) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-900 dark:to-gray-800">
          <div className="max-w-md w-full mx-4">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6">
              <h2 className="text-2xl font-bold text-center mb-4 text-gray-800 dark:text-white">
                ¡Bienvenido!
              </h2>
              <p className="text-gray-600 dark:text-gray-300 text-center mb-6">
                Tu wallet se conectó exitosamente. ¿Te gustaría completar tu perfil?
              </p>
              <div className="space-y-3">
                <button
                  onClick={() => setShowProfileSetup(true)}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
                >
                  Completar perfil
                </button>
                <button
                  onClick={() => setShowProfileSetup(false)}
                  className="w-full bg-gray-200 hover:bg-gray-300 dark:bg-gray-600 dark:hover:bg-gray-500 text-gray-800 dark:text-white font-medium py-2 px-4 rounded-lg transition-colors"
                >
                  Continuar sin completar
                </button>
              </div>
            </div>
          </div>
        </div>
      );
    }

    // Mostrar setup de perfil
    if (showProfileSetup) {
      return (
        <ProfileSetup 
          user={user} 
          onComplete={() => setShowProfileSetup(false)}
          onSkip={() => setShowProfileSetup(false)}
        />
      );
    }

    // Mostrar perfil de usuario
    return <UserProfile user={user} />;
  }

  // Pantalla inicial - conectar wallet
  return <WalletConnector />;
}