/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react/no-unescaped-entities */
import Link from 'next/link';
import Image from 'next/image';
import { formatUsdWithEth } from '@/utils/currency';

export default function GetStarted() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative px-6 pt-24 pb-20 lg:pt-32 lg:pb-24 bg-gradient-to-br from-blue-50 via-white to-blue-100/60 overflow-hidden">
        <div className="absolute inset-0 bg-morpho-pattern opacity-20"></div>
        <div className="absolute inset-0 bg-morpho-dots opacity-10"></div>
        
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center px-4 py-2 bg-blue-100/80 text-blue-800 text-sm font-medium rounded-full backdrop-blur-sm border border-blue-200/50 mb-8">
            <span className="relative flex h-2 w-2 mr-2">
              <span className="absolute inline-flex h-full w-full bg-blue-400 rounded-full opacity-75 animate-ping"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-600"></span>
            </span>
            Start Your DeFi Journey
          </div>
          
          <h1 className="text-4xl lg:text-6xl font-bold text-gray-900 leading-tight mb-8">
            Choose Your Path to
            <br />
            <span className="bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
              Financial Freedom
            </span>
          </h1>
          
          <p className="text-xl text-gray-600 leading-relaxed max-w-3xl mx-auto mb-12">
            Join MorphoPymes and revolutionize how Latin America invests. 
            Whether you're an investor or entrepreneur, we have the perfect solution for you.
          </p>
        </div>
      </section>

      {/* Path Selection */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* For Investors */}
            <div className="relative group">
              <div className="bg-gradient-to-br from-blue-50 to-blue-100/60 rounded-3xl p-10 border border-blue-200/50 hover:shadow-2xl transition-all duration-500 group-hover:-translate-y-2">
                <div className="absolute -top-6 left-8">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg">
                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                    </svg>
                  </div>
                </div>

                <div className="pt-12">
                  <div className="text-sm text-blue-600 font-semibold mb-3">FOR INVESTORS</div>
                  <h2 className="text-3xl font-bold text-gray-900 mb-4">Start Investing</h2>
                  <p className="text-gray-600 mb-8 leading-relaxed">
                    Connect your wallet and start investing in verified Latin American SMEs. 
                    Earn up to 25% APY with investments starting from {formatUsdWithEth(10)}.
                  </p>

                  {/* Features List */}
                  <div className="space-y-4 mb-8">
                    <div className="flex items-center">
                      <div className="w-5 h-5 bg-blue-600 rounded-full flex items-center justify-center mr-3">
                        <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <span className="text-gray-700">Connect with MetaMask</span>
                    </div>
                    <div className="flex items-center">
                      <div className="w-5 h-5 bg-blue-600 rounded-full flex items-center justify-center mr-3">
                        <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <span className="text-gray-700">Browse verified opportunities</span>
                    </div>
                    <div className="flex items-center">
                      <div className="w-5 h-5 bg-blue-600 rounded-full flex items-center justify-center mr-3">
                        <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <span className="text-gray-700">Start with {formatUsdWithEth(10)} minimum</span>
                    </div>
                    <div className="flex items-center">
                      <div className="w-5 h-5 bg-blue-600 rounded-full flex items-center justify-center mr-3">
                        <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <span className="text-gray-700">Track returns in real-time</span>
                    </div>
                  </div>

                  <Link 
                    href="/get-started/investor"
                    className="block w-full text-center px-8 py-4 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105"
                  >
                    Start as Investor
                  </Link>
                </div>
              </div>
            </div>

            {/* For Entrepreneurs */}
            <div className="relative group">
              <div className="bg-gradient-to-br from-blue-50 to-blue-100/60 rounded-3xl p-10 border border-blue-200/50 hover:shadow-2xl transition-all duration-500 group-hover:-translate-y-2">
                <div className="absolute -top-6 left-8">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl flex items-center justify-center shadow-lg">
                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                  </div>
                </div>

                <div className="pt-12">
                  <div className="text-sm text-blue-700 font-semibold mb-3">FOR ENTREPRENEURS</div>
                  <h2 className="text-3xl font-bold text-gray-900 mb-4">Launch Your SME</h2>
                  <p className="text-gray-600 mb-8 leading-relaxed">
                    Register your business, get ENS verification, and access global funding. 
                    Submit your business plan and start raising capital today.
                  </p>

                  {/* Features List */}
                  <div className="space-y-4 mb-8">
                    <div className="flex items-center">
                      <div className="w-5 h-5 bg-blue-700 rounded-full flex items-center justify-center mr-3">
                        <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <span className="text-gray-700">Get ENS domain verification</span>
                    </div>
                    <div className="flex items-center">
                      <div className="w-5 h-5 bg-blue-700 rounded-full flex items-center justify-center mr-3">
                        <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <span className="text-gray-700">Submit business plans</span>
                    </div>
                    <div className="flex items-center">
                      <div className="w-5 h-5 bg-blue-700 rounded-full flex items-center justify-center mr-3">
                        <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <span className="text-gray-700">Access global investors</span>
                    </div>
                    <div className="flex items-center">
                      <div className="w-5 h-5 bg-blue-700 rounded-full flex items-center justify-center mr-3">
                        <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <span className="text-gray-700">Smart contract automation</span>
                    </div>
                  </div>

                  <Link 
                    href="/get-started/entrepreneur"
                    className="block w-full text-center px-8 py-4 bg-blue-700 text-white font-semibold rounded-xl hover:bg-blue-800 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105"
                  >
                    Start as Entrepreneur
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Technology Preview */}
      <section className="py-20 px-6 bg-morpho-dots">
        <div className="absolute inset-0 bg-blue-50/80"></div>
        <div className="max-w-6xl mx-auto text-center relative z-10">
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-8">
            Powered by Best-in-Class Technology
          </h2>
          
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-blue-100">
              <div className="w-12 h-12 bg-blue-600 rounded-xl mx-auto mb-4 flex items-center justify-center">
                <div className="w-6 h-6 bg-white rounded"></div>
              </div>
              <h3 className="font-bold text-gray-900 mb-2">ThirdWeb</h3>
              <p className="text-sm text-gray-600">Web3 SDK for seamless integration</p>
            </div>
            
            <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-blue-100">
              <div className="w-12 h-12 bg-orange-500 rounded-xl mx-auto mb-4 flex items-center justify-center">
                <div className="w-6 h-6 bg-white rounded-full"></div>
              </div>
              <h3 className="font-bold text-gray-900 mb-2">MetaMask</h3>
              <p className="text-sm text-gray-600">Secure wallet connection</p>
            </div>
            
            <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-blue-100">
              <div className="w-12 h-12 bg-blue-500 rounded-xl mx-auto mb-4 flex items-center justify-center">
                <div className="w-6 h-6 bg-white rounded"></div>
              </div>
              <h3 className="font-bold text-gray-900 mb-2">Morpho</h3>
              <p className="text-sm text-gray-600">DeFi lending protocol</p>
            </div>
            
            <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-blue-100">
              <div className="w-12 h-12 bg-blue-700 rounded-xl mx-auto mb-4 flex items-center justify-center">
                <div className="w-6 h-6 bg-white rounded"></div>
              </div>
              <h3 className="font-bold text-gray-900 mb-2">ENS</h3>
              <p className="text-sm text-gray-600">Domain verification</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
