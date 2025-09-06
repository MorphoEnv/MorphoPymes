'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

export default function About() {
  const team = [
    {
      name: "Allan Bolaños",
      role: "Full Stack Developer",
      bio: "Full stack developer with expertise in modern web development and scalable applications.",
      avatar: "AB",
      photo: "/Allan.jpg",
      color: "from-morpho-blue to-blue-600",
      skills: ["React", "TypeScript", "Next.js", "Node.js"],
      socials: {
        linkedin: "https://www.linkedin.com/in/allandbb",
        github: "https://github.com/AllanDBB",
        instagram: "https://www.instagram.com/allandbb_"
      }
    },
    {
      name: "Brian Ramirez", 
      role: "Blockchain Developer",
      bio: "Blockchain researcher focused on BTC, ETH, STELLAR, smart contracts and Web3 integrations.",
      avatar: "BR",
      photo: "/Brian.jpg",
      color: "from-morpho-blue to-morpho-dark-blue", 
      skills: ["Solidity", "Web3", "DeFi", "Smart Contracts"],
      socials: {
        linkedin: "https://www.linkedin.com/in/bracr/",
        github: "https://github.com/BraCR10",
        twitter: "https://x.com/BRACR10X"
      }
    },
    {
      name: "Santiago Valverde",
      role: "Developer (Documentation Lead)",
      bio: "Responsible for project documentation, technical writing, and frontend development.",
      avatar: "SV",
      photo: "/Santiago.jpeg",
      color: "from-blue-500 to-morpho-blue",
      skills: ["APIs", "Documentation", "Node.js", "React"],
      socials: {
        linkedin: "https://www.linkedin.com/in/santiago-valverde-135316279/",
        github: "https://github.com/santivalverde4",
        instagram: "https://www.instagram.com/santivalverde_"
      }
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Subtle background pattern */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50/30 via-transparent to-blue-50/20"></div>
      {/* Header */}
      <div className="relative pt-32 pb-24 bg-gradient-to-br from-morpho-blue/5 via-blue-50/80 to-morpho-blue/10">
        <div className="absolute inset-0">
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-morpho-blue/5 to-transparent"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-morpho-blue/5 rounded-full blur-3xl"></div>
          <div className="absolute top-1/3 left-1/4 w-64 h-64 bg-blue-300/10 rounded-full blur-2xl"></div>
        </div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-6 text-center">
          
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
            About <span className="text-morpho-blue">MorphoPymes</span>
          </h1>
          
          <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Democratizing access to DeFi for small and medium businesses through 
            transparent, accessible, and efficient lending solutions.
          </p>
        </div>
      </div>

      {/* Mission */}
      <div className="relative max-w-6xl mx-auto px-6 py-16">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">Our Mission</h2>
          <p className="text-lg text-gray-600 max-w-4xl mx-auto leading-relaxed">
            MorphoPymes bridges the gap between traditional SME financing and decentralized finance, 
            providing small businesses with transparent, accessible, and efficient lending solutions 
            while offering investors attractive yield opportunities backed by real-world assets.
          </p>
        </div>

        {/* Key Features */}
        <div className="grid md:grid-cols-3 gap-8 mb-20">
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-blue-100 hover:shadow-xl transition-all duration-300">
            <div className="w-12 h-12 bg-morpho-blue/10 rounded-xl flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-morpho-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">For SMEs</h3>
            <p className="text-gray-600">Access instant loans without traditional banking barriers</p>
          </div>

          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-blue-100 hover:shadow-xl transition-all duration-300">
            <div className="w-12 h-12 bg-morpho-dark-blue/10 rounded-xl flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-morpho-dark-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">For Investors</h3>
            <p className="text-gray-600">Earn competitive yields through diversified lending pools</p>
          </div>

          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-blue-100 hover:shadow-xl transition-all duration-300">
            <div className="w-12 h-12 bg-blue-500/10 rounded-xl flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Transparent</h3>
            <p className="text-gray-600">Blockchain-based transparency and automated smart contracts</p>
          </div>
        </div>

        {/* Team Section */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">Meet the Team</h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">The passionate developers building the future of SME finance</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {team.map((member, index) => (
            <div 
              key={index}
              className="bg-white/90 backdrop-blur-sm rounded-3xl p-8 border border-blue-100 hover:shadow-2xl transition-all duration-500 hover:-translate-y-3 group relative overflow-hidden"
            >
              {/* Background decoration */}
              <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-morpho-blue to-blue-600"></div>
              
              {/* Avatar */}
              <div className="text-center mb-6">
                <div className="w-24 h-24 rounded-full mx-auto mb-4 group-hover:scale-110 transition-transform duration-500 shadow-xl overflow-hidden">
                  {member.photo ? (
                    <Image
                      src={member.photo}
                      alt={member.name}
                      width={96}
                      height={96}
                      className="w-full h-full object-cover rounded-full"
                    />
                  ) : (
                    <div className={`w-full h-full bg-gradient-to-r ${member.color} flex items-center justify-center`}>
                      <span className="text-2xl font-bold text-white">{member.avatar}</span>
                    </div>
                  )}
                </div>
                <h3 className="text-2xl font-bold text-gray-900">{member.name}</h3>
                <p className="text-morpho-blue font-semibold text-lg">{member.role}</p>
              </div>

              {/* Bio */}
              <p className="text-gray-600 text-center mb-6 leading-relaxed">{member.bio}</p>

              {/* Skills */}
              <div className="flex flex-wrap gap-2 justify-center mb-6">
                {member.skills.map((skill, skillIndex) => (
                  <span 
                    key={skillIndex}
                    className="px-3 py-1 bg-morpho-blue/10 text-morpho-dark-blue text-sm rounded-full font-medium border border-morpho-blue/20"
                  >
                    {skill}
                  </span>
                ))}
              </div>

              {/* Social Links */}
              <div className="flex justify-center space-x-4">
                <a 
                  href={member.socials.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 bg-gradient-to-r from-blue-600 to-blue-700 rounded-full flex items-center justify-center text-white hover:scale-110 transition-transform duration-300 hover:shadow-lg"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                  </svg>
                </a>
                
                <a 
                  href={member.socials.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 bg-gradient-to-r from-gray-800 to-gray-900 rounded-full flex items-center justify-center text-white hover:scale-110 transition-transform duration-300 hover:shadow-lg"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                  </svg>
                </a>
                
                {/* Conditional third social - Instagram or Twitter/X */}
                {member.socials.instagram && (
                  <a 
                    href={member.socials.instagram}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 bg-gradient-to-r from-pink-500 to-purple-600 rounded-full flex items-center justify-center text-white hover:scale-110 transition-transform duration-300 hover:shadow-lg"
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                    </svg>
                  </a>
                )}
                
                {member.socials.twitter && (
                  <a 
                    href={member.socials.twitter}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 bg-gradient-to-r from-gray-900 to-black rounded-full flex items-center justify-center text-white hover:scale-110 transition-transform duration-300 hover:shadow-lg"
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                    </svg>
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center mt-12">
          <Link 
            href="/login"
            className="inline-flex items-center space-x-2 bg-gradient-to-r from-morpho-blue to-morpho-dark-blue text-white px-8 py-4 rounded-xl font-semibold text-lg hover:shadow-xl hover:scale-105 transition-all duration-300"
          >
            <span>Join MorphoPymes</span>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5-5 5M6 12h12" />
            </svg>
          </Link>
        </div>
      </div>
    </div>
  );
}
