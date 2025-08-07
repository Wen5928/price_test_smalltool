# Optimal Price Analysis and OECs Documentation

## 概述 (Overview)

本文件詳細說明價格測試工具中的最佳價格分析（Optimal Price Analysis）和優化評估準則（OECs - Optimization Evaluation Criteria）的計算邏輯和實作方法。

## 核心概念 (Core Concepts)

### 1. OECs (Optimization Evaluation Criteria) - 優化評估準則

系統提供三種不同的優化目標：

#### A. Maximize Revenue (最大化營收)
- **目標**: 尋找能產生最高總營收的價格點
- **計算公式**: `Revenue = Price × Traffic × Conversion Rate`
- **適用場景**: 當企業主要關注市場占有率和總銷售額時

#### B. Maximize Profit (最大化利潤) 
- **目標**: 尋找能產生最高淨利潤的價格點
- **計算公式**: `Profit = (Price - Total Cost) × Traffic × Conversion Rate`
- **成本結構**: 
  - 基本成本 (COGS)
  - 運費 (Shipping Fee)
  - 交易手續費 (Transaction Fee = Price × Transaction Fee %)
- **適用場景**: 當企業關注獲利能力和投資回報時

#### C. Maximize Conversion Rate (最大化轉換率)
- **目標**: 尋找能達到最高轉換率的價格點
- **計算公式**: `Conversion Rate = normCDF(μ - Price, 0, σ)`
- **適用場景**: 當企業希望最大化客戶獲取或建立市場基礎時

## 數學模型 (Mathematical Model)

### 1. 轉換率計算基礎

系統使用**正態累積分布函數 (Normal Cumulative Distribution Function)** 來模擬價格與轉換率的關係：

```javascript
conversionRate = normCDF(μ - price, 0, σ)
```

**參數說明:**
- `μ (mu)`: 顧客價值感知的平均值（心理價位中心）
- `σ (sigma)`: 顧客價值感知的標準差（價格敏感度）
- `price`: 產品售價

**理論基礎:**
- 當價格 < μ 時，轉換率較高（價格低於心理價位）
- 當價格 > μ 時，轉換率較低（價格高於心理價位）
- σ 值越小，顧客對價格越敏感（轉換率曲線越陡峭）

### 2. 實際資料調校模式

當使用 CSV 上傳實際銷售資料時，系統會結合理論模型與實際數據：

```javascript
// 計算基準轉換率
baseConversionRate = actualConversionRate / 100

// 計算價格彈性係數
theoreticalOriginal = normCDF(μ - originalPrice, 0, σ)
theoreticalNew = normCDF(μ - newPrice, 0, σ)
conversionMultiplier = theoreticalNew / theoreticalOriginal

// 調校後的轉換率
adjustedConversionRate = baseConversionRate × conversionMultiplier
```

## 最佳價格計算流程 (Optimal Price Calculation Process)

### 1. 資料生成階段

```javascript
function generateEnhancedChartData(parameters) {
    // 1. 生成價格區間內所有價格點的數據
    const chartData = generateChartData(parameters);
    
    // 2. 根據選定的 OEC 尋找最佳點
    let optimalPoint;
    switch (oec) {
        case 'revenue':
            optimalPoint = chartData.reduce((max, current) => 
                current.revenue > max.revenue ? current : max
            );
            break;
        case 'profit':
            optimalPoint = chartData.reduce((max, current) => 
                current.profit > max.profit ? current : max
            );
            break;
        case 'conversion':
            optimalPoint = chartData.reduce((max, current) => 
                current.conversionRate > max.conversionRate ? current : max
            );
            break;
    }
    
    return { chartData, optimalPrice: optimalPoint };
}
```

### 2. 價格區間動態調整

系統會自動確保最佳價格在可視範圍內：

```javascript
// 如果最大價格 ≤ 最佳價格，自動調整為最佳價格 + 1
useEffect(() => {
    if (enhancedData.optimalPrice && maxPrice <= enhancedData.optimalPrice.price) {
        setMaxPrice(Math.round(enhancedData.optimalPrice.price) + 1);
    }
}, [enhancedData.optimalPrice, maxPrice]);
```

## 計算範例 (Calculation Example)

假設有以下參數：
- μ = 30 (顧客心理價位)
- σ = 10 (價格敏感度)
- Traffic = 1000 (流量)
- COGS = 15 (商品成本)
- 價格區間: $20 - $40

### 針對價格 $25 的計算:

1. **轉換率計算:**
   ```
   conversionRate = normCDF(30 - 25, 0, 10) = normCDF(5, 0, 10) ≈ 69.15%
   ```

2. **營收計算:**
   ```
   revenue = 25 × 1000 × 0.6915 = $17,287.50
   ```

3. **利潤計算:**
   ```
   profit = (25 - 15) × 1000 × 0.6915 = $6,915.00
   ```

### OEC 比較結果:

| 價格 | 轉換率 | 營收 | 利潤 | 最佳化目標 |
|------|--------|------|------|------------|
| $20  | 84.13% | $16,826 | $4,207 | 最大轉換率 ✓ |
| $25  | 69.15% | $17,288 | $6,915 | - |
| $30  | 50.00% | $15,000 | $7,500 | 最大利潤 ✓ |
| $35  | 30.85% | $10,798 | $6,177 | - |
| $28  | 57.93% | $16,220 | $7,532 | 最大營收 ✓ |

## 使用建議 (Usage Recommendations)

### 1. 選擇適合的 OEC

- **新產品上市**: 建議使用 "Maximize Conversion Rate" 來建立市場基礎
- **成熟產品**: 建議使用 "Maximize Profit" 來優化獲利
- **促銷活動**: 建議使用 "Maximize Revenue" 來衝刺業績

### 2. 參數調整原則

- **μ (心理價位)**: 可通過市場調研或競品分析來估算
- **σ (價格敏感度)**: 奢侈品通常較低(5-8)，必需品較高(10-15)
- **成本結構**: 務必包含所有相關成本以確保利潤計算準確

### 3. 結果解讀

- 最佳價格只是模型預測，實際執行時建議進行 A/B 測試驗證
- 不同 OEC 可能產生不同的最佳價格，需根據商業目標選擇
- 考量市場競爭、品牌定位等模型外因素

## 技術實作細節 (Technical Implementation)

### 誤差函數實作

```javascript
function erf(x) {
    // Abramowitz and Stegun approximation
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
```

### 正態累積分布函數

```javascript
function normCDF(x, mean, std) {
    return 0.5 * (1 + erf((x - mean) / (std * Math.sqrt(2))));
}
```

## 限制與注意事項 (Limitations & Considerations)

1. **模型假設**: 基於正態分布假設，實際市場行為可能更複雜
2. **外部因素**: 未考慮競爭、季節性、品牌效應等因素
3. **資料品質**: CSV 模式下的結果取決於輸入資料的準確性
4. **價格區間**: 建議設定合理的價格範圍以獲得有意義的結果

---

*此文件基於 Price Test Easy Tool v1.0 的實作邏輯整理，如有疑問請參考原始程式碼。*