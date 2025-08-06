import React from 'react';
import { OECType } from '@/utils/math';

interface OecSelectorProps {
  oec: OECType;
  setOec: (value: OECType) => void;
}

export default function OecSelector({ oec, setOec }: OecSelectorProps) {
  return (
    <div className="space-y-2">
      <h3 className="font-semibold flex items-center gap-2">
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
            onChange={(e) => setOec(e.target.value as OECType)}
            className="w-4 h-4"
          />
          <span>Maximize Revenue</span>
        </label>
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="radio"
            name="oec"
            value="profit"
            checked={oec === 'profit'}
            onChange={(e) => setOec(e.target.value as OECType)}
            className="w-4 h-4"
          />
          <span>Maximize Profit</span>
        </label>
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="radio"
            name="oec"
            value="conversion"
            checked={oec === 'conversion'}
            onChange={(e) => setOec(e.target.value as OECType)}
            className="w-4 h-4"
          />
          <span>Maximize Conversion Rate</span>
        </label>
      </div>
    </div>
  );
}