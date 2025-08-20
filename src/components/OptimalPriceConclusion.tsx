import React from 'react';
import { OptimalPrice, OECType } from '@/utils/math';

interface OptimalPriceConclusionProps {
  optimalPrice: OptimalPrice;
  oec: OECType;
  inputMode?: string;
  sellingTraffic?: number;
  conversionRate?: number;
  shippingFee?: number;
  transactionFeePercent?: number;
  gmv?: number;
}

export default function OptimalPriceConclusion({ 
  optimalPrice, 
  oec,
  inputMode,
  sellingTraffic,
  conversionRate,
  shippingFee,
  transactionFeePercent,
  gmv
}: OptimalPriceConclusionProps) {
  const oecLabel = oec === 'revenue' ? 'Maximize Revenue' : 
                   oec === 'profit' ? 'Maximize Profit' : 
                   'Maximize Conversion Rate';
  
  const metricValue = oec === 'revenue' ? `$${optimalPrice.revenue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` :
                      oec === 'profit' ? `$${optimalPrice.profit.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` :
                      `${optimalPrice.conversionRate.toFixed(2)}%`;

  return (
    <div className="h-full p-6 rounded-lg border border-default flex flex-col">
      <h3 className="text-xl font-bold mb-3 text-white flex items-center gap-2">
        <span>🎯</span>
        <span>Optimal Price Analysis</span>
      </h3>
      
      <div className="space-y-3">
        <p className="text-white">
          Based on your selected OEC: <strong className="text-white">{oecLabel}</strong>,
        </p>
        
        <div className="p-4 rounded-lg border border-gray-200">
          <p className="text-lg text-white">
            The best simulated price is: <strong className="text-2xl text-abc-blue-light">${optimalPrice.price.toFixed(2)}</strong>
          </p>
          <p className="text-white mt-2">
            With an estimated {oec === 'conversion' ? 'conversion rate' : oec} of: <strong className="text-lg text-white">{metricValue}</strong>
          </p>
        </div>
        
        {/* Input Parameters Section (only in CSV mode) */}
        {inputMode === 'csv' && (
          <div className="p-4 rounded-lg border border-blue-200 mt-4">
            <h4 className="font-semibold text-white mb-2">📊 Input Parameters Used:</h4>
            <div className="grid grid-cols-2 gap-3 text-sm">
              {sellingTraffic !== undefined && (
                <div>
                  <span className="text-gray-300">Selling Traffic:</span>
                  <span className="font-medium ml-2 text-white">{sellingTraffic.toLocaleString()}</span>
                </div>
              )}
              {conversionRate !== undefined && (
                <div>
                  <span className="text-gray-300">Current Conv. Rate:</span>
                  <span className="font-medium ml-2 text-white">{conversionRate.toFixed(2)}%</span>
                </div>
              )}
              {shippingFee !== undefined && (
                <div>
                  <span className="text-gray-300">Shipping Cost:</span>
                  <span className="font-medium ml-2 text-white">${shippingFee.toFixed(2)}</span>
                </div>
              )}
              {transactionFeePercent !== undefined && (
                <div>
                  <span className="text-gray-300">Transaction Fee:</span>
                  <span className="font-medium ml-2 text-white">{transactionFeePercent.toFixed(1)}%</span>
                </div>
              )}
              {gmv !== undefined && gmv > 0 && (
                <div>
                  <span className="text-gray-300">Current GMV:</span>
                  <span className="font-medium ml-2 text-white">${gmv.toLocaleString()}</span>
                </div>
              )}
            </div>
          </div>
        )}
        
        <div className="grid grid-cols-3 gap-4 mt-4">
          <div className="text-center p-3 border border-gray-200 rounded">
            <div className="text-sm text-gray-400 font-semibold">Conversion Rate</div>
            <div className="font-bold text-white">{optimalPrice.conversionRate.toFixed(2)}%</div>
          </div>
          <div className="text-center p-3 border border-gray-200 rounded">
            <div className="text-sm text-gray-400 font-semibold">Revenue</div>
            <div className="font-bold text-white">${optimalPrice.revenue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
          </div>
          <div className="text-center p-3 border border-gray-200 rounded">
            <div className="text-sm text-gray-400 font-semibold">Profit</div>
            <div className="font-bold text-white">${optimalPrice.profit.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
          </div>
        </div>
      </div>
    </div>
  );
}