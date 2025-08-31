"use client";

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { apiService } from '@/services/apiService';

export default function ProjectDetail() {
  const params = useParams();
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [investmentAmount, setInvestmentAmount] = useState('');
  const [showInvestModal, setShowInvestModal] = useState(false);
  const [project, setProject] = useState<any>(null);
  const [loading, setLoading] = useState(true);

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

                {/* Investment Panel */}
                <div className="bg-white/90 backdrop-blur-sm rounded-3xl p-6 shadow-xl border border-blue-200/50">
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
                      <span>{project.funding.investors} investors</span>
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
                    <input
                      type="number"
                      value={investmentAmount}
                      onChange={(e) => setInvestmentAmount(e.target.value)}
                      placeholder={`Min. $${project.funding.minimumInvestment}`}
                      className="w-full px-4 py-3 border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                    />
                  </div>

                  <button
                    onClick={() => setShowInvestModal(true)}
                    className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white py-3 px-4 rounded-xl font-semibold hover:shadow-lg transition-all duration-300 hover:scale-105"
                  >
                    Invest Now
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
            <div className="space-y-4 mb-6">
              <div className="flex justify-between">
                <span>Project:</span>
                <span className="font-medium">{project.title}</span>
              </div>
              <div className="flex justify-between">
                <span>Investment Amount:</span>
                <span className="font-medium">{formatCurrency(Number(investmentAmount) || 0)}</span>
              </div>
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
                    // Minimal investment flow: send wallet and amount to API
                    // Here we assume investor wallet is not integrated in this view; ask user to connect wallet later
                    const wallet = (window as any)?.ethereum?.selectedAddress || 'anonymous';
                    const amt = Number(investmentAmount) || 0;
                    const res = await apiService.investProject(project._id || project.id, wallet, amt);
                    if (res && res.success && res.data) {
                      // update project funding locally with returned project
                      setProject(res.data.project || res.data);
                      setShowInvestModal(false);
                      setInvestmentAmount('');
                    } else {
                      console.error('Investment failed', res);
                      alert(res.message || 'Investment failed');
                    }
                  } catch (err) {
                    console.error('Error making investment', err);
                    alert('Error making investment');
                  }
                }
                }
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
