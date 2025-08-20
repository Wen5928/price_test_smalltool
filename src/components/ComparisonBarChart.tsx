import React from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import { ComparisonData } from '@/utils/math';

interface ComparisonBarChartProps {
  comparisonData: ComparisonData;
}

export default function ComparisonBarChart({ comparisonData }: ComparisonBarChartProps) {
  const { priceA, priceB } = comparisonData;

  const barData = [
    {
      metric: 'Profit',
      'Price A': Math.round(priceA.profit),
      'Price B': Math.round(priceB.profit),
    },
    {
      metric: 'Revenue', 
      'Price A': Math.round(priceA.revenue),
      'Price B': Math.round(priceB.revenue),
    },
    {
      metric: 'Conversion Rate (%)',
      'Price A': Number(priceA.conversionRate.toFixed(1)),
      'Price B': Number(priceB.conversionRate.toFixed(1)),
    },
  ];

  return (
    <div className="w-full h-[300px] mt-6">
      <h3 className="text-lg font-semibold mb-4 text-center">Price A vs Price B Comparison</h3>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          layout="horizontal"
          data={barData}
          margin={{ top: 20, right: 30, left: 80, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis type="number" />
          <YAxis dataKey="metric" type="category" width={80} />
          <Tooltip 
            formatter={(value, name) => [
              typeof value === 'number' ? value.toLocaleString() : value,
              name
            ]}
          />
          <Legend />
          <Bar 
            dataKey="Price A" 
            fill="var(--abc-blue-01)" 
            name={`Price A ($${priceA.price})`}
            radius={[0, 4, 4, 0]}
          />
          <Bar 
            dataKey="Price B" 
            fill="var(--abc-green-02)" 
            name={`Price B ($${priceB.price})`}
            radius={[0, 4, 4, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}