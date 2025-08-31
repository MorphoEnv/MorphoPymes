'use client';

import React, { useEffect, useState, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useAuth } from '@/hooks/useAuth';
import { apiService } from '@/services/apiService';
import { useRouter } from 'next/navigation';

// We'll compute dashboard stats from the fetched `projects` for the current user
// (totalRaised, totalInvestors, totalViews, activeProjects)

export default function Dashboard() {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [activeTab, setActiveTab] = useState('projects');
  const [projectImages, setProjectImages] = useState<string[]>([]);
  const [projectImageFiles, setProjectImageFiles] = useState<File[]>([]);
  const [useMilestones, setUseMilestones] = useState(false);
  const [milestones, setMilestones] = useState([
    { title: '', description: '', target: '', completed: false }
  ]);

  const { user, token } = useAuth();
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const router = useRouter();
  const [loadingProjects, setLoadingProjects] = useState(false);
  const [projects, setProjects] = useState<any[]>([]);

  // derive dashboard stats from projects
  const stats = useMemo(() => {
    const totalRaised = projects.reduce((acc, p) => acc + (p?.funding?.raised || 0), 0);
    const totalInvestors = projects.reduce((acc, p) => acc + (p?.funding?.investors || 0), 0);
    const totalViews = projects.reduce((acc, p) => acc + (p?.views || 0), 0);
    const activeProjects = projects.filter((p) => (p?.status || '').toLowerCase() === 'active').length;
    return { totalRaised, totalInvestors, totalViews, activeProjects };
  }, [projects]);

  useEffect(() => {
    (async () => {
      if (!user?.walletAddress) return;
      setLoadingProjects(true);
      try {
  const res = await apiService.getProjectsByEntrepreneur(user.walletAddress, token ?? undefined);
        if (res.success && res.data) {
          setProjects(res.data.projects || []);
        }
      } catch (err) {
        console.error('Error loading projects:', err);
      } finally {
        setLoadingProjects(false);
      }
    })();
  }, [user?.walletAddress, token]);

  // fetch categories for create modal
  useEffect(() => {
    (async () => {
      try {
        const res = await apiService.getCategories();
        if (res && res.success && res.data?.categories) {
          const cats = res.data.categories as Array<any>;
          const mapped = cats.map((c) => ({ label: c.label || String(c.value || ''), value: c.value || '' }));
          setCategories(mapped);
          if (!category && mapped.length > 0) setCategory(mapped[0].value || '');
        }
      } catch (e) {
        // ignore
      }
    })();
  }, []);

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [authLoading, isAuthenticated, router]);

  const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0
    }).format(amount);
  };

  // Use explicit locale formatting to avoid SSR/client mismatch
  const formatNumber = (value: number) => {
    try {
      return new Intl.NumberFormat('en-US').format(value);
    } catch (e) {
      return String(value);
    }
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      active: { bg: 'bg-green-100', text: 'text-green-800', label: 'Active' },
      draft: { bg: 'bg-yellow-100', text: 'text-yellow-800', label: 'Draft' },
      paused: { bg: 'bg-gray-100', text: 'text-gray-800', label: 'Paused' },
      completed: { bg: 'bg-blue-100', text: 'text-blue-800', label: 'Completed' }
    };
    
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.draft;
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.bg} ${config.text}`}>
        {config.label}
      </span>
    );
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      const newImages: string[] = [];
      const newFiles: File[] = [];
      Array.from(files).forEach(file => {
        newFiles.push(file);
        const reader = new FileReader();
        reader.onload = (e) => {
          if (e.target?.result) {
            newImages.push(e.target.result as string);
            if (newImages.length === files.length) {
              setProjectImages(prev => [...prev, ...newImages]);
              setProjectImageFiles(prev => [...prev, ...newFiles]);
            }
          }
        };
        reader.readAsDataURL(file);
      });
    }
  };

  const removeImage = (index: number) => {
  setProjectImages(prev => prev.filter((_, i) => i !== index));
  setProjectImageFiles(prev => prev.filter((_, i) => i !== index));
  };

  const addMilestone = () => {
    setMilestones(prev => [...prev, { title: '', description: '', target: '', completed: false }]);
  };

  const removeMilestone = (index: number) => {
    setMilestones(prev => prev.filter((_, i) => i !== index));
  };

  const updateMilestone = (index: number, field: string, value: string) => {
    setMilestones(prev => prev.map((milestone, i) => 
      i === index ? { ...milestone, [field]: value } : milestone
    ));
  };

  const resetForm = () => {
    setProjectImages([]);
    setUseMilestones(false);
    setMilestones([{ title: '', description: '', target: '', completed: false }]);
  };

  // Create project form state
  const [title, setTitle] = useState('');
  const [shortDescription, setShortDescription] = useState('');
  const [fullDescription, setFullDescription] = useState('');
  const [repaymentDays, setRepaymentDays] = useState<number | ''>('');
  const [fundingGoal, setFundingGoal] = useState<number | ''>('');
  const [category, setCategory] = useState('');
  const [categories, setCategories] = useState<Array<{ label: string; value: string }>>([]);
  const [minInvestment, setMinInvestment] = useState<number | ''>('');
  const [submitting, setSubmitting] = useState(false);
  const [location, setLocation] = useState('');
  const [marketSize, setMarketSize] = useState('');

  const createProjectHandler = async (saveAsDraft = false) => {
    if (!user?.walletAddress) return;
    // client-side validation for required fields only when publishing
    if (!saveAsDraft && (!title || !shortDescription || !fullDescription || !location || !fundingGoal)) {
      alert('Please fill required fields: Title, Short Description, Full Description, Location and Funding Goal.');
      return;
    }
    setSubmitting(true);
    try {
      // If there are files selected, upload them first to the API which will store them in MinIO
      let uploadedUrls: string[] = [];
      if (projectImageFiles.length > 0) {
        const formData = new FormData();
        projectImageFiles.forEach((f) => formData.append('images', f));
        const uploadRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/projects/images/upload`, {
          method: 'POST',
          body: formData,
          headers: token ? { Authorization: `Bearer ${token}` } : undefined
        });
        const uploadJson = await uploadRes.json();
        if (uploadJson.success && uploadJson.data?.urls) {
          uploadedUrls = uploadJson.data.urls;
        } else {
          console.error('Image upload failed', uploadJson);
        }
      }

      const payload = {
        title,
        shortDescription,
        fullDescription,
        category,
        location,
  marketSize: marketSize.trim(),
        funding: {
          target: Number(fundingGoal) || 100,
          minimumInvestment: Number(minInvestment) || 5,
          raised: 0,
          percentage: 0,
          investors: 0,
          expectedROI: 'N/A',
          repaymentDays: repaymentDays || undefined
        },
        milestones: useMilestones ? milestones : [],
        images: uploadedUrls.length ? uploadedUrls : projectImages,
        draft: !!saveAsDraft,
        entrepreneurWallet: user.walletAddress
      };

      const res = await apiService.createProject(payload, token ?? undefined);
      if (res.success) {
        const created = res.data?.project;
        if (created) setProjects(prev => [created, ...prev]);
        setShowCreateModal(false);
        resetForm();
      } else {
        console.error('Create project failed', res);
      }
    } catch (err) {
      console.error('Error creating project:', err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100/60">
      {/* Header */}
      <section className="relative px-6 pt-28 pb-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
            <div>
              <div className="inline-flex items-center px-3 py-1.5 bg-blue-100/80 text-blue-800 text-xs font-medium rounded-full backdrop-blur-sm border border-blue-200/50 mb-4">
                <span className="relative flex h-1.5 w-1.5 mr-2">
                  <span className="absolute inline-flex h-full w-full bg-blue-400 rounded-full opacity-75 animate-pulse"></span>
                  <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-blue-600"></span>
                </span>
                Entrepreneur Dashboard
              </div>
              
              <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 leading-tight mb-2">
                Welcome back, <span className="bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">{user?.firstName || (user?.walletAddress ? `${user.walletAddress.slice(0,6)}...${user.walletAddress.slice(-4)}` : 'Creator')}</span>
              </h1>
              
              <p className="text-gray-600 leading-relaxed">
                Manage your projects, track investments, and grow your business.
              </p>
            </div>

            <button
              onClick={() => setShowCreateModal(true)}
              className="mt-4 sm:mt-0 bg-gradient-to-r from-blue-500 to-blue-600 text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg transition-all duration-300 hover:scale-105 flex items-center space-x-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              <span>Create Project</span>
            </button>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 border border-blue-200/50 shadow-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Raised</p>
                  <p className="text-2xl font-bold text-gray-900">{formatCurrency(stats.totalRaised)}</p>
                </div>
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                  <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                  </svg>
                </div>
              </div>
            </div>

            <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 border border-blue-200/50 shadow-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Investors</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.totalInvestors}</p>
                </div>
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                  <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
              </div>
            </div>

            <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 border border-blue-200/50 shadow-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Views</p>
                  <p className="text-2xl font-bold text-gray-900">{formatNumber(stats.totalViews)}</p>
                </div>
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                  <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                </div>
              </div>
            </div>

            <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 border border-blue-200/50 shadow-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Active Projects</p>
                  <p className="text-2xl font-bold text-gray-900">{formatNumber(stats.activeProjects)}</p>
                </div>
                <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
                  <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="px-6 pb-16">
        <div className="max-w-7xl mx-auto">
          {/* Tabs */}
          <div className="bg-white/90 backdrop-blur-sm rounded-2xl border border-blue-200/50 shadow-lg mb-6">
            <div className="border-b border-gray-200">
              <nav className="flex space-x-8 px-6" aria-label="Tabs">
                <button
                  onClick={() => setActiveTab('projects')}
                  className={`py-4 px-1 border-b-2 font-medium text-sm transition-all duration-300 ${
                    activeTab === 'projects'
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  My Projects
                </button>
                <button
                  onClick={() => setActiveTab('analytics')}
                  className={`py-4 px-1 border-b-2 font-medium text-sm transition-all duration-300 ${
                    activeTab === 'analytics'
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  Analytics (coming soon)
                </button>
                <button
                  onClick={() => setActiveTab('marketing')}
                  className={`py-4 px-1 border-b-2 font-medium text-sm transition-all duration-300 ${
                    activeTab === 'marketing'
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  Marketing & Ads
                </button>
              </nav>
            </div>

            {/* Tab Content */}
            <div className="p-6">
              {activeTab === 'projects' && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-gray-900">Your Projects</h3>
                    <div className="flex space-x-3">
                      <select className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                        <option>All Status</option>
                        <option>Active</option>
                        <option>Draft</option>
                        <option>Completed</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {projects.map((project) => (
                      <div key={project._id ?? project.id} className="bg-gray-50 rounded-2xl p-4 hover:bg-gray-100 transition-colors">
                        <div className="relative h-32 rounded-xl overflow-hidden mb-4">
                          <Image
                            src={(project.images && project.images[0]) || project.image || '/Figura1.png'}
                            alt={project.title}
                            fill
                            className="object-cover"
                          />
                          <div className="absolute top-2 left-2 flex space-x-2">
                            {getStatusBadge(project.status)}
                            {project.sponsored && (
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                                Sponsored
                              </span>
                            )}
                          </div>
                        </div>

                        <h4 className="font-semibold text-gray-900 mb-2">{project.title}</h4>
                        
                        <div className="space-y-2 mb-4">
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-600">Progress</span>
                            <span className="font-medium">{project.funding.percentage}%</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-gradient-to-r from-blue-500 to-blue-600 h-2 rounded-full"
                              style={{ width: `${project.funding.percentage}%` }}
                            ></div>
                          </div>
                          <div className="flex justify-between text-xs text-gray-500">
                            <span>{formatCurrency(project.funding.raised)} raised</span>
                            <span>{project.funding.investors} investors</span>
                          </div>
                        </div>

                        <div className="flex space-x-2">
                          <Link
                            href={`/dashboard/project/${project._id ?? project.id}`}
                            className="flex-1 px-3 py-2 bg-blue-600 text-white text-center rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
                          >
                            Edit
                          </Link>
                          <Link
                            href={`/invest/${project._id ?? project.id}`}
                            className="flex-1 px-3 py-2 border border-gray-300 text-gray-700 text-center rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors"
                          >
                            View
                          </Link>
                        </div>
                      </div>
                    ))}

                    {/* Create New Card */}
                    <button
                      onClick={() => setShowCreateModal(true)}
                      className="bg-gray-50 border-2 border-dashed border-gray-300 rounded-2xl p-4 hover:bg-gray-100 hover:border-blue-300 transition-all duration-300 flex flex-col items-center justify-center min-h-[280px] group"
                    >
                      <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-3 group-hover:bg-blue-200 transition-colors">
                        <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                      </div>
                      <p className="font-medium text-gray-900 group-hover:text-blue-600 transition-colors">Create New Project</p>
                      <p className="text-sm text-gray-500 mt-1 text-center">Start raising funds for your next big idea</p>
                    </button>
                  </div>
                </div>
              )}

              {activeTab === 'marketing' && (
                <div className="space-y-6">
                  <h3 className="text-lg font-semibold text-gray-900">Marketing & Sponsorship</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Sponsored Listings */}
                    <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-2xl p-6 border border-yellow-200">
                      <div className="flex items-center mb-4">
                        <div className="w-12 h-12 bg-yellow-200 rounded-full flex items-center justify-center mr-4">
                          <svg className="w-6 h-6 text-yellow-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                          </svg>
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-900">Featured Listing</h4>
                          <p className="text-sm text-gray-600">Get more visibility with sponsored placement</p>
                        </div>
                      </div>
                      <div className="space-y-3">
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-700">Current Plan</span>
                          <span className="px-2 py-1 bg-yellow-200 text-yellow-800 rounded-full text-xs font-medium">
                            Featured
                          </span>
                        </div>
                        <div className="text-2xl font-bold text-gray-900">$49/month</div>
                        <ul className="text-sm text-gray-600 space-y-1">
                          <li className="flex items-center">
                            <svg className="w-4 h-4 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                            Top placement in search results
                          </li>
                          <li className="flex items-center">
                            <svg className="w-4 h-4 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                            Featured badge on project card
                          </li>
                          <li className="flex items-center">
                            <svg className="w-4 h-4 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                            Priority customer support
                          </li>
                        </ul>
                        <button className="w-full bg-yellow-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-yellow-700 transition-colors">
                          Upgrade to Premium
                        </button>
                      </div>
                    </div>

                    {/* Email Marketing */}
                    <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-6 border border-blue-200">
                      <div className="flex items-center mb-4">
                        <div className="w-12 h-12 bg-blue-200 rounded-full flex items-center justify-center mr-4">
                          <svg className="w-6 h-6 text-blue-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                          </svg>
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-900">Email Marketing</h4>
                          <p className="text-sm text-gray-600">Reach potential investors via email</p>
                        </div>
                      </div>
                      <div className="space-y-3">
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-700">Current Plan</span>
                          <span className="px-2 py-1 bg-gray-200 text-gray-800 rounded-full text-xs font-medium">
                            Basic
                          </span>
                        </div>
                        <div className="text-2xl font-bold text-gray-900">$99/campaign</div>
                        <ul className="text-sm text-gray-600 space-y-1">
                          <li className="flex items-center">
                            <svg className="w-4 h-4 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                            Send to 1,000+ investors
                          </li>
                          <li className="flex items-center">
                            <svg className="w-4 h-4 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                            Analytics and tracking
                          </li>
                          <li className="flex items-center">
                            <svg className="w-4 h-4 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                            A/B testing support
                          </li>
                        </ul>
                        <button className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-blue-700 transition-colors">
                          Launch Campaign
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Create Project Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-8 max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-gray-900">Create New Project</h3>
              <button
                onClick={() => {
                  setShowCreateModal(false);
                  resetForm();
                }}
                className="text-gray-400 hover:text-gray-600"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <form className="space-y-6">
              {/* Basic Information */}
              <div className="bg-gray-50 rounded-2xl p-6">
                <h4 className="text-lg font-semibold text-gray-900 mb-4">Basic Information</h4>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Project Title *
                    </label>
                    <input
                      type="text"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="Enter your project title"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Short Description *
                    </label>
                    <textarea
                      rows={3}
                      value={shortDescription}
                      onChange={(e) => setShortDescription(e.target.value)}
                      placeholder="Brief description of your project (max 200 characters)"
                      maxLength={200}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none resize-none"
                    ></textarea>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Full Description *
                    </label>
                    <textarea
                      rows={6}
                      value={fullDescription}
                      onChange={(e) => setFullDescription(e.target.value)}
                      placeholder="Detailed description of your project, business model, target market, etc."
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none resize-none"
                    ></textarea>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Funding Goal (USD) *
                      </label>
                      <input
                        type="number"
                        value={fundingGoal}
                        onChange={(e) => setFundingGoal(e.target.value ? Number(e.target.value) : '')}
                        min="100"
                        max="1000"
                        placeholder="800"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                      />
                      <p className="text-xs text-gray-500 mt-1">Max: $1,000 for microinvestments</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Category *
                      </label>
                      <select className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none" value={category} onChange={(e) => setCategory(e.target.value)}>
                        <option value="">Select category</option>
                        {categories && categories.length > 0 ? (
                          categories.map((c) => (
                            <option key={c.value} value={c.value}>{c.label}</option>
                          ))
                        ) : (
                          <>
                            <option value="technology">Technology</option>
                            <option value="healthcare">Healthcare</option>
                            <option value="food">Food & Beverage</option>
                            <option value="fashion">Fashion</option>
                            <option value="education">Education</option>
                          </>
                        )}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Min. Investment (USD) *
                      </label>
                      <input
                        type="number"
                        value={minInvestment}
                        onChange={(e) => setMinInvestment(e.target.value ? Number(e.target.value) : '')}
                        min="5"
                        max="100"
                        placeholder="10"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                      />
                      <p className="text-xs text-gray-500 mt-1">Min: $5, Max: $100</p>
                    </div>
                  </div>
                </div>

                {/* Location and Funding minimal inputs required by backend */}
                <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Location *</label>
                    <input type="text" value={location} onChange={(e) => setLocation(e.target.value)} className="w-full px-4 py-3 border border-gray-300 rounded-lg" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Repayment Time (days) *</label>
                    <input type="number" value={repaymentDays} onChange={(e) => setRepaymentDays(e.target.value ? Number(e.target.value) : '')} min={1} max={365} className="w-full px-4 py-3 border border-gray-300 rounded-lg" />
                  </div>
                </div>
              </div>

              {/* Project Images */}
              <div className="bg-gray-50 rounded-2xl p-6">
                <h4 className="text-lg font-semibold text-gray-900 mb-4">Project Images</h4>
                <div className="space-y-4">
                  {/* Upload Area */}
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-400 transition-colors">
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                      id="image-upload"
                    />
                    <label htmlFor="image-upload" className="cursor-pointer">
                      <svg className="w-12 h-12 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                      </svg>
                      <p className="text-gray-600 font-medium">Click to upload images</p>
                      <p className="text-gray-400 text-sm">PNG, JPG up to 5MB each (max 5 images)</p>
                    </label>
                  </div>

                  {/* Image Preview Grid */}
                  {projectImages.length > 0 && (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                      {projectImages.map((image, index) => (
                        <div key={index} className="relative group">
                          <div className="aspect-square rounded-lg overflow-hidden bg-gray-100">
                            <Image
                              src={image}
                              alt={`Project image ${index + 1}`}
                              width={200}
                              height={200}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <button
                            type="button"
                            onClick={() => removeImage(index)}
                            className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          </button>
                          {index === 0 && (
                            <div className="absolute bottom-2 left-2 bg-blue-500 text-white text-xs px-2 py-1 rounded-full">
                              Main
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Milestones Section */}
              <div className="bg-gray-50 rounded-2xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-lg font-semibold text-gray-900">Project Milestones</h4>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={useMilestones}
                      onChange={(e) => setUseMilestones(e.target.checked)}
                      className="mr-2 rounded border-gray-300 focus:ring-blue-500"
                    />
                    <span className="text-sm font-medium text-gray-700">Use milestones</span>
                  </label>
                </div>

                {useMilestones && (
                  <div className="space-y-4">
                    <p className="text-sm text-gray-600">
                      Break down your funding goal into milestones to build investor confidence.
                    </p>
                    
                    {milestones.map((milestone, index) => (
                      <div key={index} className="border border-gray-200 rounded-lg p-4 bg-white">
                        <div className="flex items-center justify-between mb-3">
                          <h5 className="font-medium text-gray-900">Milestone {index + 1}</h5>
                          {milestones.length > 1 && (
                            <button
                              type="button"
                              onClick={() => removeMilestone(index)}
                              className="text-red-500 hover:text-red-700 text-sm"
                            >
                              Remove
                            </button>
                          )}
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Title *
                            </label>
                            <input
                              type="text"
                              value={milestone.title}
                              onChange={(e) => updateMilestone(index, 'title', e.target.value)}
                              placeholder="e.g., MVP Development"
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-1 focus:ring-blue-500 focus:border-transparent outline-none text-sm"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Target Amount (USD) *
                            </label>
                            <input
                              type="number"
                              value={milestone.target}
                              onChange={(e) => updateMilestone(index, 'target', e.target.value)}
                              placeholder="200"
                              min="50"
                              max="1000"
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-1 focus:ring-blue-500 focus:border-transparent outline-none text-sm"
                            />
                          </div>
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Description *
                          </label>
                          <textarea
                            value={milestone.description}
                            onChange={(e) => updateMilestone(index, 'description', e.target.value)}
                            placeholder="Describe what will be achieved with this milestone"
                            rows={2}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-1 focus:ring-blue-500 focus:border-transparent outline-none text-sm resize-none"
                          ></textarea>
                        </div>
                      </div>
                    ))}

                    <button
                      type="button"
                      onClick={addMilestone}
                      className="w-full py-2 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-blue-400 hover:text-blue-600 transition-colors flex items-center justify-center space-x-2"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                      </svg>
                      <span>Add Another Milestone</span>
                    </button>
                  </div>
                )}
              </div>

              {/* Business Details */}
              <div className="bg-gray-50 rounded-2xl p-6">
                <h4 className="text-lg font-semibold text-gray-900 mb-4">Business Details</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Business Model
                    </label>
                    <textarea
                      rows={3}
                      placeholder="How does your business make money?"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none resize-none"
                    ></textarea>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Expected ROI
                    </label>
                    <input
                      type="text"
                      placeholder="e.g., 15-25% expected"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Market Size</label>
                    <input value={marketSize} onChange={(e) => setMarketSize(e.target.value)} placeholder="e.g., $5M - $20M" className="w-full px-4 py-3 border border-gray-300 rounded-lg" />
                    <p className="text-xs text-gray-400 mt-1">Optional, helps investors understand the opportunity</p>
                  </div>
                </div>
              </div>

              {/* Form Actions */}
              <div className="flex space-x-4 pt-4 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => {
                    setShowCreateModal(false);
                    resetForm();
                  }}
                  className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={async () => await createProjectHandler(true)}
                  disabled={submitting}
                  className="px-6 py-3 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 font-medium transition-colors"
                >
                  {submitting ? 'Saving...' : 'Save as Draft'}
                </button>
                <button
                  type="button"
                  onClick={async () => await createProjectHandler(false)}
                  disabled={submitting}
                  className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium transition-colors"
                >
                  {submitting ? 'Publishing...' : 'Publish Project'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
