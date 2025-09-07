'use client';
/* eslint-disable @typescript-eslint/no-explicit-any */

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
// PortfolioChart removed from Finance per request
import { useAuth } from '@/hooks/useAuth';
import { apiService } from '@/services/apiService';
import { useActiveAccount } from 'thirdweb/react';

export default function FinancePage() {
  const { user, isLoading: authLoading } = useAuth();
  const activeAccount = useActiveAccount();
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(false);
  const [projects, setProjects] = useState<any[]>([]);
  const [myInvestments, setMyInvestments] = useState<any[]>([]);

  // PortfolioChart removed from Finance; stats remain

  // Function to format currency
  const formatCurrency = (amount: number) => {
    const safe = typeof amount === 'number' && !isNaN(amount) ? amount : 0;
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
    }).format(safe);
  };


  // Load public projects and derive user's investments from project.investments
  // derive wallet address from authenticated user or connected wallet (computed inside effect)

  useEffect(() => {
    const load = async () => {
      const walletAddress = (user?.walletAddress || activeAccount?.address || (typeof window !== 'undefined' && (window as any)?.ethereum?.selectedAddress) || null);
      if (!walletAddress) return;
      setLoading(true);
      try {
        // Prefer calling a dedicated endpoint that returns only projects/investments for this wallet
        const res = await apiService.getInvestmentsByWallet(walletAddress);
        if (res.success && res.data) {
          const all = res.data.projects || [];
          setProjects(all);

          const mine = all.map((p: any) => {
            const invs = Array.isArray(p.investments) ? p.investments : [];
            const totalAmount = invs.reduce((s: number, iv: any) => s + (Number(iv.amount) || 0), 0);
            const totalCurrent = invs.reduce((s: number, iv: any) => {
              const roi = iv.roiPercent || iv.roi || null;
              if (roi != null && !isNaN(Number(roi))) {
                return s + totalAmount * (1 + Number(roi) / 100);
              }
              return s + totalAmount;
            }, 0);

            const returns = totalCurrent - totalAmount;
            const roiPercent = totalAmount > 0 ? (returns / totalAmount) * 100 : 0;

            return {
              id: p._id || p.id,
              projectName: p.title || p.name || p.projectName || 'Untitled',
              ensDomain: p.ensDomain || p.url || '',
              founder: p.entrepreneur?.name || p.entrepreneur?.firstName || p.entrepreneur || 'Unknown',
              founderEns: p.entrepreneur?.ensName || p.entrepreneur?.walletAddress || '',
              category: p.category || (p.tags && p.tags[0]) || 'Other',
              myInvestment: totalAmount,
              investmentDate: invs[0]?.createdAt || invs[0]?.date || new Date().toISOString(),
              projectStatus: p.status || (p.draft ? 'draft' : 'active'),
              projectGoal: p.funding?.target || p.goal || 0,
              projectRaised: p.funding?.raised || 0,
              progressPercentage: p.funding?.percentage || (p.funding && p.funding.target ? Math.round((p.funding.raised / p.funding.target) * 100) : 0),
              currentValue: Math.round(totalCurrent),
              returns: Math.round(returns),
              roi: Number(roiPercent.toFixed(1)),
              expectedRoi: Number((p.funding?.expectedROI && Number(p.funding.expectedROI)) || 0),
              daysRemaining: p.deadline ? Math.max(0, Math.ceil((new Date(p.deadline).getTime() - Date.now()) / (1000 * 60 * 60 * 24))) : 0,
              image: (p.images && p.images[0]) || '/Figura1.png',
              updates: p.updates || [],
              nextMilestone: p.nextMilestone || '',
            };
          });

          setMyInvestments(mine);
        }
      } catch (err) {
        console.error('Error loading finance data:', err);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [user, activeAccount?.address]);

  // Calculate portfolio statistics
  const portfolioStats = {
    totalInvested: myInvestments.reduce((sum, inv) => sum + (inv.myInvestment || 0), 0),
    currentValue: myInvestments.reduce((sum, inv) => sum + (inv.currentValue || 0), 0),
    totalReturns: myInvestments.reduce((sum, inv) => sum + (inv.returns || 0), 0),
    averageRoi: myInvestments.length ? myInvestments.reduce((sum, inv) => sum + (inv.roi || 0), 0) / myInvestments.length : 0,
    activeInvestments: myInvestments.filter((inv) => inv.projectStatus === 'active').length,
    completedInvestments: myInvestments.filter((inv) => inv.projectStatus === 'completed').length,
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
              <span className="bg-gradient-to-r from-morpho-blue to-morpho-dark-blue bg-clip-text text-transparent">Portfolio</span>
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
            {/* Portfolio Chart removed */}
        </div>
      </section>

      {/* My Investments List */}
      <section className="px-4 md:px-6 pb-6">
        <div className="max-w-7xl mx-auto">
          <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-4 md:p-8 border border-blue-200/50 shadow-lg">
            <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-4 md:mb-6">My Investments</h2>
            
            <div className="space-y-4 md:space-y-6">
                {myInvestments.length === 0 && !loading && (
                  <div className="p-6 text-center text-gray-600">
                    No investments found for your connected wallet. Connect your wallet or log in to see your portfolio.
                  </div>
                )}

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
