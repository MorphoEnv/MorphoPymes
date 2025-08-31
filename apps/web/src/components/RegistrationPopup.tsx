'use client';

import { useState } from 'react';

interface RegistrationPopupProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete: (data: RegistrationData) => Promise<boolean>;
  walletAddress: string;
}

export interface RegistrationData {
  firstName: string;
  lastName: string;
  email?: string;
  userType: 'entrepreneur' | 'investor';
  description?: string;
}

export default function RegistrationPopup({
  isOpen,
  onClose,
  onComplete,
  walletAddress
}: RegistrationPopupProps) {
  const [formData, setFormData] = useState<RegistrationData>({
    firstName: '',
    lastName: '',
    email: undefined,
    userType: 'entrepreneur',
    description: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [linked, setLinked] = useState(false); // whether wallet was linked via quick register

  if (!isOpen) return null;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Quick wallet-only registration: use short wallet as name and minimal fields
  const handleQuickRegister = async () => {
    if (!walletAddress) return;
    setIsLoading(true);
    setError('');
    try {
      const short = `${walletAddress.slice(0,6)}...${walletAddress.slice(-4)}`;
      const data: RegistrationData = {
        firstName: short,
        lastName: '',
        userType: 'entrepreneur',
        // email omitted on purpose
      };
      const success = await onComplete(data);
      if (success) {
        // keep the form open so user can finish profile; prefill and mark linked
        setFormData(prev => ({ ...prev, firstName: short }));
        setLinked(true);
      }
    } catch (err) {
      console.error('Quick registration failed:', err);
      setError('No se pudo crear la cuenta rápida. Intenta nuevamente.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // allow submit even if lastName is empty when account is already linked
    if (!formData.firstName.trim() || (!linked && !formData.lastName.trim())) {
      setError('Nombre y apellido son requeridos');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const success = await onComplete(formData);
      if (success) {
        onClose();
      }
    } catch (error) {
      console.error('Error completing registration:', error);
      setError('Error al completar el registro. Intenta nuevamente.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl p-8 max-w-md w-full shadow-2xl transform transition-all">
        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Completa tu Perfil
          </h2>
          <p className="text-gray-600">
            Tu wallet está conectada. Ahora necesitamos algunos datos para crear tu cuenta.
          </p>
          <div className="mt-3 p-2 bg-gray-100 rounded-lg">
            <p className="text-xs text-gray-500 break-all">
              {walletAddress.slice(0, 6)}...{walletAddress.slice(-4)}
            </p>
          </div>
          {linked && (
            <div className="mt-3 p-2 bg-green-50 border border-green-200 rounded-lg">
              <p className="text-sm text-green-700">✅ Cuenta creada y vinculada a MetaMask. Puedes completar tu perfil ahora.</p>
            </div>
          )}
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nombre *
              </label>
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                placeholder="Tu nombre"
                required
                disabled={isLoading}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Apellido *
              </label>
              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                placeholder="Tu apellido"
                required
                disabled={isLoading}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email (opcional)
            </label>
            <input
              type="email"
              name="email"
              value={formData.email || ''}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              placeholder="tu@email.com"
              disabled={isLoading}
            />
          </div>

          <div className="text-sm text-gray-600">
            ¿Quieres crear la cuenta rápidamente sin completar datos? Puedes crearla solo con tu wallet.
          </div>

          <div className="pt-2">
            <button
              type="button"
              onClick={handleQuickRegister}
              disabled={isLoading}
              className="w-full mb-2 px-4 py-3 bg-gray-100 text-gray-800 rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50"
            >
              {isLoading ? 'Creando...' : 'Crear cuenta rápida (solo wallet)'}
            </button>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tipo de Usuario *
            </label>
            <select
              name="userType"
              value={formData.userType}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              required
              disabled={isLoading}
            >
              <option value="entrepreneur">Emprendedor</option>
              <option value="investor">Inversionista</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Descripción breve (opcional)
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none resize-none"
              placeholder="Cuéntanos sobre ti..."
              disabled={isLoading}
            />
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3">
              <p className="text-red-700 text-sm">{error}</p>
            </div>
          )}

          <div className="flex space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              disabled={isLoading}
              className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium transition-colors disabled:opacity-50"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="flex-1 px-4 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-medium rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Creando...
                </div>
              ) : (
                'Crear Cuenta'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
