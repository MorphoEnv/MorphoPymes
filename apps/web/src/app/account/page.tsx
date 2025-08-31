'use client';

import { useState } from 'react';
import Image from 'next/image';

export default function Account() {
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    firstName: 'Carlos Eduardo',
    lastName: 'Mendoza Rivera',
    description: 'Serial entrepreneur and investor with 8+ years experience in Latin American fintech and sustainable business development. Currently focused on blockchain-based financial inclusion initiatives.',
    profileImage: '/default-avatar.svg',
    email: 'carlos.mendoza@morphopymes.com',
    phone: '+506 8765-4321',
    location: 'San José, Costa Rica',
    joinDate: 'March 2024',
    totalInvestments: 45,
    totalInvested: 127500,
    portfolioValue: 142300,
    successfulExits: 12,
    averageROI: '22.5%'
  });

  const [tempData, setTempData] = useState(profileData);

  // Mock data para el portfolio e historial
  const [portfolioData] = useState([
    {
      id: 1,
      projectName: 'Verde Coffee Roastery',
      investmentAmount: 8500,
      currentValue: 9350,
      roi: 10.0,
      status: 'active',
      investmentDate: '2024-08-28'
    },
    {
      id: 2,
      projectName: 'TechRepair Solutions',
      investmentAmount: 12000,
      currentValue: 14400,
      roi: 20.0,
      status: 'completed',
      investmentDate: '2024-07-15'
    },
    {
      id: 3,
      projectName: 'Eco Textiles Artesanales',
      investmentAmount: 5500,
      currentValue: 6050,
      roi: 10.0,
      status: 'active',
      investmentDate: '2024-08-20'
    },
    {
      id: 4,
      projectName: 'FreshMarket Delivery',
      investmentAmount: 7200,
      currentValue: 8280,
      roi: 15.0,
      status: 'active',
      investmentDate: '2024-08-26'
    },
    {
      id: 5,
      projectName: 'Solar Panel Installation Co.',
      investmentAmount: 15000,
      currentValue: 18750,
      roi: 25.0,
      status: 'active',
      investmentDate: '2024-08-25'
    }
  ]);

  const [recentActivity] = useState([
    {
      id: 1,
      type: 'investment',
      description: 'Invested in Verde Coffee Roastery',
      amount: 8500,
      date: '2024-08-28',
      status: 'completed'
    },
    {
      id: 2,
      type: 'return',
      description: 'Received returns from TechRepair Solutions',
      amount: 2400,
      date: '2024-08-25',
      status: 'completed'
    },
    {
      id: 3,
      type: 'investment',
      description: 'Invested in FreshMarket Delivery',
      amount: 7200,
      date: '2024-08-22',
      status: 'completed'
    },
    {
      id: 4,
      type: 'dividend',
      description: 'Quarterly dividend from Solar Panel Installation Co.',
      amount: 1125,
      date: '2024-08-20',
      status: 'completed'
    }
  ]);

  // Calculate portfolio statistics
  const totalInvested = portfolioData.reduce((sum, item) => sum + item.investmentAmount, 0);
  const totalCurrentValue = portfolioData.reduce((sum, item) => sum + item.currentValue, 0);
  const totalReturn = totalCurrentValue - totalInvested;
  const activeInvestments = portfolioData.filter(item => item.status === 'active').length;

  const handleSave = () => {
    setProfileData(tempData);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setTempData(profileData);
    setIsEditing(false);
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        setTempData({...tempData, profileImage: result});
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100/60">
      {/* Header - Compact */}
      <section className="relative px-6 pt-28 pb-8 overflow-hidden">
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center">
            <div className="inline-flex items-center px-3 py-1.5 bg-blue-100/80 text-blue-800 text-xs font-medium rounded-full backdrop-blur-sm border border-blue-200/50 mb-4">
              <span className="relative flex h-1.5 w-1.5 mr-2">
                <span className="absolute inline-flex h-full w-full bg-blue-400 rounded-full opacity-75 animate-pulse"></span>
                <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-blue-600"></span>
              </span>
              Account Dashboard
            </div>
            
            <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 leading-tight mb-2">
              Welcome Back, <span className="bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">{profileData.firstName}</span>
            </h1>
            
            <p className="text-sm text-gray-600 leading-relaxed max-w-xl mx-auto">
              Manage your profile and account settings
            </p>
          </div>
        </div>
      </section>

      {/* Main Content - Horizontal Layout */}
      <section className="px-6 pb-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
            {/* Profile Section - Left Side */}
            <div className="bg-white/90 backdrop-blur-sm rounded-3xl p-6 border border-blue-200/50 shadow-xl">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900">Profile Information</h2>
                <button
                  onClick={() => setIsEditing(!isEditing)}
                  className="flex items-center space-x-2 px-3 py-1.5 text-blue-600 hover:text-blue-700 font-medium text-sm transition-all duration-300 hover:bg-blue-50/60 rounded-lg border border-blue-200/50 hover:border-blue-300/70"
                >
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                  <span>{isEditing ? 'Cancel' : 'Edit'}</span>
                </button>
              </div>

              <div className="space-y-6">
                {/* Profile Image */}
                <div className="text-center">
                  <div className="relative w-24 h-24 mx-auto mb-3">
                    <div className="w-full h-full rounded-full overflow-hidden border-3 border-blue-200/50 shadow-lg">
                      <Image
                        src={tempData.profileImage}
                        alt="Profile"
                        width={96}
                        height={96}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    {isEditing && (
                      <label className="absolute bottom-0 right-0 w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center text-white hover:bg-blue-700 transition-colors cursor-pointer">
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
                    <label className="text-xs text-blue-600 hover:text-blue-700 font-medium cursor-pointer">
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
                    <label className="block text-xs font-medium text-gray-700 mb-1">Description</label>
                    {isEditing ? (
                      <textarea
                        value={tempData.description}
                        onChange={(e) => setTempData({...tempData, description: e.target.value})}
                        rows={3}
                        className="w-full px-3 py-2 text-sm border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all resize-none"
                        placeholder="Tell us about yourself..."
                      />
                    ) : (
                      <div className="px-3 py-2 bg-gray-50 rounded-lg text-gray-700 text-sm min-h-[70px]">
                        {profileData.description}
                      </div>
                    )}
                  </div>

                  {isEditing && (
                    <div className="flex gap-3 pt-2">
                      <button
                        onClick={handleSave}
                        className="flex-1 px-4 py-2 bg-blue-600 text-white font-semibold text-sm rounded-lg hover:bg-blue-700 transition-all duration-300 shadow-lg hover:shadow-xl"
                      >
                        Save Changes
                      </button>
                      <button
                        onClick={handleCancel}
                        className="flex-1 px-4 py-2 border-2 border-blue-600 text-blue-600 font-semibold text-sm rounded-lg hover:bg-blue-50 transition-all duration-300"
                      >
                        Cancel
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Portfolio Stats */}
          <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-xl shadow-blue-500/5 border border-blue-100/50 p-6">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h3 className="text-xl font-bold text-gray-900">Portfolio Overview</h3>
                <p className="text-sm text-gray-600 mt-1">Your investment performance</p>
              </div>
              <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              <div className="bg-gradient-to-br from-blue-50 to-blue-100/60 rounded-xl p-4 border border-blue-200/50">
                <div className="text-2xl font-bold text-blue-600">${totalInvested.toLocaleString()}</div>
                <div className="text-xs text-gray-600 mt-1">Total Invested</div>
              </div>
              <div className="bg-gradient-to-br from-green-50 to-green-100/60 rounded-xl p-4 border border-green-200/50">
                <div className="text-2xl font-bold text-green-600">${totalCurrentValue.toLocaleString()}</div>
                <div className="text-xs text-gray-600 mt-1">Current Value</div>
              </div>
              <div className="bg-gradient-to-br from-purple-50 to-purple-100/60 rounded-xl p-4 border border-purple-200/50">
                <div className={`text-2xl font-bold ${totalReturn >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {totalReturn >= 0 ? '+' : ''}${totalReturn.toLocaleString()}
                </div>
                <div className="text-xs text-gray-600 mt-1">Total Return</div>
              </div>
              <div className="bg-gradient-to-br from-orange-50 to-orange-100/60 rounded-xl p-4 border border-orange-200/50">
                <div className="text-2xl font-bold text-orange-600">{activeInvestments}</div>
                <div className="text-xs text-gray-600 mt-1">Active Investments</div>
              </div>
            </div>

            <div className="space-y-3">
              <h4 className="font-semibold text-gray-900 text-sm">Recent Investments</h4>
              {portfolioData.slice(0, 3).map((investment: any, index: number) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200/50">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                      <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-6m-2-3h6m-8 0V9a2 2 0 012-2h2a2 2 0 012 2v8M7 7h.01M7 3h.01" />
                      </svg>
                    </div>
                    <div>
                      <div className="font-medium text-gray-900 text-sm">{investment.projectName}</div>
                      <div className="text-xs text-gray-600">{investment.investmentDate}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold text-gray-900 text-sm">${investment.investmentAmount.toLocaleString()}</div>
                    <div className={`text-xs ${investment.roi >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {investment.roi >= 0 ? '+' : ''}{investment.roi}%
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-xl shadow-blue-500/5 border border-blue-100/50 p-6">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h3 className="text-xl font-bold text-gray-900">Recent Activity</h3>
                <p className="text-sm text-gray-600 mt-1">Your latest transactions and updates</p>
              </div>
              <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            
            <div className="space-y-4">
              {recentActivity.map((activity: any, index: number) => (
                <div key={index} className="flex items-start space-x-4 p-4 bg-gray-50 rounded-lg border border-gray-200/50 hover:shadow-md transition-all">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                    activity.type === 'investment' ? 'bg-blue-100' :
                    activity.type === 'return' ? 'bg-green-100' :
                    activity.type === 'update' ? 'bg-purple-100' : 'bg-orange-100'
                  }`}>
                    {activity.type === 'investment' && (
                      <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                      </svg>
                    )}
                    {activity.type === 'return' && (
                      <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 11l5-5m0 0l5 5m-5-5v12" />
                      </svg>
                    )}
                    {activity.type === 'update' && (
                      <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    )}
                    {activity.type === 'milestone' && (
                      <svg className="w-5 h-5 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                      </svg>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium text-gray-900">{activity.description}</p>
                      <time className="text-xs text-gray-500 whitespace-nowrap">{activity.date || activity.time}</time>
                    </div>
                    {activity.details && (
                      <p className="text-xs text-gray-600 mt-1">{activity.details}</p>
                    )}
                    {activity.amount && (
                      <p className={`text-sm font-semibold mt-2 ${
                        activity.status === 'completed' ? 'text-green-600' : 
                        activity.status === 'pending' ? 'text-orange-600' : 'text-blue-600'
                      }`}>
                        ${activity.amount.toLocaleString()}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-xl shadow-blue-500/5 border border-blue-100/50 p-6">
            <div className="bg-white/90 backdrop-blur-sm rounded-3xl p-6 border border-blue-200/50 shadow-xl">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Account Settings</h2>
              
              <div className="space-y-4">
                <div className="bg-gradient-to-r from-blue-50 to-blue-100/60 rounded-xl p-4 border border-blue-200/50">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <h3 className="font-semibold text-gray-900 text-sm">Email Notifications</h3>
                      <p className="text-xs text-gray-600">Receive updates about your account</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" defaultChecked />
                      <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>
                </div>

                <div className="bg-gradient-to-r from-red-50 to-red-100/60 rounded-xl p-4 border border-red-200/50">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <h3 className="font-semibold text-gray-900 text-sm">Account Deletion</h3>
                      <p className="text-xs text-gray-600">Permanently delete your account</p>
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
      </section>
    </div>
  );
}
