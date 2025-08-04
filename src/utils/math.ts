

// utils/math.ts

export function erf(x: number): number {
  const sign = x < 0 ? -1 : 1;
  x = Math.abs(x);

  const a1 = 0.254829592;
  const a2 = -0.284496736;
  const a3 = 1.421413741;
  const a4 = -1.453152027;
  const a5 = 1.061405429;
  const p = 0.3275911;

  const t = 1 / (1 + p * x);
  const y =
    1 -
    (((((a5 * t + a4) * t + a3) * t + a2) * t + a1) * t) * Math.exp(-x * x);
  return sign * y;
}

export function normCDF(x: number, mean: number, std: number): number {
  return 0.5 * (1 + erf((x - mean) / (std * Math.sqrt(2))));
}

interface ChartPoint {
  price: number;
  conversionRate: number;
  revenue: number;
  profit: number;
}

export function generateChartData(
  mu: number,
  sigma: number,
  cost: number,
  traffic: number,
  minPrice: number,
  maxPrice: number
): ChartPoint[] {
  const result: ChartPoint[] = [];

  for (let price = minPrice; price <= maxPrice; price++) {
    const convRate = normCDF(mu - price, 0, sigma);
    const revenue = price * traffic * convRate;
    const profit = (price - cost) * traffic * convRate;

    result.push({
      price,
      conversionRate: convRate * 100,
      revenue,
      profit,
    });
  }

  return result;
}

interface ComparisonPoint {
  price: number;
  conversionRate: number;
  revenue: number;
  profit: number;
}

export interface ComparisonData {
  priceA: ComparisonPoint;
  priceB: ComparisonPoint;
  chartData: ChartPoint[];
}

export function generateComparisonData(
  mu: number,
  sigma: number,
  cost: number,
  traffic: number,
  minPrice: number,
  maxPrice: number,
  priceA: number,
  priceB: number
): ComparisonData {
  const chartData = generateChartData(mu, sigma, cost, traffic, minPrice, maxPrice);
  
  const calculatePoint = (price: number): ComparisonPoint => {
    const convRate = normCDF(mu - price, 0, sigma);
    return {
      price,
      conversionRate: convRate * 100,
      revenue: price * traffic * convRate,
      profit: (price - cost) * traffic * convRate,
    };
  };

  return {
    priceA: calculatePoint(priceA),
    priceB: calculatePoint(priceB),
    chartData,
  };
}