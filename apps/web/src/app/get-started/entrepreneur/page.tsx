'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';

export default function EntrepreneurGetStarted() {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    businessName: '',
    ensName: '',
    businessType: '',
    fundingGoal: '',
    description: ''
  });

  const handleStepComplete = (step: number) => {
    if (step < 4) {
      setCurrentStep(step + 1);
    }
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
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
            For Entrepreneurs
          </div>
          
          <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 leading-tight mb-8">
            Launch Your SME and
            <br />
            <span className="bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
              Access Global Capital
            </span>
          </h1>
          
          <p className="text-xl text-gray-600 leading-relaxed max-w-3xl mx-auto mb-12">
            Get ENS verification, submit your business plan, and connect with investors worldwide. 
            Our platform helps you raise funding with complete transparency.
          </p>
        </div>
      </section>

      {/* Progress Steps */}
      <section className="py-8 px-6 bg-white border-b border-gray-100">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between">
            {[1, 2, 3, 4].map((step) => (
              <div key={step} className="flex items-center">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm ${
                  step <= currentStep
                    ? 'bg-blue-600 text-white'
                    : step === currentStep + 1
                    ? 'bg-blue-100 text-blue-600 border-2 border-blue-600'
                    : 'bg-gray-200 text-gray-500'
                }`}>
                  {step < currentStep ? (
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  ) : (
                    step
                  )}
                </div>
                {step < 4 && (
                  <div className={`w-16 lg:w-24 h-1 mx-2 ${
                    step < currentStep ? 'bg-blue-600' : 'bg-gray-200'
                  }`}></div>
                )}
              </div>
            ))}
          </div>
          <div className="flex justify-between mt-3 text-sm text-gray-600">
            <span>Business Info</span>
            <span>ENS Setup</span>
            <span>Business Plan</span>
            <span>Launch</span>
          </div>
        </div>
      </section>

      {/* Setup Steps */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-4xl mx-auto">
          {/* Step 1 - Business Information */}
          {currentStep === 1 && (
            <div className="bg-gradient-to-r from-blue-50 to-blue-100/60 rounded-3xl p-8 border border-blue-200/50">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-gray-900 mb-4">Tell Us About Your Business</h2>
                <p className="text-lg text-gray-600">Provide basic information about your SME to get started</p>
              </div>

              <div className="max-w-2xl mx-auto space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Business Name</label>
                  <input
                    type="text"
                    placeholder="Enter your business name"
                    className="w-full px-4 py-3 border border-blue-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                    value={formData.businessName}
                    onChange={(e) => setFormData({...formData, businessName: e.target.value})}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Business Type</label>
                  <select 
                    className="w-full px-4 py-3 border border-blue-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                    value={formData.businessType}
                    onChange={(e) => setFormData({...formData, businessType: e.target.value})}
                  >
                    <option value="">Select business type</option>
                    <option value="tech">Technology</option>
                    <option value="fintech">FinTech</option>
                    <option value="ecommerce">E-commerce</option>
                    <option value="manufacturing">Manufacturing</option>
                    <option value="agriculture">Agriculture</option>
                    <option value="services">Services</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Funding Goal (USD)</label>
                  <input
                    type="number"
                    placeholder="50000"
                    className="w-full px-4 py-3 border border-blue-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                    value={formData.fundingGoal}
                    onChange={(e) => setFormData({...formData, fundingGoal: e.target.value})}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Brief Description</label>
                  <textarea
                    placeholder="Describe your business in a few sentences..."
                    rows={4}
                    className="w-full px-4 py-3 border border-blue-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all resize-none"
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                  ></textarea>
                </div>

                <button
                  onClick={() => handleStepComplete(1)}
                  disabled={!formData.businessName || !formData.businessType}
                  className="w-full px-8 py-4 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-all duration-300 shadow-lg hover:shadow-xl"
                >
                  Continue to ENS Setup
                </button>
              </div>
            </div>
          )}

          {/* Step 2 - ENS Setup */}
          {currentStep === 2 && (
            <div className="bg-gradient-to-r from-blue-50 to-blue-100/60 rounded-3xl p-8 border border-blue-200/50">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-gray-900 mb-4">Register Your ENS Domain</h2>
                <p className="text-lg text-gray-600">Get a verified Web3 identity for your business</p>
              </div>

              <div className="max-w-2xl mx-auto space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Choose Your ENS Name</label>
                  <div className="flex">
                    <input
                      type="text"
                      placeholder="mybusiness"
                      className="flex-1 px-4 py-3 border border-blue-200 rounded-l-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                      value={formData.ensName}
                      onChange={(e) => setFormData({...formData, ensName: e.target.value})}
                    />
                    <div className="px-4 py-3 bg-gray-100 border border-l-0 border-blue-200 rounded-r-xl text-gray-600 font-medium">
                      .eth
                    </div>
                  </div>
                  <p className="text-sm text-gray-500 mt-2">This will be your verified business identity on the blockchain</p>
                </div>

                <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 border border-blue-100">
                  <h3 className="font-semibold text-gray-900 mb-3">ENS Benefits:</h3>
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li className="flex items-center">
                      <svg className="w-4 h-4 text-green-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      Verified blockchain identity
                    </li>
                    <li className="flex items-center">
                      <svg className="w-4 h-4 text-green-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      Enhanced investor trust
                    </li>
                    <li className="flex items-center">
                      <svg className="w-4 h-4 text-green-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      Decentralized web presence
                    </li>
                    <li className="flex items-center">
                      <svg className="w-4 h-4 text-green-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      Smart contract integration
                    </li>
                  </ul>
                </div>

                <div className="flex gap-4">
                  <button
                    onClick={() => setCurrentStep(1)}
                    className="px-6 py-3 border-2 border-blue-600 text-blue-600 font-semibold rounded-xl hover:bg-blue-50 transition-all duration-300"
                  >
                    Back
                  </button>
                  <button
                    onClick={() => handleStepComplete(2)}
                    disabled={!formData.ensName}
                    className="flex-1 px-8 py-4 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-all duration-300 shadow-lg hover:shadow-xl"
                  >
                    Register ENS & Continue
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Step 3 - Business Plan */}
          {currentStep === 3 && (
            <div className="bg-gradient-to-r from-blue-50 to-blue-100/60 rounded-3xl p-8 border border-blue-200/50">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-gray-900 mb-4">Upload Your Business Plan</h2>
                <p className="text-lg text-gray-600">Share detailed information about your business model and projections</p>
              </div>

              <div className="max-w-2xl mx-auto space-y-6">
                <div className="border-2 border-dashed border-blue-300 rounded-xl p-8 text-center">
                  <svg className="w-12 h-12 text-blue-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                  </svg>
                  <p className="text-lg font-medium text-gray-700 mb-2">Upload Business Plan</p>
                  <p className="text-sm text-gray-500 mb-4">PDF, DOC, or DOCX files up to 10MB</p>
                  <button className="px-6 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors">
                    Choose File
                  </button>
                </div>

                <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 border border-blue-100">
                  <h3 className="font-semibold text-gray-900 mb-3">Your business plan should include:</h3>
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li className="flex items-center">
                      <svg className="w-4 h-4 text-blue-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      Executive Summary
                    </li>
                    <li className="flex items-center">
                      <svg className="w-4 h-4 text-blue-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      Market Analysis
                    </li>
                    <li className="flex items-center">
                      <svg className="w-4 h-4 text-blue-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      Financial Projections
                    </li>
                    <li className="flex items-center">
                      <svg className="w-4 h-4 text-blue-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      Marketing Strategy
                    </li>
                    <li className="flex items-center">
                      <svg className="w-4 h-4 text-blue-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      Risk Assessment
                    </li>
                  </ul>
                </div>

                <div className="flex gap-4">
                  <button
                    onClick={() => setCurrentStep(2)}
                    className="px-6 py-3 border-2 border-blue-600 text-blue-600 font-semibold rounded-xl hover:bg-blue-50 transition-all duration-300"
                  >
                    Back
                  </button>
                  <button
                    onClick={() => handleStepComplete(3)}
                    className="flex-1 px-8 py-4 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition-all duration-300 shadow-lg hover:shadow-xl"
                  >
                    Continue to Launch
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Step 4 - Launch */}
          {currentStep === 4 && (
            <div className="bg-gradient-to-r from-blue-50 to-blue-100/60 rounded-3xl p-8 border border-blue-200/50 text-center">
              <div className="w-20 h-20 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Ready to Launch!</h2>
              <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
                Your business profile is complete. Deploy your smart contract and start connecting with investors worldwide.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 border border-blue-100">
                  <div className="text-2xl font-bold text-blue-600 mb-2">{formData.businessName || 'Your Business'}</div>
                  <div className="text-sm text-gray-600">Business Name</div>
                </div>
                <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 border border-blue-100">
                  <div className="text-2xl font-bold text-blue-600 mb-2">{formData.ensName || 'business'}.eth</div>
                  <div className="text-sm text-gray-600">ENS Domain</div>
                </div>
                <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 border border-blue-100">
                  <div className="text-2xl font-bold text-blue-600 mb-2">${formData.fundingGoal || '0'}</div>
                  <div className="text-sm text-gray-600">Funding Goal</div>
                </div>
              </div>

              <div className="space-y-4">
                <button className="w-full px-8 py-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105">
                  Deploy Smart Contract & Go Live
                </button>
                
                <p className="text-sm text-gray-500">
                  By launching, you agree to our terms of service and commit to transparency with investors.
                </p>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Support Section */}
      <section className="py-20 px-6 bg-morpho-dots">
        <div className="absolute inset-0 bg-blue-50/80"></div>
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">Need Help Getting Started?</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 border border-blue-100">
              <div className="w-12 h-12 bg-blue-600 rounded-xl mx-auto mb-4 flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </div>
              <h3 className="font-bold text-gray-900 mb-2">Live Support</h3>
              <p className="text-sm text-gray-600">Chat with our team for real-time assistance</p>
            </div>
            
            <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 border border-blue-100">
              <div className="w-12 h-12 bg-blue-600 rounded-xl mx-auto mb-4 flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <h3 className="font-bold text-gray-900 mb-2">Documentation</h3>
              <p className="text-sm text-gray-600">Comprehensive guides and tutorials</p>
            </div>
            
            <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 border border-blue-100">
              <div className="w-12 h-12 bg-blue-600 rounded-xl mx-auto mb-4 flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="font-bold text-gray-900 mb-2">Community</h3>
              <p className="text-sm text-gray-600">Join our Discord for peer support</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
