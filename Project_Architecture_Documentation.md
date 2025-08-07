# 📊 Price Test Easy Tool - 專案架構文件

## 🎯 專案概述

Price Test Easy Tool 是一個互動式定價模擬工具，幫助電商商家了解價格變化對轉換率、營收和利潤的影響。基於價格彈性建模來預測客戶行為，展示系統化 A/B 測試的價值。

### 🌐 線上展示
- **Live Demo**: [https://price-test-smalltool.vercel.app/](https://price-test-smalltool.vercel.app/)
- **GitHub**: 目前為私有專案

## 🏗️ 技術架構

### 核心技術棧
- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript 5
- **Styling**: Tailwind CSS 4.1.11
- **Charts**: Recharts 3.1.0
- **CSV Processing**: Papa Parse 5.5.3
- **UI Components**: React 19.1.0

### 開發工具
- **Package Manager**: npm
- **Build Tool**: Next.js built-in
- **Type Checking**: TypeScript
- **Linting**: ESLint (Next.js)
- **CSS**: PostCSS + Tailwind

## 📁 專案結構

```
price_test_smalltool/
├── 📁 public/                     # 靜態資源
│   ├── Logomark color@2x.png     # 品牌標誌
│   ├── favicon.ico               # 網站圖示
│   └── robots.txt                # SEO 設定
│
├── 📁 src/                        # 原始碼
│   ├── 📁 app/                   # Next.js App Router
│   │   ├── globals.css           # 全域樣式
│   │   ├── layout.tsx           # 根佈局組件
│   │   ├── page.tsx             # 主頁面組件
│   │   └── sitemap.ts           # 網站地圖
│   │
│   ├── 📁 components/            # React 組件庫
│   │   ├── ComparisonBarChart.tsx    # 價格比較長條圖
│   │   ├── ComparisonTable.tsx       # 價格比較表格
│   │   ├── CsvUploader.tsx          # CSV 上傳器
│   │   ├── ExplanationText.tsx      # 說明文字
│   │   ├── ExportSummary.tsx        # 匯出摘要 (未使用)
│   │   ├── InputPanel.tsx           # 手動輸入面板
│   │   ├── OecSelector.tsx          # 優化目標選擇器
│   │   ├── OptimalPriceConclusion.tsx # 最佳價格結論
│   │   ├── ResultChart.tsx          # 結果圖表
│   │   └── StructuredData.tsx       # SEO 結構化資料
│   │
│   └── 📁 utils/                 # 工具函數
│       └── math.ts              # 數學計算邏輯
│
├── 📁 Illustrate_Doc/            # 說明文件
│   ├── Optimal_Price_Analysis_Documentation.md
│   └── Proof of Concept.md
│
├── 📄 Configuration Files        # 設定檔案
│   ├── next.config.ts           # Next.js 設定
│   ├── tailwind.config.ts       # Tailwind CSS 設定
│   ├── tsconfig.json           # TypeScript 設定
│   ├── postcss.config.mjs      # PostCSS 設定
│   └── package.json            # 專案依賴
│
├── 📄 README.md                 # 專案說明
└── 📄 products_export_1.csv     # 測試資料範例
```

## 🔧 組件架構

### 🎛️ 核心組件 (Core Components)

#### 1. **page.tsx** - 主應用程式
- **功能**: 主要的狀態管理和組件協調
- **狀態管理**: 使用 React hooks 管理 15+ 個狀態變數
- **關鍵功能**:
  - 雙輸入模式切換 (Manual/CSV)
  - 價格區間自動調整
  - 最佳價格計算觸發

```typescript
// 主要狀態
const [mu, setMu] = useState(30);           // 心理價位中心
const [sigma, setSigma] = useState(10);     // 價格敏感度
const [oec, setOec] = useState<OECType>('profit'); // 優化目標
const [inputMode, setInputMode] = useState<'manual' | 'csv'>('csv');
```

#### 2. **ResultChart.tsx** - 互動式圖表
- **功能**: 價格曲線視覺化和互動式價格調整
- **特色**:
  - Recharts 整合
  - 雙價格滑桿
  - 最佳價格標記
  - OEC 選擇器內建

```typescript
interface ResultChartProps {
  data: DataPoint[];
  priceA: number; priceB: number;
  setPriceA: (value: number) => void;
  setPriceB: (value: number) => void;
  optimalPrice?: OptimalPrice;
  oec: OECType; setOec: (value: OECType) => void;
}
```

### 📊 分析組件 (Analytics Components)

#### 3. **OptimalPriceConclusion.tsx** - 最佳價格分析
- **功能**: 顯示最佳價格建議和相關指標
- **展示內容**:
  - 最佳價格數值
  - 預期轉換率/營收/利潤
  - 輸入參數摘要

#### 4. **ComparisonTable.tsx** - 價格比較表
- **功能**: A/B 價格對比的詳細數據表格
- **指標**: 轉換率、營收、利潤、成本結構

#### 5. **ExplanationText.tsx** - 教育內容
- **功能**: 動態生成解說文字
- **內容**: A/B 測試價值、模擬限制、實際測試建議

### 🎨 輸入組件 (Input Components)

#### 6. **InputPanel.tsx** - 手動輸入面板
```typescript
interface InputPanelProps {
  mu: number; setMu: (value: number) => void;        // 心理價位
  sigma: number; setSigma: (value: number) => void;  // 價格敏感度
  cost: number; setCost: (value: number) => void;    // 基本成本
  traffic: number; setTraffic: (value: number) => void; // 流量
  // ... 更多成本參數
}
```

#### 7. **CsvUploader.tsx** - CSV 上傳器
- **功能**: Shopify 產品匯出檔案處理
- **特色**:
  - 拖放上傳
  - 即時資料預覽
  - 產品選擇介面
  - 業務參數設定

```typescript
export interface ProductData {
  handle: string;
  title: string;
  price: number;
  costPerItem: number;
  requiresShipping: boolean;
}
```

#### 8. **OecSelector.tsx** - 優化目標選擇器
```typescript
type OECType = 'revenue' | 'profit' | 'conversion';

// 三種優化目標
- Maximize Revenue (最大化營收)
- Maximize Profit (最大化利潤)
- Maximize Conversion Rate (最大化轉換率)
```

## 🧮 數學計算架構

### 📐 核心數學模型 (`math.ts`)

#### 1. **價格彈性模型**
```typescript
// 正態累積分布函數
function normCDF(x: number, mean: number, std: number): number {
  return 0.5 * (1 + erf((x - mean) / (std * Math.sqrt(2))));
}

// 轉換率計算
conversionRate = normCDF(μ - price, 0, σ)
```

#### 2. **關鍵計算函數**

**a. generateChartData()** - 圖表資料生成
- 輸入: 價格參數、成本結構、流量
- 輸出: 價格區間內每個價格點的轉換率/營收/利潤

**b. generateEnhancedChartData()** - 最佳價格計算
- 根據選定的 OEC 尋找最佳價格點
- 支援三種優化目標

**c. generateComparisonData()** - A/B 比較資料
- 計算兩個特定價格點的詳細指標

#### 3. **成本結構模型**
```typescript
const transactionFee = price * (transactionFeePercent / 100);
const totalCost = (cogs || cost) + shippingFee + transactionFee;
const profit = (price - totalCost) * traffic * conversionRate;
```

## 🎯 業務邏輯流程

### 1. **雙輸入模式架構**

#### Manual Mode (手動模式)
```
用戶輸入 → 理論模型計算 → 結果展示
    ↓
心理價位 (μ) + 價格敏感度 (σ) + 成本 + 流量
    ↓
正態分布模型 → 轉換率曲線 → 最佳價格
```

#### CSV Mode (CSV 模式)
```
CSV 上傳 → 產品選擇 → 實際資料校正 → 結果展示
    ↓
實際轉換率 + 價格彈性 → 調校模型 → 預測分析
```

### 2. **最佳價格計算流程**
```
1. 生成價格區間內所有數據點
   ↓
2. 根據 OEC 選擇優化目標
   ├── Revenue: max(price × traffic × conversionRate)
   ├── Profit: max((price - cost) × traffic × conversionRate)
   └── Conversion: max(conversionRate)
   ↓
3. 找出最佳價格點
   ↓
4. 動態調整價格區間 (確保最佳價格可見)
   ↓
5. 展示結果和建議
```

## 🎨 UI/UX 設計架構

### 1. **響應式佈局**
- **Desktop**: 雙欄式佈局 (設定區 + 圖表區)
- **Mobile**: 垂直堆疊佈局
- **Tablet**: 適應性調整

### 2. **視覺層次**
```
Header (品牌 + 標題)
    ↓
Configuration Panel (左側)
├── 模式選擇 (CSV/Manual)
├── 輸入參數面板
└── 成本結構設定
    ↓
Result Chart (右側)
├── 轉換率曲線圖
├── 互動式價格滑桿
└── OEC 選擇器
    ↓
Analysis Section (底部)
├── 價格比較表格
└── 最佳價格分析
    ↓
Educational Content (說明文字)
```

### 3. **互動設計模式**
- **即時回饋**: 滑桿調整立即更新圖表
- **視覺引導**: 顏色編碼 (藍色=原價格, 綠色=新價格, 紅色=最佳價格)
- **狀態指示**: 載入、錯誤、成功狀態清楚標示

## 📊 資料流架構

### 1. **狀態管理模式**
```
page.tsx (Root State)
    ├── Input States (mu, sigma, cost, traffic...)
    ├── Business States (cogs, shippingFee, transactionFee...)
    ├── UI States (inputMode, isProductSelected...)
    └── Analysis States (oec, priceA, priceB...)
        ↓
Props Drilling 到各子組件
        ↓
計算函數 (utils/math.ts)
        ↓
渲染更新
```

### 2. **資料轉換鏈**
```
原始輸入 → 標準化參數 → 數學計算 → 視覺化資料 → UI 展示
    ↓
CSV/Manual → ChartPoint[] → Recharts → Interactive Chart
    ↓
User Interaction → State Update → Recalculation → Re-render
```

## 🔧 開發工作流程

### 1. **開發指令**
```bash
npm run dev      # 開發伺服器 (localhost:3000)
npm run build    # 生產版本建置
npm run start    # 生產伺服器啟動
npm run lint     # 程式碼檢查
```

### 2. **部署架構**
- **平台**: Vercel (零設定部署)
- **CI/CD**: GitHub 整合自動部署
- **CDN**: Vercel Edge Network
- **SSL**: 自動 HTTPS

### 3. **效能優化**
- **Next.js 優化**: 自動程式碼分割、圖片優化
- **React 優化**: useMemo 用於昂貴計算
- **CSS 優化**: Tailwind CSS 自動清理

## 📈 擴展性設計

### 1. **模組化架構**
- 組件高度解耦，易於獨立測試和維護
- 數學邏輯與 UI 邏輯分離
- 型別安全保證 (TypeScript)

### 2. **可擴展點**
- **新的 OEC 類型**: 易於在 `math.ts` 中添加
- **新的圖表類型**: Recharts 支援多種圖表
- **新的輸入模式**: 組件化設計便於擴展
- **國際化**: 文字內容易於抽取和翻譯

### 3. **潛在改進方向**
- 資料庫整合 (儲存用戶分析)
- 用戶帳號系統
- 多產品批次分析
- 進階統計功能
- API 整合 (Shopify, Google Analytics)

## 🔐 SEO 和性能

### 1. **SEO 優化**
- **Meta Tags**: 完整的 Open Graph 和 Twitter Cards
- **Structured Data**: JSON-LD 格式的結構化資料
- **Sitemap**: 自動生成的 XML sitemap
- **Robots.txt**: 搜索引擎爬蟲指引

### 2. **性能指標**
- **Core Web Vitals**: 優化的 LCP, FID, CLS
- **載入速度**: Next.js 自動優化
- **互動性**: 即時計算和渲染

## 📚 相關文件

1. **[Optimal_Price_Analysis_Documentation.md](./Optimal_Price_Analysis_Documentation.md)** - 數學模型詳細說明
2. **[Proof of Concept.md](./Illustrate_Doc/Proof%20of%20Concept.md)** - 技術規格文件
3. **[README.md](./README.md)** - 使用者指南和快速開始

---

**📝 文件版本**: v1.0  
**📅 最後更新**: 2025-08-07  
**👨‍💻 維護者**: ABConvert Team

*此文件涵蓋 Price Test Easy Tool 的完整技術架構，如有疑問或建議，歡迎提出 Issue 或 Pull Request。*