'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { useAuth } from '@/hooks/useAuth';
import { apiService } from '@/services/apiService';
import { useRouter } from 'next/navigation';
import { useActiveAccount } from 'thirdweb/react';

export default function Account() {
  const router = useRouter();
  const { user, token, logout, isAuthenticated, isLoading: authLoading } = useAuth();
  const activeAccount = useActiveAccount();
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  const [profileData, setProfileData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    walletAddress: '',
    userType: 'entrepreneur' as 'entrepreneur' | 'investor',
    description: '',
    profileImage: '/default-avatar.svg',
    verified: false,
    createdAt: '',
    // Campos adicionales opcionales
    phone: '',
    location: '',
    occupation: '',
    company: '',
    bio: '',
    interests: [] as string[],
  });

  const [tempData, setTempData] = useState(profileData);

  // UI state for wallet copy + withdraw
  const [copySuccess, setCopySuccess] = useState('');
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  const [withdrawDestination, setWithdrawDestination] = useState('');
  const [withdrawAmount, setWithdrawAmount] = useState(''); // in ETH
  const [withdrawLoading, setWithdrawLoading] = useState(false);
  const [withdrawError, setWithdrawError] = useState('');
  const [withdrawTxHash, setWithdrawTxHash] = useState('');

  // Redirigir si no está autenticado
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [authLoading, isAuthenticated, router]);

  // Cargar datos del usuario cuando esté disponible
  useEffect(() => {
    if (user) {
      console.log('👤 Loading user data into profile:', user);
      const userData = {
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        email: user.email || '',
        walletAddress: user.walletAddress || '',
        userType: user.userType || 'entrepreneur',
        description: user.description || '',
        profileImage: user.profileImage || '/default-avatar.svg',
        verified: user.verified || false,
        createdAt: user.createdAt || '',
        // Campos adicionales con valores por defecto
        phone: '',
        location: 'Sin especificar',
        occupation: user.userType === 'entrepreneur' ? 'Emprendedor' : 'Inversionista',
        company: 'Sin especificar',
        bio: user.description || '',
        interests: user.userType === 'entrepreneur' ? ['Emprendimiento', 'Negocios'] : ['Inversiones', 'Finanzas'],
      };
      setProfileData(userData);
      setTempData(userData);
    }
  }, [user]);

  // Helper: parse ETH decimal string to wei BigInt
  const parseEthToWei = (ethStr: string) => {
    if (!ethStr) return 0n;
    const cleaned = ethStr.trim();
    if (cleaned === '') return 0n;
    const parts = cleaned.split('.');
    const whole = parts[0] || '0';
    const frac = parts[1] || '';
    const wholeWei = BigInt(whole) * 10n ** 18n;
    const fracPadded = (frac + '0'.repeat(18)).slice(0, 18);
    const fracWei = BigInt(fracPadded || '0');
    return wholeWei + fracWei;
  };
  

  if (authLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100/60 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando perfil...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null; // El useEffect se encarga de la redirección
  }

  const handleSave = async () => {
    if (!user?.walletAddress) return;
    
    setIsLoading(true);
    setError('');
    setSuccess('');

    try {
      console.log('💾 Updating profile with data:', tempData);
      // Enviar todos los campos editables
      const updateData = {
        firstName: tempData.firstName,
        lastName: tempData.lastName,
        email: tempData.email || undefined,
        description: tempData.description || undefined,
        profileImage: tempData.profileImage !== '/default-avatar.svg' ? tempData.profileImage : undefined,
        phone: tempData.phone || undefined,
        location: tempData.location || undefined,
        occupation: tempData.occupation || undefined,
        company: tempData.company || undefined,
        bio: tempData.bio || undefined,
        interests: tempData.interests || [],
      };

      const response = await apiService.updateUserProfile(user.walletAddress, updateData);

      if (response.success && response.data) {
        console.log('✅ Profile updated successfully');
        setProfileData(tempData);
        setIsEditing(false);
        setSuccess('Perfil actualizado exitosamente');
        setTimeout(() => setSuccess(''), 3000);
      } else {
        console.error('❌ Profile update failed:', response.message);
        setError(response.message || 'Error al actualizar el perfil');
      }
    } catch (error) {
      console.error('💥 Error updating profile:', error);
      setError('Error de conexión. Intenta nuevamente.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setTempData(profileData);
    setIsEditing(false);
    setError('');
    setSuccess('');
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Optimistic preview
    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      setTempData({...tempData, profileImage: result});
    };
    reader.readAsDataURL(file);

    // Upload to backend
    (async () => {
      if (!user?.walletAddress || !token) return;
      try {
        setIsLoading(true);
        const resp = await apiService.uploadProfileImage(user.walletAddress, file, token);
        if (resp.success && resp.data?.url) {
          setTempData((prev) => ({ ...prev, profileImage: resp.data!.url }));
          setSuccess('Foto subida exitosamente');
          setTimeout(() => setSuccess(''), 3000);
        } else {
          setError(resp.message || 'Error al subir la imagen');
        }
      } catch (err) {
        console.error('Upload error:', err);
        setError('Error al subir la imagen');
      } finally {
        setIsLoading(false);
      }
    })();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100/60">
      {/* Header - Enhanced */}
      <section className="relative px-6 pt-28 pb-12 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/5 via-transparent to-purple-600/5"></div>
        <div className="absolute inset-0 bg-morpho-pattern opacity-[0.02]"></div>
        
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-8">
            <div className="inline-flex items-center px-4 py-2 bg-blue-100/80 text-blue-800 text-sm font-medium rounded-full backdrop-blur-sm border border-blue-200/50 mb-6">
              <span className="relative flex h-2 w-2 mr-3">
                <span className="absolute inline-flex h-full w-full bg-blue-400 rounded-full opacity-75 animate-pulse"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-600"></span>
              </span>
              Account Dashboard
            </div>
            
            <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 leading-tight mb-4">
              Welcome Back, <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">{profileData.firstName}</span>
            </h1>
            
            <p className="text-gray-600 leading-relaxed max-w-2xl mx-auto mb-6">
              Manage your profile, account settings, and preferences. Keep your information up-to-date to make the most of your MorphoPymes experience.
            </p>

            {/* Quick Stats */}
            <div className="flex justify-center items-center space-x-8">
              <div className="text-center">
                <div className="text-lg font-bold text-blue-600">{profileData.verified ? 'Verified' : 'Unverified'}</div>
                <div className="text-xs text-gray-500 font-medium">Account Status</div>
              </div>
              <div className="w-px h-8 bg-gray-300"></div>
              <div className="text-center">
                <div className="text-lg font-bold text-purple-600">{profileData.location}</div>
                <div className="text-xs text-gray-500 font-medium">Location</div>
              </div>
              <div className="w-px h-8 bg-gray-300"></div>
              <div className="text-center">
                <div className="text-lg font-bold text-green-600">{profileData.occupation}</div>
                <div className="text-xs text-gray-500 font-medium">Occupation</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content - Responsive Layout */}
      <section className="px-6 pb-12">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          
            {/* Profile Section - Left Side (2/3 width on xl screens) */}
            <div className="xl:col-span-2 bg-white/90 backdrop-blur-sm rounded-3xl p-8 border border-blue-200/50 shadow-xl">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl font-bold text-gray-900 flex items-center">
                  <svg className="w-6 h-6 mr-3 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  Profile Information
                </h2>
                <button
                  onClick={() => setIsEditing(!isEditing)}
                  className="flex items-center space-x-2 px-4 py-2 text-blue-600 hover:text-blue-700 font-medium text-sm transition-all duration-300 hover:bg-blue-50/60 rounded-xl border border-blue-200/50 hover:border-blue-300/70 hover:shadow-sm"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                  <span>{isEditing ? 'Cancel' : 'Edit Profile'}</span>
                </button>
              </div>

              <div className="space-y-8">
                {/* Profile Image */}
                <div className="text-center">
                  <div className="relative w-32 h-32 mx-auto mb-4">
                    <div className="w-full h-full rounded-full overflow-hidden border-4 border-blue-200/50 shadow-lg">
                      <Image
                        src={tempData.profileImage}
                        alt="Profile"
                        width={128}
                        height={128}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    {isEditing && (
                      <label className="absolute bottom-0 right-0 w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white hover:bg-blue-700 transition-colors cursor-pointer shadow-lg">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleImageUpload}
                          className="hidden"
                        />
                      </label>
                    )}
                  </div>
                  {isEditing && (
                    <label className="text-sm text-blue-600 hover:text-blue-700 font-medium cursor-pointer">
                      Change Photo
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                      />
                    </label>
                  )}
                </div>

                {/* Profile Form */}
                {/* Mensajes de éxito y error */}
                {success && (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-3 mb-4">
                    <div className="flex items-center">
                      <svg className="w-5 h-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <p className="text-green-700 text-sm font-medium">{success}</p>
                    </div>
                  </div>
                )}
                
                {error && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4">
                    <div className="flex items-center">
                      <svg className="w-5 h-5 text-red-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16c-.77.833.192 2.5 1.732 2.5z" />
                      </svg>
                      <p className="text-red-700 text-sm font-medium">{error}</p>
                    </div>
                  </div>
                )}
                
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">First Name</label>
                      {isEditing ? (
                        <input
                          type="text"
                          value={tempData.firstName}
                          onChange={(e) => setTempData({...tempData, firstName: e.target.value})}
                          className="w-full px-3 py-2 text-sm border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                          placeholder="Enter first name"
                        />
                      ) : (
                        <div className="px-3 py-2 bg-gray-50 rounded-lg text-gray-900 font-medium text-sm">
                          {profileData.firstName}
                        </div>
                      )}
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">Last Name</label>
                      {isEditing ? (
                        <input
                          type="text"
                          value={tempData.lastName}
                          onChange={(e) => setTempData({...tempData, lastName: e.target.value})}
                          className="w-full px-3 py-2 text-sm border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                          placeholder="Enter last name"
                        />
                      ) : (
                        <div className="px-3 py-2 bg-gray-50 rounded-lg text-gray-900 font-medium text-sm">
                          {profileData.lastName}
                        </div>
                      )}
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Email Address</label>
                    {isEditing ? (
                      <input
                        type="email"
                        value={tempData.email}
                        onChange={(e) => setTempData({...tempData, email: e.target.value})}
                        className="w-full px-3 py-2 text-sm border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                        placeholder="Enter your email"
                      />
                    ) : (
                      <div className="px-3 py-2 bg-gray-50 rounded-lg text-gray-900 font-medium text-sm flex items-center">
                        {profileData.email}
                        {profileData.verified && (
                          <svg className="w-4 h-4 ml-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                        )}
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Location</label>
                    {isEditing ? (
                      <input
                        type="text"
                        value={tempData.location}
                        onChange={(e) => setTempData({...tempData, location: e.target.value})}
                        className="w-full px-3 py-2 text-sm border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                        placeholder="City, Country"
                      />
                    ) : (
                      <div className="px-3 py-2 bg-gray-50 rounded-lg text-gray-900 font-medium text-sm">
                        {profileData.location}
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Occupation</label>
                    {isEditing ? (
                      <input
                        type="text"
                        value={tempData.occupation}
                        onChange={(e) => setTempData({...tempData, occupation: e.target.value})}
                        className="w-full px-3 py-2 text-sm border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                        placeholder="Your job title or profession"
                      />
                    ) : (
                      <div className="px-3 py-2 bg-gray-50 rounded-lg text-gray-900 font-medium text-sm">
                        {profileData.occupation}
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Company</label>
                    {isEditing ? (
                      <input
                        type="text"
                        value={tempData.company}
                        onChange={(e) => setTempData({...tempData, company: e.target.value})}
                        className="w-full px-3 py-2 text-sm border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                        placeholder="Your company or organization"
                      />
                    ) : (
                      <div className="px-3 py-2 bg-gray-50 rounded-lg text-gray-900 font-medium text-sm">
                        {profileData.company}
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Bio</label>
                    {isEditing ? (
                      <textarea
                        value={tempData.bio}
                        onChange={(e) => setTempData({...tempData, bio: e.target.value})}
                        rows={4}
                        className="w-full px-3 py-2 text-sm border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all resize-none"
                        placeholder="Tell us about yourself, your interests, and experience..."
                      />
                    ) : (
                      <div className="px-3 py-2 bg-gray-50 rounded-lg text-gray-700 text-sm min-h-[90px]">
                        {profileData.bio}
                      </div>
                    )}
                  </div>

                  {/* Interests removed as requested */}

                  {isEditing && (
                    <div className="flex gap-4 pt-6 border-t border-gray-200">
                      <button
                        onClick={handleSave}
                        className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold text-sm rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-300 shadow-lg hover:shadow-xl flex items-center justify-center space-x-2"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        <span>Save Changes</span>
                      </button>
                      <button
                        onClick={handleCancel}
                        className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 font-semibold text-sm rounded-xl hover:bg-gray-50 hover:border-gray-400 transition-all duration-300 flex items-center justify-center space-x-2"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                        <span>Cancel</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Account Overview & Settings Section - Right Side */}
            <div className="space-y-6">
              {/* Account Summary */}
              <div className="bg-white/90 backdrop-blur-sm rounded-3xl p-6 border border-blue-200/50 shadow-xl">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Account Overview</h2>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-gradient-to-r from-green-50 to-green-100/60 rounded-xl border border-green-200/50">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
                        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900 text-sm">Account Status</h3>
                        <p className="text-xs text-gray-600">Verified & Active</p>
                      </div>
                    </div>
                    <div className="px-3 py-1 bg-green-600 text-white text-xs font-medium rounded-full">
                      Verified
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-4 bg-blue-50 rounded-xl border border-blue-200/50">
                      <div className="text-2xl font-bold text-blue-600">
                        {new Date(profileData.createdAt || new Date()).toLocaleDateString('en', { 
                          month: 'short', 
                          year: 'numeric' 
                        })}
                      </div>
                      <div className="text-xs text-gray-600 font-medium">Member Since</div>
                    </div>

                    <div className="text-center p-4 bg-purple-50 rounded-xl border border-purple-200/50">
                      <div className="text-2xl font-bold text-purple-600">
                        {profileData.userType ? profileData.userType.charAt(0).toUpperCase() + profileData.userType.slice(1) : '—'}
                      </div>
                      <div className="text-xs text-gray-600 font-medium">User Type</div>
                    </div>
                  </div>
                </div>
              
              {/* Wallet Actions: copy + withdraw */}
              <div className="mt-4 p-4 bg-white rounded-xl border border-gray-100">
                <h3 className="text-sm font-semibold text-gray-900 mb-2">Connected Wallet</h3>
                <div className="text-xs text-gray-600 break-all mb-3">
                  {(profileData.walletAddress && profileData.walletAddress.length > 0) ? profileData.walletAddress : (activeAccount?.address || 'No wallet connected')}
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={async () => {
                      const addr = profileData.walletAddress || activeAccount?.address;
                      if (!addr) return;
                      try {
                        await navigator.clipboard.writeText(addr);
                        setCopySuccess('Copied');
                        setTimeout(() => setCopySuccess(''), 2000);
                      } catch (err) {
                        setCopySuccess('');
                      }
                    }}
                    className="px-3 py-2 border rounded-lg text-sm bg-blue-50 text-blue-700 hover:bg-blue-100"
                  >
                    Copy Wallet
                  </button>
                  <button
                    onClick={() => setShowWithdrawModal(true)}
                    className="px-3 py-2 border rounded-lg text-sm bg-gradient-to-r from-purple-600 to-purple-700 text-white hover:opacity-95"
                  >
                    Withdraw
                  </button>
                  {copySuccess && <div className="text-xs text-green-600 self-center">{copySuccess}</div>}
                </div>
                <p className="mt-3 text-xs text-gray-500">Withdraws use your connected wallet to send native ETH to an external address. This applies to funds held in your ThirdWeb in-app or connected wallet.</p>
              </div>
              
                {/* Withdraw Modal */}
                {showWithdrawModal && (
                  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
                    <div className="w-full max-w-md bg-white rounded-2xl p-6">
                      <h3 className="text-lg font-semibold mb-3">Withdraw ETH</h3>
                      <p className="text-xs text-gray-500 mb-4">Send native ETH from your connected wallet to an external address.</p>

                      <label className="text-xs font-medium">Destination Address</label>
                      <input
                        type="text"
                        value={withdrawDestination}
                        onChange={(e) => setWithdrawDestination(e.target.value)}
                        className="w-full px-3 py-2 mb-3 border rounded-lg text-sm"
                        placeholder="0x..."
                      />

                      <label className="text-xs font-medium">Amount (ETH)</label>
                      <input
                        type="text"
                        value={withdrawAmount}
                        onChange={(e) => setWithdrawAmount(e.target.value)}
                        className="w-full px-3 py-2 mb-3 border rounded-lg text-sm"
                        placeholder="0.01"
                      />

                      {withdrawError && <div className="text-sm text-red-600 mb-2">{withdrawError}</div>}
                      {withdrawTxHash && <div className="text-sm text-green-600 mb-2">Success: <a href={`https://sepolia.etherscan.io/tx/${withdrawTxHash}`} target="_blank" rel="noreferrer" className="underline">View tx</a></div>}

                      <div className="flex gap-3 mt-4 justify-end">
                        <button
                          onClick={() => {
                            setShowWithdrawModal(false);
                            setWithdrawError('');
                            setWithdrawTxHash('');
                          }}
                          className="px-4 py-2 rounded-lg border text-sm"
                        >
                          Cancel
                        </button>

                        <button
                          onClick={async () => {
                            setWithdrawError('');
                            setWithdrawTxHash('');
                            if (!activeAccount || !activeAccount.address) {
                              setWithdrawError('No connected wallet available to sign the transaction.');
                              return;
                            }
                            const dest = withdrawDestination?.trim();
                            if (!dest || !dest.startsWith('0x') || dest.length !== 42) {
                              setWithdrawError('Please enter a valid destination address (0x...).');
                              return;
                            }
                            // parse amount
                            let valueWei: bigint;
                            try {
                              valueWei = parseEthToWei(withdrawAmount || '0');
                              if (valueWei <= 0n) {
                                setWithdrawError('Enter an amount greater than 0');
                                return;
                              }
                            } catch (err) {
                              setWithdrawError('Invalid amount');
                              return;
                            }

                            setWithdrawLoading(true);
                            try {
                              // Use ThirdWeb account's sendTransaction API
                              // Cast options to any to satisfy typing in build environment
                              const tx = await activeAccount.sendTransaction(({
                                to: dest,
                                value: valueWei,
                              } as any));
                              // Prefer transactionHash; fall back to legacy .hash if present
                              setWithdrawTxHash(tx?.transactionHash ?? (tx as any)?.hash ?? '');
                              setWithdrawError('');
                            } catch (err: any) {
                              console.error('Withdraw error', err);
                              setWithdrawError(err?.message || 'Transaction failed');
                            } finally {
                              setWithdrawLoading(false);
                            }
                          }}
                          disabled={withdrawLoading}
                          className="px-4 py-2 rounded-lg bg-gradient-to-r from-purple-600 to-purple-700 text-white text-sm disabled:opacity-50"
                        >
                          {withdrawLoading ? 'Sending...' : 'Send'}
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Account Settings */}
              <div className="bg-white/90 backdrop-blur-sm rounded-3xl p-6 border border-blue-200/50 shadow-xl">
                <h2 className="text-xl font-bold text-gray-900 mb-6">Account Settings</h2>
                
                <div className="space-y-4">
                  {/* Email Notifications */}
                  <div className="bg-gradient-to-r from-blue-50 to-blue-100/60 rounded-xl p-4 border border-blue-200/50">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <h3 className="font-semibold text-gray-900 text-sm">Email Notifications</h3>
                        <p className="text-xs text-gray-600">Receive updates about investments and campaigns</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" className="sr-only peer" defaultChecked />
                        <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-blue-600"></div>
                      </label>
                    </div>
                  </div>

                  {/* Removed push notifications, two-factor, and profile visibility as requested */}

                  {/* Account Deletion */}
                  <div className="bg-gradient-to-r from-red-50 to-red-100/60 rounded-xl p-4 border border-red-200/50">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <h3 className="font-semibold text-gray-900 text-sm">Account Deletion</h3>
                        <p className="text-xs text-gray-600">Permanently delete your account and all data</p>
                      </div>
                      <button className="px-3 py-1.5 bg-red-600 text-white font-medium text-sm rounded-lg hover:bg-red-700 transition-colors">
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
