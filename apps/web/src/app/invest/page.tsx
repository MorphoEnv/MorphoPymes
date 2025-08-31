'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';

// Mock data para proyectos de ejemplo
const mockProjects = [
  {
    id: 1,
    title: 'EcoTech Solutions',
    description: 'Soluciones tecnológicas sostenibles para empresas que buscan reducir su huella de carbono.',
    entrepreneur: {
      name: 'María González',
      avatar: '/default-avatar.svg',
      verified: true
    },
    funding: {
      target: 800,
      raised: 520,
      percentage: 65,
      investors: 28
    },
    milestones: true,
    category: 'Technology',
    location: 'Medellín, Colombia',
    featured: true,
    sponsored: true,
    image: '/Figura1.png'
  },
  {
    id: 2,
    title: 'Café Premium Local',
    description: 'Producción y distribución de café de alta calidad directamente desde fincas colombianas.',
    entrepreneur: {
      name: 'Carlos Rodríguez',
      avatar: '/default-avatar.svg',
      verified: true
    },
    funding: {
      target: 500,
      raised: 375,
      percentage: 75,
      investors: 15
    },
    milestones: false,
    category: 'Food & Beverage',
    location: 'Bogotá, Colombia',
    featured: false,
    sponsored: false,
    image: '/Figura1.png'
  },
  {
    id: 3,
    title: 'HealthApp Mobile',
    description: 'Aplicación móvil para el seguimiento de salud personal y conexión con profesionales médicos.',
    entrepreneur: {
      name: 'Ana Martínez',
      avatar: '/default-avatar.svg',
      verified: false
    },
    funding: {
      target: 1000,
      raised: 160,
      percentage: 16,
      investors: 8
    },
    milestones: true,
    category: 'Healthcare',
    location: 'Cali, Colombia',
    featured: true,
    sponsored: false,
    image: '/Figura1.png'
  },
  {
    id: 4,
    title: 'Textile Innovation',
    description: 'Producción de textiles ecológicos usando materiales reciclados y procesos sostenibles.',
    entrepreneur: {
      name: 'Juan Pablo Silva',
      avatar: '/default-avatar.svg',
      verified: true
    },
    funding: {
      target: 600,
      raised: 520,
      percentage: 87,
      investors: 42
    },
    milestones: true,
    category: 'Fashion',
    location: 'Barranquilla, Colombia',
    featured: false,
    sponsored: true,
    image: '/Figura1.png'
  }
];

const categories = ['All', 'Technology', 'Healthcare', 'Food & Beverage', 'Fashion', 'Education'];

