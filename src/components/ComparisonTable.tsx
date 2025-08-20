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
  const conversionDiff = Math.abs(priceA.conversionRate - priceB.conversionRate);
  const revenueDiff = Math.abs(priceA.revenue - priceB.revenue);
  const profitDiff = Math.abs(priceA.profit - priceB.profit);
  
  const betterConversion = priceA.conversionRate > priceB.conversionRate ? 'A' : 'B';
  const betterRevenue = priceA.revenue > priceB.revenue ? 'A' : 'B';
  const betterProfit = priceA.profit > priceB.profit ? 'A' : 'B';

  return (
    <div className="h-full flex flex-col">
      <h3 className="text-base font-semibold mb-2 text-center">📊 Price Comparison Analysis</h3>
      
      {/* Detailed explanation */}
      <div className="mb-4 p-3 border border-gray-600 rounded-lg text-xs space-y-1">
        <p className="font-medium text-white">How to read this analysis:</p>
        <ul className="text-white space-y-1 ml-2">
          <li>• <strong>Conv Rate:</strong> Predicted % of visitors who will purchase at each price point</li>
          <li>• <strong>Revenue:</strong> Total income = Price × Conversion Rate × Traffic</li>
          <li>• <strong>Profit:</strong> Net income after deducting costs (product + shipping + fees)</li>
          <li>• <strong>Diff:</strong> Absolute difference between price points</li>
        </ul>
      </div>
      
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
            <th className="px-2 py-2 text-center text-sm font-semibold text-white border-b border-gray-600">Diff</th>
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
            <td className="px-2 py-2 text-center text-xs">
              <span className={`font-semibold ${
                priceA.conversionRate > priceB.conversionRate ? 'text-blue-400' : 'text-green-400'
              }`}>
                {Math.abs(priceA.conversionRate - priceB.conversionRate).toFixed(2)}%
              </span>
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
            <td className="px-2 py-2 text-center text-xs">
              <span className={`font-semibold ${
                priceA.revenue > priceB.revenue ? 'text-blue-400' : 'text-green-400'
              }`}>
                ${Math.abs(priceA.revenue - priceB.revenue).toFixed(0)}
              </span>
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
            <td className="px-2 py-2 text-center text-xs">
              <span className={`font-semibold ${
                priceA.profit > priceB.profit ? 'text-blue-400' : 'text-green-400'
              }`}>
                ${Math.abs(priceA.profit - priceB.profit).toFixed(0)}
              </span>
            </td>
          </tr>
        </tbody>
      </table>
      
      {/* Analysis summary */}
      <div className="mt-4 p-3 border border-gray-600 rounded-lg text-xs space-y-2">
        <p className="font-medium text-blue-400">📈 Analysis Summary:</p>
        <div className="grid grid-cols-1 gap-2">
          <div className="flex justify-between items-center">
            <span className="text-white">Best Conversion Rate:</span>
            <span className={`font-semibold px-2 py-1 rounded ${
              betterConversion === 'A' ? 'text-blue-400' : 'text-green-400'
            }`}>
              Price {betterConversion} ({betterConversion === 'A' ? priceA.conversionRate.toFixed(2) : priceB.conversionRate.toFixed(2)}%)
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-white">Highest Revenue:</span>
            <span className={`font-semibold px-2 py-1 rounded ${
              betterRevenue === 'A' ? 'text-blue-400' : 'text-green-400'
            }`}>
              Price {betterRevenue} (${betterRevenue === 'A' ? priceA.revenue.toFixed(0) : priceB.revenue.toFixed(0)})
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-white">Maximum Profit:</span>
            <span className={`font-semibold px-2 py-1 rounded ${
              betterProfit === 'A' ? 'text-blue-400' : 'text-green-400'
            }`}>
              Price {betterProfit} (${betterProfit === 'A' ? priceA.profit.toFixed(0) : priceB.profit.toFixed(0)})
            </span>
          </div>
        </div>
        
        {/* Key insights */}
        <div className="border-t border-gray-600 pt-2 mt-2">
          <p className="font-medium text-yellow-400 mb-1">💡 Key Insights:</p>
          <ul className="text-white space-y-1 text-xs">
            {conversionDiff > 1 && (
              <li>• Significant conversion difference: {conversionDiff.toFixed(2)}% gap between prices</li>
            )}
            {revenueDiff > 1000 && (
              <li>• Revenue impact: ${revenueDiff.toFixed(0)} difference in total income</li>
            )}
            {profitDiff > 500 && (
              <li>• Profit impact: ${profitDiff.toFixed(0)} difference in net earnings</li>
            )}
            {betterProfit !== betterRevenue && (
              <li>• ⚠️ Highest revenue doesn't equal highest profit - consider costs carefully</li>
            )}
            {Math.abs(priceA.price - priceB.price) / Math.min(priceA.price, priceB.price) > 0.2 && (
              <li>• Large price gap ({(Math.abs(priceA.price - priceB.price) / Math.min(priceA.price, priceB.price) * 100).toFixed(0)}%) may significantly affect customer behavior</li>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
}