'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useActiveAccount, useActiveWallet, useDisconnect } from 'thirdweb/react';

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeItem, setActiveItem] = useState('/');
  
  // ThirdWeb hooks
  const account = useActiveAccount();
  const activeWallet = useActiveWallet();
  const { disconnect } = useDisconnect();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    // Ya no necesitamos detectar MetaMask por separado
    // ThirdWeb maneja todo el estado de las wallets
  }, [account]);

  const handleDisconnectWallet = () => {
    if (activeWallet) {
      // Desconectar ThirdWeb (incluye MetaMask)
      disconnect(activeWallet);
    }
  };

  // Determinar qué wallet está conectado
  const isWalletConnected = !!account;
  const walletAddress = account?.address || '';
  const walletType = activeWallet?.id === 'io.metamask' 
    ? 'MetaMask' 
    : activeWallet?.id === 'walletConnect' 
    ? 'WalletConnect'
    : activeWallet?.id === 'inApp'
    ? 'ThirdWeb'
    : 'Wallet';

  const navItems = [
    { label: 'Invest', href: '/invest' },
    { label: 'Finance', href: '/finance' },
    { label: 'Ecosystem', href: '/ecosystem' },
    { label: 'About', href: '/about' },
  ];

  return (
    <nav
      className={`fixed top-4 left-1/2 transform -translate-x-1/2 z-50 transition-all duration-500 ease-out ${
        isScrolled
          ? 'bg-white/95 backdrop-blur-xl shadow-2xl border border-blue-100/50 scale-95'
          : 'bg-white/90 backdrop-blur-lg shadow-xl border border-blue-200/30'
      } rounded-2xl px-4 py-1.5 w-[98%] sm:w-[96%] max-w-6xl`}
    >
        <div className="flex items-center justify-between">
          {/* Logo with PNG */}
          <Link href="/" className="flex items-center group" onClick={() => setActiveItem('/')}>
            <div className="relative">
              {/* Logo container */}
              <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl flex items-center justify-center shadow-md group-hover:shadow-lg transition-all duration-300 group-hover:scale-105 overflow-hidden bg-white/80">
                <Image
                  src="/Logo1.png"
                  alt="MorphoPymes Logo"
                  width={40}
                  height={40}
                  className="object-contain sm:w-12 sm:h-12"
                />
              </div>
            </div>
          </Link>

          {/* Desktop Navigation - Clean design */}
          <div className="hidden lg:flex items-center space-x-6">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`relative px-3 py-2 rounded-lg font-medium text-sm transition-all duration-300 group ${
                  activeItem === item.href
                    ? 'text-blue-600'
                    : 'text-gray-700 hover:text-blue-600'
                }`}
                onClick={() => setActiveItem(item.href)}
              >
                <span>{item.label}</span>
                {/* Active/Hover indicator */}
                <div className={`absolute bottom-0 left-1/2 transform -translate-x-1/2 h-0.5 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full transition-all duration-300 ${
                  activeItem === item.href 
                    ? 'w-full' 
                    : 'w-0 group-hover:w-full'
                }`}></div>
              </Link>
            ))}
          </div>

          {/* Enhanced CTA Buttons */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            {isWalletConnected && walletAddress ? (
              // Mostrar icono de perfil cuando está conectado
              <div className="flex items-center space-x-3">
                <div className="hidden md:flex items-center space-x-2 px-3 py-2 bg-green-50 border border-green-200 rounded-lg">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-sm text-green-700 font-medium">
                    {walletAddress.slice(0, 6)}...{walletAddress.slice(-4)}
                  </span>
                  <div className="text-xs bg-green-100 text-green-600 px-2 py-0.5 rounded-full">
                    {walletType}
                  </div>
                </div>
                
                {/* Profile Icon Button */}
                <div className="relative group">
                  <Link href="/account" className="w-10 h-10 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white hover:shadow-lg transition-all duration-300 hover:scale-105">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </Link>
                  
                  {/* Dropdown menu (opcional para el futuro) */}
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-xl border border-gray-200 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50">
                    <div className="p-2 space-y-1">
                      <Link href="/dashboard" className="block px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg">
                        Dashboard
                      </Link>
                      <Link href="/account" className="block px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg">
                        Perfil
                      </Link>
                      <hr className="my-1" />
                      <button 
                        onClick={handleDisconnectWallet}
                        className="w-full text-left px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg"
                      >
                        Disconnect
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              // Botón "Connect" cuando no está conectado
              <Link
                href="/login"
                className="relative bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 text-white px-4 sm:px-5 py-2 rounded-lg font-semibold text-sm transition-all duration-300 flex items-center space-x-1.5 sm:space-x-2 overflow-hidden group hover:shadow-xl hover:scale-105"
              >
                {/* Animated background layers */}
                <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-blue-600 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out"></div>
                
                {/* Button content */}
                <span className="relative z-10 transition-transform duration-300 group-hover:translate-x-1">Connect</span>
                <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4 relative z-10 transition-all duration-300 group-hover:translate-x-2 group-hover:scale-110" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                </svg>
                
                {/* Pulse effect on hover */}
                <div className="absolute inset-0 rounded-lg bg-blue-400/20 scale-0 group-hover:scale-100 transition-transform duration-300"></div>
              </Link>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2 rounded-lg hover:bg-blue-50/60 transition-all duration-300 border border-blue-200/30 hover:border-blue-300/50"
            >
              <svg className={`w-5 h-5 text-blue-600 transition-transform duration-300 ${isMobileMenuOpen ? 'rotate-90' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {isMobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Menu - Clean design */}
        {isMobileMenuOpen && (
          <div className="lg:hidden mt-4 pt-4 border-t border-blue-200/30">
            <div className="flex flex-col space-y-1">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="flex items-center justify-between px-3 py-2.5 rounded-lg text-blue-700 hover:text-blue-800 hover:bg-blue-50/60 transition-all duration-300 font-medium group"
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    setActiveItem(item.href);
                  }}
                >
                  <span>{item.label}</span>
                  <svg className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              ))}
              <div className="pt-3 border-t border-blue-200/30 mt-3">
                {isWalletConnected && walletAddress ? (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between px-3 py-2 bg-green-50/60 rounded-lg border border-green-200/30">
                      <div className="flex items-center space-x-2">
                        <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center">
                          <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                          </svg>
                        </div>
                        <div className="flex flex-col">
                          <span className="text-sm text-green-700 font-medium">
                            {walletAddress.slice(0, 6)}...{walletAddress.slice(-4)}
                          </span>
                          <div className="text-xs bg-green-100 text-green-600 px-2 py-0.5 rounded-full w-fit">
                            {walletType}
                          </div>
                        </div>
                      </div>
                      <button 
                        onClick={handleDisconnectWallet}
                        className="text-green-600 hover:text-green-700"
                        title="Disconnect"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                        </svg>
                      </button>
                    </div>
                  </div>
                ) : (
                  <Link 
                    href="/login"
                    className="w-full flex items-center justify-center space-x-2 px-3 py-2.5 text-white font-medium transition-colors duration-300 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg hover:shadow-lg"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                    </svg>
                    <span>Connect</span>
                  </Link>
                )}
              </div>
            </div>
          </div>
        )}
      </nav>
    );
  }