export default function Invest() {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredProjects = mockProjects.filter(project => {
    const matchesCategory = selectedCategory === 'All' || project.category === selectedCategory;
    const matchesSearch = project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         project.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0
    }).format(amount);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100/60">
      {/* Header */}
      <section className="relative px-6 pt-28 pb-12 overflow-hidden">
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-8">
            <div className="inline-flex items-center px-4 py-2 bg-blue-100/80 text-blue-800 text-sm font-medium rounded-full backdrop-blur-sm border border-blue-200/50 mb-4">
              <span className="relative flex h-2 w-2 mr-2">
                <span className="absolute inline-flex h-full w-full bg-blue-400 rounded-full opacity-75 animate-pulse"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-600"></span>
              </span>
              Investment Opportunities
            </div>
            
            <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 leading-tight mb-4">
              Discover & <span className="bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">Invest</span>
            </h1>
            
            <p className="text-lg text-gray-600 leading-relaxed max-w-2xl mx-auto mb-8">
              Explore innovative projects from talented entrepreneurs across Latin America. 
              Find opportunities that align with your values and investment goals.
            </p>

            {/* Search and Filters */}
            <div className="flex flex-col sm:flex-row gap-4 max-w-4xl mx-auto">
              {/* Search */}
              <div className="flex-1 relative">
                <input
                  type="text"
                  placeholder="Search projects..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 bg-white/90 backdrop-blur-sm border border-blue-200/50 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all text-gray-900 placeholder-gray-500"
                />
                <svg className="absolute left-4 top-3.5 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>

              {/* Category Filter */}
              <div className="flex gap-2 overflow-x-auto pb-2">
                {categories.map((category) => (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className={`whitespace-nowrap px-4 py-3 rounded-xl font-medium text-sm transition-all duration-300 ${
                      selectedCategory === category
                        ? 'bg-blue-600 text-white shadow-lg'
                        : 'bg-white/90 text-gray-700 hover:bg-blue-50 border border-blue-200/50'
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Projects Grid */}
      <section className="px-6 pb-16">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProjects.map((project) => (
              <div key={project.id} className={`bg-white/90 backdrop-blur-sm rounded-3xl overflow-hidden shadow-xl border border-blue-200/50 hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 group ${
                project.featured ? 'ring-2 ring-blue-300/50' : ''
              }`}>
                {/* Project Image */}
                <div className="relative h-48 overflow-hidden">
                  <Image
                    src={project.image}
                    alt={project.title}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute top-4 left-4 flex flex-col space-y-2">
                    {project.featured && (
                      <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-3 py-1 rounded-full text-xs font-semibold">
                        Featured
                      </div>
                    )}
                    {project.sponsored && (
                      <div className="bg-gradient-to-r from-yellow-500 to-yellow-600 text-white px-3 py-1 rounded-full text-xs font-semibold">
                        Patrocinado
                      </div>
                    )}
                  </div>
                  <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-full px-3 py-1 text-xs font-medium text-gray-700">
                    {project.category}
                  </div>
                </div>

                <div className="p-6">
                  {/* Entrepreneur Info */}
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="relative">
                      <Image
                        src={project.entrepreneur.avatar}
                        alt={project.entrepreneur.name}
                        width={40}
                        height={40}
                        className="rounded-full border-2 border-blue-200/50"
                      />
                      {project.entrepreneur.verified && (
                        <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                          <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                      )}
                    </div>
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="font-medium text-gray-900 text-sm">{project.entrepreneur.name}</span>
                        {project.entrepreneur.verified && (
                          <span className="text-green-600 text-xs">Verified</span>
                        )}
                      </div>
                      <span className="text-xs text-gray-500">{project.location}</span>
                    </div>
                  </div>

                  {/* Project Info */}
                  <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                    {project.title}
                  </h3>
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                    {project.description}
                  </p>

                  {/* Funding Progress */}
                  <div className="mb-4">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium text-gray-700">
                        {formatCurrency(project.funding.raised)} raised
                      </span>
                      <span className="text-sm text-gray-500">
                        {project.funding.percentage}%
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-gradient-to-r from-blue-500 to-blue-600 h-2 rounded-full transition-all duration-1000"
                        style={{ width: `${project.funding.percentage}%` }}
                      ></div>
                    </div>
                    <div className="flex justify-between items-center mt-2">
                      <span className="text-xs text-gray-500">
                        Goal: {formatCurrency(project.funding.target)}
                      </span>
                      <span className="text-xs text-gray-500">
                        {project.funding.investors} investors
                      </span>
                    </div>
                  </div>

                  {/* Features */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-1">
                      {project.milestones ? (
                        <div className="flex items-center space-x-1 bg-green-50 px-2 py-1 rounded-full">
                          <svg className="w-3 h-3 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          <span className="text-xs text-green-600 font-medium">Milestones</span>
                        </div>
                      ) : (
                        <div className="flex items-center space-x-1 bg-gray-50 px-2 py-1 rounded-full">
                          <span className="text-xs text-gray-500">No Milestones</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* CTA Button */}
                  <Link
                    href={`/invest/${project.id}`}
                    className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white py-3 px-4 rounded-xl font-semibold text-sm hover:shadow-lg transition-all duration-300 hover:scale-105 flex items-center justify-center space-x-2 group"
                  >
                    <span>View Details</span>
                    <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </Link>
                </div>
              </div>
            ))}
          </div>

          {/* Empty State */}
          {filteredProjects.length === 0 && (
            <div className="text-center py-16">
              <div className="w-24 h-24 mx-auto bg-gray-100 rounded-full flex items-center justify-center mb-4">
                <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No projects found</h3>
              <p className="text-gray-600">Try adjusting your filters or search terms.</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
