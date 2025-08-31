/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react/no-unescaped-entities */
'use client';

import { useState } from 'react';

export default function Ecosystem() {
  const [activeSection, setActiveSection] = useState('overview');

  const technologies = [
    {
      id: 'base',
      name: 'Base Network',
      subtitle: 'Ethereum Layer 2 Foundation',
      description: 'Base is an Optimistic Rollup built on Ethereum using the OP Stack framework. It provides 95-99% cost reduction compared to Ethereum mainnet while maintaining full security guarantees.',
      features: [
        { label: 'Block Time', value: '2 seconds', description: '6x faster than Ethereum' },
        { label: 'Transaction Cost', value: '$0.01-0.05', description: 'vs $20-50 on Ethereum' },
        { label: 'Throughput', value: '4,000+ TPS', description: 'Theoretical maximum' },
        { label: 'Security', value: 'Ethereum-grade', description: 'Inherits L1 consensus' }
      ],
      technical: [
        'Optimistic rollup with fraud proofs',
        'EVM compatibility for seamless migration',
        'Coinbase enterprise infrastructure',
        'Direct fiat on-ramps integration'
      ]
    },
    {
      id: 'ens',
      name: 'Ethereum Name Service',
      subtitle: 'Decentralized Identity Infrastructure',
      description: 'ENS replaces complex wallet addresses with human-readable names, enabling businesses to create memorable identities like coffeshop.morphopymes.eth.',
      features: [
        { label: 'Address Resolution', value: 'Human-readable', description: 'Replace 42-char addresses' },
        { label: 'Multi-chain Support', value: '100+ Networks', description: 'Bitcoin, Ethereum, Base' },
        { label: 'Governance', value: 'Decentralized DAO', description: '100M ENS tokens' },
        { label: 'Records', value: 'Unlimited', description: 'Text, addresses, content' }
      ],
      technical: [
        'Registry contract stores ownership',
        'Resolver contracts translate names',
        'Subdomain support for organizations',
        'DNSSEC integration with traditional DNS'
      ]
    },
    {
      id: 'ethereum',
      name: 'Ethereum Blockchain',
      subtitle: 'Decentralized Finance Foundation',
      description: 'Ethereum powers the largest DeFi ecosystem with over $60B total value locked. Proof of Stake consensus provides energy-efficient security for financial applications.',
      features: [
        { label: 'Total Value Locked', value: '$60+ Billion', description: 'In DeFi protocols' },
        { label: 'Validators', value: '1,000,000+', description: 'Securing the network' },
        { label: 'Energy Reduction', value: '99.95%', description: 'Since Proof of Stake' },
        { label: 'Smart Contracts', value: 'Turing Complete', description: 'Unlimited programmability' }
      ],
      technical: [
        'Proof of Stake consensus mechanism',
        'EIP-1559 fee market with base fee burning',
        'Sharding roadmap for infinite scalability',
        'Largest developer ecosystem in crypto'
      ]
    }
  ];

  const renderOverviewSection = () => (
    <div className="space-y-16">
      {/* Hero Content */}
      <div className="text-center max-w-4xl mx-auto px-4">
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-4 sm:mb-6">
          Blockchain Infrastructure for <span className="text-blue-600">Microenterprises</span>
        </h2>
        <p className="text-lg sm:text-xl text-gray-600 leading-relaxed">
          MorphoPymes leverages cutting-edge blockchain technology to democratize access to capital 
          for small businesses worldwide, combining Ethereum's security with Base's scalability.
        </p>
      </div>

      {/* Technology Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
        {technologies.map((tech, index) => (
          <div key={tech.id} className="group">
            <div className="bg-white rounded-2xl border border-gray-200 p-6 sm:p-8 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-2 h-full">
              <div className="flex items-center justify-between mb-4 sm:mb-6">
                <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-br ${
                  index === 0 ? 'from-blue-500 to-blue-600' : 
                  index === 1 ? 'from-gray-800 to-gray-900' : 
                  'from-blue-600 to-blue-700'
                } flex items-center justify-center`}>
                  <span className="text-white font-bold text-sm sm:text-lg">{tech.name.charAt(0)}</span>
                </div>
                <div className="text-right">
                  <div className="text-xl sm:text-2xl font-bold text-gray-900">{tech.name.split(' ')[0]}</div>
                  <div className="text-xs sm:text-sm text-gray-500">{tech.name.split(' ').slice(1).join(' ')}</div>
                </div>
              </div>
              
              <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-3">{tech.subtitle}</h3>
              <p className="text-sm sm:text-base text-gray-600 mb-4 sm:mb-6 leading-relaxed">{tech.description}</p>
              
              <div className="space-y-2 sm:space-y-3 mb-4 sm:mb-6">
                {tech.features.slice(0, 2).map((feature, idx) => (
                  <div key={idx} className="flex justify-between items-center">
                    <span className="text-xs sm:text-sm text-gray-600">{feature.label}</span>
                    <span className="font-semibold text-sm sm:text-base text-gray-900">{feature.value}</span>
                  </div>
                ))}
              </div>
              
              <button 
                onClick={() => setActiveSection(tech.id)}
                className="w-full bg-gray-900 text-white py-2.5 sm:py-3 rounded-xl font-semibold text-sm sm:text-base hover:bg-blue-600 transition-colors duration-300"
              >
                Learn More
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Microenterprise Statistics */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-2xl p-6 sm:p-8 md:p-12 text-white">
        <div className="text-center mb-6 sm:mb-8">
          <h3 className="text-xl sm:text-2xl md:text-3xl font-bold mb-3 sm:mb-4">Global Microenterprise Impact</h3>
          <p className="text-sm sm:text-base text-blue-100 max-w-2xl mx-auto">
            Blockchain technology addresses systematic exclusion of 400+ million microenterprises from traditional finance
          </p>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
          <div className="text-center">
            <div className="text-2xl sm:text-3xl md:text-4xl font-bold mb-1 sm:mb-2">400M+</div>
            <div className="text-blue-100 text-xs sm:text-sm">Microenterprises globally</div>
          </div>
          <div className="text-center">
            <div className="text-2xl sm:text-3xl md:text-4xl font-bold mb-1 sm:mb-2">$5.2T</div>
            <div className="text-blue-100 text-xs sm:text-sm">Annual funding gap</div>
          </div>
          <div className="text-center">
            <div className="text-2xl sm:text-3xl md:text-4xl font-bold mb-1 sm:mb-2">70%</div>
            <div className="text-blue-100 text-xs sm:text-sm">Employment in developing countries</div>
          </div>
          <div className="text-center">
            <div className="text-2xl sm:text-3xl md:text-4xl font-bold mb-1 sm:mb-2">31%</div>
            <div className="text-blue-100 text-xs sm:text-sm">Of global GDP</div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderTechnologySection = (techId: string) => {
    const tech = technologies.find(t => t.id === techId);
    if (!tech) return null;

    return (
      <div className="space-y-8 sm:space-y-12">
        {/* Header */}
        <div className="text-center px-4">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3 sm:mb-4">{tech.name}</h2>
          <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto">{tech.description}</p>
        </div>

        {/* Feature Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {tech.features.map((feature, index) => (
            <div key={index} className="bg-white rounded-xl border border-gray-200 p-4 sm:p-6 text-center">
              <div className="text-xl sm:text-2xl font-bold text-blue-600 mb-1 sm:mb-2">{feature.value}</div>
              <div className="font-semibold text-gray-900 mb-1 text-sm sm:text-base">{feature.label}</div>
              <div className="text-xs sm:text-sm text-gray-600">{feature.description}</div>
            </div>
          ))}
        </div>

        {/* Technical Details */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6 sm:p-8">
          <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 sm:mb-6">Technical Implementation</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
            <div>
              <h4 className="font-semibold text-gray-900 mb-3 sm:mb-4">Core Features</h4>
              <ul className="space-y-2 sm:space-y-3">
                {tech.technical.map((item, index) => (
                  <li key={index} className="flex items-start">
                    <div className="w-2 h-2 bg-blue-600 rounded-full mt-1.5 sm:mt-2 mr-3 flex-shrink-0"></div>
                    <span className="text-sm sm:text-base text-gray-700">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold text-gray-900 mb-3 sm:mb-4">MorphoPymes Integration</h4>
              <div className="space-y-3 sm:space-y-4">
                {techId === 'base' && (
                  <div className="bg-blue-50 p-3 sm:p-4 rounded-lg">
                    <h5 className="font-semibold text-blue-900 mb-1 sm:mb-2 text-sm sm:text-base">Micro-Investment Economics</h5>
                    <p className="text-xs sm:text-sm text-blue-800">
                      Base enables $10-100 investments with transaction costs under $0.05, 
                      making micro-investing economically viable for global participants.
                    </p>
                  </div>
                )}
                {techId === 'ens' && (
                  <div className="bg-blue-50 p-3 sm:p-4 rounded-lg">
                    <h5 className="font-semibold text-blue-900 mb-1 sm:mb-2 text-sm sm:text-base">Business Identity</h5>
                    <p className="text-xs sm:text-sm text-blue-800">
                      Microenterprises register meaningful names like coffeshop.morphopymes.eth, 
                      improving brand recognition and payment simplification.
                    </p>
                  </div>
                )}
                {techId === 'ethereum' && (
                  <div className="bg-blue-50 p-3 sm:p-4 rounded-lg">
                    <h5 className="font-semibold text-blue-900 mb-1 sm:mb-2 text-sm sm:text-base">Smart Contract Security</h5>
                    <p className="text-xs sm:text-sm text-blue-800">
                      Ethereum's battle-tested security model protects investor funds and 
                      automates complex financial agreements without intermediaries.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderMicroenterprisesSection = () => (
    <div className="space-y-8 sm:space-y-12">
      {/* Header */}
      <div className="text-center px-4">
        <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3 sm:mb-4">Microenterprises & Financial Inclusion</h2>
        <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto">
          Understanding the global microenterprise market and how blockchain technology 
          addresses systematic financial exclusion
        </p>
      </div>

      {/* Problem & Solution Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
        {/* Traditional Barriers */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6 sm:p-8">
          <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 sm:mb-6">Traditional Barriers</h3>
          <div className="space-y-4 sm:space-y-6">
            <div className="border-l-4 border-gray-400 pl-3 sm:pl-4">
              <h4 className="font-semibold text-gray-900 mb-1 sm:mb-2 text-sm sm:text-base">Geographic Exclusion</h4>
              <p className="text-gray-600 text-xs sm:text-sm">
                40% of global microenterprises lack access to banking infrastructure, 
                particularly in rural and developing regions.
              </p>
            </div>
            
            <div className="border-l-4 border-gray-400 pl-3 sm:pl-4">
              <h4 className="font-semibold text-gray-900 mb-1 sm:mb-2 text-sm sm:text-base">Collateral Requirements</h4>
              <p className="text-gray-600 text-xs sm:text-sm">
                Banks require 150-200% collateral for loans, excluding businesses 
                without significant assets.
              </p>
            </div>
            
            <div className="border-l-4 border-gray-400 pl-3 sm:pl-4">
              <h4 className="font-semibold text-gray-900 mb-1 sm:mb-2 text-sm sm:text-base">High Transaction Costs</h4>
              <p className="text-gray-600 text-xs sm:text-sm">
                Loan processing costs of $500-2,000 make small loans economically 
                unviable for traditional banks.
              </p>
            </div>
          </div>
        </div>

        {/* Blockchain Solutions */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6 sm:p-8">
          <h3 className="text-xl sm:text-2xl font-bold text-blue-600 mb-4 sm:mb-6">Blockchain Solutions</h3>
          <div className="space-y-4 sm:space-y-6">
            <div className="border-l-4 border-blue-600 pl-3 sm:pl-4">
              <h4 className="font-semibold text-gray-900 mb-1 sm:mb-2 text-sm sm:text-base">Global Accessibility</h4>
              <p className="text-gray-600 text-xs sm:text-sm">
                Internet-only access eliminates geographic barriers, enabling 
                participation from anywhere with connectivity.
              </p>
            </div>
            
            <div className="border-l-4 border-blue-600 pl-3 sm:pl-4">
              <h4 className="font-semibold text-gray-900 mb-1 sm:mb-2 text-sm sm:text-base">Community-Based Lending</h4>
              <p className="text-gray-600 text-xs sm:text-sm">
                Peer-to-peer funding based on project merit rather than 
                traditional asset ownership.
              </p>
            </div>
            
            <div className="border-l-4 border-blue-600 pl-3 sm:pl-4">
              <h4 className="font-semibold text-gray-900 mb-1 sm:mb-2 text-sm sm:text-base">Micro-Transaction Economics</h4>
              <p className="text-gray-600 text-xs sm:text-sm">
                $0.05 transaction costs on Base enable $10-100 investments 
                that were previously impossible.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Global Statistics */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6 sm:p-8">
        <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-6 sm:mb-8 text-center">Global Market Impact</h3>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-8">
          <div className="text-center">
            <div className="text-2xl sm:text-3xl font-bold text-blue-600 mb-1 sm:mb-2">400M+</div>
            <div className="text-gray-600 text-xs sm:text-sm">Microenterprises worldwide</div>
          </div>
          <div className="text-center">
            <div className="text-2xl sm:text-3xl font-bold text-blue-600 mb-1 sm:mb-2">$5.2T</div>
            <div className="text-gray-600 text-xs sm:text-sm">Annual funding gap</div>
          </div>
          <div className="text-center">
            <div className="text-2xl sm:text-3xl font-bold text-blue-600 mb-1 sm:mb-2">2B+</div>
            <div className="text-gray-600 text-xs sm:text-sm">Jobs created globally</div>
          </div>
          <div className="text-center">
            <div className="text-2xl sm:text-3xl font-bold text-blue-600 mb-1 sm:mb-2">31%</div>
            <div className="text-gray-600 text-xs sm:text-sm">Of global GDP</div>
          </div>
        </div>
      </div>
    </div>
  );
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100/60">
      {/* Hero Section */}
      <section className="relative px-4 sm:px-6 pt-28 sm:pt-32 pb-16 sm:pb-20 lg:pt-40 lg:pb-24 overflow-hidden">
        {/* Background patterns similar to homepage */}
        <div className="absolute inset-0 bg-morpho-pattern opacity-30"></div>
        <div className="absolute inset-0 bg-morpho-dots"></div>
        
        <div className="max-w-6xl mx-auto relative z-10">
          <div className="text-center">
            <div className="inline-flex items-center px-3 py-1.5 bg-blue-50 border border-blue-200 rounded-full text-blue-700 font-medium text-xs sm:text-sm mb-4 sm:mb-6">
              <div className="w-2 h-2 bg-blue-500 rounded-full mr-2 animate-pulse"></div>
              Blockchain Technology Ecosystem
            </div>
            
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight mb-4 sm:mb-6 px-4">
              Technical Infrastructure for
              <br />
              <span className="text-blue-600">Global Finance</span>
            </h1>
            
            <p className="text-base sm:text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed mb-8 sm:mb-12 px-4">
              Deep dive into Base Layer 2, Ethereum Name Service, Ethereum blockchain, 
              and microenterprise market dynamics powering decentralized finance
            </p>

            {/* Navigation Tabs */}
            <div className="flex justify-center px-4">
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-1.5 sm:p-2 border border-gray-200 shadow-lg w-full max-w-5xl">
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-1 sm:gap-1">
                  {[
                    { id: 'overview', label: 'Overview' },
                    { id: 'base', label: 'Base Network' },
                    { id: 'ens', label: 'ENS Protocol' },
                    { id: 'ethereum', label: 'Ethereum' },
                    { id: 'microenterprises', label: 'Microenterprises' }
                  ].map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveSection(tab.id)}
                      className={`px-2 sm:px-4 lg:px-6 py-2 sm:py-3 rounded-lg sm:rounded-xl text-xs sm:text-sm font-medium transition-all duration-200 ${
                        activeSection === tab.id
                          ? 'bg-blue-600 text-white shadow-lg'
                          : 'text-gray-600 hover:text-blue-600 hover:bg-blue-50'
                      }`}
                    >
                      <span className="hidden sm:inline">{tab.label}</span>
                      <span className="sm:hidden">
                        {tab.id === 'overview' ? 'Overview' : 
                         tab.id === 'base' ? 'Base' : 
                         tab.id === 'ens' ? 'ENS' : 
                         tab.id === 'ethereum' ? 'ETH' : 
                         'Micro'}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Content Section */}
      <section className="px-4 sm:px-6 pb-16 sm:pb-20">
        <div className="max-w-6xl mx-auto">
          {activeSection === 'overview' && renderOverviewSection()}
          {activeSection === 'base' && renderTechnologySection('base')}
          {activeSection === 'ens' && renderTechnologySection('ens')}
          {activeSection === 'ethereum' && renderTechnologySection('ethereum')}
          {activeSection === 'microenterprises' && renderMicroenterprisesSection()}
        </div>
      </section>
    </div>
  );
}
