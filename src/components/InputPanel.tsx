import React from 'react';

export type OECType = 'revenue' | 'profit' | 'conversion';

interface InputPanelProps {
  mu: number;
  setMu: (value: number) => void;
  sigma: number;
  setSigma: (value: number) => void;
  cost: number;
  setCost: (value: number) => void;
  traffic: number;
  setTraffic: (value: number) => void;
  minPrice: number;
  setMinPrice: (value: number) => void;
  maxPrice: number;
  setMaxPrice: (value: number) => void;
  oec: OECType;
  setOec: (value: OECType) => void;
}

export default function InputPanel({
  mu, setMu,
  sigma, setSigma,
  cost, setCost,
  traffic, setTraffic,
  minPrice, setMinPrice,
  maxPrice, setMaxPrice,
  oec, setOec
}: InputPanelProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <label>
        Average WTP (μ):
        <input type="number" value={mu} onChange={e => setMu(e.target.value === '' ? 0 : parseFloat(e.target.value) || 0)} className="w-full border px-3 py-1 rounded" />
      </label>
      <label>
        Std. Deviation (σ):
        <input type="number" value={sigma} onChange={e => setSigma(e.target.value === '' ? 0 : parseFloat(e.target.value) || 0)} className="w-full border px-3 py-1 rounded" />
      </label>
      <label>
        Unit Cost (C):
        <input type="number" value={cost} onChange={e => setCost(e.target.value === '' ? 0 : parseFloat(e.target.value) || 0)} className="w-full border px-3 py-1 rounded" />
      </label>
      <label>
        Traffic (N):
        <input type="number" value={traffic} onChange={e => setTraffic(e.target.value === '' ? 0 : parseFloat(e.target.value) || 0)} className="w-full border px-3 py-1 rounded" />
      </label>
      <label>
        Min Price:
        <input type="number" value={minPrice} onChange={e => setMinPrice(e.target.value === '' ? 0 : parseFloat(e.target.value) || 0)} className="w-full border px-3 py-1 rounded" />
      </label>
      <label>
        Max Price:
        <input type="number" value={maxPrice} onChange={e => setMaxPrice(e.target.value === '' ? 0 : parseFloat(e.target.value) || 0)} className="w-full border px-3 py-1 rounded" />
      </label>
      
      <div className="sm:col-span-2 border-t pt-4 mt-4">
        <h3 className="text-lg font-medium mb-3 text-center">Overall Evaluation Criterion (OEC)</h3>
        <div className="flex justify-center space-x-4">
          <label className="flex items-center space-x-2">
            <input 
              type="radio" 
              name="oec" 
              value="revenue" 
              checked={oec === 'revenue'} 
              onChange={(e) => setOec(e.target.value as OECType)}
              className="text-blue-600"
            />
            <span>Maximize Revenue</span>
          </label>
          <label className="flex items-center space-x-2">
            <input 
              type="radio" 
              name="oec" 
              value="profit" 
              checked={oec === 'profit'} 
              onChange={(e) => setOec(e.target.value as OECType)}
              className="text-green-600"
            />
            <span>Maximize Profit</span>
          </label>
          <label className="flex items-center space-x-2">
            <input 
              type="radio" 
              name="oec" 
              value="conversion" 
              checked={oec === 'conversion'} 
              onChange={(e) => setOec(e.target.value as OECType)}
              className="text-orange-600"
            />
            <span>Maximize Conversion Rate</span>
          </label>
        </div>
      </div>
    </div>
  );
}
