# 📚 濃縮文檔 - A/B價格測試工具

## 🎯 項目概覽

**A/B價格測試工具** - 幫助電商優化定價策略的智能分析平台

- **Live Demo**: https://price-test-smalltool.vercel.app/
- **技術棧**: Next.js 15 + TypeScript + Tailwind CSS
- **核心功能**: 價格優化分析、CSV批量處理、互動式圖表

---

## 🏗️ 技術架構

### 核心技術
```
Frontend: Next.js 15 (App Router) + React 19
Language: TypeScript 5  
Styling: Tailwind CSS 4.1.11
Charts: Recharts 3.1.0
Data: Papa Parse (CSV處理)
```

### 項目結構
```
src/
├── app/                 # Next.js App Router
│   ├── page.tsx        # 主頁面 (狀態管理中心)
│   ├── analysis/       # 分析頁面
│   └── globals.css     # 全域樣式 + ABC色彩系統
├── components/         # React組件
│   ├── CsvUploader.tsx          # CSV上傳處理
│   ├── InteractivePriceChart.tsx # 互動價格圖表
│   ├── ComparisonTable.tsx      # 價格比較表
│   └── OecSelector.tsx          # 優化目標選擇
└── utils/
    └── math.ts         # 數學計算核心
```

---

## 📊 核心功能

### 1. 優化評估準則 (OECs)

| OEC | 目標 | 公式 | 適用場景 |
|-----|------|------|----------|
| **Revenue** | 最大化營收 | `Price × Traffic × ConversionRate` | 市場占有率導向 |
| **Profit** | 最大化利潤 | `(Price - TotalCost) × Traffic × ConversionRate` | 獲利能力導向 |
| **Conversion** | 最大化轉換率 | `normCDF(μ - Price, 0, σ)` | 客戶獲取導向 |

### 2. 數學模型

**轉換率計算**: 基於正態累積分佈函數
```typescript
conversionRate = normCDF(μ - price, 0, σ)
// μ: 心理價位中心
// σ: 價格敏感度  
// 低價格 → 高轉換率，高價格 → 低轉換率
```

**成本結構**: 
```
TotalCost = COGS + ShippingFee + (Price × TransactionFee%)
```

### 3. 數據處理模式

**手動輸入模式**: 理論模型計算
**CSV上傳模式**: 實際數據 + 理論調校
```typescript
adjustedRate = actualRate × (theoretical_new / theoretical_original)
```

---

## 🎨 設計系統

### ABC色彩系統
```css
:root {
  /* Primary Colors */
  --abc-blue: #3B82F6;      /* 主品牌色 */
  --abc-green: #10B981;     /* 成功/利潤 */
  --abc-red: #EF4444;       /* 警告/最佳價格 */
  
  /* Backgrounds */
  --abc-bg-primary: #111827;   /* 深色背景 */
  --abc-bg-secondary: #1F2937; /* 卡片背景 */
  
  /* Interactive */
  --abc-hover: #374151;     /* 懸停效果 */
}
```

### 組件規範
- **響應式設計**: 375px / 768px / 1440px 斷點
- **無障礙標準**: WCAG AA 合規
- **主題切換**: CSS變量實現深色/淺色主題

---

## 🔧 開發流程

### 快速開始
```bash
npm install          # 安裝依賴
npm run dev         # 開發服務器 (port 3000)
npm run build       # 生產構建
npm run lint        # 代碼檢查
```

### 測試流程
1. **手動模式**: 輸入產品資料 → 調整參數 → 查看分析
2. **CSV模式**: 上傳產品文件 → 選擇產品 → 分析對比
3. **驗證點**: 轉換率邏輯、利潤計算、OEC選擇

### 部署
- **平台**: Vercel (自動部署)
- **環境變數**: 如需AI功能需配置 `OPENAI_API_KEY`

---

## 📈 功能詳解

### 1. 互動式價格圖表
- **雙滑桿控制**: 原始價格 + 新價格
- **實時計算**: 價格變動即時顯示影響
- **視覺化**: 長條圖比較轉換率/利潤/營收
- **最佳價格標記**: 紅色線標示最佳點

### 2. CSV數據處理
```typescript
interface ProductVariant {
  title: string;           // 產品名稱
  price: number;          // 當前價格
  costPerItem: number;    // 成本
  category: string;       // 類別
  vendor: string;        // 供應商
  requiresShipping: boolean; // 需要運費
}
```

### 3. 價格比較分析
- **A/B對比**: 原始價格 vs 新價格
- **關鍵指標**: 轉換率、利潤、營收變化
- **百分比影響**: 顯示相對改善幅度

---

## 🚀 最新更新

### 已修復問題
- ✅ OEC類型匹配錯誤 (添加 conversion 支持)
- ✅ 成本計算重複問題 (math.ts 修復)
- ✅ TypeScript 類型錯誤
- ✅ 滑桿範圍動態調整

### 開發中功能
- 🔄 AI智能定價分析
- 🔄 批量產品優化建議
- 🔄 競爭對手價格比較

---

## 🎛️ 配置選項

### 環境變數 (.env)
```bash
# AI分析功能 (可選)
OPENAI_API_KEY=your_key_here
OPENAI_MODEL=gpt-4o-mini

# 默認參數
DEFAULT_PROFIT_MARGIN=0.3
DEFAULT_CONVERSION_RATE=0.02
MIN_PROFIT_MARGIN=0.1
```

### 核心參數
```typescript
// 價格彈性參數
mu: 客戶心理價位 (建議: 當前價格 × 1.2)
sigma: 價格敏感度 (建議: 當前價格 × 0.3)

// 成本參數  
shippingFee: 運費
transactionFeePercent: 交易手續費百分比
monthlyTraffic: 月流量
```

---

## 📋 使用指南

### 基本流程
1. **選擇輸入模式**: 手動輸入 或 CSV上傳
2. **設定產品資料**: 價格、成本、流量等參數
3. **選擇優化目標**: Revenue / Profit / Conversion
4. **分析結果**: 查看最佳價格建議和影響評估
5. **調整測試**: 使用滑桿探索不同價格點

### 最佳實踐
- **利潤率**: 建議保持在 20-40% 之間
- **價格測試**: 避免超過 ±20% 的大幅調整
- **數據驗證**: CSV上傳後檢查數據完整性
- **A/B測試**: 根據建議進行實際市場測試

---

## 🔍 故障排除

### 常見問題
1. **計算結果異常**: 檢查成本設定和流量參數
2. **CSV上傳失敗**: 確認文件格式和必要欄位
3. **圖表不顯示**: 檢查價格範圍設定
4. **AI分析錯誤**: 確認 API 金鑰配置

### 技術支援
- **文檔**: 參考完整技術文檔
- **測試**: 使用內建測試數據驗證
- **日誌**: 檢查瀏覽器控制台錯誤訊息

---

**維護團隊**: ABConvert Development Team  
**最後更新**: 2025-01-22