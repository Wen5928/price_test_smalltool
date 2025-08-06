import React from 'react';
import { OptimalPrice } from '@/utils/math';

interface OptimalPriceConclusionProps {
  optimalPrice: OptimalPrice;
  oec: string;
}

export default function OptimalPriceConclusion({ optimalPrice, oec }: OptimalPriceConclusionProps) {
  const oecLabel = oec === 'revenue' ? 'Maximize Revenue' : 
                   oec === 'profit' ? 'Maximize Profit' : 
                   'Maximize Conversion Rate';
  
  const metricValue = oec === 'revenue' ? `$${optimalPrice.revenue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` :
                      oec === 'profit' ? `$${optimalPrice.profit.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` :
                      `${optimalPrice.conversionRate.toFixed(2)}%`;

  return (
    <div className="h-full bg-gradient-to-r from-red-50 to-orange-50 p-6 rounded-lg border border-orange-200 flex flex-col">
      <h3 className="text-xl font-bold mb-3 text-gray-800 flex items-center gap-2">
        <span>🎯</span>
        <span>Optimal Price Analysis</span>
      </h3>
      
      <div className="space-y-3">
        <p className="text-gray-700">
          Based on your selected OEC: <strong>{oecLabel}</strong>,
        </p>
        
        <div className="bg-white p-4 rounded-lg shadow-sm">
          <p className="text-lg">
            The best simulated price is: <strong className="text-2xl text-red-600">${optimalPrice.price.toFixed(2)}</strong>
          </p>
          <p className="text-gray-600 mt-2">
            With an estimated {oec === 'conversion' ? 'conversion rate' : oec} of: <strong className="text-lg">{metricValue}</strong>
          </p>
        </div>
        
        <div className="grid grid-cols-3 gap-4 mt-4">
          <div className="text-center p-3 bg-gray-50 rounded">
            <div className="text-sm text-gray-600">Conversion Rate</div>
            <div className="font-semibold">{optimalPrice.conversionRate.toFixed(2)}%</div>
          </div>
          <div className="text-center p-3 bg-gray-50 rounded">
            <div className="text-sm text-gray-600">Revenue</div>
            <div className="font-semibold">${optimalPrice.revenue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
          </div>
          <div className="text-center p-3 bg-gray-50 rounded">
            <div className="text-sm text-gray-600">Profit</div>
            <div className="font-semibold">${optimalPrice.profit.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
          </div>
        </div>
      </div>
    </div>
  );
}