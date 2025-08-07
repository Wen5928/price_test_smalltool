# 🧠 Business Analytics Module - Development TODO

## 📋 專案概述
新增商業分析層模組化架構，將商業邏輯與數學模擬計算分離，提供更深入的業務洞察功能。

## 🎯 目標
1. **架構分離**: 將商業分析邏輯從 `utils/math.ts` 中獨立出來
2. **模組化設計**: 創建可重用的商業分析引擎
3. **功能擴展**: 支援多產品分析和異常檢測
4. **業務洞察**: 提供更深層的獲利分析

---

## 📁 新增目錄結構

```
src/
├── analytics/                     # 🆕 商業分析模組
│   ├── index.ts                  # 模組匯出入口
│   ├── types.ts                  # 商業分析相關型別定義
│   ├── core/                     # 核心分析引擎
│   │   ├── BusinessAnalyticsEngine.ts  # 主要分析引擎
│   │   └── MetricsCalculator.ts        # 指標計算器
│   ├── metrics/                  # 獲利指標計算
│   │   ├── calculateProfitMetrics.ts   # 獲利指標計算
│   │   ├── calculateUnitEconomics.ts   # 單位經濟學計算
│   │   └── calculateBreakeven.ts       # 損益兩平點計算
│   ├── analysis/                 # 分析功能
│   │   ├── groupByProduct.ts           # 產品分群分析
│   │   ├── detectProfitLeaks.ts        # 獲利漏洞檢測
│   │   └── performanceComparison.ts    # 績效比較分析
│   └── reports/                  # 報告生成
│       ├── generateInsights.ts         # 洞察報告生成
│       └── exportAnalytics.ts          # 分析結果匯出
```

---

## ✅ 開發任務清單

### 🏗️ Phase 1: 基礎架構搭建

#### Task 1.1: 建立基礎目錄和型別定義
- [ ] 建立 `src/analytics/` 目錄結構
- [ ] 建立 `types.ts` 定義商業分析相關型別
- [ ] 建立 `index.ts` 作為模組匯出入口
- [ ] 定義核心介面：`BusinessMetrics`, `ProductAnalysis`, `ProfitAnalysis`

**預估工時**: 2小時

```typescript
// src/analytics/types.ts (預期結構)
export interface BusinessMetrics {
  revenue: number;
  profit: number;
  profitMargin: number;
  breakEvenConversionRate: number;
  costPerAcquisition: number;
  lifetimeValue: number;
}

export interface ProductAnalysis {
  productId: string;
  productName: string;
  currentMetrics: BusinessMetrics;
  optimizedMetrics: BusinessMetrics;
  profitLeaks: ProfitLeak[];
  recommendations: string[];
}

export interface ProfitLeak {
  type: 'high_transaction_fee' | 'low_margin' | 'high_cogs' | 'shipping_cost';
  severity: 'low' | 'medium' | 'high';
  impact: number; // 預估損失金額
  description: string;
  solution: string;
}
```

#### Task 1.2: 建立核心分析引擎
- [ ] 建立 `BusinessAnalyticsEngine.ts`
- [ ] 建立 `MetricsCalculator.ts`
- [ ] 定義分析引擎的主要介面和方法

**預估工時**: 3小時

---

### 🧮 Phase 2: 獲利指標計算模組

#### Task 2.1: calculateProfitMetrics.ts
- [ ] **功能**: 輸入 GMV、交易費用、轉換率，計算獲利指標
- [ ] **輸出**: 每單成本、利潤率、Break-even conversion rate

```typescript
// 預期功能簽名
interface ProfitMetricsInput {
  gmv: number;
  transactionFeePercent: number;
  conversionRate: number;
  traffic: number;
  cogs: number;
  shippingFee: number;
  price: number;
}

interface ProfitMetricsOutput {
  costPerOrder: number;           // 每單成本
  profitMargin: number;           // 利潤率 (%)
  breakEvenConversionRate: number; // 損益兩平轉換率
  netProfitPerOrder: number;      // 每單淨利
  totalProfit: number;            // 總利潤
  profitability: 'profitable' | 'break_even' | 'loss_making';
}

export function calculateProfitMetrics(input: ProfitMetricsInput): ProfitMetricsOutput
```

**實作重點**:
- [ ] 成本結構分析 (COGS + 運費 + 交易手續費)
- [ ] 利潤率計算公式
- [ ] Break-even 轉換率計算
- [ ] 單位經濟學指標

