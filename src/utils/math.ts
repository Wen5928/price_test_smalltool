

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
  maxPrice: number,
  cogs: number = 0,
  shippingFee: number = 0,
  transactionFeePercent: number = 0
): ChartPoint[] {
  const result: ChartPoint[] = [];

  // Ensure valid inputs and price range
  const safeMinPrice = Math.max(minPrice || 1, 0.01);
  const safeMaxPrice = Math.max(maxPrice || safeMinPrice + 10, safeMinPrice);
  const safeSigma = Math.max(sigma || 1, 0.01);
  const safeTraffic = Math.max(traffic || 1000, 1);

  for (let price = safeMinPrice; price <= safeMaxPrice; price++) {
    const convRate = normCDF(mu - price, 0, safeSigma);
    const revenue = price * safeTraffic * convRate;
    const transactionFee = price * (transactionFeePercent / 100);
    const totalCost = (cogs || cost) + shippingFee + transactionFee;
    const profit = (price - totalCost) * safeTraffic * convRate;

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

export type OECType = 'revenue' | 'profit' | 'conversion';

export interface OptimalPrice {
  price: number;
  conversionRate: number;
  revenue: number;
  profit: number;
  metric: string;
  value: number;
}

export interface ComparisonData {
  priceA: ComparisonPoint;
  priceB: ComparisonPoint;
  chartData: ChartPoint[];
}

export interface EnhancedChartData {
  chartData: ChartPoint[];
  optimalPrice: OptimalPrice;
}

export function generateEnhancedChartData(
  mu: number,
  sigma: number,
  cost: number,
  traffic: number,
  minPrice: number,
  maxPrice: number,
  oec: OECType,
  cogs: number = 0,
  shippingFee: number = 0,
  transactionFeePercent: number = 0
): EnhancedChartData {
  const chartData = generateChartData(mu, sigma, cost, traffic, minPrice, maxPrice, cogs, shippingFee, transactionFeePercent);
  
  // Handle empty chartData case
  if (chartData.length === 0) {
    const fallbackPrice = Math.max(minPrice, 1);
    const fallbackConvRate = normCDF(mu - fallbackPrice, 0, sigma);
    const fallbackRevenue = fallbackPrice * traffic * fallbackConvRate;
    const transactionFee = fallbackPrice * (transactionFeePercent / 100);
    const totalCost = (cogs || cost) + shippingFee + transactionFee;
    const fallbackProfit = (fallbackPrice - totalCost) * traffic * fallbackConvRate;
    
    return {
      chartData: [],
      optimalPrice: {
        price: fallbackPrice,
        conversionRate: fallbackConvRate * 100,
        revenue: fallbackRevenue,
        profit: fallbackProfit,
        metric: oec === 'revenue' ? 'Revenue' : oec === 'profit' ? 'Profit' : 'Conversion Rate',
        value: oec === 'revenue' ? fallbackRevenue : oec === 'profit' ? fallbackProfit : fallbackConvRate * 100
      }
    };
  }
  
  let optimalPoint = chartData[0];
  let metricName = '';
  
  switch (oec) {
    case 'revenue':
      metricName = 'Revenue';
      optimalPoint = chartData.reduce((max, current) => 
        current.revenue > max.revenue ? current : max
      );
      break;
    case 'profit':
      metricName = 'Profit';
      optimalPoint = chartData.reduce((max, current) => 
        current.profit > max.profit ? current : max
      );
      break;
    case 'conversion':
      metricName = 'Conversion Rate';
      optimalPoint = chartData.reduce((max, current) => 
        current.conversionRate > max.conversionRate ? current : max
      );
      break;
  }
  
  const optimalPrice: OptimalPrice = {
    price: optimalPoint.price,
    conversionRate: optimalPoint.conversionRate,
    revenue: optimalPoint.revenue,
    profit: optimalPoint.profit,
    metric: metricName,
    value: oec === 'revenue' ? optimalPoint.revenue : 
           oec === 'profit' ? optimalPoint.profit : 
           optimalPoint.conversionRate
  };
  
  return {
    chartData,
    optimalPrice
  };
}

export function generateComparisonData(
  mu: number,
  sigma: number,
  cost: number,
  traffic: number,
  minPrice: number,
  maxPrice: number,
  priceA: number,
  priceB: number,
  cogs: number = 0,
  shippingFee: number = 0,
  transactionFeePercent: number = 0
): ComparisonData {
  const chartData = generateChartData(mu, sigma, cost, traffic, minPrice, maxPrice, cogs, shippingFee, transactionFeePercent);
  
  const calculatePoint = (price: number): ComparisonPoint => {
    const convRate = normCDF(mu - price, 0, sigma);
    const transactionFee = price * (transactionFeePercent / 100);
    const totalCost = (cogs || cost) + shippingFee + transactionFee;
    return {
      price,
      conversionRate: convRate * 100,
      revenue: price * traffic * convRate,
      profit: (price - totalCost) * traffic * convRate,
    };
  };

  return {
    priceA: calculatePoint(priceA),
    priceB: calculatePoint(priceB),
    chartData,
  };
}