'use client';

import React from 'react';
import { ComparisonData } from '@/utils/math';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface PriceComparisonChartProps {
  comparisonData: ComparisonData;
}

export default function PriceComparisonChart({ comparisonData }: PriceComparisonChartProps) {
  const { priceA, priceB } = comparisonData;

  const data = [
    {
      name: 'Conversion Rate (%)',
      Original: priceA.conversionRate,
      Recommended: priceB.conversionRate,
    },
    {
      name: 'Revenue ($)',
      Original: priceA.revenue,
      Recommended: priceB.revenue,
    },
    {
      name: 'Profit ($)',
      Original: priceA.profit,
      Recommended: priceB.profit,
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
    <div className="w-full space-y-4">
      <div className="flex justify-center gap-6 mb-4">
        <div className="text-center">
          <div className="text-sm text-gray-400">Original Price</div>
          <div className="text-2xl font-bold text-blue-400">${priceA.price}</div>
        </div>
        <div className="text-center">
          <div className="text-sm text-gray-400">Recommended Price</div>
          <div className="text-2xl font-bold text-green-400">${priceB.price}</div>
        </div>
      </div>

      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#444" />
          <XAxis dataKey="name" stroke="#888" />
          <YAxis stroke="#888" />
          <Tooltip content={<CustomTooltip />} />
          <Legend />
          <Bar dataKey="Original" fill="#3B82F6" />
          <Bar dataKey="Recommended" fill="#10B981" />
        </BarChart>
      </ResponsiveContainer>

      <div className="grid grid-cols-3 gap-4 mt-6">
        <div className="text-center p-4 border border-gray-700 rounded-lg">
          <div className="text-sm text-gray-400">Conversion Change</div>
          <div className={`text-xl font-bold ${priceB.conversionRate > priceA.conversionRate ? 'text-green-400' : 'text-red-400'}`}>
            {priceB.conversionRate > priceA.conversionRate ? '+' : ''}
            {(priceB.conversionRate - priceA.conversionRate).toFixed(2)}%
          </div>
        </div>
        <div className="text-center p-4 border border-gray-700 rounded-lg">
          <div className="text-sm text-gray-400">Revenue Change</div>
          <div className={`text-xl font-bold ${priceB.revenue > priceA.revenue ? 'text-green-400' : 'text-red-400'}`}>
            ${Math.abs(priceB.revenue - priceA.revenue).toFixed(0)}
          </div>
        </div>
        <div className="text-center p-4 border border-gray-700 rounded-lg">
          <div className="text-sm text-gray-400">Profit Change</div>
          <div className={`text-xl font-bold ${priceB.profit > priceA.profit ? 'text-green-400' : 'text-red-400'}`}>
            ${Math.abs(priceB.profit - priceA.profit).toFixed(0)}
          </div>
        </div>
      </div>
    </div>
  );
}