**預估工時**: 4小時

#### Task 2.2: calculateUnitEconomics.ts
- [ ] **功能**: 單位經濟學深度分析
- [ ] **指標**: LTV, CAC, Payback Period, Unit Contribution Margin

```typescript
interface UnitEconomicsOutput {
  customerLifetimeValue: number;    // 客戶終身價值
  customerAcquisitionCost: number;  // 客戶獲取成本
  paybackPeriod: number;            // 回本週期 (月)
  unitContributionMargin: number;   // 單位貢獻毛利
  ltv_cac_ratio: number;           // LTV/CAC 比率
}
```

**預估工時**: 3小時

#### Task 2.3: calculateBreakeven.ts
- [ ] **功能**: 多維度損益兩平分析
- [ ] **分析**: 價格、轉換率、流量的損益兩平點

**預估工時**: 2小時

---

### 📊 Phase 3: 分析功能模組

#### Task 3.1: groupByProduct.ts
- [ ] **功能**: 多產品分群比較分析
- [ ] **分群邏輯**: 
  - 依價格區間分群 (低價 < $50, 中價 $50-200, 高價 > $200)
  - 依獲利率分群 (高利潤 > 30%, 中利潤 10-30%, 低利潤 < 10%)
  - 依轉換率分群

```typescript
interface ProductGroup {
  groupId: string;
  groupName: string;
  groupType: 'price_range' | 'profit_margin' | 'conversion_rate';
  products: ProductAnalysis[];
  groupMetrics: {
    averagePrice: number;
    averageProfitMargin: number;
    averageConversionRate: number;
    totalRevenue: number;
    totalProfit: number;
  };
  recommendations: string[];
}

export function groupByProduct(products: ProductData[], groupBy: 'price' | 'profit' | 'conversion'): ProductGroup[]
```

**實作重點**:
- [ ] 動態分群算法
- [ ] 群組績效比較
- [ ] 群組層級的優化建議

**預估工時**: 4小時

#### Task 3.2: detectProfitLeaks.ts
- [ ] **功能**: 自動檢測獲利漏洞
- [ ] **檢測項目**:
  - 轉換高但利潤低的產品
  - 手續費占比異常的產品 (> 5% of price)
  - COGS 占比過高的產品 (> 70% of price)
  - 運費成本異常的產品

```typescript
interface ProfitLeakDetection {
  productId: string;
  leakType: ProfitLeakType;
  currentValue: number;
  benchmarkValue: number;
  potentialSaving: number;
  urgencyLevel: 'low' | 'medium' | 'high' | 'critical';
  actionItems: ActionItem[];
}

export function detectProfitLeaks(products: ProductAnalysis[]): ProfitLeakDetection[]
```

**檢測邏輯**:
- [ ] **高轉換低利潤**: `conversionRate > 平均值 && profitMargin < 平均值`
- [ ] **異常手續費**: `transactionFee / price > 0.05`
- [ ] **高成本比**: `cogs / price > 0.7`
- [ ] **運費異常**: `shippingFee > price * 0.15`

**預估工時**: 5小時

#### Task 3.3: performanceComparison.ts
- [ ] **功能**: 績效比較分析
- [ ] **比較維度**: 同類產品、歷史績效、行業基準

**預估工時**: 3小時

---

### 📈 Phase 4: 報告生成模組

#### Task 4.1: generateInsights.ts
- [ ] **功能**: 自動生成商業洞察報告
- [ ] **內容**: 關鍵發現、改進建議、風險警示

```typescript
interface BusinessInsight {
  type: 'opportunity' | 'risk' | 'recommendation';
  title: string;
  description: string;
  impact: {
    revenueImpact: number;
    profitImpact: number;
    conversionImpact: number;
  };
  actionPlan: string[];
  priority: 'low' | 'medium' | 'high';
}

export function generateInsights(analysis: ProductAnalysis[]): BusinessInsight[]
```

**預估工時**: 4小時

#### Task 4.2: exportAnalytics.ts
- [ ] **功能**: 分析結果匯出 (CSV, JSON)
- [ ] **格式**: 支援多種匯出格式

**預估工時**: 2小時

---

### 🔗 Phase 5: 整合現有系統

#### Task 5.1: 重構現有組件
- [ ] **CsvUploader.tsx**: 整合多產品分析功能
- [ ] **OptimalPriceConclusion.tsx**: 加入獲利漏洞警示
- [ ] **新增組件**: `BusinessInsightPanel.tsx` 顯示商業洞察

