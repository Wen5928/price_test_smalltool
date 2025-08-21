import React from 'react';
import { OECType } from '@/utils/math';
import toast from 'react-hot-toast';

interface OecSelectorProps {
  oec: OECType;
  setOec: (value: OECType) => void;
  targetConversionRate?: number;
  setTargetConversionRate?: (value: number) => void;
}

export default function OecSelector({ oec, setOec, targetConversionRate, setTargetConversionRate }: OecSelectorProps) {
  const handleOecChange = (newOec: OECType) => {
    setOec(newOec);
    
    if (newOec === 'conversion') {
      toast(
        `💡 Tip: The system now finds the optimal conversion rate with reasonable profit margins (50%+ above cost). To fine-tune further, adjust your price range or expected conversion rate in the configuration above.`,
        {
          duration: 7000,
          style: {
            background: 'var(--color-info)',
            color: 'var(--abc-pure-white)',
          }
        }
      );
    }
  };
  return (
    <div className="space-y-2">
      <h3 className="font-semibold flex items-center gap-2 text-white">
        <span>📊</span>
        <span>Evaluation Focus:</span>
      </h3>
      <div className="space-y-2">
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="radio"
            name="oec"
            value="revenue"
            checked={oec === 'revenue'}
            onChange={(e) => handleOecChange(e.target.value as OECType)}
            className="w-4 h-4"
          />
          <span className="text-white">Maximize Revenue</span>
        </label>
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="radio"
            name="oec"
            value="profit"
            checked={oec === 'profit'}
            onChange={(e) => handleOecChange(e.target.value as OECType)}
            className="w-4 h-4"
          />
          <span className="text-white">Maximize Profit</span>
        </label>
        <div className="space-y-2">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              name="oec"
              value="conversion"
              checked={oec === 'conversion'}
              onChange={(e) => handleOecChange(e.target.value as OECType)}
              className="w-4 h-4"
            />
            <span className="text-white">Maximize Conversion Rate</span>
          </label>
          {oec === 'conversion' && setTargetConversionRate && (
            <div className="ml-6 flex items-center gap-2">
              <label className="text-sm text-[var(--color-text-secondary)]">Target Rate:</label>
              <input
                type="number"
                value={targetConversionRate || ''}
                onChange={(e) => setTargetConversionRate(parseFloat(e.target.value) || 0)}
                placeholder="3.0"
                min="0.1"
                max="50"
                step="0.1"
                className="w-20 px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
              />
              <span className="text-sm text-gray-400">%</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}