import React from 'react';

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
  priceA: number;
  setPriceA: (value: number) => void;
  priceB: number;
  setPriceB: (value: number) => void;
}

export default function InputPanel({
  mu, setMu,
  sigma, setSigma,
  cost, setCost,
  traffic, setTraffic,
  minPrice, setMinPrice,
  maxPrice, setMaxPrice,
  priceA, setPriceA,
  priceB, setPriceB
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
        <h3 className="text-lg font-medium mb-3 text-center">Price Comparison</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <label>
            Price A:
            <input type="number" value={priceA} onChange={e => setPriceA(e.target.value === '' ? 0 : parseFloat(e.target.value) || 0)} className="w-full border px-3 py-1 rounded bg-blue-50" />
          </label>
          <label>
            Price B:
            <input type="number" value={priceB} onChange={e => setPriceB(e.target.value === '' ? 0 : parseFloat(e.target.value) || 0)} className="w-full border px-3 py-1 rounded bg-green-50" />
          </label>
        </div>
      </div>
    </div>
  );
}
