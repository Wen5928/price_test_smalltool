

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
  transactionFeePercent: number = 0,
  actualConversionRate?: number,
  gmv?: number,
  originalPrice?: number
): ChartPoint[] {
  const result: ChartPoint[] = [];

  // Ensure valid inputs and price range
  const safeMinPrice = Math.max(minPrice || 1, 0.01);
  const rawMaxPrice = Math.max(maxPrice || safeMinPrice + 10, safeMinPrice);
  
  // Check for extremely large price ranges that could cause performance issues
  const maxRecommendedRange = 10000; // Maximum recommended price points for performance
  const priceRange = rawMaxPrice - safeMinPrice;
  
  let safeMaxPrice = rawMaxPrice;
  let useSampling = false;
  let sampleStep = 1;
  
  if (priceRange > maxRecommendedRange) {
    console.warn(`Price range is very large (${priceRange.toLocaleString()} points). Using sampling for performance.`);
    useSampling = true;
    sampleStep = Math.ceil(priceRange / maxRecommendedRange);
  }
  
  const safeSigma = Math.max(sigma || 1, 0.01);
  const safeTraffic = Math.max(traffic || 1000, 1);

  // If actual conversion rate is provided, use it as base for calculations
  let baseConversionRate: number;
  if (actualConversionRate !== undefined && originalPrice !== undefined) {
    // Use the actual conversion rate as the base (at 0% price change)
    baseConversionRate = actualConversionRate / 100;
  } else {
    // Fall back to theoretical model - assume mu is the reference price (0% change)
    baseConversionRate = normCDF(0, 0, safeSigma); // At reference price, no change
  }

  for (let price = safeMinPrice; price <= safeMaxPrice; price += sampleStep) {
    let convRate: number;
    
    if (actualConversionRate !== undefined && originalPrice !== undefined) {
      // Calculate conversion rate based on price percentage change from original price
      const priceChangePercent = ((price - originalPrice) / originalPrice) * 100;
      const theoreticalOriginal = normCDF(0, 0, safeSigma); // Base conversion at 0% change
      const theoreticalNew = normCDF(-priceChangePercent, 0, safeSigma); // Negative because higher price = lower conversion
      const conversionMultiplier = theoreticalOriginal > 0 ? theoreticalNew / theoreticalOriginal : 1;
      convRate = baseConversionRate * conversionMultiplier;
    } else {
      // Use pure theoretical model with percentage change from mu (reference price)
      const priceChangePercent = ((price - mu) / mu) * 100;
      convRate = normCDF(-priceChangePercent, 0, safeSigma); // Negative because higher price = lower conversion
    }
    
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

export interface ComparisonPoint {
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

export interface CalculateOptimalPriceParams {
  currentPrice: number;
  costPerItem: number;
  shippingFee: number;
  transactionFeePercent: number;
  monthlyTraffic: number;
  oec: OECType;
  targetConversionRate?: number;
}

export interface CalculateOptimalPriceResult {
  comparison: ComparisonData;
  optimalPrice: number;
}

export function calculateOptimalPrice(params: CalculateOptimalPriceParams): CalculateOptimalPriceResult {
  const {
    currentPrice,
    costPerItem,
    shippingFee,
    transactionFeePercent,
    monthlyTraffic,
    oec,
    targetConversionRate
  } = params;

  // Calculate total cost per item
  const totalCost = costPerItem + shippingFee + (currentPrice * transactionFeePercent / 100);
  
  // Generate price range for testing
  const minPrice = Math.max(totalCost * 1.1, currentPrice * 0.5); // At least 10% margin
  const maxPrice = currentPrice * 2; // Test up to 2x current price
  
  // Estimate conversion parameters based on current price
  // Assuming a typical e-commerce conversion curve
  const mu = currentPrice * 1.2; // Mean price sensitivity
  const sigma = currentPrice * 0.3; // Standard deviation
  
  // Generate chart data
  const chartData = generateChartData(
    mu,
    sigma,
    totalCost,
    monthlyTraffic,
    minPrice,
    maxPrice,
    costPerItem,
    shippingFee,
    transactionFeePercent
  );
  
  // Find optimal price based on OEC
  let optimalPoint = chartData[0];
  for (const point of chartData) {
    if (oec === 'profit' && point.profit > optimalPoint.profit) {
      optimalPoint = point;
    } else if (oec === 'revenue' && point.revenue > optimalPoint.revenue) {
      optimalPoint = point;
    } else if (oec === 'conversion' && point.conversionRate > optimalPoint.conversionRate) {
      optimalPoint = point;
    }
  }
  
  // Create comparison data
  const currentPoint = chartData.find(p => Math.abs(p.price - currentPrice) < 0.01) || {
    price: currentPrice,
    conversionRate: normCDF(currentPrice, mu, sigma) * 100,
    revenue: 0,
    profit: 0
  };
  
  // Calculate metrics for current price if not found
  if (currentPoint.revenue === 0) {
    const convRate = normCDF(currentPrice, mu, sigma);
    const conversions = monthlyTraffic * convRate;
    currentPoint.revenue = conversions * currentPrice;
    currentPoint.profit = conversions * (currentPrice - totalCost);
    currentPoint.conversionRate = convRate * 100;
  }
  
  const comparison: ComparisonData = {
    priceA: {
      price: currentPrice,
      conversionRate: currentPoint.conversionRate,
      revenue: currentPoint.revenue,
      profit: currentPoint.profit
    },
    priceB: {
      price: optimalPoint.price,
      conversionRate: optimalPoint.conversionRate,
      revenue: optimalPoint.revenue,
      profit: optimalPoint.profit
    },
    chartData: chartData
  };
  
  return {
    comparison,
    optimalPrice: optimalPoint.price
  };
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
  transactionFeePercent: number = 0,
  actualConversionRate?: number,
  gmv?: number,
  originalPrice?: number,
  targetConversionRate?: number
): EnhancedChartData {
  const chartData = generateChartData(mu, sigma, cost, traffic, minPrice, maxPrice, cogs, shippingFee, transactionFeePercent, actualConversionRate, gmv, originalPrice);
  
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
      
      if (targetConversionRate && targetConversionRate > 0) {
        // Find the price point closest to the target conversion rate
        optimalPoint = chartData.reduce((closest, current) => {
          const closestDiff = Math.abs(closest.conversionRate - targetConversionRate);
          const currentDiff = Math.abs(current.conversionRate - targetConversionRate);
          return currentDiff < closestDiff ? current : closest;
        });
      } else {
        // Original logic: find the point with highest conversion rate
        // but with a reasonable minimum price constraint to avoid $1 optimization
        const minReasonablePrice = Math.max(minPrice, cost * 1.5); // At least 50% margin
        const reasonablePricePoints = chartData.filter(point => point.price >= minReasonablePrice);
        
        if (reasonablePricePoints.length > 0) {
          optimalPoint = reasonablePricePoints.reduce((max, current) => 
            current.conversionRate > max.conversionRate ? current : max
          );
        } else {
          // Fallback to original logic if no reasonable price points
          optimalPoint = chartData.reduce((max, current) => 
            current.conversionRate > max.conversionRate ? current : max
          );
        }
      }
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
  transactionFeePercent: number = 0,
  actualConversionRate?: number,
  gmv?: number
): ComparisonData {
  const chartData = generateChartData(mu, sigma, cost, traffic, minPrice, maxPrice, cogs, shippingFee, transactionFeePercent, actualConversionRate, gmv, priceA);
  
  const calculatePoint = (price: number): ComparisonPoint => {
    let convRate: number;
    
    if (actualConversionRate !== undefined && priceA !== undefined) {
      // Calculate conversion rate based on price percentage change from priceA
      const priceChangePercent = ((price - priceA) / priceA) * 100;
      const theoreticalOriginal = normCDF(0, 0, sigma); // Base conversion at 0% change
      const theoreticalNew = normCDF(-priceChangePercent, 0, sigma); // Negative because higher price = lower conversion
      const conversionMultiplier = theoreticalOriginal > 0 ? theoreticalNew / theoreticalOriginal : 1;
      convRate = (actualConversionRate / 100) * conversionMultiplier;
    } else {
      // Use pure theoretical model with percentage change from mu (reference price)
      const priceChangePercent = ((price - mu) / mu) * 100;
      convRate = normCDF(-priceChangePercent, 0, sigma); // Negative because higher price = lower conversion
    }
    
    const transactionFee = price * (transactionFeePercent / 100);
    const totalCost = (cogs || cost) + shippingFee + transactionFee;
    const revenue = price * traffic * convRate;
    const profit = (price - totalCost) * traffic * convRate;
    
    return {
      price,
      conversionRate: convRate * 100,
      revenue,
      profit,
    };
  };

  return {
    priceA: calculatePoint(priceA),
    priceB: calculatePoint(priceB),
    chartData,
  };
}