**預估工時**: 6小時

#### Task 5.2: 修改主頁面邏輯
- [ ] **page.tsx**: 整合新的分析引擎
- [ ] 新增商業分析相關的狀態管理
- [ ] 整合多產品選擇功能

**預估工時**: 4小時

#### Task 5.3: 新增分析報告頁面
- [ ] 建立新的報告展示區域
- [ ] 整合獲利漏洞檢測結果
- [ ] 整合產品分群比較

**預估工時**: 5小時

---

### 🧪 Phase 6: 測試和優化

#### Task 6.1: 單元測試
- [ ] 為所有分析函數撰寫單元測試
- [ ] 測試邊界條件和錯誤處理

**預估工時**: 6小時

#### Task 6.2: 整合測試
- [ ] 測試完整的分析流程
- [ ] 測試多產品上傳和分析

**預估工時**: 4小時

#### Task 6.3: 效能優化
- [ ] 大量產品資料的處理優化
- [ ] 分析計算的快取機制

**預估工時**: 3小時

---

## 📊 新增 UI 組件需求

### BusinessInsightPanel.tsx
```typescript
interface BusinessInsightPanelProps {
  insights: BusinessInsight[];
  profitLeaks: ProfitLeakDetection[];
  isLoading?: boolean;
}
```

### ProductGroupComparison.tsx
```typescript
interface ProductGroupComparisonProps {
  groups: ProductGroup[];
  selectedGroup?: string;
  onGroupSelect: (groupId: string) => void;
}
```

### ProfitLeakAlert.tsx
```typescript
interface ProfitLeakAlertProps {
  leaks: ProfitLeakDetection[];
  severity: 'all' | 'high' | 'critical';
  onActionClick: (leak: ProfitLeakDetection) => void;
}
```

---

## 🎯 預期效益

### 1. **商業價值**
- ✅ 自動檢測獲利漏洞，直接影響底線
- ✅ 多產品比較分析，優化產品組合
- ✅ 深度獲利指標，支援精準決策

### 2. **技術價值**
- ✅ 模組化架構，便於維護和擴展
- ✅ 業務邏輯與數學計算分離
- ✅ 可重用的分析引擎

### 3. **使用者體驗**
- ✅ 自動化洞察，減少手動分析工作
- ✅ 清晰的改進建議和行動方案
- ✅ 多產品批次分析能力

---

## ⏰ 總預估工時

| Phase | 任務數 | 預估工時 | 優先級 |
|-------|--------|----------|--------|
| Phase 1: 基礎架構 | 2 | 5小時 | 🔴 高 |
| Phase 2: 獲利指標 | 3 | 9小時 | 🔴 高 |
| Phase 3: 分析功能 | 3 | 12小時 | 🟡 中 |
| Phase 4: 報告生成 | 2 | 6小時 | 🟡 中 |
| Phase 5: 系統整合 | 3 | 15小時 | 🔴 高 |
| Phase 6: 測試優化 | 3 | 13小時 | 🟢 低 |

**總計**: 60小時 (約 7-8 個工作天)

---

## 🚀 實施建議

### 階段性開發
1. **第一階段** (Phase 1-2): 建立基礎架構和核心獲利計算
2. **第二階段** (Phase 3-4): 實作分析功能和報告生成
3. **第三階段** (Phase 5-6): 系統整合和測試優化

### 關鍵里程碑
- [ ] **Week 1**: 完成基礎架構和獲利指標計算
- [ ] **Week 2**: 完成分析功能和報告生成
- [ ] **Week 3**: 完成系統整合和 UI 組件
- [ ] **Week 4**: 完成測試和優化

---

## 🤔 需要確認的問題

1. **多產品支援範圍**: 單次上傳支援多少產品？是否需要分頁或虛擬化？
2. **報告匯出格式**: 除了 CSV/JSON，是否需要支援 Excel 或 PDF？
3. **警示閾值設定**: 獲利漏洞的警示標準是否需要可調整？
4. **歷史資料**: 是否需要支援歷史分析資料的儲存？
5. **行業基準**: 是否需要內建不同行業的基準資料？

---

**📝 備註**: 此 TODO 清單可根據實際需求調整優先順序和細節，建議先從 Phase 1-2 開始實作，驗證架構設計後再進行後續開發。