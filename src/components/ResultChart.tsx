

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

interface ResultChartProps {
  data: DataPoint[];
  priceA?: number;
  priceB?: number;
}

export default function ResultChart({ data, priceA, priceB }: ResultChartProps) {
  const minPrice = priceA && priceB ? Math.min(priceA, priceB) : undefined;
  const maxPrice = priceA && priceB ? Math.max(priceA, priceB) : undefined;

  return (
    <div className="w-full h-[400px]">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart 
          data={data}
          margin={{ top: 50, right: 30, left: 20, bottom: 50 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="price" label={{ value: 'Price', position: 'insideBottom', offset: -10 }} />
          <YAxis yAxisId="left" label={{ value: 'Revenue / Profit', angle: -90, position: 'insideLeft', style: { textAnchor: 'middle' }, dx: -10 }} />
          <YAxis yAxisId="right" orientation="right" label={{ value: 'Conversion Rate (%)', angle: -90, position: 'insideRight', style: { textAnchor: 'middle' } }} />
          <Tooltip 
            formatter={(value, name) => [
              typeof value === 'number' ? value.toFixed(2) : value,
              name
            ]}
            labelFormatter={(label) => `Price: $${label}`}
          />
          <Legend verticalAlign="bottom" height={10} />
          
          {/* Price range highlighting */}
          {minPrice && maxPrice && (
            <ReferenceArea 
              x1={minPrice} 
              x2={maxPrice} 
              fill="url(#priceRangeGradient)" 
              fillOpacity={0.3}
            />
          )}
          
          <Line yAxisId="left" type="monotone" dataKey="revenue" stroke="#8884d8" name="Revenue" strokeWidth={2} />
          <Line yAxisId="left" type="monotone" dataKey="profit" stroke="#82ca9d" name="Profit" strokeWidth={2} />
          <Line yAxisId="right" type="monotone" dataKey="conversionRate" stroke="#ff7300" name="Conversion Rate" strokeWidth={2} />
          
          {priceA && (
            <ReferenceLine 
              x={priceA} 
              stroke="#3b82f6" 
              strokeWidth={3} 
              strokeDasharray="5 5" 
              label={{ value: `Price A ($${priceA})`, position: "top", fill: "#3b82f6", fontWeight: "bold" }} 
            />
          )}
          {priceB && (
            <ReferenceLine 
              x={priceB} 
              stroke="#10b981" 
              strokeWidth={3} 
              strokeDasharray="5 5" 
              label={{ value: `Price B ($${priceB})`, position: "top", fill: "#10b981", fontWeight: "bold" }} 
            />
          )}
          
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
  );
}