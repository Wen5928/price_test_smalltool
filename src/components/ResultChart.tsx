

'use client';

import React from 'react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ReferenceLine, ReferenceArea
} from 'recharts';

interface DataPoint {
  price: number;
  revenue: number;
  profit: number;
  conversionRate: number;
}

interface OptimalPrice {
  price: number;
  conversionRate: number;
  revenue: number;
  profit: number;
  metric: string;
  value: number;
}

interface ResultChartProps {
  data: DataPoint[];
  priceA: number;
  priceB: number;
  setPriceA: (value: number) => void;
  setPriceB: (value: number) => void;
  minPrice: number;
  maxPrice: number;
}

export default function ResultChart({ 
  data, 
  priceA, 
  priceB, 
  setPriceA, 
  setPriceB, 
  minPrice, 
  maxPrice
}: ResultChartProps) {
  const priceRange = { min: Math.min(priceA, priceB), max: Math.max(priceA, priceB) };

  // Price slider component
  const renderPriceSlider = () => {
    const range = maxPrice - minPrice;
    const priceAPercent = ((priceA - minPrice) / range) * 100;
    const priceBPercent = ((priceB - minPrice) / range) * 100;

    const handlePriceAChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setPriceA(parseFloat(e.target.value));
    };

    const handlePriceBChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setPriceB(parseFloat(e.target.value));
    };

    return (
      <div className="mt-4 p-4 bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg border border-gray-200">
        <h4 className="text-md font-semibold mb-3 text-center text-gray-800">
          🎚️ Interactive Price Adjustment
        </h4>
        
        <div className="relative mb-6 px-3">
          {/* Price range bar background */}
          <div className="w-full h-2 bg-gray-200 rounded-full relative overflow-hidden">
            {/* Range between A and B */}
            <div 
              className="absolute top-0 h-full bg-gradient-to-r from-blue-300 to-green-300 opacity-50"
              style={{
                left: `${Math.min(priceAPercent, priceBPercent)}%`,
                width: `${Math.abs(priceBPercent - priceAPercent)}%`
              }}
            />
          </div>

          {/* Price markers */}
          <div className="relative mt-3 h-12">
            {/* Price A marker */}
            <div 
              className="absolute transform -translate-x-1/2"
              style={{ left: `${priceAPercent}%` }}
            >
              <div className="w-3 h-3 bg-blue-500 rounded-full border-2 border-white shadow-lg"></div>
              <div className="text-xs font-semibold text-blue-600 mt-1 text-center whitespace-nowrap">
                A: ${priceA}
              </div>
            </div>

            {/* Price B marker - ensure it's green */}
            <div 
              className="absolute transform -translate-x-1/2"
              style={{ left: `${priceBPercent}%` }}
            >
              <div className="w-3 h-3 bg-green-500 rounded-full border-2 border-white shadow-lg"></div>
              <div className="text-xs font-semibold text-green-600 mt-1 text-center whitespace-nowrap">
                B: ${priceB}
              </div>
            </div>

          </div>
        </div>

        {/* Dual sliders with consistent boundaries */}
        <div className="space-y-5 px-3">
          {/* Price A slider */}
          <div className="flex items-center space-x-3">
            <label className="w-16 text-sm font-medium text-blue-700">Price A:</label>
            <div className="flex-1 relative px-0">
              <input
                type="range"
                min={minPrice}
                max={maxPrice}
                step="1"
                value={priceA}
                onChange={handlePriceAChange}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer price-a-slider"
                style={{
                  background: `linear-gradient(to right, #3b82f6 0%, #3b82f6 ${priceAPercent}%, #e5e7eb ${priceAPercent}%, #e5e7eb 100%)`
                }}
              />
            </div>
            <div className="w-14 px-2 py-1 text-xs font-semibold text-blue-700 bg-blue-50 rounded border text-center">
              ${priceA}
            </div>
          </div>

          {/* Price B slider */}
          <div className="flex items-center space-x-3">
            <label className="w-16 text-sm font-medium text-green-700">Price B:</label>
            <div className="flex-1 relative px-0">
              <input
                type="range"
                min={minPrice}
                max={maxPrice}
                step="1"
                value={priceB}
                onChange={handlePriceBChange}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer price-b-slider"
                style={{
                  background: `linear-gradient(to right, #10b981 0%, #10b981 ${priceBPercent}%, #e5e7eb ${priceBPercent}%, #e5e7eb 100%)`
                }}
              />
            </div>
            <div className="w-14 px-2 py-1 text-xs font-semibold text-green-700 bg-green-50 rounded border text-center">
              ${priceB}
            </div>
          </div>
        </div>

        {/* Range indicators */}
        <div className="flex justify-between mt-3 px-3 text-xs text-gray-500">
          <span>Min: ${minPrice}</span>
          <span>Max: ${maxPrice}</span>
        </div>
      </div>
    );
  };

  return (
    <div className="w-full">
      <div className="w-full h-[400px]">
        <ResponsiveContainer width="100%" height="100%">
        <LineChart 
          data={data}
          margin={{ top: 50, right: 30, left: 20, bottom: 80 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="price" label={{ value: 'Price', position: 'insideBottom', offset: -5 }} />
          <YAxis label={{ value: 'Conversion Rate (%)', angle: -90, position: 'insideLeft', style: { textAnchor: 'middle' } }} />
          <Tooltip 
            formatter={(value, name) => [
              typeof value === 'number' ? value.toFixed(2) : value,
              name
            ]}
            labelFormatter={(label) => `Price: $${label}`}
          />
          
          {/* Price range highlighting */}
          {priceRange && (
            <ReferenceArea 
              x1={priceRange.min} 
              x2={priceRange.max} 
              fill="url(#priceRangeGradient)" 
              fillOpacity={0.3}
            />
          )}
          
          <Line type="monotone" dataKey="conversionRate" stroke="#8b5cf6" name="Conversion Rate" strokeWidth={3} dot={{ fill: '#8b5cf6', r: 3 }} />
          
          <ReferenceLine 
            x={priceA} 
            stroke="#3b82f6" 
            strokeWidth={3} 
            strokeDasharray="5 5" 
          />
          <ReferenceLine 
            x={priceB} 
            stroke="#10b981" 
            strokeWidth={3} 
            strokeDasharray="5 5" 
          />
          
          {/* Gradient definition */}
          <defs>
            <linearGradient id="priceRangeGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#3b82f6" stopOpacity={0.2} />
              <stop offset="50%" stopColor="#8b5cf6" stopOpacity={0.1} />
              <stop offset="100%" stopColor="#10b981" stopOpacity={0.2} />
            </linearGradient>
          </defs>
        </LineChart>
      </ResponsiveContainer>
      </div>
      
      {/* Integrated Price Slider */}
      {renderPriceSlider()}
      
      {/* Custom slider styles */}
      <style jsx global>{`
        .price-a-slider::-webkit-slider-thumb {
          -webkit-appearance: none;
          appearance: none;
          height: 20px;
          width: 20px;
          background: #3b82f6 !important;
          border-radius: 50%;
          cursor: pointer;
          box-shadow: 0 2px 4px rgba(0,0,0,0.2);
          border: 2px solid white;
        }
        
        .price-b-slider::-webkit-slider-thumb {
          -webkit-appearance: none;
          appearance: none;
          height: 20px;
          width: 20px;
          background: #10b981 !important;
          border-radius: 50%;
          cursor: pointer;
          box-shadow: 0 2px 4px rgba(0,0,0,0.2);
          border: 2px solid white;
        }
        
        .price-a-slider::-moz-range-thumb {
          height: 20px;
          width: 20px;
          background: #3b82f6 !important;
          border-radius: 50%;
          cursor: pointer;
          border: 2px solid white;
          box-shadow: 0 2px 4px rgba(0,0,0,0.2);
        }
        
        .price-b-slider::-moz-range-thumb {
          height: 20px;
          width: 20px;
          background: #10b981 !important;
          border-radius: 50%;
          cursor: pointer;
          border: 2px solid white;
          box-shadow: 0 2px 4px rgba(0,0,0,0.2);
        }

        /* For Edge/IE */
        .price-a-slider::-ms-thumb {
          height: 20px;
          width: 20px;
          background: #3b82f6 !important;
          border-radius: 50%;
          cursor: pointer;
          border: 2px solid white;
          box-shadow: 0 2px 4px rgba(0,0,0,0.2);
        }
        
        .price-b-slider::-ms-thumb {
          height: 20px;
          width: 20px;
          background: #10b981 !important;
          border-radius: 50%;
          cursor: pointer;
          border: 2px solid white;
          box-shadow: 0 2px 4px rgba(0,0,0,0.2);
        }

        /* Ensure track styling */
        .price-a-slider::-webkit-slider-track,
        .price-b-slider::-webkit-slider-track {
          height: 8px;
          border-radius: 4px;
        }
        
        .price-a-slider::-moz-range-track,
        .price-b-slider::-moz-range-track {
          height: 8px;
          border-radius: 4px;
        }
      `}</style>
    </div>
  );
}