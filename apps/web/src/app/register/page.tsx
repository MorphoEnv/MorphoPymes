'use client';

import { useState, useEffect } from 'react';
import { ConnectButton, useActiveAccount, useConnect } from 'thirdweb/react';
import { client } from '@/components/providers/ThirdWebProvider';
import { createWallet } from 'thirdweb/wallets';
import { apiService, CreateUserData } from '@/services/apiService';

interface UserFormData {
  firstName: string;
  lastName: string;
  email: string;
  userType: 'entrepreneur' | 'investor';
  description: string;
}

const wallets = [
  createWallet("io.metamask"),
  createWallet("com.coinbase.wallet"),
  createWallet("me.rainbow"),
];

export default function RegisterPage() {
  const account = useActiveAccount();
  const { connect } = useConnect();
  const [formData, setFormData] = useState<UserFormData>({
    firstName: '',
    lastName: '',
    email: '',
    userType: 'entrepreneur',
    description: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  // Verificar si el usuario ya existe cuando se conecta la wallet
  useEffect(() => {
    const checkUserExists = async () => {
      if (account?.address) {
        try {
          const response = await apiService.checkUserExists(account.address);
          
          if (response.success && response.data?.exists) {
            setError('Ya existe una cuenta registrada con esta wallet. Serás redirigido al dashboard.');
            setTimeout(() => {
              window.location.href = '/dashboard';
            }, 3000);
          }
        } catch (error) {
          console.error('Error checking user:', error);
        }
      }
    };

    checkUserExists();
  }, [account?.address]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!account?.address) {
      setError('Por favor conecta tu wallet primero');
      return;
    }

    if (!formData.firstName.trim() || !formData.lastName.trim()) {
      setError('Nombre y apellido son requeridos');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const userData: CreateUserData = {
        ...formData,
        walletAddress: account.address,
        email: formData.email || undefined
      };

      const response = await apiService.registerUser(userData);

      if (response.success) {
        setSuccess(true);
        setTimeout(() => {
          window.location.href = '/dashboard';
        }, 2000);
      } else {
        setError(response.message || 'Error al registrar usuario');
      }
    } catch (error) {
      console.error('Error registering user:', error);
      setError('Error de conexión. Intenta nuevamente.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-morpho-dark-blue via-blue-900 to-morpho-blue">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-md mx-auto bg-white/10 backdrop-blur-md rounded-2xl shadow-2xl p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-white mb-2">
              Registro en MorphoPymes
            </h1>
            <p className="text-gray-300">
              Conecta tu wallet y crea tu perfil
            </p>
          </div>

          {/* Conectar Wallet */}
          <div className="mb-8">
            <div className="text-center">
              {!account ? (
                <div>
                  <p className="text-white mb-4">Paso 1: Conecta tu wallet</p>
                  <ConnectButton
                    client={client}
                    wallets={wallets}
                    theme="dark"
                    connectModal={{
                      size: "wide"
                    }}
                  />
                </div>
              ) : (
                <div className="bg-green-500/20 border border-green-500/30 rounded-lg p-4">
                  <p className="text-green-300 mb-2">✅ Wallet Conectada</p>
                  <p className="text-sm text-gray-300 break-all">
                    {account.address}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Formulario de Registro */}
          {account && !success && (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <p className="text-white mb-4">Paso 2: Completa tu perfil</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Nombre *
                  </label>
                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-500"
                    placeholder="Tu nombre"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Apellido *
                  </label>
                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-500"
                    placeholder="Tu apellido"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Email (opcional)
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-500"
                  placeholder="tu@email.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Tipo de Usuario *
                </label>
                <select
                  name="userType"
                  value={formData.userType}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:border-purple-500"
                  required
                >
                  <option value="entrepreneur">Emprendedor</option>
                  <option value="investor">Inversionista</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Descripción breve (opcional)
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows={3}
                  className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-500"
                  placeholder="Cuéntanos sobre ti..."
                />
              </div>

              {error && (
                <div className="bg-red-500/20 border border-red-500/30 rounded-lg p-4">
                  <p className="text-red-300 text-sm">{error}</p>
                </div>
              )}

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 px-4 bg-gradient-to-r from-morpho-blue to-morpho-dark-blue hover:from-blue-600 hover:to-blue-800 disabled:opacity-50 text-white font-medium rounded-lg transition-all duration-200"
              >
                {isLoading ? 'Registrando...' : 'Crear Cuenta'}
              </button>
            </form>
          )}

          {success && (
            <div className="text-center">
              <div className="bg-green-500/20 border border-green-500/30 rounded-lg p-6 mb-4">
                <div className="text-4xl mb-4">🎉</div>
                <h3 className="text-xl font-semibold text-green-300 mb-2">
                  ¡Registro Exitoso!
                </h3>
                <p className="text-gray-300">
                  Tu cuenta ha sido creada. Serás redirigido al dashboard...
                </p>
              </div>
            </div>
          )}

          <div className="text-center mt-6">
            <p className="text-gray-400 text-sm">
              ¿Ya tienes cuenta?{' '}
              <a href="/login" className="text-blue-400 hover:text-blue-300">
                Inicia sesión
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
