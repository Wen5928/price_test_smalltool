'use client';

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

interface ChartPoint {
  price: number;
  profit: number;
}

interface ProfitCurveChartProps {
  data: ChartPoint[];
  currentPrice: number;
  optimalPrice: number;
  explorerPrice?: number;
}

export default function ProfitCurveChart({
  data,
  currentPrice,
  optimalPrice,
  explorerPrice,
}: ProfitCurveChartProps) {
  return (
    <ResponsiveContainer width="100%" height={360}>
      <AreaChart data={data} margin={{ top: 30, right: 30, left: 10, bottom: 0 }}>
        <defs>
          <linearGradient id="profitGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="var(--abc-blue-primary)" stopOpacity={0.4} />
            <stop offset="95%" stopColor="var(--abc-blue-primary)" stopOpacity={0} />
          </linearGradient>
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
          formatter={(value: number) => [`$${value.toLocaleString(undefined, { maximumFractionDigits: 0 })}`, 'Profit']}
          labelFormatter={(label: number) => `Price: $${label.toFixed(2)}`}
        />
        <Area
          type="monotone"
          dataKey="profit"
          stroke="var(--abc-blue-primary)"
          strokeWidth={2.5}
          fill="url(#profitGradient)"
          animationDuration={1200}
        />
        <ReferenceLine
          x={currentPrice}
          stroke="var(--abc-warning)"
          strokeWidth={2}
          strokeDasharray="6 4"
          label={{
            value: `Current ($${currentPrice.toFixed(0)})`,
            position: 'insideTopRight',
            fill: 'var(--abc-warning)',
            fontSize: 11,
            fontWeight: 600,
            offset: 6,
          }}
        />
        <ReferenceLine
          x={optimalPrice}
          stroke="var(--abc-success)"
          strokeWidth={2}
          strokeDasharray="6 4"
          label={{
            value: `Optimal ($${optimalPrice.toFixed(0)})`,
            position: 'insideTopLeft',
            fill: 'var(--abc-success)',
            fontSize: 11,
            fontWeight: 600,
            offset: 6,
          }}
        />
        {explorerPrice !== undefined && (
          <ReferenceLine
            x={explorerPrice}
            stroke="var(--abc-blue-light)"
            strokeWidth={2}
            label={{
              value: 'Explorer',
              position: 'top',
              fill: 'var(--abc-blue-light)',
              fontSize: 12,
              fontWeight: 600,
            }}
          />
        )}
      </AreaChart>
    </ResponsiveContainer>
  );
}
