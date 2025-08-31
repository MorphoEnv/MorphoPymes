'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import PortfolioChart from '../../components/PortfolioChart';

export default function FinancePage() {
  const [activeTab, setActiveTab] = useState('overview');

  // Portfolio performance data for chart
  const portfolioPerformanceData = [
    { date: '2024-07-01', value: 5000000, change: 0 },
    { date: '2024-07-15', value: 5250000, change: 5.0 },
    { date: '2024-08-01', value: 5180000, change: -1.33 },
    { date: '2024-08-15', value: 5420000, change: 4.63 },
    { date: '2024-08-30', value: 5700000, change: 5.17 },
  ];

  // My investments - projects where I invested
  const myInvestments = [
    {
      id: 1,
      projectName: 'EcoTech Solutions',
      ensDomain: 'ecotech.morpho.eth',
      founder: 'María González',
      founderEns: 'maria.eth',
      category: 'Technology',
      myInvestment: 2500000, // $2,500 USD
      investmentDate: '2024-07-15',
      projectStatus: 'active',
      projectGoal: 800000000, // $800K USD
      projectRaised: 650000000, // $650K USD  
      progressPercentage: 81.25,
      currentValue: 2700000, // $2,700 USD - current value of my investment
      returns: 200000, // +$200 USD profit
      roi: 8.0, // 8% current ROI
      expectedRoi: 22.5, // 22.5% expected ROI
      daysRemaining: 18,
      image: '/Figura1.png',
      updates: [
        { date: '2024-08-25', title: 'Beta Completed', content: 'Successfully completed beta testing phase.' },
        { date: '2024-08-10', title: 'Product Update', content: 'New features added to IoT platform.' }
      ],
      nextMilestone: 'Market Launch - $800K Goal'
    },
    {
      id: 2,
      projectName: 'Urban Coffee Collective',
      ensDomain: 'urbancoffee.morpho.eth',
      founder: 'Carlos Mendoza',
      founderEns: 'carlos.eth',
      category: 'Food & Beverage',
      myInvestment: 1500000, // $1,500 USD
      investmentDate: '2024-05-20',
      projectStatus: 'completed',
      projectGoal: 450000000, // $450K USD
      projectRaised: 465000000, // $465K USD - exceeded goal
      progressPercentage: 103.33,
      currentValue: 1930000, // $1,930 USD - already generated returns
      returns: 430000, // +$430 USD profit
      roi: 28.7, // 28.7% ROI - successful completed project
      expectedRoi: 28.7,
      daysRemaining: 0,
      image: '/Figura1.png',
      updates: [
        { date: '2024-08-01', title: 'Project Completed', content: 'Successful launch and returns distributed.' },
        { date: '2024-07-15', title: 'Final Report', content: 'Exceeded funding goal by 3.33%.' }
      ],
      nextMilestone: 'Returns Distributed'
    }
  ];

  // Function to format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0
    }).format(amount / 1000000); // Convert from pesos to USD for display
  };

  // Calculate portfolio statistics
  const portfolioStats = {
    totalInvested: myInvestments.reduce((sum, inv) => sum + inv.myInvestment, 0),
    currentValue: myInvestments.reduce((sum, inv) => sum + inv.currentValue, 0),
    totalReturns: myInvestments.reduce((sum, inv) => sum + inv.returns, 0),
    averageRoi: myInvestments.reduce((sum, inv) => sum + inv.roi, 0) / myInvestments.length,
    activeInvestments: myInvestments.filter(inv => inv.projectStatus === 'active').length,
    completedInvestments: myInvestments.filter(inv => inv.projectStatus === 'completed').length
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100/60">
      {/* Header */}
      <section className="relative px-6 pt-28 pb-8 overflow-hidden">
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center">
            <div className="inline-flex items-center px-4 py-2 bg-blue-100/80 text-blue-800 text-sm font-medium rounded-full backdrop-blur-sm border border-blue-200/50 mb-6">
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
              Investment Portfolio
            </div>
            
            <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 leading-tight mb-4">
              My Investment{' '}
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Portfolio</span>
            </h1>
            
            <p className="text-gray-600 leading-relaxed max-w-2xl mx-auto">
              Track your investments, monitor performance, and stay updated with project developments.
            </p>
          </div>
        </div>
      </section>

      {/* Estadísticas del Portfolio */}
      <section className="px-6 pb-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 mb-6 md:mb-8">
            {/* Total Invested */}
            <div className="bg-white/90 backdrop-blur-sm rounded-xl md:rounded-2xl p-4 md:p-6 border border-blue-200/50 shadow-lg">
              <div className="flex items-center justify-between mb-3 md:mb-4">
                <div className="w-10 h-10 md:w-12 md:h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <svg className="w-5 h-5 md:w-6 md:h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                  </svg>
                </div>
                <span className="text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded-full hidden sm:inline">Total</span>
              </div>
              <h3 className="text-xs md:text-sm text-gray-600 mb-1">Total Invested</h3>
              <p className="text-lg md:text-2xl font-bold text-blue-600">{formatCurrency(portfolioStats.totalInvested)}</p>
            </div>

            {/* Current Value */}
            <div className="bg-white/90 backdrop-blur-sm rounded-xl md:rounded-2xl p-4 md:p-6 border border-blue-200/50 shadow-lg">
              <div className="flex items-center justify-between mb-3 md:mb-4">
                <div className="w-10 h-10 md:w-12 md:h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <svg className="w-5 h-5 md:w-6 md:h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
                  </svg>
                </div>
                <span className="text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded-full hidden sm:inline">Current</span>
              </div>
              <h3 className="text-xs md:text-sm text-gray-600 mb-1">Current Value</h3>
              <p className="text-lg md:text-2xl font-bold text-blue-600">{formatCurrency(portfolioStats.currentValue)}</p>
            </div>

            {/* Total Returns */}
            <div className="bg-white/90 backdrop-blur-sm rounded-xl md:rounded-2xl p-4 md:p-6 border border-blue-200/50 shadow-lg">
              <div className="flex items-center justify-between mb-3 md:mb-4">
                <div className="w-10 h-10 md:w-12 md:h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <svg className="w-5 h-5 md:w-6 md:h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                  </svg>
                </div>
                <span className="text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded-full hidden sm:inline">Profit</span>
              </div>
              <h3 className="text-xs md:text-sm text-gray-600 mb-1">Total Returns</h3>
              <p className="text-lg md:text-2xl font-bold text-blue-600">+{formatCurrency(portfolioStats.totalReturns)}</p>
            </div>

            {/* Average ROI */}
            <div className="bg-white/90 backdrop-blur-sm rounded-xl md:rounded-2xl p-4 md:p-6 border border-blue-200/50 shadow-lg">
              <div className="flex items-center justify-between mb-3 md:mb-4">
                <div className="w-10 h-10 md:w-12 md:h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <svg className="w-5 h-5 md:w-6 md:h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <span className="text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded-full hidden sm:inline">Average</span>
              </div>
              <h3 className="text-xs md:text-sm text-gray-600 mb-1">Average ROI</h3>
              <p className="text-lg md:text-2xl font-bold text-blue-600">+{portfolioStats.averageRoi.toFixed(1)}%</p>
            </div>
          </div>
        </div>
      </section>

      {/* Portfolio Chart */}
      <section className="px-4 md:px-6 pb-6">
        <div className="max-w-7xl mx-auto">
          <PortfolioChart 
            data={portfolioPerformanceData}
            totalValue={portfolioStats.currentValue}
            totalGain={portfolioStats.totalReturns}
            percentageGain={(portfolioStats.totalReturns / portfolioStats.totalInvested) * 100}
          />
        </div>
      </section>

      {/* My Investments List */}
      <section className="px-4 md:px-6 pb-6">
        <div className="max-w-7xl mx-auto">
          <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-4 md:p-8 border border-blue-200/50 shadow-lg">
            <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-4 md:mb-6">My Investments</h2>
            
            <div className="space-y-4 md:space-y-6">
              {myInvestments.map((investment) => (
                <div key={investment.id} className="border border-gray-200 rounded-xl p-4 md:p-6 bg-gray-50/50">
                  <div className="flex flex-col lg:flex-row gap-4 md:gap-6">
                    {/* Project Info */}
                    <div className="flex-1">
                      <div className="flex items-start space-x-3 md:space-x-4 mb-4">
                        <Image
                          src={investment.image}
                          alt={investment.projectName}
                          width={64}
                          height={64}
                          className="w-12 h-12 md:w-16 md:h-16 rounded-xl object-cover flex-shrink-0"
                        />
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-3 mb-2">
                            <h3 className="text-lg md:text-xl font-bold text-gray-900 truncate">{investment.projectName}</h3>
                            <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium border mt-1 sm:mt-0 w-fit ${
                              investment.projectStatus === 'active' 
                                ? 'bg-blue-100 text-blue-800 border-blue-200' 
                                : 'bg-gray-100 text-gray-800 border-gray-200'
                            }`}>
                              {investment.projectStatus === 'active' ? 'Active' : 'Completed'}
                            </span>
                          </div>
                          
                          <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4 mb-2 space-y-1 sm:space-y-0">
                            <p className="text-sm font-medium text-blue-600 truncate">{investment.ensDomain}</p>
                            <span className="text-sm text-gray-500 hidden sm:inline">•</span>
                            <span className="text-sm text-gray-600 truncate">{investment.category}</span>
                          </div>
                          
                          <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4 text-sm text-gray-600 space-y-1 sm:space-y-0">
                            <span className="truncate">Founder: <span className="font-medium text-blue-600">{investment.founderEns}</span></span>
                            <span className="text-sm text-gray-500 hidden sm:inline">•</span>
                            <span className="truncate">Invested: {new Date(investment.investmentDate).toLocaleDateString('en-US')}</span>
                          </div>
                        </div>
                      </div>

                      {/* Project Progress Bar */}
                      <div className="mb-4">
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-sm text-gray-600">Project Progress</span>
                          <span className="text-sm font-bold text-gray-900">{investment.progressPercentage.toFixed(1)}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-gradient-to-r from-blue-500 to-green-500 h-2 rounded-full transition-all duration-500"
                            style={{ width: `${Math.min(investment.progressPercentage, 100)}%` }}
                          />
                        </div>
                        <div className="flex justify-between text-xs text-gray-600 mt-1">
                          <span>{formatCurrency(investment.projectRaised)}</span>
                          <span>{formatCurrency(investment.projectGoal)}</span>
                        </div>
                      </div>

                      <div className="text-sm text-gray-600">
                        <span className="font-medium">Next milestone: </span>
                        <span>{investment.nextMilestone}</span>
                      </div>
                    </div>

                    {/* My Investment Metrics */}
                    <div className="lg:w-80 w-full">
                      <div className="grid grid-cols-2 gap-3 md:gap-4 mb-4">
                        <div className="bg-blue-50 rounded-lg p-3 md:p-4 text-center">
                          <p className="text-xs text-gray-600 mb-1">My Investment</p>
                          <p className="text-sm md:text-lg font-bold text-blue-600">{formatCurrency(investment.myInvestment)}</p>
                        </div>
                        <div className="bg-blue-50 rounded-lg p-3 md:p-4 text-center">
                          <p className="text-xs text-gray-600 mb-1">Current Value</p>
                          <p className="text-sm md:text-lg font-bold text-blue-600">{formatCurrency(investment.currentValue)}</p>
                        </div>
                        <div className="bg-blue-50 rounded-lg p-3 md:p-4 text-center">
                          <p className="text-xs text-gray-600 mb-1">Returns</p>
                          <p className="text-sm md:text-lg font-bold text-blue-600">+{formatCurrency(investment.returns)}</p>
                        </div>
                        <div className="bg-blue-50 rounded-lg p-3 md:p-4 text-center">
                          <p className="text-xs text-gray-600 mb-1">ROI</p>
                          <p className="text-sm md:text-lg font-bold text-blue-600">+{investment.roi}%</p>
                        </div>
                      </div>

                      {investment.projectStatus === 'active' && (
                        <div className="bg-gray-50 rounded-lg p-3 mb-4 text-center">
                          <p className="text-xs text-gray-600 mb-1">Expected ROI</p>
                          <p className="text-sm font-bold text-blue-600">+{investment.expectedRoi}%</p>
                          <p className="text-xs text-gray-500">{investment.daysRemaining} days remaining</p>
                        </div>
                      )}

                      <div className="flex flex-col sm:flex-row gap-2">
                        <Link
                          href={`/invest/${investment.id}`}
                          className="flex-1 px-3 md:px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors text-center"
                        >
                          View Project
                        </Link>
                        <button className="px-3 md:px-4 py-2 border border-blue-600 text-blue-600 text-sm font-medium rounded-lg hover:bg-blue-50 transition-colors">
                          Details
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
