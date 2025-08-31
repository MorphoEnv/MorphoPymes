'use client';

import { useState } from 'react';
import Image from 'next/image';

export default function Finance() {
  const [activeTab, setActiveTab] = useState('overview');
  const [showCreateProject, setShowCreateProject] = useState(false);
  const [showInvestors, setShowInvestors] = useState(false);
  const [selectedProjectId, setSelectedProjectId] = useState<number | null>(null);
  const [editingProject, setEditingProject] = useState<number | null>(null);
  const [showProjectDetails, setShowProjectDetails] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editForm, setEditForm] = useState({
    name: '',
    description: '',
    target: '',
    category: ''
  });
  
  // Mock data para proyectos
  const [projects, setProjects] = useState([
    {
      id: 1,
      name: 'EcoTech Startup',
      description: 'Sustainable technology solutions for urban environments',
      target: 100000,
      raised: 75000,
      status: 'open',
      daysLeft: 15,
      investors: 5,
      image: '/default-avatar.svg',
      category: 'Technology'
    },
    {
      id: 2,
      name: 'Local Coffee Roastery',
      description: 'Premium coffee roasting facility in downtown',
      target: 50000,
      raised: 52000,
      status: 'closed',
      daysLeft: 0,
      investors: 3,
      image: '/default-avatar.svg',
      category: 'Food & Beverage'
    },
    {
      id: 3,
      name: 'Art Studio & Gallery',
      description: 'Community art space for local artists',
      target: 25000,
      raised: 8500,
      status: 'open',
      daysLeft: 22,
      investors: 2,
      image: '/default-avatar.svg',
      category: 'Arts'
    }
  ]);

  // Mock data para inversores
  const [investorsData] = useState<{ [key: number]: Array<{ id: number; name: string; amount: number; date: string; avatar: string }> }>({
    1: [
      { id: 1, name: 'John Smith', amount: 5000, date: '2024-08-15', avatar: '/default-avatar.svg' },
      { id: 2, name: 'Maria Garcia', amount: 2500, date: '2024-08-14', avatar: '/default-avatar.svg' },
      { id: 3, name: 'David Chen', amount: 10000, date: '2024-08-13', avatar: '/default-avatar.svg' },
      { id: 4, name: 'Sarah Johnson', amount: 1500, date: '2024-08-12', avatar: '/default-avatar.svg' },
      { id: 5, name: 'Michael Brown', amount: 3000, date: '2024-08-11', avatar: '/default-avatar.svg' },
    ],
    2: [
      { id: 6, name: 'Emily Davis', amount: 8000, date: '2024-07-20', avatar: '/default-avatar.svg' },
      { id: 7, name: 'Robert Wilson', amount: 4500, date: '2024-07-18', avatar: '/default-avatar.svg' },
      { id: 8, name: 'Lisa Martinez', amount: 6000, date: '2024-07-15', avatar: '/default-avatar.svg' },
    ],
    3: [
      { id: 9, name: 'James Anderson', amount: 2000, date: '2024-08-10', avatar: '/default-avatar.svg' },
      { id: 10, name: 'Anna Taylor', amount: 1200, date: '2024-08-08', avatar: '/default-avatar.svg' },
    ]
  });

  const [newProject, setNewProject] = useState({
    name: '',
    description: '',
    target: '',
    duration: '30',
    category: 'Technology'
  });

  const openProjects = projects.filter(p => p.status === 'open');
  const closedProjects = projects.filter(p => p.status === 'closed');
  const totalRaised = projects.reduce((sum, p) => sum + p.raised, 0);
  const totalInvestors = projects.reduce((sum, p) => sum + p.investors, 0);

  const handleCreateProject = () => {
    if (newProject.name && newProject.description && newProject.target) {
      const newId = Math.max(...projects.map(p => p.id)) + 1;
      const projectToAdd = {
        id: newId,
        name: newProject.name,
        description: newProject.description,
        target: parseInt(newProject.target),
        raised: 0,
        status: 'open' as const,
        daysLeft: parseInt(newProject.duration),
        investors: 0,
        image: '/default-avatar.svg',
        category: newProject.category
      };
      
      setProjects(prevProjects => [...prevProjects, projectToAdd]);
      console.log('Project created successfully:', projectToAdd);
    }
    setShowCreateProject(false);
    setNewProject({ name: '', description: '', target: '', duration: '30', category: 'Technology' });
  };

  const handleEditProject = (projectId: number) => {
    const project = projects.find(p => p.id === projectId);
    if (project) {
      setEditingProject(projectId);
      setEditForm({
        name: project.name,
        description: project.description,
        target: project.target.toString(),
        category: project.category
      });
      setShowEditModal(true);
    }
  };

  const handleViewDetails = (projectId: number) => {
    setSelectedProjectId(projectId);
    setShowProjectDetails(true);
  };

  const handleSaveEdit = () => {
    if (editingProject) {
      setProjects(prevProjects => 
        prevProjects.map(project => 
          project.id === editingProject 
            ? {
                ...project,
                name: editForm.name,
                description: editForm.description,
                target: parseInt(editForm.target) || project.target,
                category: editForm.category
              }
            : project
        )
      );
      console.log('Project updated successfully:', editingProject, editForm);
    }
    setShowEditModal(false);
    setEditingProject(null);
    setEditForm({ name: '', description: '', target: '', category: '' });
  };

  const handleCancelEdit = () => {
    setShowEditModal(false);
    setEditingProject(null);
    setEditForm({ name: '', description: '', target: '', category: '' });
  };

  const renderOverview = () => (
    <div className="space-y-6">
      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-4 border border-blue-200/50 shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-600 mb-1">Total Projects</p>
              <p className="text-2xl font-bold text-gray-900">{projects.length}</p>
            </div>
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-4 border border-blue-200/50 shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-600 mb-1">Total Raised</p>
              <p className="text-2xl font-bold text-blue-600">${totalRaised.toLocaleString()}</p>
            </div>
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-4 border border-blue-200/50 shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-600 mb-1">Active Projects</p>
              <p className="text-2xl font-bold text-gray-900">{openProjects.length}</p>
            </div>
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-4 border border-blue-200/50 shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-600 mb-1">Total Investors</p>
              <p className="text-2xl font-bold text-gray-900">{totalInvestors}</p>
            </div>
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Projects */}
      <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 border border-blue-200/50 shadow-lg">
        <h3 className="text-lg font-bold text-gray-900 mb-4">Recent Projects</h3>
        <div className="space-y-4">
          {projects.slice(0, 3).map((project) => (
            <div key={project.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                  </svg>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">{project.name}</h4>
                  <p className="text-sm text-gray-600">{project.category}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-semibold text-gray-900">${project.raised.toLocaleString()}</p>
                <p className="text-sm text-gray-600">{Math.round((project.raised / project.target) * 100)}% funded</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderProjects = (status = 'all') => {
    const filteredProjects = status === 'all' ? projects : 
                            status === 'open' ? openProjects : closedProjects;

    return (
      <div className="space-y-4">
        {filteredProjects.map((project) => (
          <div key={project.id} className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 border border-blue-200/50 shadow-lg">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-start space-x-4">
                <div className="w-16 h-16 bg-blue-100 rounded-lg flex items-center justify-center">
                  <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                  </svg>
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-gray-900 mb-1">{project.name}</h3>
                  <p className="text-sm text-gray-600 mb-2">{project.description}</p>
                  <span className="inline-block px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                    {project.category}
                  </span>
                </div>
              </div>
              <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                project.status === 'open' 
                  ? 'bg-blue-100 text-blue-800' 
                  : 'bg-gray-100 text-gray-800'
              }`}>
                {project.status === 'open' ? 'Active' : 'Completed'}
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
              <div>
                <p className="text-xs text-gray-600 mb-1">Target</p>
                <p className="font-semibold text-gray-900">${project.target.toLocaleString()}</p>
              </div>
              <div>
                <p className="text-xs text-gray-600 mb-1">Raised</p>
                <p className="font-semibold text-blue-600">${project.raised.toLocaleString()}</p>
              </div>
              <div>
                <p className="text-xs text-gray-600 mb-1">Investors</p>
                <button 
                  onClick={() => {
                    setSelectedProjectId(project.id);
                    setShowInvestors(true);
                  }}
                  className="font-semibold text-blue-600 hover:text-blue-700 transition-colors cursor-pointer underline"
                >
                  {project.investors}
                </button>
              </div>
              <div>
                <p className="text-xs text-gray-600 mb-1">Days Left</p>
                <p className="font-semibold text-gray-900">
                  {project.status === 'open' ? project.daysLeft : 'Finished'}
                </p>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="mb-4">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-gray-600">Progress</span>
                <span className="text-sm font-semibold text-gray-900">
                  {Math.round((project.raised / project.target) * 100)}%
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${Math.min((project.raised / project.target) * 100, 100)}%` }}
                ></div>
              </div>
            </div>

            <div className="flex gap-3">
              <button 
                onClick={() => handleViewDetails(project.id)}
                className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
              >
                View Details
              </button>
              <button 
                onClick={() => handleEditProject(project.id)}
                className="px-4 py-2 border border-blue-600 text-blue-600 text-sm font-medium rounded-lg hover:bg-blue-50 transition-colors"
              >
                Edit
              </button>
            </div>
          </div>
        ))}
      </div>
    );
  };

  const renderCreateProject = () => (
    <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 border border-blue-200/50 shadow-lg">
      <h3 className="text-lg font-bold text-gray-900 mb-6">Create New Project</h3>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Project Name</label>
          <input
            type="text"
            value={newProject.name}
            onChange={(e) => setNewProject({...newProject, name: e.target.value})}
            className="w-full px-4 py-3 border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
            placeholder="Enter your project name"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
          <textarea
            value={newProject.description}
            onChange={(e) => setNewProject({...newProject, description: e.target.value})}
            rows={4}
            className="w-full px-4 py-3 border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all resize-none"
            placeholder="Describe your project..."
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Funding Target ($)</label>
            <input
              type="number"
              value={newProject.target}
              onChange={(e) => setNewProject({...newProject, target: e.target.value})}
              className="w-full px-4 py-3 border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
              placeholder="0"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Campaign Duration (days)</label>
            <select
              value={newProject.duration}
              onChange={(e) => setNewProject({...newProject, duration: e.target.value})}
              className="w-full px-4 py-3 border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
            >
              <option value="30">30 days</option>
              <option value="45">45 days</option>
              <option value="60">60 days</option>
              <option value="90">90 days</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
          <select
            value={newProject.category}
            onChange={(e) => setNewProject({...newProject, category: e.target.value})}
            className="w-full px-4 py-3 border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
          >
            <option value="Technology">Technology</option>
            <option value="Food & Beverage">Food & Beverage</option>
            <option value="Arts">Arts</option>
            <option value="Health">Health</option>
            <option value="Education">Education</option>
            <option value="Environment">Environment</option>
          </select>
        </div>

        <div className="flex gap-4 pt-4">
          <button
            onClick={handleCreateProject}
            className="flex-1 px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-all duration-300 shadow-lg hover:shadow-xl"
          >
            Create Project
          </button>
          <button
            onClick={() => setShowCreateProject(false)}
            className="flex-1 px-6 py-3 border-2 border-blue-600 text-blue-600 font-semibold rounded-lg hover:bg-blue-50 transition-all duration-300"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );

  const renderInvestorsModal = () => {
    if (!showInvestors || !selectedProjectId) return null;
    
    const project = projects.find(p => p.id === selectedProjectId);
    const investors = investorsData[selectedProjectId] || [];
    
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-2xl p-6 max-w-2xl w-full max-h-[80vh] overflow-y-auto">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-xl font-bold text-gray-900">Investors</h3>
              <p className="text-sm text-gray-600">{project?.name}</p>
            </div>
            <button
              onClick={() => setShowInvestors(false)}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="space-y-3">
            {investors.map((investor) => (
              <div key={investor.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                    <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">{investor.name}</h4>
                    <p className="text-sm text-gray-600">{investor.date}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-blue-600">${investor.amount.toLocaleString()}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 pt-4 border-t border-gray-200">
            <div className="flex justify-between items-center">
              <span className="font-semibold text-gray-900">Total from {investors.length} investors:</span>
              <span className="font-bold text-blue-600 text-lg">
                ${investors.reduce((sum, inv) => sum + inv.amount, 0).toLocaleString()}
              </span>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderProjectDetailsModal = () => {
    if (!showProjectDetails || !selectedProjectId) return null;
    
    const project = projects.find(p => p.id === selectedProjectId);
    if (!project) return null;
    
    const progressPercentage = Math.min((project.raised / project.target) * 100, 100);
    
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-2xl p-6 max-w-2xl w-full max-h-[80vh] overflow-y-auto">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-xl font-bold text-gray-900">{project.name}</h3>
              <p className="text-sm text-gray-600">{project.category}</p>
            </div>
            <button
              onClick={() => setShowProjectDetails(false)}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="space-y-6">
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">Description</h4>
              <p className="text-gray-600">{project.description}</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="font-semibold text-gray-900 mb-1">Target</h4>
                <p className="text-2xl font-bold text-blue-600">${project.target.toLocaleString()}</p>
              </div>
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="font-semibold text-gray-900 mb-1">Raised</h4>
                <p className="text-2xl font-bold text-green-600">${project.raised.toLocaleString()}</p>
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <h4 className="font-semibold text-gray-900">Progress</h4>
                <span className="text-sm text-gray-600">{progressPercentage.toFixed(1)}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div 
                  className="bg-blue-600 h-3 rounded-full transition-all duration-300"
                  style={{ width: `${progressPercentage}%` }}
                ></div>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="text-center">
                <p className="text-xs text-gray-600 mb-1">Investors</p>
                <p className="text-lg font-bold text-gray-900">{project.investors}</p>
              </div>
              <div className="text-center">
                <p className="text-xs text-gray-600 mb-1">Status</p>
                <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                  project.status === 'open' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                }`}>
                  {project.status === 'open' ? 'Active' : 'Closed'}
                </span>
              </div>
              <div className="text-center">
                <p className="text-xs text-gray-600 mb-1">Days Left</p>
                <p className="text-lg font-bold text-gray-900">
                  {project.status === 'open' ? project.daysLeft : 'Finished'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderEditModal = () => {
    if (!showEditModal || !editingProject) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-2xl p-6 max-w-2xl w-full max-h-[80vh] overflow-y-auto">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-gray-900">Edit Project</h3>
            <button
              onClick={handleCancelEdit}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Project Name</label>
              <input
                type="text"
                value={editForm.name}
                onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
              <textarea
                value={editForm.description}
                onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Target Amount ($)</label>
              <input
                type="number"
                value={editForm.target}
                onChange={(e) => setEditForm({ ...editForm, target: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
              <select
                value={editForm.category}
                onChange={(e) => setEditForm({ ...editForm, category: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="Technology">Technology</option>
                <option value="Food & Beverage">Food & Beverage</option>
                <option value="Arts">Arts</option>
                <option value="Health">Health</option>
                <option value="Education">Education</option>
                <option value="Environment">Environment</option>
              </select>
            </div>
          </div>

          <div className="flex gap-3 mt-6">
            <button
              onClick={handleSaveEdit}
              className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              Save Changes
            </button>
            <button
              onClick={handleCancelEdit}
              className="flex-1 border border-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-50 transition-colors font-medium"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100/60">
      {/* Header */}
      <section className="relative px-6 pt-28 pb-8 overflow-hidden">
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center">
            <div className="inline-flex items-center px-3 py-1.5 bg-blue-100/80 text-blue-800 text-xs font-medium rounded-full backdrop-blur-sm border border-blue-200/50 mb-4">
              <span className="relative flex h-1.5 w-1.5 mr-2">
                <span className="absolute inline-flex h-full w-full bg-blue-400 rounded-full opacity-75 animate-pulse"></span>
                <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-blue-600"></span>
              </span>
              Finance Dashboard
            </div>
            
            <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 leading-tight mb-2">
              Your <span className="bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">Finance</span> Hub
            </h1>
            
            <p className="text-sm text-gray-600 leading-relaxed max-w-xl mx-auto">
              Manage your projects, track funding, and monitor your financial progress
            </p>
          </div>
        </div>
      </section>

      {/* Navigation Tabs */}
      <section className="px-6 pb-6">
        <div className="max-w-7xl mx-auto">
          <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-1 border border-blue-200/50 shadow-lg mb-6">
            <div className="flex flex-wrap gap-1">
              <button
                onClick={() => setActiveTab('overview')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                  activeTab === 'overview'
                    ? 'bg-blue-600 text-white shadow-lg'
                    : 'text-gray-600 hover:text-blue-600 hover:bg-blue-50'
                }`}
              >
                Overview
              </button>
              <button
                onClick={() => setActiveTab('all-projects')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                  activeTab === 'all-projects'
                    ? 'bg-blue-600 text-white shadow-lg'
                    : 'text-gray-600 hover:text-blue-600 hover:bg-blue-50'
                }`}
              >
                All Projects
              </button>
              <button
                onClick={() => setActiveTab('open-projects')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                  activeTab === 'open-projects'
                    ? 'bg-blue-600 text-white shadow-lg'
                    : 'text-gray-600 hover:text-blue-600 hover:bg-blue-50'
                }`}
              >
                Active Projects
              </button>
              <button
                onClick={() => setActiveTab('closed-projects')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                  activeTab === 'closed-projects'
                    ? 'bg-blue-600 text-white shadow-lg'
                    : 'text-gray-600 hover:text-blue-600 hover:bg-blue-50'
                }`}
              >
                Completed Projects
              </button>
              <button
                onClick={() => setActiveTab('earnings')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                  activeTab === 'earnings'
                    ? 'bg-blue-600 text-white shadow-lg'
                    : 'text-gray-600 hover:text-blue-600 hover:bg-blue-50'
                }`}
              >
                Earnings
              </button>
              <button
                onClick={() => {
                  setActiveTab('create');
                  setShowCreateProject(true);
                }}
                className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-all duration-300 shadow-lg hover:shadow-xl ml-auto"
              >
                + Create Project
              </button>
            </div>
          </div>

          {/* Content */}
          <div>
            {activeTab === 'overview' && renderOverview()}
            {activeTab === 'all-projects' && renderProjects('all')}
            {activeTab === 'open-projects' && renderProjects('open')}
            {activeTab === 'closed-projects' && renderProjects('closed')}
            {activeTab === 'earnings' && (
              <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 border border-blue-200/50 shadow-lg">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Your Earnings</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-blue-50 rounded-lg p-4">
                    <h4 className="font-semibold text-blue-800">Total Earned</h4>
                    <p className="text-2xl font-bold text-blue-600">${totalRaised.toLocaleString()}</p>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h4 className="font-semibold text-gray-800">This Month</h4>
                    <p className="text-2xl font-bold text-gray-900">$12,350</p>
                  </div>
                  <div className="bg-blue-50 rounded-lg p-4">
                    <h4 className="font-semibold text-blue-800">Pending</h4>
                    <p className="text-2xl font-bold text-blue-600">$2,450</p>
                  </div>
                </div>
              </div>
            )}
            {(activeTab === 'create' || showCreateProject) && renderCreateProject()}
          </div>
        </div>
      </section>
      {renderInvestorsModal()}
      {renderProjectDetailsModal()}
      {renderEditModal()}
    </div>
  );
}
