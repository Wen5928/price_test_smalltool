# 🧮 數學模型

## 核心數學公式

### 1. 轉換率計算
```typescript
// 基於正態累積分佈函數
conversionRate = normCDF(μ - price, 0, σ)

// 參數說明:
μ (mu): 客戶心理價位中心 (建議: 當前價格 × 1.2)
σ (sigma): 價格敏感度 (建議: 當前價格 × 0.3)
price: 測試價格點
```

**理論基礎**: 
- 價格 < μ → 轉換率高 (物超所值)
- 價格 > μ → 轉換率低 (價格過高)
- σ 越小 → 價格敏感度越高

### 2. OEC 計算公式

| OEC | 公式 | 說明 |
|-----|------|------|
| **Revenue** | `Price × Traffic × ConversionRate` | 總營收最大化 |
| **Profit** | `(Price - TotalCost) × Traffic × ConversionRate` | 淨利潤最大化 |
| **Conversion** | `max(ConversionRate)` | 轉換率最大化 |

### 3. 成本結構
```typescript
TotalCost = COGS + ShippingFee + TransactionFee
TransactionFee = Price × TransactionFeePercent

// 實際計算
const totalCost = costPerItem + shippingFee + (price * transactionFeePercent / 100);
const profit = (price - totalCost) * traffic * conversionRate;
```

## 數據模式

### 1. 理論模式 (手動輸入)
```typescript
function generateChartData(mu, sigma, cost, traffic, minPrice, maxPrice) {
  const result = [];
  for (let price = minPrice; price <= maxPrice; price++) {
    const convRate = normCDF(mu - price, 0, sigma);
    const revenue = price * traffic * convRate;
    const profit = (price - cost) * traffic * convRate;
    result.push({ price, conversionRate: convRate * 100, revenue, profit });
  }
  return result;
}
```

### 2. 調校模式 (CSV數據)
```typescript
// 結合實際數據校準理論模型
if (actualConversionRate && originalPrice) {
  const baseConversionRate = actualConversionRate / 100;
  const priceChangePercent = ((price - originalPrice) / originalPrice) * 100;
  const theoreticalOriginal = normCDF(0, 0, sigma);
  const theoreticalNew = normCDF(-priceChangePercent, 0, sigma);
  const conversionMultiplier = theoreticalNew / theoreticalOriginal;
  convRate = baseConversionRate * conversionMultiplier;
}
```

## 最佳化算法

### 1. 最佳價格搜尋
```typescript
function findOptimalPrice(chartData, oec) {
  let optimalPoint = chartData[0];
  for (const point of chartData) {
    switch (oec) {
      case 'profit':
        if (point.profit > optimalPoint.profit) optimalPoint = point;
        break;
      case 'revenue':
        if (point.revenue > optimalPoint.revenue) optimalPoint = point;
        break;
      case 'conversion':
        if (point.conversionRate > optimalPoint.conversionRate) optimalPoint = point;
        break;
    }
  }
  return optimalPoint;
}
```

### 2. 價格範圍計算
```typescript
// 動態價格範圍
const minPrice = Math.max(totalCost * 1.1, currentPrice * 0.5);
const maxPrice = optimalPrice ? 
  Math.max(currentPrice * 2, optimalPrice * 1.2) : 
  currentPrice * 2;
```

## 誤差函數實現

```typescript
// 高精度誤差函數 (用於正態分佈計算)
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
  const y = 1 - (((((a5 * t + a4) * t + a3) * t + a2) * t + a1) * t) * Math.exp(-x * x);
  return sign * y;
}

// 正態累積分佈函數
export function normCDF(x: number, mean: number, std: number): number {
  return 0.5 * (1 + erf((x - mean) / (std * Math.sqrt(2))));
}
```

## 性能優化

### 1. 大範圍處理
```typescript
// 處理極大價格範圍時使用採樣
if (priceRange > 10000) {
  const sampleStep = Math.ceil(priceRange / 1000);
  for (let price = minPrice; price <= maxPrice; price += sampleStep) {
    // 計算邏輯
  }
}
```

### 2. 數值穩定性
```typescript
// 避免極小轉換率造成的數值問題
const convRate = Math.max(0.01, normCDF(/* ... */));
const safeTraffic = Math.max(traffic, 1);
```

## 模型限制與假設

### 假設條件
1. **客戶行為**: 遵循正態分佈價格敏感度
2. **市場穩定**: 不考慮外部市場變動
3. **競爭環境**: 假設競爭對手價格不變
4. **成本固定**: 短期內成本結構穩定

### 模型限制
1. **歷史依賴**: 缺乏歷史數據時準確度降低
2. **市場假設**: 不適用於全新產品或市場
3. **外部因素**: 未考慮季節性、促銷等影響
4. **非線性效應**: 極端價格變動可能偏離模型預測