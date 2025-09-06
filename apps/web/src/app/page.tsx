import Image from 'next/image';
import { formatUsdWithEth } from '@/utils/currency';
import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative px-6 pt-32 pb-20 lg:pt-40 lg:pb-24 bg-gradient-to-br from-blue-50 via-white to-blue-100/60 overflow-hidden">
        {/* Enhanced Hero Background */}
        <div className="absolute inset-0 bg-morpho-pattern opacity-30"></div>
        <div className="absolute inset-0 bg-morpho-dots"></div>
        
        <div className="max-w-6xl mx-auto relative z-10">
          <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-16">
            {/* Left Content */}
            <div className="flex-1 text-center lg:text-left space-y-6">
              
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
                The Investment
                <br />
                <span className="text-blue-600">Platform for</span>
                <br />
                Latin America
              </h1>
              
              <p className="text-lg text-gray-600 max-w-lg leading-relaxed">
                Democratizing micro-investments through DeFi. 
                Connect entrepreneurs with global investors using 
                smart contracts and ENS domains.
              </p>

              <div className="flex flex-col sm:flex-row gap-3 lg:justify-start justify-center">
                <Link href="/login" className="bg-blue-600 text-white px-8 py-3 rounded-xl font-semibold text-base hover:bg-blue-700 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 uppercase tracking-wide text-center">
                  START INVESTING
                </Link>
                <button className="border-2 border-gray-300 text-gray-700 px-8 py-3 rounded-xl font-semibold text-base hover:bg-gray-50 hover:border-gray-400 transition-all duration-300">
                  How it works?
                </button>
              </div>

              <div className="flex items-center gap-6 pt-4 justify-center lg:justify-start">
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900">{formatUsdWithEth(10)}</div>
                    <div className="text-sm text-gray-600">Starting from</div>
                </div>
                <div className="w-px h-12 bg-gray-300"></div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900">100%</div>
                  <div className="text-sm text-gray-600">Transparent</div>
                </div>
                <div className="w-px h-12 bg-gray-300"></div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900">DeFi</div>
                  <div className="text-sm text-gray-600">Powered</div>
                </div>
              </div>
            </div>

            {/* Right Visual Element - Solo tu Figura 1 */}
            <div className="flex-1 flex justify-center lg:justify-end">
              <div className="relative">
                <Image 
                  src="/Figura1.png" 
                  alt="MorphoPymes Platform Overview" 
                  width={500} 
                  height={500}
                  className="w-full max-w-md lg:max-w-lg xl:max-w-xl"
                  priority
                />
              </div>
            </div>
          </div>
        </div>

        {/* Clean Startup MVP Background */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {/* Grid Pattern */}
          <div className="absolute inset-0 bg-grid-pattern opacity-[0.02]"></div>
          
          {/* Gradient Orbs - Only Morpho Blues */}
          <div className="absolute top-20 -left-40 w-80 h-80 bg-blue-400/12 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-40 -right-20 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"></div>
          <div className="absolute top-1/2 right-1/4 w-64 h-64 bg-blue-300/8 rounded-full blur-2xl"></div>
          
          {/* Geometric Lines */}
          <div className="absolute top-32 left-1/4 w-32 h-px bg-gradient-to-r from-transparent via-gray-300/30 to-transparent"></div>
          <div className="absolute bottom-48 right-1/3 w-24 h-px bg-gradient-to-r from-transparent via-blue-300/25 to-transparent rotate-45"></div>
          <div className="absolute top-2/3 left-1/6 w-20 h-px bg-gradient-to-r from-transparent via-blue-400/20 to-transparent -rotate-12"></div>
          
          {/* Minimal Dots */}
          <div className="absolute top-40 right-20 w-1 h-1 bg-gray-400/40 rounded-full"></div>
          <div className="absolute bottom-60 left-16 w-1.5 h-1.5 bg-blue-400/30 rounded-full"></div>
          <div className="absolute top-1/2 left-1/3 w-0.5 h-0.5 bg-blue-500/50 rounded-full"></div>
          <div className="absolute bottom-1/3 right-1/4 w-1 h-1 bg-blue-600/35 rounded-full"></div>
          
          {/* Subtle Floating Elements */}
          <div className="absolute top-1/4 left-12 w-8 h-8 border border-gray-200/30 rounded rotate-45 animate-pulse" style={{animationDuration: '4s'}}></div>
          <div className="absolute bottom-1/4 right-16 w-6 h-6 border border-blue-200/25 rounded-full animate-pulse" style={{animationDuration: '6s', animationDelay: '2s'}}></div>
          <div className="absolute top-3/5 right-1/3 w-4 h-4 border border-blue-300/20 rounded-sm rotate-12 animate-pulse" style={{animationDuration: '5s', animationDelay: '1s'}}></div>
        </div>
      </section>

      {/* How It Works Section - Redesigned */}
      <section className="relative py-32 px-6 bg-morpho-gradient-mesh">
        <div className="absolute inset-0 bg-morpho-dots opacity-20"></div>
        <div className="max-w-7xl mx-auto relative z-10">
          {/* Section Header */}
          <div className="text-center mb-24">
            <div className="inline-flex items-center px-6 py-3 bg-blue-100/80 border border-blue-200 rounded-full text-blue-800 font-semibold text-sm mb-8 shadow-sm backdrop-blur-sm">
              <div className="w-2 h-2 bg-blue-600 rounded-full mr-3 animate-pulse"></div>
              How MorphoPymes Works
            </div>
            <h2 className="text-5xl lg:text-6xl font-bold text-gray-900 mb-8 leading-tight">
              From Idea to
              <br />
              <span className="bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
                Investment Success
              </span>
            </h2>
            <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
              Our revolutionary DeFi platform streamlines micro-investing while ensuring transparency, 
              security, and maximum returns for both entrepreneurs and investors.
            </p>
          </div>

          {/* Interactive Steps */}
          <div className="relative">


            {/* Connection Lines */}
            <div className="hidden lg:block absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
              <div className="absolute w-80 h-px bg-gradient-to-r from-transparent via-blue-400/60 to-transparent rotate-0"></div>
              <div className="absolute w-80 h-px bg-gradient-to-r from-transparent via-blue-500/60 to-transparent rotate-60"></div>
              <div className="absolute w-80 h-px bg-gradient-to-r from-transparent via-blue-300/60 to-transparent rotate-120"></div>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-16 lg:gap-8">
              {/* Step 1 - For Investors */}
              <div className="relative group">
                <div className="bg-white/90 backdrop-blur-sm rounded-3xl p-10 shadow-xl border border-blue-100 hover:shadow-2xl transition-all duration-500 group-hover:-translate-y-2">
                  <div className="absolute -top-6 left-8">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                      </svg>
                    </div>
                  </div>
                  
                  <div className="pt-8">
                    <div className="text-sm text-blue-600 font-semibold mb-3">FOR INVESTORS</div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-4">Discover & Invest</h3>
                    <p className="text-gray-600 mb-8 leading-relaxed">
                      Browse verified SMEs with detailed business plans, financial projections, and ENS-verified identities. 
                      Start investing from just 0.01 ETH with complete transparency.
                    </p>
                    
                    {/* Mini Dashboard Preview */}
                    <div className="bg-gradient-to-r from-blue-50 to-blue-100/60 rounded-2xl p-6 mb-6 border border-blue-200/30">
                      <div className="flex items-center justify-between mb-4">
                        <div className="text-sm text-gray-600">Investment Range</div>
                        <div className="text-lg font-bold text-blue-600">0.01 - 10 ETH</div>
                      </div>
                      <div className="flex items-center justify-between mb-4">
                        <div className="text-sm text-gray-600">Expected ROI</div>
                        <div className="text-lg font-bold text-blue-700">8-25% APY</div>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-gradient-to-r from-blue-400 to-blue-600 h-2 rounded-full w-3/4"></div>
                      </div>
                      <div className="text-xs text-gray-500 mt-2">Portfolio diversification recommended</div>
                    </div>

                    <div className="flex items-center text-sm text-gray-500">
                      <div className="w-2 h-2 bg-blue-400 rounded-full mr-2 animate-pulse"></div>
                      Live marketplace with 50+ verified projects
                    </div>
                  </div>
                </div>
              </div>

              {/* Step 2 - For Entrepreneurs */}
              <div className="relative group">
                <div className="bg-white/90 backdrop-blur-sm rounded-3xl p-10 shadow-xl border border-blue-100 hover:shadow-2xl transition-all duration-500 group-hover:-translate-y-2">
                  <div className="absolute -top-6 left-8">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-700 rounded-xl flex items-center justify-center shadow-lg">
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                      </svg>
                    </div>
                  </div>
                  
                  <div className="pt-8">
                    <div className="text-sm text-blue-700 font-semibold mb-3">FOR ENTREPRENEURS</div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-4">Launch & Scale</h3>
                    <p className="text-gray-600 mb-8 leading-relaxed">
                      Register your SME with ENS domain verification, submit business plans, and access global capital. 
                      Our smart contracts ensure fair terms and automated distributions.
                    </p>
                    
                    {/* Application Process */}
                    <div className="bg-gradient-to-r from-blue-50 to-blue-100/60 rounded-2xl p-6 mb-6 border border-blue-200/30">
                      <div className="space-y-4">
                        <div className="flex items-center">
                          <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center mr-3">
                            <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                          </div>
                          <span className="text-sm text-gray-700">ENS Domain Registration</span>
                        </div>
                        <div className="flex items-center">
                          <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center mr-3">
                            <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                          </div>
                          <span className="text-sm text-gray-700">Business Plan Validation</span>
                        </div>
                        <div className="flex items-center">
                          <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center mr-3">
                            <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                          </div>
                          <span className="text-sm text-gray-700">Smart Contract Deployment</span>
                        </div>
                      </div>
                      <div className="mt-4 pt-4 border-t border-blue-200/50">
                        <div className="text-center">
                          <div className="text-lg font-bold text-blue-600 mb-1">10 ETH</div>
                          <div className="text-xs text-gray-500">Average funding in 30 days</div>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center text-sm text-gray-500">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mr-2 animate-pulse"></div>
                      Live processing in real-time
                    </div>
                  </div>
                </div>
              </div>

              {/* Step 3 - Technology */}
              <div className="relative group">
                <div className="bg-white/90 backdrop-blur-sm rounded-3xl p-10 shadow-xl border border-blue-100 hover:shadow-2xl transition-all duration-500 group-hover:-translate-y-2">
                  <div className="absolute -top-6 left-8">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-blue-800 rounded-xl flex items-center justify-center shadow-lg">
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                      </svg>
                    </div>
                  </div>
                  
                  <div className="pt-8">
                    <div className="text-sm text-blue-600 font-semibold mb-3">DEFI TECHNOLOGY</div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-4">Secure & Transparent</h3>
                    <p className="text-gray-600 mb-8 leading-relaxed">
                      Built on Ethereum with Morpho Protocol integration. All transactions are transparent, 
                      automated through smart contracts, and secured by blockchain technology.
                    </p>
                    
                    {/* Tech Stack */}
                    <div className="bg-gradient-to-r from-blue-50 to-blue-100/60 rounded-2xl p-6 mb-6 border border-blue-200/30">
                      <div className="grid grid-cols-2 gap-4 mb-4">
                        <div className="bg-white rounded-xl p-4 text-center border border-blue-100">
                          <div className="w-8 h-8 bg-blue-500 rounded-lg mx-auto mb-2 flex items-center justify-center">
                            <div className="w-4 h-4 bg-white rounded"></div>
                          </div>
                          <div className="text-xs font-semibold text-gray-700">Ethereum</div>
                        </div>
                        <div className="bg-white rounded-xl p-4 text-center border border-blue-100">
                          <div className="w-8 h-8 bg-blue-600 rounded-lg mx-auto mb-2 flex items-center justify-center">
                            <div className="w-4 h-4 bg-white rounded-full"></div>
                          </div>
                          <div className="text-xs font-semibold text-gray-700">Morpho</div>
                        </div>
                        <div className="bg-white rounded-xl p-4 text-center border border-blue-100">
                          <div className="w-8 h-8 bg-blue-500 rounded-lg mx-auto mb-2 flex items-center justify-center">
                            <div className="w-4 h-4 bg-white rounded"></div>
                          </div>
                          <div className="text-xs font-semibold text-gray-700">ENS</div>
                        </div>
                        <div className="bg-white rounded-xl p-4 text-center border border-blue-100">
                          <div className="w-8 h-8 bg-blue-700 rounded-lg mx-auto mb-2 flex items-center justify-center">
                            <div className="w-4 h-4 bg-white rounded"></div>
                          </div>
                          <div className="text-xs font-semibold text-gray-700">IPFS</div>
                        </div>
                      </div>
                      <div className="pt-4 border-t border-blue-200/50">
                        <div className="text-center">
                          <div className="text-lg font-bold text-blue-600 mb-1">100%</div>
                          <div className="text-xs text-gray-500">Audited smart contracts</div>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center text-sm text-gray-500">
                      <div className="w-2 h-2 bg-blue-400 rounded-full mr-2 animate-pulse"></div>
                      Built with enterprise security
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom CTA */}
          <div className="text-center mt-24">
            <div className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-3xl p-12 text-white relative overflow-hidden">
              <div className="absolute inset-0 bg-blue-400/20 animate-pulse"></div>
              <div className="relative z-10">
                <h3 className="text-3xl font-bold mb-4">Ready to revolutionize Latin American investments?</h3>
                <p className="text-xl opacity-90 mb-8 max-w-2xl mx-auto">
                  Join thousands of investors and entrepreneurs already using MorphoPymes to democratize finance.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link href="/login" className="bg-white text-blue-600 px-8 py-4 rounded-xl font-semibold text-lg hover:bg-gray-100 transition-all duration-300 shadow-xl hover:shadow-2xl hover:scale-105 text-center">
                    Start Investing Now
                  </Link>
                  <Link href="/login" className="border-2 border-white/50 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:bg-white/10 transition-all duration-300 text-center">
                    Apply for Funding
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced Background */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 -left-40 w-96 h-96 bg-blue-400/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 -right-40 w-80 h-80 bg-blue-500/8 rounded-full blur-3xl"></div>
          <div className="absolute top-1/2 left-1/4 w-64 h-64 bg-blue-300/7 rounded-full blur-2xl"></div>
        </div>
      </section>

      
    </div>
  );
}
