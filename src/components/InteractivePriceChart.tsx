'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { ComparisonData, calculateOptimalPrice } from '@/utils/math';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface ComparisonPoint {
  price: number;
  conversionRate: number;
  revenue: number;
  profit: number;
}

interface InteractivePriceChartProps {
  comparisonData: ComparisonData;
  selectedProduct: any;
  shippingFee: number;
  transactionFeePercent: number;
  monthlyTraffic: number;
  targetOec?: 'revenue' | 'profit' | 'conversion';
  onPriceChange?: (newComparison: ComparisonData) => void;
  onOecChange?: (oec: 'revenue' | 'profit' | 'conversion') => void;
  onOptimalPriceChange?: (optimalData: ComparisonPoint | null) => void;
}

export default function InteractivePriceChart({ 
  comparisonData, 
  selectedProduct,
  shippingFee,
  transactionFeePercent,
  monthlyTraffic,
  targetOec: propTargetOec,
  onPriceChange,
  onOecChange,
  onOptimalPriceChange
}: InteractivePriceChartProps) {
  const [priceA, setPriceA] = useState(comparisonData.priceA.price);
  const [priceB, setPriceB] = useState(comparisonData.priceB.price);
  const [currentComparison, setCurrentComparison] = useState(comparisonData);
  const [targetOec, setTargetOec] = useState<'revenue' | 'profit' | 'conversion'>(propTargetOec || 'profit');
  const [baseConversionRate, setBaseConversionRate] = useState(50); // Default base conversion rate %
  const [targetConversionRate, setTargetConversionRate] = useState<number>(60); // Target conversion rate for optimization
  const [optimalPrice, setOptimalPrice] = useState<number | null>(null);

  // Update prices when product changes
  useEffect(() => {
    setPriceA(comparisonData.priceA.price);
    // Ensure priceB doesn't exceed reasonable bounds
    const newPriceB = Math.min(comparisonData.priceB.price, comparisonData.priceA.price * 1.5);
    setPriceB(newPriceB);
    setCurrentComparison(comparisonData);
  }, [comparisonData.priceA.price, comparisonData.priceB.price]);

  // Calculate price range
  const totalCost = selectedProduct?.costPerItem + shippingFee + (selectedProduct?.price * transactionFeePercent / 100);
  const minPrice = Math.max(totalCost * 1.1, selectedProduct?.price * 0.5) || 1;
  const baseMaxPrice = selectedProduct?.price * 2 || 100;
  const maxPrice = optimalPrice ? Math.max(baseMaxPrice, optimalPrice * 1.5) : baseMaxPrice;
  
  // Ensure priceB stays within reasonable bounds when optimal price changes
  useEffect(() => {
    if (priceB > maxPrice) {
      setPriceB(maxPrice);
    } else if (priceB < minPrice) {
      setPriceB(minPrice);
    }
  }, [maxPrice, minPrice, priceB]);

  const priceAPercent = ((priceA - minPrice) / (maxPrice - minPrice)) * 100;
  const priceBPercent = ((priceB - minPrice) / (maxPrice - minPrice)) * 100;
  const optimalPricePercent = optimalPrice ? ((optimalPrice - minPrice) / (maxPrice - minPrice)) * 100 : null;

  const calculateOptimalPriceForOec = useCallback(() => {
    if (!selectedProduct) return null;

    try {
      const result = calculateOptimalPrice({
        currentPrice: selectedProduct.price,
        costPerItem: selectedProduct.costPerItem,
        shippingFee: selectedProduct.requiresShipping ? shippingFee : 0,
        transactionFeePercent,
        monthlyTraffic,
        oec: targetOec,
        targetConversionRate: targetOec === 'conversion' ? targetConversionRate : undefined
      });

      return result.optimalPrice;
    } catch (error) {
      console.error('Error calculating optimal price:', error);
      return null;
    }
  }, [selectedProduct, shippingFee, transactionFeePercent, monthlyTraffic, targetOec, targetConversionRate]);

  const updateComparison = useCallback(() => {
    if (!selectedProduct) return;

    // Calculate optimal price
    const optimal = calculateOptimalPriceForOec();
    console.log('Updating optimal price:', optimal, 'targetOec:', targetOec, 'targetConversionRate:', targetConversionRate);
    setOptimalPrice(optimal);

    // Calculate total cost for conversion rate calculations
    const totalCostA = selectedProduct.costPerItem + (selectedProduct.requiresShipping ? shippingFee : 0) + (priceA * transactionFeePercent / 100);
    const totalCostB = selectedProduct.costPerItem + (selectedProduct.requiresShipping ? shippingFee : 0) + (priceB * transactionFeePercent / 100);

    // Calculate conversion rates using base conversion rate and price elasticity
    const basePrice = selectedProduct.price || priceA;
    const baseCR = baseConversionRate / 100; // Convert percentage to decimal
    
    // Calculate relative price changes and apply elasticity
    const priceChangeA = (priceA - basePrice) / basePrice;
    const elasticity = -1.5; // Price elasticity coefficient
    const convRateA = Math.max(0.01, baseCR * (1 + elasticity * priceChangeA));
    
    let convRateB: number;
    let actualPriceB = priceB;
    
    if (targetOec === 'conversion' && targetConversionRate > 0) {
      // In conversion mode, use target conversion rate and reverse-calculate price
      convRateB = targetConversionRate / 100;
      // Reverse calculate price from target conversion rate
      // convRate = baseCR * (1 + elasticity * priceChange)
      // priceChange = (convRate / baseCR - 1) / elasticity
      const targetPriceChange = (convRateB / baseCR - 1) / elasticity;
      actualPriceB = basePrice * (1 + targetPriceChange);
      actualPriceB = Math.max(minPrice, Math.min(maxPrice, actualPriceB)); // Clamp to valid range
      
      // Update priceB state if it's different
      if (Math.abs(actualPriceB - priceB) > 0.01) {
        setPriceB(Math.round(actualPriceB * 100) / 100);
      }
    } else {
      // Normal mode: calculate conversion rate from price
      const priceChangeB = (priceB - basePrice) / basePrice;
      convRateB = Math.max(0.01, baseCR * (1 + elasticity * priceChangeB));
    }

    // Calculate conversions, revenue, and profit
    const conversionsA = monthlyTraffic * convRateA;
    const conversionsB = monthlyTraffic * convRateB;

    const revenueA = conversionsA * priceA;
    const revenueB = conversionsB * actualPriceB;

    const totalCostBActual = selectedProduct.costPerItem + (selectedProduct.requiresShipping ? shippingFee : 0) + (actualPriceB * transactionFeePercent / 100);
    const profitA = conversionsA * (priceA - totalCostA);
    const profitB = conversionsB * (actualPriceB - totalCostBActual);

    // Create new comparison with user-adjusted prices
    const updatedComparison: ComparisonData = {
      priceA: {
        price: priceA,
        conversionRate: convRateA * 100, // Convert to percentage for display
        revenue: revenueA,
        profit: profitA
      },
      priceB: {
        price: actualPriceB,
        conversionRate: convRateB * 100, // Convert to percentage for display
        revenue: revenueB,
        profit: profitB
      },
      chartData: [] // We can keep empty or generate if needed
    };

    setCurrentComparison(updatedComparison);
    if (onPriceChange) {
      onPriceChange(updatedComparison);
    }
    if (onOptimalPriceChange) {
      const optimalData = getOptimalMetrics();
      onOptimalPriceChange(optimalData);
    }
  }, [priceA, priceB, selectedProduct, shippingFee, transactionFeePercent, monthlyTraffic, targetOec, baseConversionRate, targetConversionRate, onPriceChange, onOptimalPriceChange, calculateOptimalPriceForOec]);

  useEffect(() => {
    const timeoutId = setTimeout(updateComparison, 100); // Debounce 100ms
    return () => clearTimeout(timeoutId);
  }, [updateComparison]);

  const handlePriceBChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value);
    // Round to 2 decimal places
    setPriceB(Math.round(value * 100) / 100);
  };

  const handlePriceBInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value);
    if (!isNaN(value) && value >= minPrice && value <= maxPrice) {
      // Round to 2 decimal places
      setPriceB(Math.round(value * 100) / 100);
    }
  };

  // Calculate optimal price metrics for comparison
  const getOptimalMetrics = (): ComparisonPoint | null => {
    if (!optimalPrice || !selectedProduct) return null;

    const basePrice = selectedProduct.price || priceA;
    const totalCostOptimal = selectedProduct.costPerItem + (selectedProduct.requiresShipping ? shippingFee : 0) + (optimalPrice * transactionFeePercent / 100);
    
    let convRateOptimal: number;
    
    if (targetOec === 'conversion' && targetConversionRate > 0) {
      // For conversion optimization, use the target conversion rate directly
      convRateOptimal = targetConversionRate / 100;
      console.log('Using target conversion rate:', targetConversionRate, '% for optimal metrics');
    } else {
      // For other optimization modes, calculate using price elasticity
      const baseCR = baseConversionRate / 100;
      const priceChangeOptimal = (optimalPrice - basePrice) / basePrice;
      const elasticity = -1.5;
      convRateOptimal = Math.max(0.01, baseCR * (1 + elasticity * priceChangeOptimal));
      console.log('Using calculated conversion rate:', convRateOptimal * 100, '% for optimal metrics');
    }
    
    const conversionsOptimal = monthlyTraffic * convRateOptimal;
    const revenueOptimal = conversionsOptimal * optimalPrice;
    const profitOptimal = conversionsOptimal * (optimalPrice - totalCostOptimal);

    const result = {
      price: optimalPrice,
      conversionRate: convRateOptimal * 100,
      revenue: revenueOptimal,
      profit: profitOptimal
    };
    
    console.log('getOptimalMetrics result:', result);
    return result;
  };

  const optimalMetrics = getOptimalMetrics();

  const data = [
    {
      name: 'Conversion Rate (%)',
      A: currentComparison.priceA.conversionRate,
      B: currentComparison.priceB.conversionRate,
      Optimal: optimalMetrics ? optimalMetrics.conversionRate : 0
    },
    {
      name: 'Profit ($)',
      A: currentComparison.priceA.profit,
      B: currentComparison.priceB.profit,
      Optimal: optimalMetrics ? optimalMetrics.profit : 0
    },
    {
      name: 'Revenue ($)',
      A: currentComparison.priceA.revenue,
      B: currentComparison.priceB.revenue,
      Optimal: optimalMetrics ? optimalMetrics.revenue : 0
    },
  ];

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const getDisplayName = (name: string) => {
        switch (name) {
          case 'A': return 'Original';
          case 'B': return 'New';
          case 'Optimal': return 'Optimal';
          default: return name;
        }
      };

      return (
        <div className="bg-gray-800 p-3 rounded-lg border border-gray-600">
          <p className="text-white font-semibold">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} className="text-sm" style={{ color: entry.color }}>
              {getDisplayName(entry.name)}: {entry.value.toFixed(2)}
              {label.includes('%') ? '%' : label.includes('$') ? '' : ''}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="w-full space-y-4">
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
      
      {/* First Row: Product Info + Optimization Focus + Base Conversion Rate */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-3 border border-gray-600 rounded-lg bg-gray-800/30">
        {/* Selected Product Info */}
        <div className="flex justify-center">
          <div className="text-center">
            <div className="text-sm text-gray-400 mb-1">Selected Product</div>
            <div className="text-sm font-medium text-white truncate" title={selectedProduct?.title || selectedProduct?.name}>
              {selectedProduct?.title || selectedProduct?.name || 'Product'}
            </div>
            <div className="text-xs text-gray-400 mt-2 space-y-1">
              <div>Cost: ${selectedProduct?.costPerItem || 0}</div>
              <div>Shipping: ${selectedProduct?.requiresShipping ? shippingFee : 0}</div>
              <div>Transaction Fee: ${((priceB * transactionFeePercent) / 100).toFixed(2)}</div>
              <div className="font-medium text-white">
                Total Cost: ${((selectedProduct?.costPerItem || 0) + (selectedProduct?.requiresShipping ? shippingFee : 0) + ((priceB * transactionFeePercent) / 100)).toFixed(2)}
              </div>
            </div>
          </div>
        </div>

        {/* OEC Selector */}
        <div className="flex justify-center">
          <div>
            <div className="text-base text-green-400 mb-2 text-center font-medium">Optimization Focus</div>
            <div className="flex gap-1 justify-center">
              {[
                { value: 'profit', label: '💰 Profit' },
                { value: 'revenue', label: '💵 Revenue' },
                { value: 'conversion', label: '📈 Conv' }
              ].map((option) => (
                <button
                  key={option.value}
                  onClick={() => {
                    setTargetOec(option.value as any);
                    if (onOecChange) {
                      onOecChange(option.value as any);
                    }
                  }}
                  className={`px-3 py-2 rounded border text-sm font-medium transition-colors ${
                    targetOec === option.value
                      ? 'border-white text-white bg-white/10'
                      : 'border-gray-400 text-gray-400 hover:border-white hover:text-white'
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Base Conversion Rate / Target Conversion Rate Setting */}
        <div className="flex justify-center">
          <div>
            {targetOec === 'conversion' ? (
              <div className="space-y-3">
                <div>
                  <div className="text-base text-blue-400 mb-2 text-center font-medium">Base Conversion Rate</div>
                  <div className="flex items-center justify-center gap-2">
                    <input
                      type="number"
                      value={baseConversionRate}
                      onChange={(e) => setBaseConversionRate(parseFloat(e.target.value) || 0)}
                      min="0"
                      max="100"
                      step="0.1"
                      className="w-16 px-2 py-1 text-xs font-semibold text-white border border-gray-500 rounded text-center bg-transparent"
                    />
                    <span className="text-xs text-white">%</span>
                  </div>
                </div>
                <div>
                  <div className="text-base text-orange-400 mb-2 text-center font-medium">Target Conversion Rate</div>
                  <div className="flex items-center justify-center gap-2">
                    <input
                      type="number"
                      value={targetConversionRate}
                      onChange={(e) => setTargetConversionRate(parseFloat(e.target.value) || 0)}
                      min="0"
                      max="100"
                      step="0.1"
                      className="w-16 px-2 py-1 text-xs font-semibold text-white border border-gray-500 rounded text-center bg-transparent"
                    />
                    <span className="text-xs text-white">%</span>
                  </div>
                </div>
              </div>
            ) : (
              <>
                <div className="text-base text-blue-400 mb-2 text-center font-medium">Base Conversion Rate</div>
                <div className="flex items-center justify-center gap-2">
                  <input
                    type="number"
                    value={baseConversionRate}
                    onChange={(e) => setBaseConversionRate(parseFloat(e.target.value) || 0)}
                    min="0"
                    max="100"
                    step="0.1"
                    className="w-16 px-2 py-1 text-xs font-semibold text-white border border-gray-500 rounded text-center bg-transparent"
                  />
                  <span className="text-xs text-white">%</span>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Second Row: Three Prices */}
      <div className="flex justify-center gap-6 p-3 border border-gray-600 rounded-lg bg-gray-800/30">
        <div className="text-center">
          <div className="text-sm text-gray-400">Original Price</div>
          <div className="text-xl font-bold text-blue-400">
            ${priceA.toFixed(2)}
          </div>
        </div>
        <div className="text-center">
          <div className="text-sm text-gray-400">New Price</div>
          <div className="text-xl font-bold text-green-400">
            ${priceB.toFixed(2)}
          </div>
        </div>
        {optimalPrice && (
          <div className="text-center">
            <div className="text-sm text-gray-400">Optimal Price</div>
            <div className="text-xl font-bold text-red-400">
              ${optimalPrice.toFixed(2)}
            </div>
          </div>
        )}
      </div>

      {/* Interactive Price Sliders */}
      <div className="p-4 border border-white rounded-lg">
        <h4 className="text-md font-semibold mb-3 text-center text-white">
          🎚️ Price Optimization Tool
        </h4>
        
        <div className="relative mb-5">
          {/* Price range bar background */}
          <div className="mx-3">
            <div className="w-full h-2 bg-gray-700 rounded-full relative overflow-hidden">
              {/* Original price marker */}
              <div 
                className="absolute top-0 h-full w-2 bg-blue-500 z-20"
                style={{ left: `${priceAPercent}%`, marginLeft: '-1px' }}
              />
              {/* Price comparison range */}
              <div 
                className="absolute top-0 h-full bg-gradient-to-r from-blue-300 to-green-300 opacity-50"
                style={{
                  left: `${Math.min(priceAPercent, priceBPercent)}%`,
                  width: `${Math.abs(priceBPercent - priceAPercent)}%`
                }}
              />
              {/* New price marker */}
              <div 
                className="absolute top-0 h-full w-2 bg-green-500 z-20"
                style={{ left: `${priceBPercent}%`, marginLeft: '-1px' }}
              />
              {/* Optimal price marker */}
              {optimalPricePercent !== null && (
                <div 
                  className="absolute top-0 h-full w-2 bg-red-500 z-30"
                  style={{ left: `${optimalPricePercent}%`, marginLeft: '-1px' }}
                />
              )}
            </div>
          </div>
        </div>

        {/* Dual sliders */}
        <div className="space-y-5">
          {/* Original Price display */}
          <div className="flex items-center space-x-3 mx-3">
            <label className="w-24 text-sm font-medium text-white">
              Original Price:
              <div className="text-xs text-gray-400 mt-1">Fixed</div>
            </label>
            <div className="flex-1 flex items-center">
              <div className="w-full h-2 bg-gray-700 rounded-full relative">
                <div 
                  className="absolute top-0 left-0 h-full bg-blue-500 rounded-full"
                  style={{ width: `${priceAPercent}%` }}
                />
                <div 
                  className="absolute top-1/2 -translate-y-1/2 w-4 h-4 bg-blue-500 rounded-full border-2 border-white shadow-sm"
                  style={{ left: `calc(${priceAPercent}% - 8px)` }}
                />
              </div>
            </div>
            <div className="w-16 px-2 py-1 text-xs font-semibold text-blue-100 border border-blue-400 rounded text-center bg-gray-800">
              $ {priceA.toFixed(2)}
            </div>
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
            <div className="w-20 px-2 py-1 text-xs font-semibold text-green-100 border border-green-400 rounded bg-gray-800 flex items-center">
              <span className="text-green-100">$</span>
              <input
                type="number"
                value={priceB.toFixed(2)}
                onChange={handlePriceBInputChange}
                min={minPrice}
                max={maxPrice}
                step="0.01"
                className="bg-transparent border-none outline-none text-center flex-1 text-green-100 font-semibold w-full"
                style={{ minWidth: '40px' }}
              />
            </div>
          </div>
        </div>

        {/* Range indicators */}
        <div className="flex justify-between mt-3 mx-3 text-xs text-gray-400">
          <span>Min: ${minPrice.toFixed(2)}</span>
          {optimalPrice && (
            <span className="text-red-400 font-medium">
              Optimal: ${optimalPrice.toFixed(2)} ({targetOec})
            </span>
          )}
          <span>Max: ${maxPrice.toFixed(2)}</span>
        </div>
      </div>

      {/* Charts Side by Side */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Conversion Rate Chart */}
        <div>
          <h5 className="text-lg font-semibold mb-3 text-white text-center">Conversion Rate Comparison</h5>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={[data[0]]} margin={{ top: 20, right: 20, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#444" />
              <XAxis dataKey="name" stroke="#888" />
              <YAxis 
                stroke="#888" 
                tickFormatter={(value) => `${value.toFixed(2)}%`}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend 
                formatter={(value) => {
                  switch (value) {
                    case 'A': return 'Original';
                    case 'B': return 'New';
                    case 'Optimal': return 'Optimal';
                    default: return value;
                  }
                }}
              />
              <Bar dataKey="A" fill="#3B82F6" />
              <Bar dataKey="B" fill="#10B981" />
              <Bar dataKey="Optimal" fill="#EF4444" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Profit & Revenue Chart */}
        <div>
          <h5 className="text-lg font-semibold mb-3 text-white text-center">Profit & Revenue Comparison</h5>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={data.slice(1)} margin={{ top: 20, right: 20, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#444" />
              <XAxis dataKey="name" stroke="#888" />
              <YAxis 
                stroke="#888" 
                tickFormatter={(value) => {
                  if (value >= 1000) {
                    return `$${(value / 1000).toFixed(1)}k`;
                  } else {
                    return `$${value.toFixed(0)}`;
                  }
                }}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend 
                formatter={(value) => {
                  switch (value) {
                    case 'A': return 'Original';
                    case 'B': return 'New';
                    case 'Optimal': return 'Optimal';
                    default: return value;
                  }
                }}
              />
              <Bar dataKey="A" fill="#3B82F6" />
              <Bar dataKey="B" fill="#10B981" />
              <Bar dataKey="Optimal" fill="#EF4444" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Comparison Stats */}
      <div className={`grid ${optimalMetrics ? 'grid-cols-4' : 'grid-cols-3'} gap-4`}>
        <div className="text-center p-4 border border-gray-700 rounded-lg">
          <div className="text-sm text-gray-400">Conversion Change</div>
          <div className={`text-xl font-bold ${currentComparison.priceB.conversionRate > currentComparison.priceA.conversionRate ? 'text-green-400' : 'text-red-400'}`}>
            {currentComparison.priceB.conversionRate > currentComparison.priceA.conversionRate ? '+' : ''}
            {(currentComparison.priceB.conversionRate - currentComparison.priceA.conversionRate).toFixed(2)}%
          </div>
        </div>

        <div className="text-center p-4 border border-gray-700 rounded-lg">
          <div className="text-sm text-gray-400">Profit Change</div>
          <div className={`text-xl font-bold ${currentComparison.priceB.profit > currentComparison.priceA.profit ? 'text-green-400' : 'text-red-400'}`}>
            {currentComparison.priceB.profit > currentComparison.priceA.profit ? '+' : ''}${(currentComparison.priceB.profit - currentComparison.priceA.profit).toFixed(0)}
          </div>
        </div>
        
        <div className="text-center p-4 border border-gray-700 rounded-lg">
          <div className="text-sm text-gray-400">Revenue Change</div>
          <div className={`text-xl font-bold ${currentComparison.priceB.revenue > currentComparison.priceA.revenue ? 'text-green-400' : 'text-red-400'}`}>
            {currentComparison.priceB.revenue > currentComparison.priceA.revenue ? '+' : ''}${(currentComparison.priceB.revenue - currentComparison.priceA.revenue).toFixed(0)}
          </div>
        </div>

        {/* Optimal Price Comparison */}
        {optimalMetrics && (
          <div className="text-center p-4 border border-red-700 rounded-lg">
            <div className="text-sm text-gray-400">Optimal vs Current</div>
            <div className={`text-xl font-bold ${
              targetOec === 'profit' ? 
                (optimalMetrics.profit > currentComparison.priceA.profit ? 'text-green-400' : 'text-red-400') :
              targetOec === 'revenue' ? 
                (optimalMetrics.revenue > currentComparison.priceA.revenue ? 'text-green-400' : 'text-red-400') :
                (optimalMetrics.conversionRate > currentComparison.priceA.conversionRate ? 'text-green-400' : 'text-red-400')
            }`}>
              {targetOec === 'profit' ? 
                `${optimalMetrics.profit > currentComparison.priceA.profit ? '+' : ''}$${(optimalMetrics.profit - currentComparison.priceA.profit).toFixed(0)}` :
               targetOec === 'revenue' ? 
                `${optimalMetrics.revenue > currentComparison.priceA.revenue ? '+' : ''}$${(optimalMetrics.revenue - currentComparison.priceA.revenue).toFixed(0)}` :
                `${optimalMetrics.conversionRate > currentComparison.priceA.conversionRate ? '+' : ''}${(optimalMetrics.conversionRate - currentComparison.priceA.conversionRate).toFixed(2)}%`}
            </div>
            <div className="text-xs text-gray-500 mt-1">
              {targetOec === 'profit' ? 'Profit Change' :
               targetOec === 'revenue' ? 'Revenue Change' :
               'Conversion Change'}
            </div>
          </div>
        )}
        
      </div>
    </div>
  );
}