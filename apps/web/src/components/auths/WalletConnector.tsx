'use client';

import { useState } from 'react';
import { useWeb3Auth } from '@/hooks/useWeb3Auth';
import { Wallet, Loader2 } from 'lucide-react';

export default function WalletConnector() {
  const { connectWallet, isLoading, error } = useWeb3Auth();
  const [selectedWallet, setSelectedWallet] = useState<'metamask' | 'walletconnect' | 'coinbase'>('metamask');

  const handleConnect = async () => {
    await connectWallet(selectedWallet);
  };

  const walletOptions = [
    {
      id: 'metamask' as const,
      name: 'MetaMask',
      description: 'Conectar usando MetaMask wallet',
      icon: '🦊'
    },
    {
      id: 'walletconnect' as const,
      name: 'WalletConnect',
      description: 'Conectar usando WalletConnect protocol',
      icon: '🔗'
    },
    {
      id: 'coinbase' as const,
      name: 'Coinbase Wallet',
      description: 'Conectar usando Coinbase Wallet',
      icon: '💙'
    }
  ];

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-900 dark:to-gray-800">
      <div className="max-w-md w-full mx-4">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6">
          <div className="text-center mb-6">
            <Wallet className="h-12 w-12 text-blue-600 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">
              Conectar Wallet
            </h1>
            <p className="text-gray-600 dark:text-gray-300">
              Elige tu wallet preferida para continuar
            </p>
          </div>

          {error && (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3 mb-4">
              <p className="text-red-600 dark:text-red-400 text-sm">{error}</p>
            </div>
          )}

          <div className="space-y-3 mb-6">
            {walletOptions.map((wallet) => (
              <div
                key={wallet.id}
                className={`border rounded-lg p-4 cursor-pointer transition-colors ${
                  selectedWallet === wallet.id
                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                    : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500'
                }`}
                onClick={() => setSelectedWallet(wallet.id)}
              >
                <div className="flex items-center space-x-3">
                  <span className="text-2xl">{wallet.icon}</span>
                  <div>
                    <h3 className="font-medium text-gray-800 dark:text-white">
                      {wallet.name}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      {wallet.description}
                    </p>
                  </div>
                  <div className="ml-auto">
                    <div
                      className={`w-4 h-4 rounded-full border-2 ${
                        selectedWallet === wallet.id
                          ? 'border-blue-500 bg-blue-500'
                          : 'border-gray-300 dark:border-gray-600'
                      }`}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>

          <button
            onClick={handleConnect}
            disabled={isLoading}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-medium py-3 px-4 rounded-lg transition-colors flex items-center justify-center"
          >
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                Conectando...
              </>
            ) : (
              'Conectar Wallet'
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
