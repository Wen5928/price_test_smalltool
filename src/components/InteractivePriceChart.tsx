'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { ComparisonData, calculateOptimalPrice } from '@/utils/math';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface InteractivePriceChartProps {
  comparisonData: ComparisonData;
  selectedProduct: any;
  shippingFee: number;
  transactionFeePercent: number;
  monthlyTraffic: number;
  onPriceChange?: (newComparison: ComparisonData) => void;
}

export default function InteractivePriceChart({ 
  comparisonData, 
  selectedProduct,
  shippingFee,
  transactionFeePercent,
  monthlyTraffic,
  onPriceChange
}: InteractivePriceChartProps) {
  const [priceA, setPriceA] = useState(comparisonData.priceA.price);
  const [priceB, setPriceB] = useState(comparisonData.priceB.price);
  const [currentComparison, setCurrentComparison] = useState(comparisonData);

  // Calculate price range
  const totalCost = selectedProduct?.costPerItem + shippingFee + (selectedProduct?.price * transactionFeePercent / 100);
  const minPrice = Math.max(totalCost * 1.1, selectedProduct?.price * 0.5) || 1;
  const maxPrice = selectedProduct?.price * 2 || 100;

  const priceAPercent = ((priceA - minPrice) / (maxPrice - minPrice)) * 100;
  const priceBPercent = ((priceB - minPrice) / (maxPrice - minPrice)) * 100;

  const updateComparison = useCallback(() => {
    if (!selectedProduct) return;

    // Recalculate comparison when prices change
    const resultA = calculateOptimalPrice({
      currentPrice: priceA,
      costPerItem: selectedProduct.costPerItem,
      shippingFee: selectedProduct.requiresShipping ? shippingFee : 0,
      transactionFeePercent,
      monthlyTraffic,
      oec: 'profit'
    });

    const resultB = calculateOptimalPrice({
      currentPrice: priceB,
      costPerItem: selectedProduct.costPerItem,
      shippingFee: selectedProduct.requiresShipping ? shippingFee : 0,
      transactionFeePercent,
      monthlyTraffic,
      oec: 'profit'
    });

    // Create new comparison with user-adjusted prices
    const updatedComparison: ComparisonData = {
      priceA: {
        price: priceA,
        conversionRate: resultA.comparison.priceA.conversionRate,
        revenue: resultA.comparison.priceA.revenue,
        profit: resultA.comparison.priceA.profit
      },
      priceB: {
        price: priceB,
        conversionRate: resultB.comparison.priceA.conversionRate,
        revenue: resultB.comparison.priceA.revenue,
        profit: resultB.comparison.priceA.profit
      },
      chartData: resultA.comparison.chartData
    };

    setCurrentComparison(updatedComparison);
    if (onPriceChange) {
      onPriceChange(updatedComparison);
    }
  }, [priceA, priceB, selectedProduct, shippingFee, transactionFeePercent, monthlyTraffic, onPriceChange]);

  useEffect(() => {
    const timeoutId = setTimeout(updateComparison, 100); // Debounce 100ms
    return () => clearTimeout(timeoutId);
  }, [updateComparison]);

  const handlePriceAChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPriceA(parseFloat(e.target.value));
  };

  const handlePriceBChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPriceB(parseFloat(e.target.value));
  };

  const handlePriceAInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value);
    if (!isNaN(value) && value >= minPrice && value <= maxPrice) {
      setPriceA(value);
    }
  };

  const handlePriceBInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value);
    if (!isNaN(value) && value >= minPrice && value <= maxPrice) {
      setPriceB(value);
    }
  };

  const data = [
    {
      name: 'Conversion Rate (%)',
      Original: currentComparison.priceA.conversionRate,
      New: currentComparison.priceB.conversionRate,
    },
    {
      name: 'Revenue ($)',
      Original: currentComparison.priceA.revenue,
      New: currentComparison.priceB.revenue,
    },
    {
      name: 'Profit ($)',
      Original: currentComparison.priceA.profit,
      New: currentComparison.priceB.profit,
    },
  ];

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-gray-800 p-3 rounded-lg border border-gray-600">
          <p className="text-white font-semibold">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} className="text-sm" style={{ color: entry.color }}>
              {entry.name}: {entry.value.toFixed(2)}
              {label.includes('%') ? '%' : label.includes('$') ? '' : ''}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="w-full space-y-6">
      <style jsx>{`
        .slider-green::-webkit-slider-thumb {
          appearance: none;
          height: 20px;
          width: 20px;
          background: #059669;
          cursor: pointer;
          border-radius: 50%;
          border: 2px solid #ffffff;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
        }
        .slider-green::-moz-range-thumb {
          height: 20px;
          width: 20px;
          background: #059669;
          cursor: pointer;
          border-radius: 50%;
          border: 2px solid #ffffff;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
        }
      `}</style>
      {/* Price Display */}
      <div className="flex justify-center gap-8 mb-4">
        <div className="text-center">
          <div className="text-sm text-gray-400">Original Price</div>
          <div className="text-2xl font-bold text-blue-100">
            $<input
              type="number"
              value={priceA.toFixed(2)}
              onChange={handlePriceAInputChange}
              min={minPrice}
              max={maxPrice}
              step="0.01"
              className="bg-transparent border-none outline-none text-center w-20 text-blue-100 font-bold"
            />
          </div>
        </div>
        <div className="text-center">
          <div className="text-sm text-gray-400">New Price</div>
          <div className="text-2xl font-bold text-green-100">
            $<input
              type="number"
              value={priceB.toFixed(2)}
              onChange={handlePriceBInputChange}
              min={minPrice}
              max={maxPrice}
              step="0.01"
              className="bg-transparent border-none outline-none text-center w-20 text-green-100 font-bold"
            />
          </div>
        </div>
      </div>

      {/* Interactive Price Sliders */}
      <div className="p-4 border border-white rounded-lg">
        <h4 className="text-md font-semibold mb-3 text-center text-white">
          🎚️ Interactive Price Adjustment
        </h4>
        
        <div className="relative mb-5">
          {/* Price range bar background */}
          <div className="mx-3">
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
          </div>
        </div>

        {/* Dual sliders */}
        <div className="space-y-5">
          {/* Original Price slider */}
          <div className="flex items-center space-x-3 mx-3">
            <label className="w-24 text-sm font-medium text-white">Original Price:</label>
            <div className="flex-1 relative">
              <input
                type="range"
                min={minPrice}
                max={maxPrice}
                step="0.01"
                value={priceA}
                onChange={handlePriceAChange}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                style={{
                  background: `linear-gradient(to right, #3b82f6 0%, #3b82f6 ${priceAPercent}%, #e5e7eb ${priceAPercent}%, #e5e7eb 100%)`
                }}
              />
            </div>
            <input
              type="number"
              value={priceA.toFixed(2)}
              onChange={handlePriceAInputChange}
              min={minPrice}
              max={maxPrice}
              step="0.01"
              className="w-16 px-2 py-1 text-xs font-semibold text-blue-100 border border-blue-400 rounded text-center bg-gray-800"
            />
          </div>

          {/* New Price slider */}
          <div className="flex items-center space-x-3 mx-3">
            <label className="w-24 text-sm font-medium text-white">New Price:</label>
            <div className="flex-1 relative">
              <input
                type="range"
                min={minPrice}
                max={maxPrice}
                step="0.01"
                value={priceB}
                onChange={handlePriceBChange}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider-green"
                style={{
                  background: `linear-gradient(to right, #059669 0%, #059669 ${priceBPercent}%, #e5e7eb ${priceBPercent}%, #e5e7eb 100%)`
                }}
              />
            </div>
            <input
              type="number"
              value={priceB.toFixed(2)}
              onChange={handlePriceBInputChange}
              min={minPrice}
              max={maxPrice}
              step="0.01"
              className="w-16 px-2 py-1 text-xs font-semibold text-green-100 border border-green-400 rounded text-center bg-gray-800"
            />
          </div>
        </div>

        {/* Range indicators */}
        <div className="flex justify-between mt-3 mx-3 text-xs text-gray-400">
          <span>Min: ${minPrice.toFixed(2)}</span>
          <span>Max: ${maxPrice.toFixed(2)}</span>
        </div>
      </div>

      {/* Chart */}
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#444" />
          <XAxis dataKey="name" stroke="#888" />
          <YAxis 
            stroke="#888" 
            tickFormatter={(value) => {
              if (value < 1) {
                return `${(value * 100).toFixed(1)}%`;
              } else if (value < 100) {
                return `${value.toFixed(1)}%`;
              } else {
                return `$${value.toLocaleString()}`;
              }
            }}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend />
          <Bar dataKey="Original" fill="#3B82F6" />
          <Bar dataKey="New" fill="#10B981" />
        </BarChart>
      </ResponsiveContainer>

      {/* Comparison Stats */}
      <div className="grid grid-cols-3 gap-4">
        <div className="text-center p-4 border border-gray-700 rounded-lg">
          <div className="text-sm text-gray-400">Conversion Change</div>
          <div className={`text-xl font-bold ${currentComparison.priceB.conversionRate > currentComparison.priceA.conversionRate ? 'text-green-400' : 'text-red-400'}`}>
            {currentComparison.priceB.conversionRate > currentComparison.priceA.conversionRate ? '+' : ''}
            {(currentComparison.priceB.conversionRate - currentComparison.priceA.conversionRate).toFixed(2)}%
          </div>
        </div>
        <div className="text-center p-4 border border-gray-700 rounded-lg">
          <div className="text-sm text-gray-400">Revenue Change</div>
          <div className={`text-xl font-bold ${currentComparison.priceB.revenue > currentComparison.priceA.revenue ? 'text-green-400' : 'text-red-400'}`}>
            ${Math.abs(currentComparison.priceB.revenue - currentComparison.priceA.revenue).toFixed(0)}
          </div>
        </div>
        <div className="text-center p-4 border border-gray-700 rounded-lg">
          <div className="text-sm text-gray-400">Profit Change</div>
          <div className={`text-xl font-bold ${currentComparison.priceB.profit > currentComparison.priceA.profit ? 'text-green-400' : 'text-red-400'}`}>
            ${Math.abs(currentComparison.priceB.profit - currentComparison.priceA.profit).toFixed(0)}
          </div>
        </div>
      </div>
    </div>
  );
}