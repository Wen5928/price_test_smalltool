# 🏗️ 系統架構

## 技術棧概覽

```
Frontend: Next.js 15 (App Router)
Language: TypeScript 5
Styling: Tailwind CSS 4.1.11
Charts: Recharts 3.1.0
Data Processing: Papa Parse 5.5.3
State Management: React Hooks
```

## 項目結構

```
src/
├── app/                        # Next.js App Router
│   ├── globals.css            # 全域樣式 + ABC色彩系統
│   ├── layout.tsx            # 根布局
│   ├── page.tsx              # 首頁 (手動輸入模式)
│   └── analysis/             # 分析頁面 (CSV模式)
│       └── page.tsx
├── components/               # React 組件
│   ├── CsvUploader.tsx      # CSV 上傳和解析
│   ├── InteractivePriceChart.tsx  # 互動價格圖表
│   ├── ComparisonTable.tsx   # 價格對比表格
│   ├── OecSelector.tsx      # 優化目標選擇器
│   └── ...                  # 其他 UI 組件
├── utils/
│   └── math.ts              # 核心數學計算邏輯
└── services/                # 服務層 (未來擴展)
    └── aiPricingAnalyzer.ts # AI 分析服務
```

## 核心架構模式

### 1. 狀態管理
```typescript
// 主頁面狀態管理 (page.tsx)
const [currentPrice, setCurrentPrice] = useState(50);
const [comparisonData, setComparisonData] = useState<ComparisonData | null>(null);
const [targetOec, setTargetOec] = useState<'revenue' | 'profit' | 'conversion'>('profit');
// ... 15+ 個狀態變數
```

### 2. 數據流向
```
用戶輸入 → 狀態更新 → 數學計算 → 圖表渲染
     ↓
CSV上傳 → 數據解析 → 產品選擇 → 分析計算
```

### 3. 組件通信
- **Props Down**: 父組件傳遞狀態和回調函數
- **Events Up**: 子組件通過回調函數向上傳遞事件
- **Context**: 全域主題和設定 (未來擴展)

## 部署架構

```
Vercel Platform
├── 自動構建 (npm run build)
├── 靜態檔案優化
├── 自動部署 (Git推送觸發)
└── CDN分發
```

## 性能優化

### 1. 計算優化
- **防抖處理**: 滑桿變動 100ms 防抖
- **數據快取**: sessionStorage 快取 CSV 數據
- **懶載入**: 圖表組件按需載入

### 2. 渲染優化
- **useCallback**: 防止不必要的重新渲染
- **useMemo**: 快取昂貴的計算結果
- **分頁顯示**: CSV 產品列表分批顯示

### 3. 構建優化
- **Tree Shaking**: 自動移除未使用代碼
- **代碼分割**: 自動分割 JavaScript 包
- **靜態優化**: Next.js 自動靜態優化

## 擴展架構

### 未來技術升級
```typescript
// AI 服務整合
interface AIService {
  analyzeBatch(products: Product[]): Promise<PricingInsights>;
  predictCosts(product: Product): Promise<CostAnalysis>;
}

// 後端API整合
interface BackendAPI {
  saveAnalysis(data: AnalysisResult): Promise<void>;
  getMarketData(category: string): Promise<MarketData>;
}
```