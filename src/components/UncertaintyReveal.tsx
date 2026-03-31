'use client';

import { useState, useEffect, useRef, useMemo } from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ReferenceLine,
  ResponsiveContainer,
} from 'recharts';
import { getUncertaintyCurves } from '@/utils/math';

const COLORS = [
  'var(--abc-warning)',      // coral - Price Sensitive
  'var(--abc-blue-primary)', // blue  - Moderate
  'var(--abc-success)',      // green - Price Insensitive
];

export default function UncertaintyReveal() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [visibleCurves, setVisibleCurves] = useState(0);

  const currentPrice = 29.99;
  const costPerItem = 8.0;

  const { curves } = useMemo(
    () => getUncertaintyCurves(currentPrice, costPerItem),
    []
  );

  // Build merged data: each point has price + profit for each curve
  const mergedData = useMemo(() => {
    if (curves.length === 0) return [];
    // Use the first curve's price set as the base
    return curves[0].data.map((point, i) => {
      const row: Record<string, number> = { price: point.price };
      curves.forEach((c, ci) => {
        row[`profit${ci}`] = c.data[i]?.profit ?? 0;
      });
      return row;
    });
  }, [curves]);

  // Scroll-triggered reveal: show curves one at a time
  useEffect(() => {
    const element = sectionRef.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && visibleCurves === 0) {
          // Stagger curve reveals
          setVisibleCurves(1);
          setTimeout(() => setVisibleCurves(2), 700);
          setTimeout(() => setVisibleCurves(3), 1400);
        }
      },
      { threshold: 0.25 }
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, [visibleCurves]);

  return (
    <section
      ref={sectionRef}
      className="min-h-screen flex flex-col justify-center px-4 sm:px-6 lg:px-8 py-16 sm:py-24"
    >
      <div className="max-w-5xl mx-auto w-full">
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-[var(--foreground)] mb-2 text-center">
          But here&apos;s the problem...
        </h2>
        <p className="text-[var(--color-text-muted)] text-center mb-10 sm:mb-14 text-base sm:text-lg max-w-2xl mx-auto">
          The &ldquo;optimal&rdquo; price depends entirely on how sensitive your customers are
          to price changes &mdash; and you don&apos;t know that without real data.
        </p>

        {/* Overlaid chart */}
        <div className="bg-[var(--color-card)] rounded-xl border border-[var(--color-border)] p-4 sm:p-6 mb-8 overflow-visible">
          <ResponsiveContainer width="100%" height={380}>
            <AreaChart data={mergedData} margin={{ top: 30, right: 30, left: 10, bottom: 0 }}>
              <defs>
                {COLORS.map((color, i) => (
                  <linearGradient key={i} id={`ug${i}`} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={color} stopOpacity={0.2} />
                    <stop offset="95%" stopColor={color} stopOpacity={0} />
                  </linearGradient>
                ))}
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
              <XAxis
                dataKey="price"
                tick={{ fill: 'rgba(255,255,255,0.6)', fontSize: 12 }}
                tickFormatter={(v: number) => `$${v.toFixed(0)}`}
                stroke="rgba(255,255,255,0.1)"
              />
              <YAxis
                tick={{ fill: 'rgba(255,255,255,0.6)', fontSize: 12 }}
                tickFormatter={(v: number) => `$${(v / 1000).toFixed(0)}k`}
                stroke="rgba(255,255,255,0.1)"
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'var(--color-card)',
                  border: '1px solid var(--color-border)',
                  borderRadius: '8px',
                  color: 'var(--foreground)',
                }}
                labelFormatter={(label: number) => `Price: $${label.toFixed(2)}`}
                formatter={(value: number, name: string) => {
                  const idx = parseInt(name.replace('profit', ''));
                  const label = curves[idx]?.label ?? name;
                  return [`$${value.toLocaleString(undefined, { maximumFractionDigits: 0 })}`, label];
                }}
              />

              {curves.map((curve, i) => (
                <Area
                  key={i}
                  type="monotone"
                  dataKey={`profit${i}`}
                  stroke={COLORS[i]}
                  strokeWidth={2.5}
                  fill={`url(#ug${i})`}
                  strokeOpacity={visibleCurves > i ? 1 : 0}
                  fillOpacity={visibleCurves > i ? 1 : 0}
                  animationDuration={800}
                  name={`profit${i}`}
                />
              ))}

              {/* Optimal price markers */}
              {curves.map(
                (curve, i) =>
                  visibleCurves > i && (
                    <ReferenceLine
                      key={`ref-${i}`}
                      x={curve.optimalPrice}
                      stroke={COLORS[i]}
                      strokeWidth={1.5}
                      strokeDasharray="4 4"
                    />
                  )
              )}
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Legend */}
        <div className="flex flex-wrap justify-center gap-4 sm:gap-6 mb-8">
          {curves.map((curve, i) => (
            <div
              key={i}
              className="flex items-center gap-2 transition-opacity duration-500"
              style={{ opacity: visibleCurves > i ? 1 : 0.2 }}
            >
              <span
                className="inline-block w-3 h-3 rounded-full"
                style={{ backgroundColor: COLORS[i] }}
              />
              <span className="text-sm text-[var(--color-text-secondary)]">
                {curve.label} &mdash; optimal at ${curve.optimalPrice.toFixed(2)}
              </span>
            </div>
          ))}
        </div>

        {/* Caption */}
        <p className="text-center text-base sm:text-lg text-[var(--color-text-secondary)] max-w-2xl mx-auto leading-relaxed">
          Different assumptions about customer behavior lead to <em>completely</em> different
          &ldquo;optimal&rdquo; prices.{' '}
          <span className="text-[var(--foreground)] font-semibold">
            You can&apos;t know without testing.
          </span>
        </p>
      </div>
    </section>
  );
}
