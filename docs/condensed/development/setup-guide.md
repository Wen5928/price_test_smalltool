# 🛠️ 開發環境設置

## 系統需求

### 基礎環境
```bash
Node.js >= 18.0.0
npm >= 8.0.0
Git >= 2.25.0
```

### 推薦IDE
- **VS Code** + 擴展包:
  - TypeScript Importer
  - Tailwind CSS IntelliSense  
  - ES7+ React/Redux/React-Native snippets
  - Prettier - Code formatter

## 快速開始

### 1. 專案初始化
```bash
# 克隆專案
git clone [repository-url]
cd price_test_smalltool

# 安裝依賴
npm install

# 複製環境變數檔案 (可選)
cp .env.example .env.local
```

### 2. 開發命令
```bash
# 啟動開發伺服器
npm run dev            # http://localhost:3000

# 建置專案
npm run build          # 產生 .next/ 資料夾

# 啟動生產模式
npm start              # 需先執行 build

# 程式碼檢查
npm run lint           # ESLint 檢查
```

### 3. 開發伺服器
```bash
# 預設設定
PORT: 3000
HOST: localhost
MODE: development

# 自訂埠號
PORT=3001 npm run dev
```

## 專案結構詳解

### 核心目錄
```
src/
├── app/                    # Next.js App Router
│   ├── globals.css        # 全域樣式和 CSS 變數
│   ├── layout.tsx         # 根布局組件
│   ├── page.tsx           # 首頁 (手動輸入模式)
│   ├── analysis/          # 分析頁面 (CSV模式)
│   │   └── page.tsx
│   └── sitemap.ts         # 自動產生 sitemap
├── components/            # React 組件庫
└── utils/                # 工具函數
    └── math.ts           # 核心數學運算
```

### 組件分類
```
components/
├── 📊 Data Display
│   ├── ComparisonTable.tsx      # 價格對比表格
│   ├── ComparisonBarChart.tsx   # 長條圖比較
│   └── ResultChart.tsx          # 結果圖表
├── 🎛️ Input Controls  
│   ├── CsvUploader.tsx          # CSV 檔案上傳
│   ├── InputPanel.tsx           # 手動輸入面板
│   └── OecSelector.tsx          # 優化目標選擇
├── 📈 Interactive
│   └── InteractivePriceChart.tsx # 互動價格分析
├── 📄 Content
│   ├── ExplanationText.tsx      # 說明文字
│   └── OptimalPriceConclusion.tsx # 結論總結
└── 🔧 Utility
    ├── LoadingSkeleton.tsx      # 載入骨架
    ├── EmptyState.tsx          # 空狀態
    └── StructuredData.tsx      # SEO 結構化資料
```

## 環境變數配置

### .env.local (開發環境)
```bash
# AI 功能 (可選)
OPENAI_API_KEY=sk-...
OPENAI_MODEL=gpt-4o-mini

# 預設參數
DEFAULT_PROFIT_MARGIN=0.3
DEFAULT_CONVERSION_RATE=0.02
MIN_PROFIT_MARGIN=0.1

# 分析設定
AI_CONFIDENCE_THRESHOLD=0.8
BATCH_ANALYSIS_SIZE=50
```

### 環境變數使用
```typescript
// 在組件中使用
const apiKey = process.env.OPENAI_API_KEY;
const defaultMargin = parseFloat(process.env.DEFAULT_PROFIT_MARGIN || '0.3');
```

## 開發工作流程

### 1. 功能開發流程
```bash
# 1. 創建功能分支
git checkout -b feature/new-feature

# 2. 開發功能
npm run dev              # 啟動開發伺服器
# 進行開發...

# 3. 測試功能
npm run lint             # 檢查程式碼風格
npm run build            # 驗證建置正常

# 4. 提交變更
git add .
git commit -m "feat: add new feature"
git push origin feature/new-feature
```

### 2. 程式碼規範
```typescript
// TypeScript 設定
// tsconfig.json 已配置嚴格模式
{
  "strict": true,
  "noImplicitAny": true,
  "strictNullChecks": true
}

// 組件命名規範
export default function ComponentName() { }  // PascalCase
const variableName = '';                     // camelCase
const CONSTANT_NAME = '';                    // UPPER_CASE
```

### 3. Git 提交規範
```bash
feat:     新功能
fix:      錯誤修復
docs:     文件更新
style:    格式調整（不影響程式邏輯）
refactor: 重構代碼
test:     測試相關
chore:    建置工具或輔助工具變動
```

## 除錯和測試

### 1. 開發者工具
```javascript
// 在瀏覽器中除錯
console.log('除錯訊息', data);

// React DevTools 
// 安裝瀏覽器擴展以檢查組件狀態

// 數學計算除錯
import { generateChartData } from '@/utils/math';
const testData = generateChartData(60, 20, 10, 1000, 20, 100);
console.table(testData);
```

### 2. 常見問題排查
```bash
# 清理快取
rm -rf .next/
rm -rf node_modules/
npm install

# 檢查埠號衝突
lsof -ti:3000 | xargs kill -9

# 檢查 TypeScript 錯誤
npx tsc --noEmit
```

### 3. 性能分析
```bash
# 建置分析
npm run build
# 檢查 .next/ 資料夾大小

# Chrome DevTools
# Network 標籤檢查載入時間
# Performance 標籤分析運行效能
```

## 部署準備

### 1. 建置檢查
```bash
# 本地建置測試
npm run build           # 建置專案
npm start              # 測試生產模式

# 檢查建置產出
ls -la .next/static/   # 靜態檔案
du -sh .next/          # 建置大小
```

### 2. Vercel 部署
```bash
# 安裝 Vercel CLI (可選)
npm i -g vercel

# 本地部署測試
vercel dev

# 部署到 Vercel
git push origin main   # 自動觸發部署
```

### 3. 環境變數設定
```bash
# Vercel Dashboard 設定
OPENAI_API_KEY         # 生產環境 AI 金鑰
NODE_ENV=production    # 自動設定
```

## 開發最佳實踐

### 1. 性能優化
```typescript
// 使用 React.memo 防止不必要重渲染
export default React.memo(function Component({ data }) {
  // ...
});

// 使用 useCallback 快取函數
const handleClick = useCallback(() => {
  // ...
}, [dependency]);

// 使用 useMemo 快取運算結果
const expensiveValue = useMemo(() => {
  return expensiveCalculation(data);
}, [data]);
```

### 2. 錯誤處理
```typescript
// 使用 Error Boundary 或 try-catch
try {
  const result = riskyOperation();
} catch (error) {
  console.error('Operation failed:', error);
  // 顯示友好的錯誤訊息
}
```

### 3. 型別安全
```typescript
// 定義清楚的介面
interface ProductData {
  id: string;
  name: string;
  price: number;
}

// 使用型別守衛
function isValidProduct(data: any): data is ProductData {
  return data && typeof data.price === 'number';
}
```