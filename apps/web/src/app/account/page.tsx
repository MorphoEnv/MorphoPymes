'use client';

import { useState } from 'react';
import Image from 'next/image';

export default function Account() {
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    firstName: 'Juan',
    lastName: 'Pérez',
    email: 'juan.perez@morphopymes.com',
    phone: '+57 300 123 4567',
    location: 'Bogotá, Colombia',
    occupation: 'Software Engineer & Entrepreneur',
    company: 'TechStart Colombia',
    bio: 'Passionate entrepreneur focused on developing innovative technology solutions for Latin American small businesses. With over 5 years of experience in fintech and blockchain, I believe in democratizing access to investment opportunities.',
    interests: ['Blockchain', 'FinTech', 'Startups', 'AI'],
    profileImage: '/default-avatar.svg',
    joinedDate: '2024-01-15',
    isVerified: true
  });

  const [tempData, setTempData] = useState(profileData);

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
                <div className="text-lg font-bold text-blue-600">{profileData.isVerified ? 'Verified' : 'Unverified'}</div>
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
                        {profileData.isVerified && (
                          <svg className="w-4 h-4 ml-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                        )}
                      </div>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">Phone Number</label>
                      {isEditing ? (
                        <input
                          type="tel"
                          value={tempData.phone}
                          onChange={(e) => setTempData({...tempData, phone: e.target.value})}
                          className="w-full px-3 py-2 text-sm border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                          placeholder="Enter phone number"
                        />
                      ) : (
                        <div className="px-3 py-2 bg-gray-50 rounded-lg text-gray-900 font-medium text-sm">
                          {profileData.phone}
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

                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-2">Interests</label>
                    {isEditing ? (
                      <div className="space-y-2">
                        <input
                          type="text"
                          value={tempData.interests.join(', ')}
                          onChange={(e) => setTempData({...tempData, interests: e.target.value.split(',').map(s => s.trim()).filter(s => s)})}
                          className="w-full px-3 py-2 text-sm border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                          placeholder="Enter interests separated by commas"
                        />
                        <p className="text-xs text-gray-500">Separate interests with commas (e.g., Blockchain, FinTech, AI)</p>
                      </div>
                    ) : (
                      <div className="px-3 py-2 bg-gray-50 rounded-lg">
                        <div className="flex flex-wrap gap-2">
                          {profileData.interests.map((interest, index) => (
                            <span key={index} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full font-medium">
                              {interest}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

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
                        {new Date(profileData.joinedDate).toLocaleDateString('en', { 
                          month: 'short', 
                          year: 'numeric' 
                        })}
                      </div>
                      <div className="text-xs text-gray-600 font-medium">Member Since</div>
                    </div>

                    <div className="text-center p-4 bg-purple-50 rounded-xl border border-purple-200/50">
                      <div className="text-2xl font-bold text-purple-600">
                        {profileData.interests.length}
                      </div>
                      <div className="text-xs text-gray-600 font-medium">Interests</div>
                    </div>
                  </div>
                </div>
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

                  {/* Push Notifications */}
                  <div className="bg-gradient-to-r from-purple-50 to-purple-100/60 rounded-xl p-4 border border-purple-200/50">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <h3 className="font-semibold text-gray-900 text-sm">Push Notifications</h3>
                        <p className="text-xs text-gray-600">Get real-time updates on your investments</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" className="sr-only peer" />
                        <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-purple-600"></div>
                      </label>
                    </div>
                  </div>

                  {/* Two Factor Authentication */}
                  <div className="bg-gradient-to-r from-yellow-50 to-yellow-100/60 rounded-xl p-4 border border-yellow-200/50">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <h3 className="font-semibold text-gray-900 text-sm">Two-Factor Authentication</h3>
                        <p className="text-xs text-gray-600">Add extra security to your account</p>
                      </div>
                      <button className="px-3 py-1.5 bg-yellow-600 text-white font-medium text-sm rounded-lg hover:bg-yellow-700 transition-colors">
                        Enable
                      </button>
                    </div>
                  </div>

                  {/* Privacy Settings */}
                  <div className="bg-gradient-to-r from-indigo-50 to-indigo-100/60 rounded-xl p-4 border border-indigo-200/50">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <h3 className="font-semibold text-gray-900 text-sm">Profile Visibility</h3>
                        <p className="text-xs text-gray-600">Control who can see your profile information</p>
                      </div>
                      <select className="text-sm border border-indigo-200 rounded-lg px-3 py-1.5 bg-white focus:ring-2 focus:ring-indigo-500 outline-none">
                        <option>Public</option>
                        <option>Private</option>
                        <option>Investors Only</option>
                      </select>
                    </div>
                  </div>

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
