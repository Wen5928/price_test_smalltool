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
  optimalPrice?: ComparisonPoint;
}

export default function ComparisonTable({ priceA, priceB, optimalPrice }: ComparisonTableProps) {
  // Find the best performer among A, B, and Optimal
  const getAllValues = (metric: 'conversionRate' | 'revenue' | 'profit') => {
    const values = [
      { name: 'A', value: priceA[metric], color: 'text-blue-400' },
      { name: 'B', value: priceB[metric], color: 'text-green-400' }
    ];
    if (optimalPrice) {
      values.push({ name: 'Optimal', value: optimalPrice[metric], color: 'text-red-400' });
    }
    return values.sort((a, b) => b.value - a.value);
  };

  const bestConversion = getAllValues('conversionRate')[0];
  const bestRevenue = getAllValues('revenue')[0];
  const bestProfit = getAllValues('profit')[0];

  return (
    <div className="h-full flex flex-col">
      <h3 className="text-base font-semibold mb-2 text-center">📊 Price Comparison Analysis</h3>
      
      {/* Detailed explanation */}
      <div className="mb-3 p-2 border border-gray-600 rounded-lg text-sm space-y-1">
        <p className="font-medium text-white">How to read this analysis:</p>
        <ul className="text-white space-y-1 ml-2">
          <li>• <strong>Conv Rate:</strong> Predicted % of visitors who will purchase at each price point</li>
          <li>• <strong>Revenue:</strong> Total income = Price × Conversion Rate × Traffic</li>
          <li>• <strong>Profit:</strong> Net income after deducting costs (product + shipping + fees)</li>
          <li>• <strong>Optimal:</strong> Best performing metrics based on optimization focus</li>
        </ul>
      </div>
      
      {/* Side by side layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
        {/* Metrics Table */}
        <div>
          <table className="w-full rounded-lg border border-gray-600">
            <thead>
              <tr>
                <th className="px-2 py-2 text-left text-sm font-semibold text-white border-b border-gray-600">Metric</th>
                <th className="px-2 py-2 text-center text-sm font-semibold text-blue-400 border-b border-gray-600">
                  A (${priceA.price})
                </th>
                <th className="px-2 py-2 text-center text-sm font-semibold text-green-400 border-b border-gray-600">
                  B (${priceB.price})
                </th>
                <th className="px-2 py-2 text-center text-sm font-semibold text-red-400 border-b border-gray-600">
                  Optimal{optimalPrice ? ` ($${optimalPrice.price.toFixed(2)})` : ''}
                </th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-gray-600">
                <td className="px-2 py-2 text-sm font-medium text-white">Conv Rate</td>
                <td className="px-2 py-2 text-center text-sm text-white font-semibold">
                  {priceA.conversionRate.toFixed(2)}%
                </td>
                <td className="px-2 py-2 text-center text-sm text-white font-semibold">
                  {priceB.conversionRate.toFixed(2)}%
                </td>
                <td className="px-2 py-2 text-center text-sm text-red-400 font-semibold">
                  {optimalPrice ? `${optimalPrice.conversionRate.toFixed(2)}%` : 'N/A'}
                </td>
              </tr>
              <tr className="border-b border-gray-600">
                <td className="px-2 py-2 text-sm font-medium text-white">Revenue</td>
                <td className="px-2 py-2 text-center text-sm text-white font-semibold">
                  ${priceA.revenue.toFixed(0)}
                </td>
                <td className="px-2 py-2 text-center text-sm text-white font-semibold">
                  ${priceB.revenue.toFixed(0)}
                </td>
                <td className="px-2 py-2 text-center text-sm text-red-400 font-semibold">
                  {optimalPrice ? `$${optimalPrice.revenue.toFixed(0)}` : 'N/A'}
                </td>
              </tr>
              <tr>
                <td className="px-2 py-2 text-sm font-medium text-white">Profit</td>
                <td className="px-2 py-2 text-center text-sm text-white font-semibold">
                  ${priceA.profit.toFixed(0)}
                </td>
                <td className="px-2 py-2 text-center text-sm text-white font-semibold">
                  ${priceB.profit.toFixed(0)}
                </td>
                <td className="px-2 py-2 text-center text-sm text-red-400 font-semibold">
                  {optimalPrice ? `$${optimalPrice.profit.toFixed(0)}` : 'N/A'}
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Analysis summary */}
        <div className="p-2 border border-gray-600 rounded-lg text-sm space-y-2 h-fit">
          <p className="font-medium text-blue-400">📈 Analysis Summary:</p>
          <div className="grid grid-cols-1 gap-2">
            <div className="flex justify-between items-center">
              <span className="text-white">Best Conversion Rate:</span>
              <span className={`font-semibold px-2 py-1 rounded text-white ${
                bestConversion.name === 'A' ? 'bg-blue-500/20' : 
                bestConversion.name === 'B' ? 'bg-green-500/20' : 
                'bg-red-500/20'
              }`}>
                {bestConversion.name} ({bestConversion.value.toFixed(2)}%)
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-white">Highest Revenue:</span>
              <span className={`font-semibold px-2 py-1 rounded text-white ${
                bestRevenue.name === 'A' ? 'bg-blue-500/20' : 
                bestRevenue.name === 'B' ? 'bg-green-500/20' : 
                'bg-red-500/20'
              }`}>
                {bestRevenue.name} (${bestRevenue.value.toFixed(0)})
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-white">Maximum Profit:</span>
              <span className={`font-semibold px-2 py-1 rounded text-white ${
                bestProfit.name === 'A' ? 'bg-blue-500/20' : 
                bestProfit.name === 'B' ? 'bg-green-500/20' : 
                'bg-red-500/20'
              }`}>
                {bestProfit.name} (${bestProfit.value.toFixed(0)})
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}