import React from 'react';

interface ComparisonPoint {
  price: number;
  conversionRate: number;
  revenue: number;
  profit: number;
}

interface ComparisonTableProps {
  priceA: ComparisonPoint;
  priceB: ComparisonPoint;
}

export default function ComparisonTable({ priceA, priceB }: ComparisonTableProps) {
  return (
    <div className="h-full flex flex-col overflow-x-auto">
      <h3 className="text-lg font-semibold mb-4 text-center">📊 Original Price vs New Price Comparison</h3>
      
      <table className="w-full bg-white rounded-lg shadow-sm border border-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-4 py-3 text-left font-semibold text-gray-700 border-b">Metric</th>
            <th className="px-4 py-3 text-center font-semibold text-blue-700 border-b bg-blue-50">
              Original Price (${priceA.price})
            </th>
            <th className="px-4 py-3 text-center font-semibold text-green-700 border-b bg-green-50">
              New Price (${priceB.price})
            </th>
            <th className="px-4 py-3 text-center font-semibold text-gray-700 border-b">Difference</th>
          </tr>
        </thead>
        <tbody>
          <tr className="border-b hover:bg-gray-50">
            <td className="px-4 py-3 font-medium text-gray-700">Conversion Rate</td>
            <td className="px-4 py-3 text-center text-blue-700 font-semibold">
              {priceA.conversionRate.toFixed(2)}%
            </td>
            <td className="px-4 py-3 text-center text-green-700 font-semibold">
              {priceB.conversionRate.toFixed(2)}%
            </td>
            <td className="px-4 py-3 text-center">
              <span className={`font-semibold ${
                priceA.conversionRate > priceB.conversionRate ? 'text-blue-600' : 'text-green-600'
              }`}>
                {Math.abs(priceA.conversionRate - priceB.conversionRate).toFixed(2)}% 
                {priceA.conversionRate > priceB.conversionRate ? ' (Original higher)' : ' (New higher)'}
              </span>
            </td>
          </tr>
          <tr className="border-b hover:bg-gray-50">
            <td className="px-4 py-3 font-medium text-gray-700">Revenue</td>
            <td className="px-4 py-3 text-center text-blue-700 font-semibold">
              ${priceA.revenue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </td>
            <td className="px-4 py-3 text-center text-green-700 font-semibold">
              ${priceB.revenue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </td>
            <td className="px-4 py-3 text-center">
              <span className={`font-semibold ${
                priceA.revenue > priceB.revenue ? 'text-blue-600' : 'text-green-600'
              }`}>
                ${Math.abs(priceA.revenue - priceB.revenue).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} 
                {priceA.revenue > priceB.revenue ? ' (Original higher)' : ' (New higher)'}
              </span>
            </td>
          </tr>
          <tr className="hover:bg-gray-50">
            <td className="px-4 py-3 font-medium text-gray-700">Profit</td>
            <td className="px-4 py-3 text-center text-blue-700 font-semibold">
              ${priceA.profit.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </td>
            <td className="px-4 py-3 text-center text-green-700 font-semibold">
              ${priceB.profit.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </td>
            <td className="px-4 py-3 text-center">
              <span className={`font-semibold ${
                priceA.profit > priceB.profit ? 'text-blue-600' : 'text-green-600'
              }`}>
                ${Math.abs(priceA.profit - priceB.profit).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} 
                {priceA.profit > priceB.profit ? ' (Original higher)' : ' (New higher)'}
              </span>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}