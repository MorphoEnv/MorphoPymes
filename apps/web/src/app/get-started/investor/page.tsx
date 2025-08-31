/* eslint-disable react/no-unescaped-entities */
'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { formatUsdWithEth } from '@/utils/currency';

export default function InvestorGetStarted() {
  const [isConnecting, setIsConnecting] = useState(false);
  const [isConnected, setIsConnected] = useState(false);

  const handleConnectWallet = async () => {
    setIsConnecting(true);
    // Simulate connection process
    setTimeout(() => {
      setIsConnecting(false);
      setIsConnected(true);
    }, 2000);
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative px-6 pt-24 pb-16 lg:pt-32 lg:pb-20 bg-gradient-to-br from-blue-50 via-white to-blue-100/60 overflow-hidden">
        <div className="absolute inset-0 bg-morpho-pattern opacity-20"></div>
        <div className="absolute inset-0 bg-morpho-dots opacity-10"></div>
        
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <Link 
            href="/get-started"
            className="inline-flex items-center text-blue-600 hover:text-blue-700 mb-6 transition-colors"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Get Started
          </Link>
          
          <div className="inline-flex items-center px-4 py-2 bg-blue-100/80 text-blue-800 text-sm font-medium rounded-full backdrop-blur-sm border border-blue-200/50 mb-8">
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
            </svg>
            For Investors
          </div>
          
          <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 leading-tight mb-8">
            Start Your Investment Journey
            <br />
            <span className="bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
              in Latin America
            </span>
          </h1>
          
            <p className="text-xl text-gray-600 leading-relaxed max-w-3xl mx-auto mb-12">
            Connect your wallet and start investing in verified SMEs with complete transparency. 
            Earn up to 25% APY with investments starting from {formatUsdWithEth(10)}.
          </p>
        </div>
      </section>

      {/* Setup Steps */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">3 Simple Steps to Start</h2>
            <p className="text-lg text-gray-600">Get started in minutes with our streamlined process</p>
          </div>

          <div className="space-y-8">
            {/* Step 1 - Connect Wallet */}
            <div className="bg-gradient-to-r from-blue-50 to-blue-100/60 rounded-3xl p-8 border border-blue-200/50 relative overflow-hidden">
              <div className="flex items-center justify-between flex-wrap gap-6">
                <div className="flex items-start space-x-6 flex-1">
                  <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center text-white font-bold text-xl flex-shrink-0">
                    1
                  </div>
                  <div className="flex-1">
                    <h3 className="text-2xl font-bold text-gray-900 mb-3">Connect Your Wallet</h3>
                    <p className="text-gray-600 mb-6 leading-relaxed">
                      Connect your MetaMask wallet to interact with our DeFi platform. 
                      We support all major Ethereum wallets through ThirdWeb integration.
                    </p>
                    
                    {!isConnected ? (
                      <button 
                        onClick={handleConnectWallet}
                        disabled={isConnecting}
                        className={`inline-flex items-center px-6 py-3 bg-blue-600 text-white font-semibold rounded-xl transition-all duration-300 ${
                          isConnecting 
                            ? 'opacity-50 cursor-not-allowed' 
                            : 'hover:bg-blue-700 hover:scale-105 shadow-lg hover:shadow-xl'
                        }`}
                      >
                        {isConnecting ? (
                          <>
                            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                            Connecting...
                          </>
                        ) : (
                          <>
                            <div className="w-5 h-5 bg-orange-500 rounded mr-3"></div>
                            Connect MetaMask
                          </>
                        )}
                      </button>
                    ) : (
                      <div className="inline-flex items-center px-6 py-3 bg-green-100 text-green-700 font-semibold rounded-xl">
                        <svg className="w-5 h-5 mr-3" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                        Wallet Connected
                      </div>
                    )}
                  </div>
                </div>
                <div className="w-24 h-24 bg-orange-500/10 rounded-2xl flex items-center justify-center">
                  <div className="w-12 h-12 bg-orange-500 rounded-xl"></div>
                </div>
              </div>
            </div>

            {/* Step 2 - Browse Opportunities */}
            <div className={`bg-gradient-to-r from-blue-50 to-blue-100/60 rounded-3xl p-8 border border-blue-200/50 relative overflow-hidden transition-all duration-500 ${
              isConnected ? 'opacity-100' : 'opacity-60'
            }`}>
              <div className="flex items-center justify-between flex-wrap gap-6">
                <div className="flex items-start space-x-6 flex-1">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-white font-bold text-xl flex-shrink-0 ${
                    isConnected ? 'bg-blue-600' : 'bg-gray-400'
                  }`}>
                    2
                  </div>
                  <div className="flex-1">
                    <h3 className="text-2xl font-bold text-gray-900 mb-3">Browse Investment Opportunities</h3>
                    <p className="text-gray-600 mb-6 leading-relaxed">
                      Explore our curated marketplace of verified SMEs. Each business comes with 
                      detailed plans, financial projections, and ENS-verified credentials.
                    </p>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                      <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 border border-blue-100">
                        <div className="text-lg font-bold text-blue-600">{formatUsdWithEth(10)}+</div>
                        <div className="text-sm text-gray-600">Min Investment</div>
                      </div>
                      <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 border border-blue-100">
                        <div className="text-lg font-bold text-blue-600">150+</div>
                        <div className="text-sm text-gray-600">Verified SMEs</div>
                      </div>
                      <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 border border-blue-100">
                        <div className="text-lg font-bold text-blue-600">8-25%</div>
                        <div className="text-sm text-gray-600">Expected APY</div>
                      </div>
                    </div>

                    <button 
                      disabled={!isConnected}
                      className={`inline-flex items-center px-6 py-3 font-semibold rounded-xl transition-all duration-300 ${
                        isConnected
                          ? 'bg-blue-600 text-white hover:bg-blue-700 hover:scale-105 shadow-lg hover:shadow-xl'
                          : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      }`}
                    >
                      Browse Opportunities
                      <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5-5 5M6 12h12" />
                      </svg>
                    </button>
                  </div>
                </div>
                <div className="w-24 h-24 bg-blue-500/10 rounded-2xl flex items-center justify-center">
                  <div className="w-12 h-12 bg-blue-500 rounded-xl"></div>
                </div>
              </div>
            </div>

            {/* Step 3 - Start Investing */}
            <div className={`bg-gradient-to-r from-blue-50 to-blue-100/60 rounded-3xl p-8 border border-blue-200/50 relative overflow-hidden transition-all duration-500 ${
              isConnected ? 'opacity-100' : 'opacity-60'
            }`}>
              <div className="flex items-center justify-between flex-wrap gap-6">
                <div className="flex items-start space-x-6 flex-1">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-white font-bold text-xl flex-shrink-0 ${
                    isConnected ? 'bg-blue-600' : 'bg-gray-400'
                  }`}>
                    3
                  </div>
                  <div className="flex-1">
                    <h3 className="text-2xl font-bold text-gray-900 mb-3">Start Investing & Track Returns</h3>
                    <p className="text-gray-600 mb-6 leading-relaxed">
                      Make your first investment and track your portfolio in real-time. 
                      Our smart contracts automatically handle distributions and returns.
                    </p>
                    
                    <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 border border-blue-100 mb-6">
                      <div className="flex items-center justify-between mb-4">
                        <span className="text-sm text-gray-600">Your Portfolio</span>
                        <span className="text-sm text-green-600 font-medium">+12.5% Total Return</span>
                      </div>
                      <div className="space-y-3">
                        <div className="flex justify-between text-sm">
                          <span>Total Invested</span>
                          <span className="font-semibold">$0</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>Active Investments</span>
                          <span className="font-semibold">0</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div className="bg-blue-500 h-2 rounded-full w-0"></div>
                        </div>
                      </div>
                    </div>

                    <button 
                      disabled={!isConnected}
                      className={`inline-flex items-center px-6 py-3 font-semibold rounded-xl transition-all duration-300 ${
                        isConnected
                          ? 'bg-green-600 text-white hover:bg-green-700 hover:scale-105 shadow-lg hover:shadow-xl'
                          : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      }`}
                    >
                      Access Dashboard
                      <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                      </svg>
                    </button>
                  </div>
                </div>
                <div className="w-24 h-24 bg-green-500/10 rounded-2xl flex items-center justify-center">
                  <div className="w-12 h-12 bg-green-500 rounded-xl"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 px-6 bg-morpho-dots">
        <div className="absolute inset-0 bg-blue-50/80"></div>
        <div className="max-w-4xl mx-auto relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Frequently Asked Questions</h2>
            <p className="text-lg text-gray-600">Everything you need to know to get started</p>
          </div>

          <div className="space-y-6">
            <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 border border-blue-100">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">What wallets are supported?</h3>
              <p className="text-gray-600">We support MetaMask and all major Ethereum wallets through ThirdWeb integration. You can also use WalletConnect for mobile wallets.</p>
            </div>
            
            <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 border border-blue-100">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">What's the minimum investment?</h3>
              <p className="text-gray-600">You can start investing with as little as {formatUsdWithEth(10)} equivalent in ETH or USDC. This makes DeFi accessible to everyone.</p>
            </div>
            
            <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 border border-blue-100">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">How are returns calculated?</h3>
              <p className="text-gray-600">Returns are calculated based on the performance of your invested SMEs. Our smart contracts automatically distribute profits according to predetermined terms.</p>
            </div>
            
            <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 border border-blue-100">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Is my investment secure?</h3>
              <p className="text-gray-600">All investments are secured by audited smart contracts on Ethereum. We use Morpho Protocol for additional security and transparency.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
