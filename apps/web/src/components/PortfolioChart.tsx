'use client';

import { useState } from 'react';

interface PortfolioDataPoint {
  date: string;
  value: number;
  change: number;
}

interface PortfolioChartProps {
  data: PortfolioDataPoint[];
  totalValue: number;
  totalGain: number;
  percentageGain: number;
  showTimeframe?: boolean;
}

export default function PortfolioChart({ 
  data, 
  totalValue, 
  totalGain, 
  percentageGain 
  , showTimeframe = true
}: PortfolioChartProps) {
  const [timeframe, setTimeframe] = useState('1M');
  
  const formatCurrency = (amount: number) => {
    const safe = typeof amount === 'number' && !isNaN(amount) ? amount : 0;
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(safe);
  };

  const timeframes = ['24H', '1W', '1M', '3M', '1Y', 'ALL'];
  
  // Different data sets for each timeframe
  const timeframeData = {
    '24H': [
      { date: '00:00', value: 5650000, change: 0 },
      { date: '04:00', value: 5680000, change: 0.53 },
      { date: '08:00', value: 5620000, change: -1.06 },
      { date: '12:00', value: 5700000, change: 1.42 },
      { date: '16:00', value: 5720000, change: 0.35 },
      { date: '20:00', value: 5700000, change: -0.35 },
    ],
    '1W': [
      { date: 'Mon', value: 5500000, change: 0 },
      { date: 'Tue', value: 5580000, change: 1.45 },
      { date: 'Wed', value: 5620000, change: 0.72 },
      { date: 'Thu', value: 5650000, change: 0.53 },
      { date: 'Fri', value: 5700000, change: 0.88 },
      { date: 'Sat', value: 5720000, change: 0.35 },
      { date: 'Sun', value: 5700000, change: -0.35 },
    ],
    '1M': data,
    '3M': [
      { date: 'Jun', value: 4800000, change: 0 },
      { date: 'Jul', value: 5100000, change: 6.25 },
      { date: 'Aug', value: 5700000, change: 11.76 },
    ],
    '1Y': [
      { date: 'Q1', value: 4200000, change: 0 },
      { date: 'Q2', value: 4800000, change: 14.29 },
      { date: 'Q3', value: 5700000, change: 18.75 },
    ],
    'ALL': [
      { date: '2023', value: 3500000, change: 0 },
      { date: '2024', value: 5700000, change: 62.86 },
    ]
  };
  
  const currentData = timeframeData[timeframe as keyof typeof timeframeData];
  
  const maxValue = Math.max(...currentData.map(d => d.value));
  const minValue = Math.min(...currentData.map(d => d.value));
  const valueRange = maxValue - minValue || 1;
  
  const createPath = () => {
    const width = 600;
    const height = 250;
    const padding = 20;
    const denom = Math.max(1, currentData.length - 1);
    
    const points = currentData.map((point, index) => {
      const x = padding + (index / denom) * (width - padding * 2);
      const y = height - padding - ((point.value - minValue) / valueRange) * (height - padding * 2);
      return `${x},${y}`;
    }).join(' L');
    
    return `M${points}`;
  };

  const createGradientPath = () => {
    const width = 600;
    const height = 250;
    const padding = 20;
    const denom = Math.max(1, currentData.length - 1);
    
    const points = currentData.map((point, index) => {
      const x = padding + (index / denom) * (width - padding * 2);
      const y = height - padding - ((point.value - minValue) / valueRange) * (height - padding * 2);
      return `${x},${y}`;
    }).join(' L');
    
    return `M${padding},${height - padding} L${points} L${width - padding},${height - padding} Z`;
  };

  return (
    <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-4 md:p-6 border border-blue-200/50 shadow-lg">
      {/* Header - Mobile responsive */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6 space-y-4 lg:space-y-0">
        <div className="order-2 lg:order-1">
          <h2 className="text-lg md:text-xl font-bold text-gray-900 mb-2">Portfolio Performance</h2>
          <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-4">
            <span className="text-2xl md:text-3xl font-bold text-gray-900">
              {formatCurrency(totalValue)}
            </span>
            <div className={`flex items-center space-x-1 ${totalGain >= 0 ? 'text-blue-600' : 'text-blue-800'}`}>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d={totalGain >= 0 ? "M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" : "M13 17h8m0 0V9m0 8l-8-8-4 4-6-6"} 
                />
              </svg>
              <span className="font-semibold text-sm md:text-base">
                +{formatCurrency(totalGain)} ({percentageGain.toFixed(2)}%)
              </span>
            </div>
          </div>
        </div>
        
        {/* Timeframe Selector - Mobile responsive */}
        {showTimeframe && (
          <div className="order-1 lg:order-2 flex justify-center lg:justify-end">
            <div className="flex bg-gray-100 rounded-lg p-1 w-full sm:w-auto overflow-x-auto">
              {timeframes.map((tf) => (
                <button
                  key={tf}
                  onClick={() => setTimeframe(tf)}
                  className={`px-2 md:px-3 py-1 rounded-md text-xs md:text-sm font-medium transition-colors whitespace-nowrap flex-shrink-0 ${
                    timeframe === tf
                      ? 'bg-blue-600 text-white shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  {tf}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Chart - Mobile responsive */}
      <div className="relative mb-4 w-full overflow-x-auto">
        <svg
          width="100%"
          height="250"
          viewBox="0 0 600 250"
          className="min-w-[400px] md:min-w-0"
        >
          <defs>
            <pattern id="grid" width="60" height="25" patternUnits="userSpaceOnUse">
              <path d="M 60 0 L 0 0 0 25" fill="none" stroke="#f0f0f0" strokeWidth="1"/>
            </pattern>
            <linearGradient id="chartGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.4"/>
              <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.05"/>
            </linearGradient>
          </defs>
          
          <rect width="100%" height="100%" fill="url(#grid)" />
          
          <path
            d={createGradientPath()}
            fill="url(#chartGradient)"
          />
          
          <path
            d={createPath()}
            fill="none"
            stroke="#3b82f6"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          
          {currentData.map((point, index) => {
            const x = 20 + (index / (currentData.length - 1)) * 560;
            const y = 230 - ((point.value - minValue) / valueRange) * 190;
            
            return (
              <circle
                key={index}
                cx={x}
                cy={y}
                r="3"
                fill="#3b82f6"
                stroke="white"
                strokeWidth="2"
                className="hover:r-5 transition-all duration-200 cursor-pointer"
              />
            );
          })}
        </svg>
      </div>

      {/* Chart Stats - Mobile responsive */}
      <div className="grid grid-cols-3 gap-2 md:gap-4 mt-6 pt-6 border-t border-gray-200">
        <div className="text-center">
          <p className="text-xs text-gray-500 mb-1">24h Change</p>
          <p className="text-sm font-bold text-blue-600">+2.45%</p>
        </div>
        <div className="text-center">
          <p className="text-xs text-gray-500 mb-1">7d Change</p>
          <p className="text-sm font-bold text-blue-600">+8.12%</p>
        </div>
        <div className="text-center">
          <p className="text-xs text-gray-500 mb-1">30d Change</p>
          <p className="text-sm font-bold text-blue-600">+15.67%</p>
        </div>
      </div>
    </div>
  );
}