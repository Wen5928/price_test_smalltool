'use client';

import { useState, useMemo } from 'react';
import ProfitCurveChart from './ProfitCurveChart';
import { getSimulationData } from '@/utils/math';

export default function PriceSimulator() {
  const [currentPrice, setCurrentPrice] = useState(29.99);
  const [costPerItem, setCostPerItem] = useState(8.0);
  const [explorerPrice, setExplorerPrice] = useState<number | null>(null);

  const simulation = useMemo(
    () => getSimulationData(currentPrice, costPerItem),
    [currentPrice, costPerItem]
  );

  // Calculate profit at explorer price
  const explorerProfit = useMemo(() => {
    if (explorerPrice === null) return null;
    const closest = simulation.curve.reduce((prev, curr) =>
      Math.abs(curr.price - explorerPrice) < Math.abs(prev.price - explorerPrice)
        ? curr
        : prev
    );
    return closest.profit;
  }, [explorerPrice, simulation.curve]);

  const sliderMin = simulation.curve.length > 0 ? simulation.curve[0].price : currentPrice * 0.5;
  const sliderMax = simulation.curve.length > 0 ? simulation.curve[simulation.curve.length - 1].price : currentPrice * 2;

  return (
    <section
      id="simulator"
      className="min-h-screen flex flex-col justify-center px-4 sm:px-6 lg:px-8 py-16 sm:py-24"
    >
      <div className="max-w-5xl mx-auto w-full">
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-[var(--foreground)] mb-2 text-center">
          Quick Price Simulator
        </h2>
        <p className="text-[var(--color-text-muted)] text-center mb-10 sm:mb-14 text-base sm:text-lg">
          Enter your product details and see the profit landscape instantly.
        </p>

        {/* Inputs */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 mb-10 max-w-lg mx-auto">
          <div>
            <label className="block text-sm font-medium text-[var(--color-text-secondary)] mb-1.5">
              Current Price
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)]">$</span>
              <input
                type="number"
                min={1}
                step={0.01}
                value={currentPrice}
                onChange={(e) => setCurrentPrice(Math.max(1, parseFloat(e.target.value) || 1))}
                className="form-input w-full rounded-lg px-3 py-2.5 pl-7 text-base"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-[var(--color-text-secondary)] mb-1.5">
              Cost per Item
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)]">$</span>
              <input
                type="number"
                min={0}
                step={0.01}
                value={costPerItem}
                onChange={(e) => setCostPerItem(Math.max(0, parseFloat(e.target.value) || 0))}
                className="form-input w-full rounded-lg px-3 py-2.5 pl-7 text-base"
              />
            </div>
          </div>
        </div>

        {/* Chart */}
        <div className="bg-[var(--color-card)] rounded-xl border border-[var(--color-border)] p-4 sm:p-6 mb-6 overflow-visible">
          <ProfitCurveChart
            data={simulation.curve}
            currentPrice={currentPrice}
            optimalPrice={simulation.optimalPrice}
            explorerPrice={explorerPrice ?? undefined}
          />
        </div>

        {/* Slider */}
        <div className="max-w-2xl mx-auto mb-8">
          <label className="block text-sm font-medium text-[var(--color-text-secondary)] mb-2 text-center">
            Drag to explore prices
          </label>
          <input
            type="range"
            min={sliderMin}
            max={sliderMax}
            step={0.5}
            value={explorerPrice ?? currentPrice}
            onChange={(e) => setExplorerPrice(parseFloat(e.target.value))}
            className="w-full accent-[var(--color-primary)] h-2 rounded-lg cursor-pointer"
          />
          {explorerPrice !== null && explorerProfit !== null && (
            <p className="text-center mt-3 text-sm text-[var(--color-text-muted)]">
              At{' '}
              <span className="text-[var(--abc-blue-light)] font-semibold">
                ${explorerPrice.toFixed(2)}
              </span>
              , estimated monthly profit:{' '}
              <span className="text-[var(--foreground)] font-semibold">
                ${explorerProfit.toLocaleString(undefined, { maximumFractionDigits: 0 })}
              </span>
            </p>
          )}
        </div>

        {/* Delta callout */}
        <div className="text-center p-4 sm:p-8 bg-[var(--color-card)] rounded-xl border border-[var(--color-border)]">
          {simulation.monthlyDelta > 0 ? (
            <p className="text-sm sm:text-lg md:text-xl leading-relaxed">
              If your optimal price is{' '}
              <span className="text-[var(--abc-success)] font-bold">
                ${simulation.optimalPrice.toFixed(2)}
              </span>{' '}
              instead of{' '}
              <span className="text-[var(--abc-warning)] font-bold">
                ${currentPrice.toFixed(2)}
              </span>
              , you could earn{' '}
              <span className="block sm:inline mt-1 sm:mt-0 text-[var(--foreground)] font-bold text-xl sm:text-2xl md:text-3xl">
                ${simulation.monthlyDelta.toLocaleString(undefined, { maximumFractionDigits: 0 })}
              </span>{' '}
              <span className="text-[var(--abc-success)] font-semibold">more per month</span>.
            </p>
          ) : (
            <p className="text-base sm:text-xl text-[var(--abc-success)]">
              Your current price is already near optimal. Nice work!
            </p>
          )}
        </div>
      </div>
    </section>
  );
}
