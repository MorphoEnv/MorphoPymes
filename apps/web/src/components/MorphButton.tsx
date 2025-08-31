'use client';

import React, { useState } from 'react';
import Image from 'next/image';

interface MorphButtonProps {
  onClick: () => void;
  isOpen: boolean;
}

export default function MorphButton({ onClick, isOpen }: MorphButtonProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [imageError, setImageError] = useState(false);

  return (
    <>
      {/* Floating Button */}
      <button
        onClick={onClick}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className={`fixed bottom-6 right-6 z-40 w-16 h-16 rounded-full shadow-2xl transition-all duration-300 transform ${
          isOpen 
            ? 'scale-0 opacity-0' 
            : 'scale-100 opacity-100 hover:scale-110'
        } bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800`}
      >
        {/* Logo de Morph */}
        <div className="w-full h-full flex items-center justify-center overflow-hidden rounded-full">
          {!imageError ? (
            <Image
              src="/Morphy.png"
              alt="Morph"
              width={48}
              height={48}
              className="w-12 h-12 rounded-full object-cover"
              onError={() => setImageError(true)}
              priority
            />
          ) : (
            /* Fallback temporal usando mariposa.png */
            <Image
              src="/mariposa.png"
              alt="Morph"
              width={48}
              height={48}
              className="w-12 h-12 rounded-full object-cover"
              onError={() => {
                // Si tampoco carga mariposa, usar M
              }}
            />
          )}
        </div>
        
        {/* Pulse effect */}
        <div className="absolute inset-0 rounded-full bg-blue-400 opacity-20 animate-ping"></div>
      </button>

      {/* Tooltip */}
      {isHovered && !isOpen && (
        <div className="fixed bottom-24 right-6 z-40 bg-gray-900 text-white px-4 py-2 rounded-lg text-sm font-medium shadow-lg pointer-events-none">
          ¡Pregúntale a Morph!
          <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-gray-900"></div>
        </div>
      )}
    </>
  );
}
