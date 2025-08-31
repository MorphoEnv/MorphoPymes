'use client';

import React, { useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';

// Mock data detallado del proyecto
const getProjectDetails = (id: string) => {
  const projects: { [key: string]: any } = {
    '1': {
      id: 1,
      title: 'EcoTech Solutions',
      shortDescription: 'Soluciones tecnológicas sostenibles para empresas que buscan reducir su huella de carbono.',
      fullDescription: 'EcoTech Solutions desarrolla tecnologías innovadoras para ayudar a las empresas a reducir significativamente su impacto ambiental. Nuestro enfoque integral incluye auditorías energéticas, implementación de sistemas de energía renovable, y desarrollo de software para monitoreo de emisiones en tiempo real.',
      entrepreneur: {
        name: 'María González',
        avatar: '/default-avatar.svg',
        verified: true,
        bio: 'Ingeniera Ambiental con 10 años de experiencia en sostenibilidad corporativa. MBA en Gestión de Empresas.',
        linkedin: '#',
        experience: '10+ años en sostenibilidad'
      },
      funding: {
        target: 800,
        raised: 520,
        percentage: 65,
        investors: 28,
        minimumInvestment: 10,
        roi: '15-25% expected'
      },
      milestones: [
        {
          title: 'Desarrollo del MVP',
          description: 'Creación del software base de monitoreo',
          target: 200,
          completed: true,
          date: 'Completed - March 2024'
        },
        {
          title: 'Primeros clientes piloto',
          description: '5 empresas usando la plataforma',
          target: 400,
          completed: true,
          date: 'Completed - June 2024'
        },
        {
          title: 'Expansión regional',
          description: 'Llegar a 20 empresas en 3 países',
          target: 600,
          completed: false,
          date: 'Target: December 2024'
        },
        {
          title: 'Escalamiento',
          description: 'Equipo de 15 personas y 100+ clientes',
          target: 800,
          completed: false,
          date: 'Target: June 2025'
        }
      ],
      category: 'Technology',
      location: 'Medellín, Colombia',
      featured: true,
      images: ['/Figura1.png', '/Figura1.png', '/Figura1.png'],
      businessModel: 'SaaS con modelo de suscripción mensual. Revenue share del 3% en ahorros generados.',
      marketSize: '$2.1B mercado de sostenibilidad empresarial en LatAm',
      competition: 'Competidores principales: EcoTrack, GreenTech Analytics',
      financials: {
        revenue: '$12,000 MRR',
        growth: '+35% monthly',
        customers: 15
      }
    },
    '2': {
      id: 2,
      title: 'Café Premium Local',
      shortDescription: 'Producción y distribución de café de alta calidad directamente desde fincas colombianas.',
      fullDescription: 'Conectamos directamente a los consumidores con los mejores productores de café de Colombia, eliminando intermediarios y garantizando precios justos para los agricultores mientras ofrecemos café de calidad superior a nuestros clientes.',
      entrepreneur: {
        name: 'Carlos Rodríguez',
        avatar: '/default-avatar.svg',
        verified: true,
        bio: 'Productor de café de tercera generación. Especialista en comercio directo y agricultura sostenible.',
        linkedin: '#',
        experience: '20+ años en agricultura'
      },
      funding: {
        target: 500,
        raised: 375,
        percentage: 75,
        investors: 15,
        minimumInvestment: 5,
        roi: '20-30% expected'
      },
      milestones: [],
      category: 'Food & Beverage',
      location: 'Bogotá, Colombia',
      featured: false,
      images: ['/Figura1.png', '/Figura1.png'],
      businessModel: 'Venta directa B2C y B2B. Suscripciones mensuales y ventas por mayor.',
      marketSize: '$500M mercado de café premium en Colombia',
      competition: 'Competencia: Juan Valdez, Oma Coffee',
      financials: {
        revenue: '$8,500 monthly',
        growth: '+20% monthly',
        customers: 120
      }
    }
  };
  
  return projects[id] || null;
};

export default function ProjectDetail() {
  const params = useParams();
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [investmentAmount, setInvestmentAmount] = useState('');
  const [showInvestModal, setShowInvestModal] = useState(false);
  
  const project = getProjectDetails(params.id as string);

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
                  <Image
                    src={project.images[selectedImageIndex]}
                    alt={project.title}
                    fill
                    className="object-cover"
                  />
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
                        <div className="text-2xl font-bold text-blue-600">{project.financials.revenue}</div>
                        <div className="text-sm text-gray-600">Monthly Revenue</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-green-600">{project.financials.growth}</div>
                        <div className="text-sm text-gray-600">Growth Rate</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-purple-600">{project.financials.customers}</div>
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
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="relative">
                      <Image
                        src={project.entrepreneur.avatar}
                        alt={project.entrepreneur.name}
                        width={60}
                        height={60}
                        className="rounded-full border-2 border-blue-200/50"
                      />
                      {project.entrepreneur.verified && (
                        <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                          <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                      )}
                    </div>
                    <div>
                      <div className="flex items-center space-x-2">
                        <h4 className="font-semibold text-gray-900">{project.entrepreneur.name}</h4>
                        {project.entrepreneur.verified && (
                          <span className="text-green-600 text-xs font-medium">Verified</span>
                        )}
                      </div>
                      <p className="text-sm text-gray-500">{project.entrepreneur.experience}</p>
                    </div>
                  </div>
                  <p className="text-gray-600 text-sm mb-4">{project.entrepreneur.bio}</p>
                  <button className="w-full px-4 py-2 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 transition-colors text-sm font-medium">
                    View Full Profile
                  </button>
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
                      <span className="font-medium text-green-600">{project.funding.roi}</span>
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
              <button className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
