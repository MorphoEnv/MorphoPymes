'use client';

import { useState } from 'react';
import { useWeb3Auth, User } from '@/hooks/useWeb3Auth';
import { 
  User as UserIcon, 
  Mail, 
  AtSign, 
  Wallet, 
  Edit3, 
  LogOut, 
  Copy, 
  Check 
} from 'lucide-react';

interface UserProfileProps {
  user: User;
}

export default function UserProfile({ user }: UserProfileProps) {
  const { disconnectWallet, updateUserProfile, isLoading } = useWeb3Auth();
  const [isEditing, setIsEditing] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const [formData, setFormData] = useState({
    email: user.email || '',
    username: user.username || ''
  });

  const copyAddress = async () => {
    try {
      await navigator.clipboard.writeText(user.address);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    } catch (err) {
      console.error('Error copying address:', err);
    }
  };

  const handleSave = async () => {
    try {
      await updateUserProfile(formData);
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  };

  const handleCancel = () => {
    setFormData({
      email: user.email || '',
      username: user.username || ''
    });
    setIsEditing(false);
  };

  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-900 dark:to-gray-800 py-8">
      <div className="max-w-2xl mx-auto px-4">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="bg-white dark:bg-gray-800 rounded-full p-3">
                  <UserIcon className="h-8 w-8 text-blue-600" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-white">
                    {user.username || 'Usuario'}
                  </h1>
                  <p className="text-blue-100">
                    Miembro desde {new Date(user.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
              <button
                onClick={() => disconnectWallet()}
                className="bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-lg transition-colors flex items-center space-x-2"
              >
                <LogOut className="h-4 w-4" />
                <span>Desconectar</span>
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="p-6">
            <div className="space-y-6">
              {/* Wallet Address */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Dirección de Wallet
                </label>
                <div className="flex items-center space-x-2">
                  <div className="flex-1 bg-gray-50 dark:bg-gray-700 rounded-lg p-3 flex items-center space-x-3">
                    <Wallet className="h-5 w-5 text-gray-400" />
                    <span className="font-mono text-sm text-gray-800 dark:text-gray-200">
                      {formatAddress(user.address)}
                    </span>
                  </div>
                  <button
                    onClick={copyAddress}
                    className="bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-lg transition-colors"
                  >
                    {isCopied ? (
                      <Check className="h-4 w-4" />
                    ) : (
                      <Copy className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Email
                </label>
                {isEditing ? (
                  <div className="relative">
                    <Mail className="h-5 w-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                      placeholder="tu-email@ejemplo.com"
                    />
                  </div>
                ) : (
                  <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3 flex items-center space-x-3">
                    <Mail className="h-5 w-5 text-gray-400" />
                    <span className="text-gray-800 dark:text-gray-200">
                      {user.email || 'No configurado'}
                    </span>
                  </div>
                )}
              </div>

              {/* Username */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Username
                </label>
                {isEditing ? (
                  <div className="relative">
                    <AtSign className="h-5 w-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                    <input
                      type="text"
                      value={formData.username}
                      onChange={(e) => setFormData(prev => ({ ...prev, username: e.target.value }))}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                      placeholder="tu_username"
                    />
                  </div>
                ) : (
                  <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3 flex items-center space-x-3">
                    <AtSign className="h-5 w-5 text-gray-400" />
                    <span className="text-gray-800 dark:text-gray-200">
                      {user.username || 'No configurado'}
                    </span>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex space-x-3 pt-4">
                {isEditing ? (
                  <>
                    <button
                      onClick={handleSave}
                      disabled={isLoading}
                      className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-medium py-2 px-4 rounded-lg transition-colors"
                    >
                      {isLoading ? 'Guardando...' : 'Guardar cambios'}
                    </button>
                    <button
                      onClick={handleCancel}
                      disabled={isLoading}
                      className="flex-1 bg-gray-200 hover:bg-gray-300 dark:bg-gray-600 dark:hover:bg-gray-500 text-gray-800 dark:text-white font-medium py-2 px-4 rounded-lg transition-colors"
                    >
                      Cancelar
                    </button>
                  </>
                ) : (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors flex items-center space-x-2"
                  >
                    <Edit3 className="h-4 w-4" />
                    <span>Editar perfil</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
