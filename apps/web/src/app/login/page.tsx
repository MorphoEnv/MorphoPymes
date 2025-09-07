/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useActiveAccount, useActiveWallet, useConnect, useDisconnect } from 'thirdweb/react';
import { createWallet } from 'thirdweb/wallets';
import { client } from '@/components/providers/ThirdWebProvider';
import { useAuth } from '@/hooks/useAuth';
import RegistrationPopup from '@/components/RegistrationPopup';

export default function Login() {
  const router = useRouter();
  const account = useActiveAccount();
  const activeWallet = useActiveWallet();
  const { connect, isConnecting } = useConnect();
  const { disconnect } = useDisconnect();
  
  const { user, isLoading, needsRegistration, completeRegistration, login } = useAuth();
  const [connectingMethod, setConnectingMethod] = useState<string>('');
  const [showRegistrationPopup, setShowRegistrationPopup] = useState(false);

  // Connect MetaMask (injected) explicitly and trigger auth login
  const handleConnectMetaMask = async () => {
    setConnectingMethod('metamask');
    try {
      // First disconnect any existing wallet to allow account switching
      if (activeWallet) {
        await disconnect(activeWallet);
        // Wait for disconnect to complete
        await new Promise(resolve => setTimeout(resolve, 500));
      }
      
      // Force MetaMask to show account selector by requesting permissions
      if (typeof window !== 'undefined' && (window as any).ethereum) {
        try {
          // Clear any cached permissions and force account selection
          await (window as any).ethereum.request({
            method: 'wallet_requestPermissions',
            params: [{ eth_accounts: {} }]
          });
        } catch (e) {
          console.log('Permission request failed, trying direct account request');
          // Fallback to direct account request
          try {
            await (window as any).ethereum.request({ method: 'eth_requestAccounts' });
          } catch (e2) {
            console.log('User rejected account access');
          }
        }
      }
      
      const wallet = createWallet('io.metamask');
      await connect(async () => {
        await wallet.connect({ client });
        return wallet;
      });
      console.log('MetaMask connected via ThirdWeb');
      // trigger backend login flow
      try { await login(); } catch (e) { console.warn('Login after MetaMask connect failed:', e); }
    } catch (error) {
      console.error('Error connecting MetaMask:', error);
      console.error('MetaMask connection failed. Make sure MetaMask is installed and unlocked.');
    } finally {
      setConnectingMethod('');
    }
  };

  // Redirigir al dashboard si ya está autenticado
  useEffect(() => {
    if (user && account) {
      router.push('/dashboard');
    }
  }, [user, account, router]);

  // Mostrar popup de registro si es necesario
  useEffect(() => {
    if (needsRegistration && account) {
      setShowRegistrationPopup(true);
    }
  }, [needsRegistration, account]);

  // Conexión con ThirdWeb (para usuarios sin wallet) - Email wallet
  const handleConnectThirdWeb = async () => {
    setConnectingMethod('thirdweb');
    try {
      // Usar WalletConnect como alternativa más simple
      const wallet = createWallet('walletConnect');
      await connect(async () => {
        await wallet.connect({ client });
        return wallet;
      });
      console.log('WalletConnect wallet connected');
    } catch (error) {
      console.error('Error connecting WalletConnect:', error);
      alert('Error al conectar wallet. Por favor intenta de nuevo o usa MetaMask.');
    } finally {
      setConnectingMethod('');
    }
  };

  // Conexión con ThirdWeb Email Wallet
  const handleConnectThirdWebEmail = async () => {
    setConnectingMethod('thirdweb-email');
    try {
      // Crear wallet embebido de ThirdWeb con Google
      const wallet = createWallet('inApp');
      await connect(async () => {
        await wallet.connect({
          client,
          strategy: 'google'
        });
        return wallet;
      });
      console.log('ThirdWeb Google wallet connected successfully');
    } catch (error) {
      console.error('Error creating ThirdWeb Google wallet:', error);
      alert('Error al crear wallet con Google. Por favor intenta de nuevo.');
    } finally {
      setConnectingMethod('');
    }
  };

  const handleRegistrationComplete = async (registrationData: any) => {
    return await completeRegistration(registrationData);
  };

  // Si ya está conectado pero cargando autenticación
  if (account && isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100/60 flex items-center justify-center px-6 py-12">
        <div className="bg-white/90 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-blue-100 max-w-md w-full">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Verificando...</h2>
            <p className="text-gray-600">
              Conectando con tu cuenta...
            </p>
            <p className="text-sm text-gray-500 mt-2 break-all">
              {account.address.slice(0, 6)}...{account.address.slice(-4)}
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Si ya está conectado y autenticado, mostrar estado
  if (account && user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100/60 flex items-center justify-center px-6 py-12">
        <div className="bg-white/90 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-blue-100 max-w-md w-full">
          <div className="text-center">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">¡Bienvenido!</h2>
            <p className="text-lg font-medium text-gray-700 mb-2">
              {user.firstName} {user.lastName}
            </p>
            <p className="text-gray-600 mb-6">
              {account.address.slice(0, 6)}...{account.address.slice(-4)}
            </p>
            <div className="space-y-3">
              <button
                onClick={() => router.push('/dashboard')}
                className="block w-full px-6 py-3 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition-all duration-300"
              >
                Ir al Dashboard
              </button>
              <button
                onClick={() => activeWallet && disconnect(activeWallet)}
                className="w-full px-6 py-3 border-2 border-gray-300 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 transition-all duration-300"
              >
                Desconectar
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100/60 flex items-center justify-center px-6 py-12">
        <div className="absolute inset-0 bg-grid-pattern opacity-[0.02]"></div>
        
        <div className="w-full max-w-md relative z-10">
          {/* Header */}
          <div className="text-center mb-8">
            <Link href="/" className="inline-flex items-center justify-center mb-6">
              <Image
                src="/Logo1.png"
                alt="MorphoPymes"
                width={60}
                height={60}
                className="object-contain"
              />
            </Link>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Conecta tu Wallet</h1>
            <p className="text-gray-600">Elige tu método preferido para empezar</p>
          </div>

          {/* Login Form */}
          <div className="bg-white/90 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-blue-100">
            {/* Wallet Connection Options */}
            <div className="space-y-4">
              {/* ThirdWeb Connection */}
              <div className="grid grid-cols-1 gap-3">
              <button
                onClick={handleConnectThirdWeb}
                disabled={connectingMethod === 'thirdweb' || isConnecting}
                className={`w-full flex items-center justify-center space-x-3 px-6 py-4 border-2 border-blue-200 rounded-xl transition-all duration-300 ${
                  connectingMethod === 'thirdweb' || isConnecting
                    ? 'opacity-50 cursor-not-allowed'
                    : 'hover:border-blue-300 hover:bg-blue-50/50 hover:shadow-md'
                }`}
              >
                {connectingMethod === 'thirdweb' || isConnecting ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
                    <span className="font-medium text-gray-700">Conectando...</span>
                  </>
                ) : (
                  <>
                    <div className="w-6 h-6 bg-gradient-to-r from-morpho-blue to-morpho-dark-blue rounded-lg flex items-center justify-center">
                      <div className="w-3 h-3 bg-white rounded-sm"></div>
                    </div>
                    <span className="font-medium text-gray-700">Conectar Wallet</span>
                    <div className="text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded-full">WalletConnect</div>
                  </>
                )}
              </button>

              {/* MetaMask (injected) */}
              <button
                onClick={handleConnectMetaMask}
                disabled={connectingMethod === 'metamask' || isConnecting}
                className={`w-full flex items-center justify-center space-x-3 px-6 py-4 border-2 border-blue-200 rounded-xl transition-all duration-300 ${
                  connectingMethod === 'metamask' || isConnecting
                    ? 'opacity-50 cursor-not-allowed'
                    : 'hover:border-blue-300 hover:bg-blue-50/50 hover:shadow-md'
                }`}
              >
                {connectingMethod === 'metamask' || isConnecting ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-yellow-600"></div>
                    <span className="font-medium text-gray-700">Conectando MetaMask...</span>
                  </>
                ) : (
                  <>
                    <div className="w-6 h-6 bg-blue-400 rounded-lg flex items-center justify-center">
                      <svg className="w-3 h-3 text-white" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 2L2 7l10 5 10-5-10-5z" fill="currentColor"/></svg>
                    </div>
                    <span className="font-medium text-gray-700">Conectar MetaMask</span>
                    <div className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">Inyectada</div>
                  </>
                )}
              </button>
              
               {/* ThirdWeb Email Wallet */}
               <button
                 onClick={handleConnectThirdWebEmail}
                 disabled={connectingMethod === 'thirdweb-email' || isConnecting}
                 className={`w-full flex items-center justify-center space-x-3 px-6 py-4 border-2 border-blue-200 rounded-xl transition-all duration-300 ${
                   connectingMethod === 'thirdweb-email' || isConnecting
                     ? 'opacity-50 cursor-not-allowed'
                     : 'hover:border-blue-300 hover:bg-blue-50/50 hover:shadow-md'
                 }`}
               >
               {connectingMethod === 'thirdweb-email' || isConnecting ? (
                 <>
                   <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
                   <span className="font-medium text-gray-700">Creando...</span>
                 </>
               ) : (
                 <>
                   <div className="w-6 h-6 bg-gradient-to-r from-morpho-blue to-morpho-dark-blue rounded-lg flex items-center justify-center">
                     <svg className="w-4 h-4 text-white" viewBox="0 0 24 24">
                       <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                       <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                       <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                       <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                     </svg>
                   </div>
                   <span className="font-medium text-gray-700">Conectar con Google</span>
                   <div className="text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded-full">ThirdWeb</div>
                 </>
               )}
             </button>
              </div>

              {/* ThirdWeb explanatory note for new users */}
              <div className="mt-3 text-sm text-gray-600">
                <strong className="font-medium">Note:</strong> If you don't have an external wallet, ThirdWeb can create an in-app wallet for you (for example, sign in with Google) so you can get started immediately. If you already use MetaMask or another wallet, connect it to use your own address.
              </div>
            </div>

            {/* Contact Us Link */}
            <div className="mt-8 text-center">
              <p className="text-gray-600">
                ¿Necesitas ayuda?{' '}
                <a 
                  href="https://x.com/MorphoEnv" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-700 font-semibold inline-flex items-center space-x-1"
                >
                  <span>Contáctanos en X</span>
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                  </svg>
                </a>
              </p>
            </div>
          </div>

          {/* Security Badge */}
          <div className="mt-6 flex items-center justify-center space-x-2 text-sm text-gray-500">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
            <span>Tus llaves, tu crypto, tu control</span>
          </div>
        </div>

        {/* Background Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 -left-32 w-64 h-64 bg-blue-400/8 rounded-full blur-3xl"></div>
          <div className="absolute bottom-1/4 -right-32 w-80 h-80 bg-blue-500/6 rounded-full blur-3xl"></div>
        </div>
      </div>

      {/* Registration Popup */}
      <RegistrationPopup
        isOpen={showRegistrationPopup}
        onClose={() => setShowRegistrationPopup(false)}
        onComplete={handleRegistrationComplete}
        walletAddress={account?.address || ''}
      />
    </>
  );
}
