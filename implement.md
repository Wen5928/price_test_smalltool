# Implementation Plan: Price Comparison Feature

## 需求理解

### 核心功能
1. **兩種價格比較**: 在現有頁面上方新增能讓使用者輸入兩個不同價格點進行比較
2. **動態解釋文案**: 在頁面下方自動生成基於圖表數據的敘述性文字，解釋為什麼需要A/B testing

### 具體實現目標
- 使用者可以設定 Price A 和 Price B 進行對比
- 圖表顯示兩條線，分別代表兩個價格的表現
- 下方文案自動分析兩個價格的差異，包括:
  - 轉換率差異
  - 收益差異  
  - 利潤差異
  - A/B test的重要性說明

## 技術實現計劃

### 1. 更新 InputPanel.tsx
- 新增 Price A 和 Price B 輸入欄位
- 保留 minPrice/maxPrice 作為分布邊界值
- 保持其他參數 (μ, σ, cost, traffic) 不變

### 2. 更新 math.ts
- 新增 `generateComparisonData()` 函數
- 為兩個特定價格點計算數據
- 返回包含兩個價格點完整數據的結構

### 3. 更新 ResultChart.tsx  
- 修改為顯示兩個價格點的垂直線標記
- 在原有曲線上突出顯示 Price A 和 Price B 的位置
- 新增圖例說明兩個價格點
- **新增功能**:
  - 價格區間高亮：A與B之間的區域用漸層背景色區隔
  - 下方比較條形圖：橫向bar顯示Profit/Revenue/Conversion對比

### 4. 新增 ExplanationText.tsx
- 接收兩個價格點的計算結果
- 動態生成解釋性文字
- 包含 A/B testing 重要性的教育內容

### 5. 更新 page.tsx
- 管理 priceA 和 priceB 狀態
- 整合新的組件和數據流
- 在下方新增解釋文案區塊

## 數據結構

```typescript
interface ComparisonData {
  priceA: {
    price: number;
    conversionRate: number;
    revenue: number;
    profit: number;
  };
  priceB: {
    price: number;
    conversionRate: number;
    revenue: number;
    profit: number;
  };
  chartData: ChartPoint[]; // 原有的曲線數據，用於背景顯示
}
```

## 文案內容結構

1. **數據對比摘要**: "價格 A ($X) vs 價格 B ($Y)"
2. **轉換率分析**: "價格 A 的轉換率為 X%，價格 B 為 Y%，相差 Z%"
3. **收益影響**: "選擇價格 A 可獲得 $X 收益，價格 B 可獲得 $Y 收益"
4. **利潤分析**: "利潤差異為 $X，相當於 Y% 的提升/下降"
5. **A/B testing 價值**: "透過實際 A/B testing，您可以驗證這些預測並找到最佳價格點"

## 確認要點

請確認我的理解是否正確：

1. ✅ 使用者輸入兩個特定價格進行比較，而不是價格範圍
2. ✅ 圖表仍顯示完整曲線，但突出顯示兩個比較點
3. ✅ 下方新增區塊自動生成解釋性文字
4. ✅ 文案重點說明 A/B testing 的重要性和價值
5. ✅ 保持現有的數學模型和參數設定

如果理解正確，我將開始實現這些功能。