'use client';

import { useState } from 'react';
import { useWeb3Auth, User } from '@/hooks/useWeb3Auth';
import { User as UserIcon, Mail, AtSign, Loader2, Check, X } from 'lucide-react';

interface ProfileSetupProps {
  user: User;
  onComplete: () => void;
  onSkip: () => void;
}

export default function ProfileSetup({ user, onComplete, onSkip }: ProfileSetupProps) {
  const { updateUserProfile, isLoading } = useWeb3Auth();
  const [formData, setFormData] = useState({
    email: user.email || '',
    username: user.username || ''
  });
  const [errors, setErrors] = useState<{ email?: string; username?: string }>({});

  const validateForm = () => {
    const newErrors: { email?: string; username?: string } = {};

    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Email inválido';
    }

    if (formData.username && formData.username.length < 3) {
      newErrors.username = 'El username debe tener al menos 3 caracteres';
    }

    if (formData.username && !/^[a-zA-Z0-9_]+$/.test(formData.username)) {
      newErrors.username = 'El username solo puede contener letras, números y guiones bajos';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    try {
      await updateUserProfile(formData);
      onComplete();
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  };

  const handleInputChange = (field: 'email' | 'username', value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-900 dark:to-gray-800">
      <div className="max-w-md w-full mx-4">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6">
          <div className="text-center mb-6">
            <UserIcon className="h-12 w-12 text-blue-600 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">
              Completa tu perfil
            </h2>
            <p className="text-gray-600 dark:text-gray-300">
              Agrega información adicional a tu cuenta
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Email (opcional)
              </label>
              <div className="relative">
                <Mail className="h-5 w-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white ${
                    errors.email ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="tu-email@ejemplo.com"
                />
              </div>
              {errors.email && (
                <p className="text-red-500 text-sm mt-1">{errors.email}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Username (opcional)
              </label>
              <div className="relative">
                <AtSign className="h-5 w-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                <input
                  type="text"
                  value={formData.username}
                  onChange={(e) => handleInputChange('username', e.target.value)}
                  className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white ${
                    errors.username ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="tu_username"
                />
              </div>
              {errors.username && (
                <p className="text-red-500 text-sm mt-1">{errors.username}</p>
              )}
            </div>

            <div className="space-y-3 pt-4">
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-medium py-2 px-4 rounded-lg transition-colors flex items-center justify-center"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    Guardando...
                  </>
                ) : (
                  <>
                    <Check className="h-4 w-4 mr-2" />
                    Guardar perfil
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={onSkip}
                disabled={isLoading}
                className="w-full bg-gray-200 hover:bg-gray-300 dark:bg-gray-600 dark:hover:bg-gray-500 text-gray-800 dark:text-white font-medium py-2 px-4 rounded-lg transition-colors flex items-center justify-center"
              >
                <X className="h-4 w-4 mr-2" />
                Saltar por ahora
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
