/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useEffect, useState, useMemo } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { apiService } from '@/services/apiService';
import PortfolioChart from '@/components/PortfolioChart';
import { useAuth } from '@/hooks/useAuth';
import { useMetaMask } from '@/hooks/useMetaMask';
import { useToast } from '@/hooks/useToast';
import { blockchainService } from '@/services/blockchainServices';
import { currencyService } from '@/services/currencyService';
import { ToastContainer } from '@/components/Toast';

export default function ProjectDetail() {
  const params = useParams();
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [investmentAmount, setInvestmentAmount] = useState('');
  const [showInvestModal, setShowInvestModal] = useState(false);
  const [showInvestorsModal, setShowInvestorsModal] = useState(false);
  const [project, setProject] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [blockchainData, setBlockchainData] = useState<any>(null);
  const [userInvestmentAmount, setUserInvestmentAmount] = useState<string>('0');
  const [loadingBlockchain, setLoadingBlockchain] = useState(false);
  const [txError, setTxError] = useState<string>('');
  
  // Build chart series from investments (cumulative raised over time)
  const chartData = useMemo(() => {
    const invs = Array.isArray(project?.investments) ? project.investments.slice() : [];
    if (invs.length === 0) {
      // fallback: single point with current raised
      const value = project?.funding?.raised || 0;
      return [{ date: (project?.createdAt || new Date()).toString().slice(0,10), value, change: 0 }];
    }

    // sort by createdAt
    invs.sort((a: any, b: any) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());

    let cumulative = 0;
    const points = invs.map((inv: any, idx: number) => {
      cumulative += Number(inv.amount) || 0;
      const date = inv.createdAt ? new Date(inv.createdAt).toISOString().slice(0,10) : `pt-${idx}`;
      return { date, value: Math.round(cumulative), change: 0 };
    });

    // compute change % between points
    for (let i = 0; i < points.length; i++) {
      if (i === 0) points[i].change = 0;
      else {
        const prev = points[i - 1].value || 1;
        points[i].change = ((points[i].value - prev) / prev) * 100;
      }
    }

    return points;
  }, [project]);

  const chartTotals = useMemo(() => {
    if (!chartData || chartData.length === 0) return { totalValue: 0, totalGain: 0, percentageGain: 0 };
    const first = chartData[0].value || 0;
    const last = chartData[chartData.length - 1].value || 0;
    const totalGain = last - first;
    const percentageGain = first ? (totalGain / first) * 100 : 0;
    return { totalValue: last, totalGain, percentageGain };
  }, [chartData]);
  const { user } = useAuth();
  const { 
    isMetaMaskInstalled, 
    isConnected: isWalletConnected, 
    account: walletAccount, 
    chainId,
    connecting: walletConnecting,
    error: walletError,
    connect: connectWallet,
    switchToBaseSepolia 
  } = useMetaMask();
  const [showReturnModal, setShowReturnModal] = useState(false);
  const [returning, setReturning] = useState(false);
  const [isOwner, setIsOwner] = useState(false);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  
  const toast = useToast();

  // Load blockchain data for this campaign
  const loadBlockchainData = async () => {
    if (!project?.campaignId || !user?.walletAddress) return;
    
    setLoadingBlockchain(true);
    try {
      const campaign = await blockchainService.getCampaignById(project.campaignId);
      setBlockchainData(campaign);
      
      if (campaign) {
        // Check if user is the owner
        setIsOwner(campaign.creator.toLowerCase() === user.walletAddress.toLowerCase());
        
        // Get user's investment amount in this campaign
        const investmentAmount = await blockchainService.getInvestmentAmount(project.campaignId, user.walletAddress);
        setUserInvestmentAmount(investmentAmount || '0');
      }
    } catch (err) {
      console.error('Error loading blockchain data:', err);
    } finally {
      setLoadingBlockchain(false);
    }
  };

  useEffect(() => {
    (async () => {
      const id = params.id as string;
      if (!id) return;
      try {
        const res = await apiService.getProjectById(id);
        if (res.success && res.data?.project) {
          setProject(res.data.project);
        }
      } catch (err) {
        console.error('Error fetching project from API, falling back to mock', err);
      } finally {
        setLoading(false);
      }
    })();
  }, [params.id]);

  // Load blockchain data when project and user are ready
  useEffect(() => {
    if (project && user?.walletAddress) {
      loadBlockchainData();
    }
  }, [project, user?.walletAddress]);

  if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;

  if (!project) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100/60 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Project not found</h1>
          <Link href="/invest" className="text-blue-600 hover:text-blue-700">
            ← Back to investments
          </Link>
        </div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100/60 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Project not found</h1>
          <Link href="/invest" className="text-blue-600 hover:text-blue-700">
            ← Back to investments
          </Link>
        </div>
      </div>
    );
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0
    }).format(amount);
  };

  // Validation function for investment
  const validateInvestment = (amount: number): string[] => {
    const errors: string[] = [];
    
    if (!amount || amount <= 0) {
      errors.push('Please enter a valid investment amount.');
    }
    
    if (amount < project.funding.minimumInvestment) {
      errors.push(`Minimum investment is ${formatCurrency(project.funding.minimumInvestment)}`);
    }
    
    if (amount > 1000000) { // $1M limit for safety
      errors.push('Investment amount exceeds maximum limit of $1,000,000');
    }
    
    return errors;
  };

  // Safe accessors for optional financials
  const revenueValue = project?.financials?.revenue ?? 0;
  const growthValue = project?.financials?.growth ?? 0;
  const customersValue = project?.financials?.customers ?? 0;
  const fundingExpectedROI = project?.funding?.expectedROI ?? project?.funding?.roi ?? 'N/A';


  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100/60">
      {/* Header */}
      <section className="relative px-6 pt-28 pb-8">
        <div className="max-w-7xl mx-auto">
          <Link 
            href="/invest" 
            className="inline-flex items-center text-blue-600 hover:text-blue-700 mb-6 font-medium"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Investments
          </Link>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Project Details */}
            <div className="lg:col-span-2 space-y-6">
              {/* Project Images */}
              <div className="bg-white/90 backdrop-blur-sm rounded-3xl overflow-hidden shadow-xl border border-blue-200/50">
                <div className="relative h-80">
                  {project.images && project.images[selectedImageIndex] ? (
                    <Image
                      src={project.images[selectedImageIndex]}
                      alt={project.title}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <img src="/default-image.png" alt="placeholder" className="w-full h-full object-cover" />
                  )}
                  {project.featured && (
                    <div className="absolute top-4 left-4 bg-gradient-to-r from-blue-500 to-blue-600 text-white px-3 py-1 rounded-full text-sm font-semibold">
                      Featured Project
                    </div>
                  )}
                </div>
                {project.images.length > 1 && (
                  <div className="p-4 flex space-x-2 overflow-x-auto">
                    {project.images.map((image: string, index: number) => (
                      <button
                        key={index}
                        onClick={() => setSelectedImageIndex(index)}
                        className={`flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-all ${
                          selectedImageIndex === index ? 'border-blue-500' : 'border-gray-200'
                        }`}
                      >
                        <Image
                          src={image}
                          alt={`${project.title} ${index + 1}`}
                          width={64}
                          height={64}
                          className="object-cover w-full h-full"
                        />
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Project Info */}
              <div className="bg-white/90 backdrop-blur-sm rounded-3xl p-6 shadow-xl border border-blue-200/50">
                <div className="flex items-start justify-between mb-6">
                  <div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">{project.title}</h1>
                    <p className="text-gray-600 mb-4">{project.shortDescription}</p>
                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                      <span className="flex items-center">
                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        {project.location}
                      </span>
                      <span className="flex items-center">
                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                        </svg>
                        {project.category}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="prose max-w-none">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">About this project</h3>
                  <p className="text-gray-600 leading-relaxed mb-6">{project.fullDescription}</p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">Business Model</h4>
                      <p className="text-gray-600 text-sm">{project.businessModel}</p>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">Market Size</h4>
                      <p className="text-gray-600 text-sm">{project.marketSize}</p>
                    </div>
                  </div>

                  <div className="bg-gradient-to-r from-blue-50 to-blue-100/60 rounded-xl p-4 mb-6">
                    <h4 className="font-semibold text-gray-900 mb-3">Current Performance</h4>
                    <div className="grid grid-cols-3 gap-4">
                      <div className="text-center">
                          <div className="text-2xl font-bold text-blue-600">{formatCurrency(Number(revenueValue || 0))}</div>
                        <div className="text-sm text-gray-600">Monthly Revenue</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-green-600">{String(growthValue)}%</div>
                        <div className="text-sm text-gray-600">Growth Rate</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-purple-600">{String(customersValue)}</div>
                        <div className="text-sm text-gray-600">Active Customers</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Milestones Section */}
              {project.milestones && project.milestones.length > 0 && (
                <div className="bg-white/90 backdrop-blur-sm rounded-3xl p-6 shadow-xl border border-blue-200/50">
                  <h3 className="text-xl font-bold text-gray-900 mb-6">Project Milestones</h3>
                  <div className="space-y-4">
                    {project.milestones.map((milestone: any, index: number) => (
                      <div key={index} className={`flex items-start space-x-4 p-4 rounded-xl ${
                        milestone.completed ? 'bg-green-50 border border-green-200' : 'bg-gray-50 border border-gray-200'
                      }`}>
                        <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                          milestone.completed ? 'bg-green-500' : 'bg-gray-300'
                        }`}>
                          {milestone.completed ? (
                            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                          ) : (
                            <span className="text-white text-sm font-bold">{index + 1}</span>
                          )}
                        </div>
                        <div className="flex-1">
                          <h4 className="font-semibold text-gray-900">{milestone.title}</h4>
                          <p className="text-gray-600 text-sm mb-2">{milestone.description}</p>
                          <div className="flex justify-between items-center">
                            <span className="text-xs text-gray-500">{milestone.date}</span>
                            <span className="text-sm font-medium text-blue-600">
                              Target: {formatCurrency(milestone.target)}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Right Column - Investment Panel */}
            <div className="lg:col-span-1">
              <div className="sticky top-28 space-y-6">
                {/* Entrepreneur Profile */}
                <div className="bg-white/90 backdrop-blur-sm rounded-3xl p-6 shadow-xl border border-blue-200/50">
                  <h3 className="text-lg font-bold text-gray-900 mb-4">Entrepreneur</h3>
                  {/** Safely handle missing entrepreneur data */}
                  {(() => {
                    const ent = project.entrepreneur || project.entrepreneur_details || {} as any;
                    // Prefer a direct `name`, otherwise compose from firstName/lastName, otherwise show walletAddress as last resort
                    const name = ent.name || ((ent.firstName || ent.lastName) ? `${ent.firstName || ''} ${ent.lastName || ''}`.trim() : (ent.walletAddress || 'Unknown Entrepreneur'));
                    // avatar may be stored as profileImage on the user model
                    const avatar = ent.avatar || ent.profileImage || '/default-avatar.svg';
                    const verified = !!ent.verified;
                    const experience = ent.experience || '';
                    const bio = ent.bio || ent.description || '';

                    return (
                      <>
                        <div className="flex items-center space-x-3 mb-4">
                          <div className="relative">
                            <Image
                              src={avatar}
                              alt={name}
                              width={60}
                              height={60}
                              className="rounded-full border-2 border-blue-200/50"
                              // allow unoptimized external src if necessary (Next will accept string)
                            />
                            {verified && (
                              <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                              </div>
                            )}
                          </div>
                          <div>
                            <div className="flex items-center space-x-2">
                              <h4 className="font-semibold text-gray-900">{name}</h4>
                              {verified && (
                                <span className="text-green-600 text-xs font-medium">Verified</span>
                              )}
                            </div>
                            <p className="text-sm text-gray-500">{experience}</p>
                          </div>
                        </div>
                        <p className="text-gray-600 text-sm mb-4">{bio}</p>
                        <button className="w-full px-4 py-2 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 transition-colors text-sm font-medium">
                          View Full Profile
                        </button>
                      </>
                    );
                  })()}
                </div>

                        {/* Portfolio Chart for this project (funding over time) */}
                        <div className="bg-white/90 backdrop-blur-sm rounded-3xl p-4 shadow-md border border-blue-200/40">
                          <PortfolioChart
                            data={chartData}
                            totalValue={chartTotals.totalValue}
                            totalGain={chartTotals.totalGain}
                            percentageGain={chartTotals.percentageGain}
                            showTimeframe={false}
                          />
                        </div>

                {/* Investment Panel */}
                <div className="bg-white/90 backdrop-blur-sm rounded-3xl p-6 shadow-xl border border-blue-200/50">
                  {/* Error Display */}
                  {txError && (
                    <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                      <div className="flex items-center">
                        <svg className="w-5 h-5 text-red-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <div>
                          <h4 className="text-red-800 font-medium">Transaction Error</h4>
                          <p className="text-red-700 text-sm mt-1">{txError}</p>
                          <button 
                            onClick={() => setTxError('')}
                            className="text-red-600 text-sm underline mt-1"
                          >
                            Dismiss
                          </button>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Blockchain Status */}
                  {project?.onChain && blockchainData && (
                    <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <div className="w-3 h-3 bg-blue-500 rounded-full mr-2"></div>
                          <span className="text-blue-800 font-medium">Blockchain Campaign</span>
                        </div>
                        <button
                          onClick={loadBlockchainData}
                          disabled={loadingBlockchain}
                          className="px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 disabled:opacity-50"
                        >
                          {loadingBlockchain ? 'Syncing...' : 'Refresh'}
                        </button>
                      </div>
                      <div className="mt-2 text-sm text-blue-700">
                        Campaign #{project.campaignId} • Status: {blockchainData.isActive ? 'Active' : 'Paused'} • 
                        {blockchainData.isFunded ? 'Funded ✅' : 'Seeking Funding'}
                      </div>
                    </div>
                  )}

                  {/* User Investment Status */}
                  {project?.onChain && Number(userInvestmentAmount) > 0 && (
                    <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                      <div className="flex items-center">
                        <svg className="w-5 h-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <div>
                          <span className="text-green-800 font-medium">Your Investment: {currencyService.formatCurrency(Number(userInvestmentAmount), 'ETH')}</span>
                          {blockchainData?.isFunded && (
                            <p className="text-green-700 text-sm mt-1">Campaign funded! Returns available when entrepreneur pays back.</p>
                          )}
                        </div>
                      </div>
                    </div>
                  )}

                  <h3 className="text-lg font-bold text-gray-900 mb-4">Investment Details</h3>
                  
                  {/* Progress */}
                  <div className="mb-6">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-2xl font-bold text-gray-900">
                        {formatCurrency(project.funding.raised)}
                      </span>
                      <span className="text-sm text-gray-500">
                        {project.funding.percentage}%
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3 mb-2">
                      <div
                        className="bg-gradient-to-r from-blue-500 to-blue-600 h-3 rounded-full transition-all duration-1000"
                        style={{ width: `${project.funding.percentage}%` }}
                      ></div>
                    </div>
                    <div className="flex justify-between text-sm text-gray-600">
                      <span>of {formatCurrency(project.funding.target)} goal</span>
                      <div className="flex items-center space-x-2">
                        <span>{project.funding.investors} investors</span>
                        <button
                          onClick={() => setShowInvestorsModal(true)}
                          className="text-xs text-blue-600 underline"
                        >
                          Details
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Investment Info */}
                  <div className="space-y-3 mb-6">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Min. Investment:</span>
                      <span className="font-medium">{formatCurrency(project.funding.minimumInvestment)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Expected ROI:</span>
                      <span className="font-medium text-green-600">{fundingExpectedROI}</span>
                    </div>
                  </div>

                  {/* Investment Input */}
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Investment Amount (USD)
                    </label>
                    <div className="relative">
                      <input
                        type="number"
                        value={investmentAmount}
                        onChange={(e) => {
                          setInvestmentAmount(e.target.value);
                          setValidationErrors([]); // Clear validation errors on change
                        }}
                        placeholder={`Min. $${project.funding.minimumInvestment}`}
                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:border-transparent outline-none transition-colors ${
                          validationErrors.length > 0 
                            ? 'border-red-300 focus:ring-red-500' 
                            : 'border-blue-200 focus:ring-blue-500'
                        }`}
                      />
                      {Number(investmentAmount) > 0 && (
                        <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                          {validateInvestment(Number(investmentAmount)).length === 0 ? (
                            <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                          ) : (
                            <svg className="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          )}
                        </div>
                      )}
                    </div>
                    {Number(investmentAmount) > 0 && (
                      <div className="mt-2 text-sm">
                        {validateInvestment(Number(investmentAmount)).length === 0 ? (
                          <span className="text-green-600">✓ Valid investment amount</span>
                        ) : (
                          <span className="text-red-600">{validateInvestment(Number(investmentAmount))[0]}</span>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Wallet Connection Status */}
                  {!user?.walletAddress && !isWalletConnected && (
                    <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <svg className="w-5 h-5 text-yellow-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                          </svg>
                          <div>
                            <span className="text-yellow-800 text-sm font-medium">Wallet not connected</span>
                            <p className="text-yellow-700 text-xs mt-1">Connect your wallet to invest</p>
                          </div>
                        </div>
                        {isMetaMaskInstalled && (
                          <button
                            onClick={connectWallet}
                            disabled={walletConnecting}
                            className="px-3 py-1 bg-yellow-600 text-white text-sm rounded-lg hover:bg-yellow-700 disabled:opacity-50"
                          >
                            {walletConnecting ? 'Connecting...' : 'Connect'}
                          </button>
                        )}
                      </div>
                      {!isMetaMaskInstalled && (
                        <div className="mt-2 text-xs text-yellow-700">
                          <a href="https://metamask.io/download/" target="_blank" rel="noopener noreferrer" className="underline">
                            Install MetaMask first
                          </a>
                        </div>
                      )}
                    </div>
                  )}

                  {(user?.walletAddress || isWalletConnected) && (
                    <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                      <div className="flex items-center">
                        <svg className="w-5 h-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <div className="flex-1">
                          <span className="text-green-800 text-sm font-medium">Wallet connected</span>
                          <p className="text-green-700 text-xs mt-1 font-mono">
                            {(user?.walletAddress || walletAccount)?.slice(0, 6)}...{(user?.walletAddress || walletAccount)?.slice(-4)}
                          </p>
                        </div>
                        {chainId && chainId !== '0x14a34' && (
                          <button
                            onClick={switchToBaseSepolia}
                            className="px-2 py-1 bg-blue-600 text-white text-xs rounded hover:bg-blue-700"
                          >
                            Switch to Base
                          </button>
                        )}
                      </div>
                    </div>
                  )}

                  {walletError && (
                    <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                      <div className="flex items-center">
                        <svg className="w-5 h-5 text-red-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span className="text-red-800 text-sm">{walletError}</span>
                      </div>
                    </div>
                  )}
                  {/* Blockchain Contract Actions */}
                  {project?.onChain && blockchainData && user?.walletAddress && (
                    <div className="mb-6 p-4 bg-gray-50 rounded-lg space-y-3">
                      <h4 className="font-medium text-gray-900">Blockchain Actions</h4>
                      
                      {/* Owner Actions */}
                      {isOwner && (
                        <div className="space-y-2">
                          {blockchainData.isFunded && !blockchainData.fundsDistributed && (
                            <button
                              onClick={async () => {
                                try {
                                  setTxError('');
                                  const txHash = await blockchainService.distributeFunds(project.campaignId);
                                  console.log('Funds distributed:', txHash);
                                  await loadBlockchainData();
                                } catch (err: any) {
                                  setTxError(err?.message || 'Failed to distribute funds');
                                }
                              }}
                              className="w-full bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors text-sm"
                            >
                              Withdraw Raised Funds
                            </button>
                          )}
                          
                          {blockchainData.isFunded && blockchainData.fundsDistributed && (
                            <button
                              onClick={async () => {
                                try {
                                  setTxError('');
                                  const requiredPayment = await blockchainService.getRequiredPayment(project.campaignId);
                                  const confirmed = window.confirm(`Return investment to investors? Required payment: ${currencyService.formatCurrency(Number(requiredPayment), 'ETH')}`);
                                  if (confirmed) {
                                    const txHash = await blockchainService.returnInvestment(project.campaignId);
                                    console.log('Investment returned:', txHash);
                                    await loadBlockchainData();
                                  }
                                } catch (err: any) {
                                  setTxError(err?.message || 'Failed to return investment');
                                }
                              }}
                              className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors text-sm"
                            >
                              Return Investment to Investors
                            </button>
                          )}

                          {blockchainData.isActive && (
                            <button
                              onClick={async () => {
                                try {
                                  setTxError('');
                                  const txHash = await blockchainService.toggleCampaignStatus(project.campaignId, false);
                                  console.log('Campaign paused:', txHash);
                                  await loadBlockchainData();
                                } catch (err: any) {
                                  setTxError(err?.message || 'Failed to pause campaign');
                                }
                              }}
                              className="w-full bg-yellow-600 text-white py-2 px-4 rounded-lg hover:bg-yellow-700 transition-colors text-sm"
                            >
                              Pause Campaign
                            </button>
                          )}
                        </div>
                      )}
                      
                      {/* Investor Actions */}
                      {!isOwner && Number(userInvestmentAmount) > 0 && (
                        <div className="space-y-2">
                          {blockchainData.isFunded && blockchainData.returnsDistributed && (
                            <button
                              onClick={async () => {
                                try {
                                  setTxError('');
                                  const txHash = await blockchainService.withdrawReturns(project.campaignId);
                                  console.log('Returns withdrawn:', txHash);
                                  await loadBlockchainData();
                                } catch (err: any) {
                                  setTxError(err?.message || 'Failed to withdraw returns');
                                }
                              }}
                              className="w-full bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors text-sm"
                            >
                              Withdraw Returns + Interest
                            </button>
                          )}
                          
                          {!blockchainData.isActive && !blockchainData.isFunded && (
                            <button
                              onClick={async () => {
                                try {
                                  setTxError('');
                                  const txHash = await blockchainService.refundInvestment(project.campaignId);
                                  console.log('Investment refunded:', txHash);
                                  await loadBlockchainData();
                                } catch (err: any) {
                                  setTxError(err?.message || 'Failed to get refund');
                                }
                              }}
                              className="w-full bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 transition-colors text-sm"
                            >
                              Get Refund (Campaign Failed)
                            </button>
                          )}
                        </div>
                      )}
                    </div>
                  )}

                  <button
                    onClick={() => setShowInvestModal(true)}
                    disabled={!isMetaMaskInstalled && !user?.walletAddress}
                    className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white py-3 px-4 rounded-xl font-semibold hover:shadow-lg transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                  >
                    {!isMetaMaskInstalled && !user?.walletAddress ? 'Install MetaMask to Invest' : 'Invest Now'}
                  </button>


                  <div className="mt-4 text-xs text-gray-500 text-center">
                    Secure investment powered by blockchain technology
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Investment Modal */}
      {showInvestModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Confirm Investment</h3>
            
            {/* Wallet Connection Notice */}
            {!user?.walletAddress && !isWalletConnected && (
              <div className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="flex items-center">
                  <svg className="w-5 h-5 text-blue-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <div>
                    <span className="text-blue-800 font-medium">MetaMask Connection Required</span>
                    <p className="text-blue-700 text-sm mt-1">We'll connect to your MetaMask wallet to process this investment</p>
                  </div>
                </div>
              </div>
            )}

            {(user?.walletAddress || isWalletConnected) && (
              <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg">
                <div className="flex items-center">
                  <svg className="w-5 h-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <div>
                    <span className="text-green-800 font-medium">Wallet Connected</span>
                    <p className="text-green-700 text-sm mt-1 font-mono">
                      {(user?.walletAddress || walletAccount)?.slice(0, 8)}...{(user?.walletAddress || walletAccount)?.slice(-6)}
                    </p>
                  </div>
                </div>
              </div>
            )}
            
            {/* Validation Errors */}
            {validationErrors.length > 0 && (
              <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                <div className="flex items-start">
                  <svg className="w-5 h-5 text-red-500 mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <div>
                    <h4 className="text-red-800 font-medium">Validation Errors</h4>
                    <ul className="mt-1 text-sm text-red-700 list-disc list-inside">
                      {validationErrors.map((error, index) => (
                        <li key={index}>{error}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            )}
            
            <div className="space-y-4 mb-6">
              <div className="flex justify-between">
                <span>Project:</span>
                <span className="font-medium">{project.title}</span>
              </div>
              <div className="flex justify-between">
                <span>Investment Amount:</span>
                <span className="font-medium">{formatCurrency(Number(investmentAmount) || 0)}</span>
              </div>
              {project.campaignId && (
                <div className="flex justify-between">
                  <span>Blockchain Campaign:</span>
                  <span className="font-medium text-blue-600">#{project.campaignId}</span>
                </div>
              )}
              <hr />
              <div className="flex justify-between text-lg font-bold">
                <span>Total:</span>
                <span>{formatCurrency(Number(investmentAmount) || 0)}</span>
              </div>
            </div>
            <div className="flex space-x-3">
              <button
                onClick={() => setShowInvestModal(false)}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={async () => {
                  try {
                    setTxError(''); // Clear any previous errors
                    setValidationErrors([]);
                    
                    const amt = Number(investmentAmount);
                    
                    // Validate investment
                    const errors = validateInvestment(amt);
                    if (errors.length > 0) {
                      setValidationErrors(errors);
                      toast.error('Invalid Investment', errors[0]);
                      return;
                    }

                    // Try to get wallet address from user or connect wallet
                    let wallet = user?.walletAddress || walletAccount;
                    
                    if (!wallet) {
                      // Try to connect wallet
                      console.log('Attempting to connect wallet...');
                      toast.info('Connecting Wallet', 'Please connect your MetaMask wallet');
                      wallet = await connectWallet();
                      if (!wallet) {
                        toast.error('Connection Failed', 'Failed to connect wallet. Please try again.');
                        return;
                      }
                    }

                    console.log('Investment attempt:', { project: project.title, amount: amt, wallet });

                    console.log('🔍 Project blockchain info:', {
                      campaignId: project.campaignId,
                      onChain: project.onChain,
                      hasBlockchainData: !!blockchainData
                    });

                    // First try blockchain investment if project has campaignId
                    if (project.campaignId) {
                      try {
                        console.log('🔄 Starting blockchain investment process...');
                        console.log('📊 Project campaignId:', project.campaignId);
                        
                        toast.info('Processing Investment', 'Preparing blockchain transaction...');
                        
                        // Check if MetaMask is unlocked
                        if (typeof window !== 'undefined' && (window as any).ethereum) {
                          const accounts = await (window as any).ethereum.request({ method: 'eth_accounts' });
                          console.log('🔍 Current MetaMask accounts:', accounts);
                          
                          if (accounts.length === 0) {
                            console.log('⚠️ No accounts connected, requesting connection...');
                            await (window as any).ethereum.request({ method: 'eth_requestAccounts' });
                          }
                        }
                        
                        const ethAmount = await currencyService.usdToEth(amt);
                        console.log('💰 USD to ETH conversion:', { usd: amt, eth: ethAmount });
                        
                        toast.info('Confirm Transaction', 'Please confirm the transaction in MetaMask');
                        
                        console.log('🚀 Calling blockchainService.investInCampaign with params:', {
                          campaignId: project.campaignId,
                          ethAmount: ethAmount.toString(),
                          usdAmount: amt
                        });
                        
                        const txHash = await blockchainService.investInCampaign(project.campaignId, ethAmount.toString());
                        console.log('✅ Blockchain investment successful:', txHash);
                        
                        // Also update API for tracking
                        const res = await apiService.investProject(project._id || project.id, wallet, amt);
                        if (res && res.success && res.data) {
                          setProject(res.data.project || res.data);
                        }
                        
                        // Refresh blockchain data
                        await loadBlockchainData();
                        
                        toast.success(
                          'Investment Successful!',
                          `Transaction completed. Hash: ${txHash.slice(0, 10)}...`,
                          10000
                        );
                      } catch (blockchainErr: any) {
                        console.error('Blockchain investment failed:', blockchainErr);
                        setTxError(blockchainErr?.message || 'Blockchain investment failed');
                        toast.error('Investment Failed', blockchainErr?.message || 'Blockchain investment failed');
                        return;
                      }
                    } else {
                      // API-only investment for projects without blockchain campaign
                      console.log('Making API-only investment...');
                      toast.info('Processing Investment', 'Recording investment in database...');
                      
                      const res = await apiService.investProject(project._id || project.id, wallet, amt);
                      if (res && res.success && res.data) {
                        setProject(res.data.project || res.data);
                        toast.success('Investment Recorded!', 'Your investment has been successfully recorded');
                      } else {
                        toast.error('Investment Failed', res?.message || 'Unknown error occurred');
                        return;
                      }
                    }
                    
                    setShowInvestModal(false);
                    setInvestmentAmount('');
                  } catch (err: any) {
                    console.error('Error making investment:', err);
                    setTxError(err?.message || 'An unexpected error occurred');
                    toast.error('Investment Error', err?.message || 'An unexpected error occurred');
                  }
                }}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Investors Modal */}
      {showInvestorsModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-lg w-full">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold">Investors</h3>
              <button onClick={() => setShowInvestorsModal(false)} className="text-gray-500">Close</button>
            </div>
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {(project?.investments || []).length === 0 && (
                <div className="text-gray-500">No investors yet.</div>
              )}
              {(project?.investments || []).map((inv: any, idx: number) => (
                <div key={idx} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-100">
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium text-gray-900 truncate">{inv.walletAddress}</div>
                    <div className="text-xs text-gray-500 truncate">{inv.createdAt ? new Date(inv.createdAt).toLocaleString() : ''}</div>
                  </div>
                  <div className="text-right ml-4">
                    <div className="text-sm font-semibold text-blue-600">{formatCurrency(inv.amount)}</div>
                    <div className="text-xs text-gray-500">ROI: {inv.roiPercent ?? '—'}%</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Return Funds Modal (entrepreneur) */}
      {showReturnModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Return Funds to Investors</h3>
            <p className="text-sm text-gray-600 mb-4">This will mark all investor contributions as returned and reset the funding totals for the project. This action is irreversible in the database. Please confirm you have processed on-chain refunds externally, if applicable.</p>
            <div className="flex space-x-3">
              <button
                onClick={() => setShowReturnModal(false)}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                disabled={returning}
              >
                Cancel
              </button>
              <button
                onClick={async () => {
                  try {
                    setReturning(true);
                    toast.info('Processing', 'Marking funds as returned...');
                    
                    const res = await apiService.returnProjectFunds(project._id || project.id);
                    if (res && res.success && res.data) {
                      // refresh project from API
                      const refreshed = await apiService.getProjectById(project._id || project.id);
                      if (refreshed && refreshed.success && refreshed.data?.project) {
                        setProject(refreshed.data.project);
                      }
                      setShowReturnModal(false);
                      toast.success('Funds Returned', 'All investor funds have been marked as returned');
                    } else {
                      toast.error('Operation Failed', res?.message || 'Failed to mark funds as returned');
                    }
                  } catch (err: any) {
                    console.error('Error returning funds', err);
                    toast.error('Error', 'An error occurred while returning funds');
                  } finally {
                    setReturning(false);
                  }
                }}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
              >
                Confirm Return
              </button>
            </div>
          </div>
        </div>
      )}


      {/* Toast Notifications */}
      <ToastContainer toasts={toast.toasts} onRemove={toast.removeToast} />
    </div>
  );
}
