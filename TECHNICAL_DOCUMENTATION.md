# 📋 ABConvert A/B Price Testing Tool - 完整技術文件

## 📖 目錄

1. [專案概述](#專案概述)
2. [技術架構](#技術架構)
3. [核心功能](#核心功能)
4. [使用方法](#使用方法)
5. [開發環境設置](#開發環境設置)
6. [維護指南](#維護指南)
7. [未來發展規劃](#未來發展規劃)
8. [API 參考](#api-參考)
9. [故障排除](#故障排除)

---

## 🎯 專案概述

### 基本資訊
- **專案名稱**: ABConvert A/B Price Testing Tool
- **版本**: 1.0.0 (生產環境就緒)
- **部署地址**: [price-test-smalltool.vercel.app](https://price-test-smalltool.vercel.app/)
- **開發框架**: Next.js 15 + React 19 + TypeScript
- **設計系統**: ABC Color Palette
- **目標用戶**: Shopify 商家、電商業者、定價策略分析師

### 專案目標
1. **教育性工具**: 幫助用戶理解價格彈性和定價策略
2. **實用分析**: 提供基於數學模型的價格優化建議  
3. **專業展示**: 展現 ABConvert 的技術實力和專業形象
4. **用戶引導**: 引導用戶對更高級解決方案的興趣

---

## 🏗️ 技術架構

### 核心技術棧

#### 前端框架
- **Next.js 15**: 使用 App Router，支持 SSG/SSR
- **React 19**: 最新的 React 版本，支持並發特性
- **TypeScript 5**: 完整的類型安全保障

#### 樣式與設計
- **Tailwind CSS 4**: 現代的原子化 CSS 框架
- **ABC Color System**: 自定義的專業色彩系統
- **CSS Variables**: 支持主題切換（目前僅實現深色主題）
- **Responsive Design**: 支持 375px/768px/1440px 斷點

#### 數據處理
- **Papa Parse**: CSV 文件解析
- **Recharts**: 圖表渲染和數據可視化
- **Session Storage**: 客戶端狀態持久化

#### 開發工具
- **ESLint**: 代碼規範檢查
- **React Hot Toast**: 用戶通知系統

### 專案結構

```
price_test_smalltool/
├── 📂 src/
│   ├── 📂 app/              # Next.js App Router
│   │   ├── globals.css      # 全域樣式和 ABC 色彩系統
│   │   ├── layout.tsx       # 根佈局組件
│   │   ├── page.tsx         # 首頁 - CSV 上傳和說明
│   │   ├── 📂 analysis/     # 分析頁面
│   │   │   ├── layout.tsx   # 分析頁佈局
│   │   │   └── page.tsx     # 互動式價格分析介面
│   │   ├── 📂 results/      # 結果頁面
│   │   │   ├── layout.tsx   # 結果頁佈局
│   │   │   └── page.tsx     # 比較結果和圖表
│   │   └── sitemap.ts       # SEO sitemap
│   ├── 📂 components/       # React 組件
│   │   ├── 🔧 核心組件/
│   │   │   ├── InteractivePriceChart.tsx    # 核心價格分析介面
│   │   │   ├── ComparisonTable.tsx          # A/B/Optimal 比較表
│   │   │   ├── CsvUploader.tsx              # Shopify CSV 處理
│   │   │   └── PriceComparisonChart.tsx     # 結果頁圖表
│   │   ├── 🎨 UI組件/
│   │   │   ├── HelpManual.tsx               # 使用說明手冊
│   │   │   ├── ManualInputForm.tsx          # 手動輸入表單
│   │   │   ├── ExplanationText.tsx          # 說明文字組件
│   │   │   └── StepIndicator.tsx            # 步驟指示器
│   │   └── 🔧 工具組件/
│   │       ├── ErrorBoundary.tsx            # 錯誤邊界
│   │       ├── LoadingSkeleton.tsx          # 載入骨架
│   │       └── DebugPanel.tsx               # 開發調試面板
│   ├── 📂 services/         # 業務邏輯服務
│   │   └── aiPricingAnalyzer.ts             # AI 價格分析服務
│   └── 📂 utils/            # 工具函數
│       └── math.ts          # 數學計算函數
├── 📂 docs/                 # 完整文檔系統
│   ├── 📁 condensed/        # 濃縮文檔
│   │   ├── technical/       # 技術文檔
│   │   ├── business/        # 商業文檔
│   │   ├── design/          # 設計文檔
│   │   └── development/     # 開發文檔
│   └── 📄 各類專業文檔...
└── 📂 public/               # 靜態資源
    ├── company_icon.png     # 公司圖標
    ├── favicon.ico          # 網站圖標
    └── robots.txt           # SEO 配置
```

---

## ⚙️ 核心功能

### 1. 數據輸入 (首頁)
- **CSV 上傳**: 支持 Shopify 產品導出文件
- **示例數據**: 提供快速體驗的演示產品
- **手動輸入**: 替代方案，支持單一產品分析
- **幫助系統**: 浮動按鈕式用戶指南

### 2. 互動分析 (分析頁)
- **雙滑桿介面**: 直觀的價格調整控制
- **即時計算**: 實時顯示轉換率、收入、利潤變化
- **參數配置**: 高級用戶可調整數學模型參數
- **最佳價格發現**: 自動計算最優定價點

### 3. 結果比較 (結果頁)
- **三列比較**: A價格 vs B價格 vs 最佳價格
- **圖表可視化**: Recharts 動態圖表展示
- **關鍵指標**: 轉換率、收入、利潤、ROI
- **商業建議**: 基於分析結果的策略建議

### 4. 技術特性
- **會話管理**: 使用 sessionStorage 保持狀態
- **錯誤處理**: 優雅的錯誤邊界和用戶提示
- **響應式設計**: 支援手機、平板、桌面設備
- **載入狀態**: 骨架屏和載入指示器
- **調試模式**: `?debug=true` 參數啟用開發工具

---

## 📱 使用方法

### 基本使用流程

#### Step 1: 數據準備
1. **訪問首頁**: 開啟 [price-test-smalltool.vercel.app](https://price-test-smalltool.vercel.app/)
2. **選擇輸入方式**:
   - 上傳 Shopify CSV 文件
   - 使用內建示例數據
   - 手動輸入產品資訊

#### Step 2: 價格分析
1. **選擇產品**: 從上傳的數據中選擇要分析的產品
2. **設置 A 價格**: 使用滑桿調整當前價格
3. **設置 B 價格**: 使用第二個滑桿設定測試價格
4. **觀察變化**: 即時查看轉換率、收入、利潤變化
5. **找到最佳點**: 系統自動顯示建議的最佳價格

#### Step 3: 結果分析
1. **比較結果**: 查看 A/B/最佳價格的詳細比較
2. **圖表分析**: 通過視覺化圖表理解價格影響
3. **商業決策**: 根據分析結果制定定價策略

### 高級功能

#### 參數調整
- **μ (平均願付價格)**: 調整目標客群的平均價格接受度
- **σ (價格敏感度)**: 調整價格變動對需求的影響程度
- **基礎轉換率**: 設定產品的基準轉換率
- **流量設置**: 輸入預期的訪客流量

#### CSV 格式要求
支持 Shopify 標準導出格式，必須包含以下欄位：
- `Title`: 產品名稱
- `Variant Price`: 產品價格
- 可選欄位：`COGS`, `Shipping Cost` 等成本資訊

---

## 🛠️ 開發環境設置

### 環境要求
- **Node.js**: 18.0 或以上版本
- **npm**: 最新穩定版本
- **瀏覽器**: Chrome, Firefox, Safari, Edge（最新 3 個版本）

### 快速開始

#### 1. 克隆專案
```bash
git clone [repository-url]
cd price_test_smalltool
```

#### 2. 安裝依賴
```bash
npm install
```

#### 3. 啟動開發服務器
```bash
npm run dev
```
開發服務器將在 `http://localhost:3000` 啟動

#### 4. 其他指令
```bash
# 建構生產版本
npm run build

# 啟動生產服務器
npm run start

# 代碼檢查
npm run lint

# TypeScript 類型檢查（需要在 CLAUDE.md 中查看正確指令）
npm run typecheck  # 如果可用
```

### 開發工具設置

#### VS Code 推薦擴展
- **TypeScript**: 內建支持
- **ESLint**: 代碼規範檢查
- **Tailwind CSS IntelliSense**: CSS 自動完成
- **React Developer Tools**: React 調試
- **Prettier**: 代碼格式化（可選）

#### 瀏覽器開發工具
- 啟用 React Developer Tools
- 使用 `?debug=true` 參數啟用調試模式
- 檢查 Console 面板的調試資訊

---

## 🔧 維護指南

### 日常維護

#### 代碼品質檢查
1. **執行 Lint 檢查**
   ```bash
   npm run lint
   ```
   修復所有 ESLint 報告的問題

2. **TypeScript 類型檢查**
   ```bash
   npm run typecheck  # 如果可用，否則檢查 tsconfig.json
   ```
   確保所有類型定義正確

3. **響應式測試**
   - 測試 375px（手機）
   - 測試 768px（平板）  
   - 測試 1440px（桌面）

#### 功能測試
1. **CSV 上傳流程**
   - 測試各種 Shopify CSV 格式
   - 驗證錯誤處理機制
   - 檢查數據解析準確性

2. **價格分析功能**
   - 測試滑桿操作響應性
   - 驗證數學計算準確性
   - 檢查最佳價格計算邏輯

3. **結果展示**
   - 確認圖表渲染正常
   - 驗證比較表數據準確性
   - 檢查響應式佈局

### 版本更新

#### 依賴更新
```bash
# 檢查過期依賴
npm outdated

# 更新依賴（小心處理）
npm update

# 更新重要依賴時的檢查清單：
# 1. Next.js 更新 - 檢查 App Router 兼容性
# 2. React 更新 - 測試所有組件功能
# 3. TypeScript 更新 - 檢查類型定義
# 4. Tailwind 更新 - 驗證樣式系統
```

#### 部署前檢查清單
- [ ] 所有 TypeScript 錯誤已修復
- [ ] ESLint 檢查通過
- [ ] 手動測試所有主要功能
- [ ] 響應式設計在各設備正常
- [ ] 暗色主題功能正常
- [ ] 性能指標達標（Lighthouse > 90）

### 監控和分析

#### 性能監控
- **Bundle 大小**: 保持在合理範圍內
  - 分析頁面: < 230KB
  - 首頁: < 150KB
  - 結果頁: < 180KB

#### 用戶體驗指標
- **First Contentful Paint**: < 1.5s
- **Largest Contentful Paint**: < 2.5s
- **Cumulative Layout Shift**: < 0.1
- **First Input Delay**: < 100ms

---

## 🚀 未來發展規劃

### 短期目標（下一個版本）

#### 1. 主題系統完善
- **淺色主題**: 完成淺色主題實現
- **主題切換**: 添加主題切換按鈕
- **系統主題**: 支持跟隨系統主題設置
- **主題持久化**: 記住用戶主題偏好

#### 2. 手機體驗優化
- **觸控優化**: 改進滑桿在觸控設備的操作
- **手勢支持**: 添加滑動手勢導航
- **載入優化**: 改善手機網路環境下的載入速度

#### 3. 性能提升
- **代碼分割**: 實現動態導入，減少初始載入時間
- **懶載入**: 圖表組件懶載入
- **快取策略**: 改善靜態資源快取

### 中期目標（3-6個月）

#### 1. 功能增強
- **多產品分析**: 支持批量產品價格分析
- **導出功能**: PDF/Excel 格式的分析報告導出
- **歷史記錄**: 保存和管理分析歷史
- **預設模板**: 行業特定的分析模板

#### 2. 數據集成
- **Shopify App**: 開發 Shopify 應用整合
- **API 接口**: 提供分析 API 服務
- **即時數據**: 連接即時市場數據
- **競品分析**: 整合競品價格數據

#### 3. 分析升級
- **機器學習**: 基於歷史數據的價格預測
- **市場因子**: 考慮季節性、競爭等因素
- **客群分析**: 不同客戶群體的價格彈性分析
- **A/B 測試整合**: 真實 A/B 測試結果整合

### 長期願景（6-12個月）

#### 1. 平台化
- **用戶系統**: 用戶註冊、登入、個人化
- **團隊協作**: 多人協作和權限管理
- **企業版**: 企業級功能和支援
- **白標方案**: 可客製化的白標解決方案

#### 2. 智能化
- **AI 助手**: 智能定價建議助手
- **自動優化**: 基於業績自動調整價格
- **預測分析**: 價格變動的市場影響預測
- **個性化**: 基於用戶行為的個性化建議

#### 3. 生態系統
- **合作夥伴**: 與電商平台深度集成
- **第三方服務**: 連接支付、物流等服務
- **開發者生態**: API、SDK、文檔、社群
- **教育內容**: 定價策略課程和認證

---

## 📚 API 參考

### 數學計算函數 (`src/utils/math.ts`)

#### `calculateOptimalPrice(params)`
計算最佳價格點

**參數**:
```typescript
interface OptimalPriceParams {
  mu: number;           // 平均願付價格
  sigma: number;        // 價格敏感度標準差
  cogs: number;         // 商品成本
  baseTraffic: number;  // 基礎流量
  baseConversion: number; // 基礎轉換率
}
```

**返回值**:
```typescript
interface OptimalPriceResult {
  optimalPrice: number;     // 最佳價格
  maxRevenue: number;       // 最大收入
  maxProfit: number;        // 最大利潤
  optimalConversion: number; // 最佳轉換率
}
```

#### `calculatePriceMetrics(price, params)`
計算指定價格下的各項指標

**參數**:
```typescript
calculatePriceMetrics(
  price: number,
  params: OptimalPriceParams
): PriceMetrics
```

**返回值**:
```typescript
interface PriceMetrics {
  conversionRate: number;  // 轉換率
  revenue: number;         // 收入
  profit: number;          // 利潤
  customers: number;       // 客戶數量
}
```

### 組件 API

#### `InteractivePriceChart`
核心價格分析組件

**Props**:
```typescript
interface InteractivePriceChartProps {
  productData: ProductData;
  onAnalysisComplete: (results: AnalysisResults) => void;
  onPriceChange: (priceA: number, priceB: number) => void;
}
```

#### `ComparisonTable`
價格比較表組件

**Props**:
```typescript
interface ComparisonTableProps {
  priceA: number;
  priceB: number;
  optimalPrice: number;
  metricsA: PriceMetrics;
  metricsB: PriceMetrics;
  metricsOptimal: PriceMetrics;
}
```

### 資料結構

#### ProductData
```typescript
interface ProductData {
  title: string;
  price: number;
  cogs?: number;
  shippingCost?: number;
  transactionFee?: number;
}
```

#### AnalysisResults
```typescript
interface AnalysisResults {
  productTitle: string;
  priceA: number;
  priceB: number;
  optimalPrice: number;
  metricsA: PriceMetrics;
  metricsB: PriceMetrics;
  metricsOptimal: PriceMetrics;
  chartData: ChartDataPoint[];
}
```

---

## 🔍 故障排除

### 常見問題

#### 1. CSV 上傳問題

**問題**: CSV 文件無法解析
**解決方案**:
- 確認文件格式為標準 CSV
- 檢查是否包含必要欄位（Title, Variant Price）
- 確認文件編碼為 UTF-8
- 檢查文件大小是否過大

**問題**: 產品資料不完整
**解決方案**:
- 檢查 CSV 中的數據完整性
- 確認價格欄位為有效數字
- 檢查是否有空白或特殊字符

#### 2. 價格分析問題

**問題**: 滑桿操作不響應
**解決方案**:
- 刷新頁面重新載入組件
- 檢查瀏覽器控制台錯誤信息
- 確認 JavaScript 已啟用
- 清除瀏覽器暫存

**問題**: 計算結果異常
**解決方案**:
- 檢查輸入參數是否合理
- 確認數學模型參數設置
- 檢查產品成本設定
- 驗證基礎轉換率設定

#### 3. 顯示問題

**問題**: 圖表無法顯示
**解決方案**:
- 檢查網絡連接
- 確認瀏覽器支援 SVG
- 清除瀏覽器快取
- 檢查控制台 JavaScript 錯誤

**問題**: 響應式佈局異常
**解決方案**:
- 檢查瀏覽器縮放設定
- 確認 CSS 載入完成
- 嘗試硬刷新 (Ctrl+F5)
- 檢查 Tailwind CSS 是否正常載入

#### 4. 性能問題

**問題**: 頁面載入緩慢
**解決方案**:
- 檢查網絡連接速度
- 清除瀏覽器快取
- 檢查是否啟用廣告攔截器
- 嘗試無痕模式瀏覽

**問題**: 互動操作延遲
**解決方案**:
- 關閉其他瀏覽器分頁
- 檢查設備性能
- 確認瀏覽器版本支援
- 嘗試重啟瀏覽器

### 調試工具

#### 1. 開發者模式
在 URL 後添加 `?debug=true` 啟用調試模式：
```
https://price-test-smalltool.vercel.app/analysis?debug=true
```

啟用後可查看：
- 詳細的計算過程
- 組件狀態信息
- 性能監控數據
- 錯誤堆棧信息

#### 2. 瀏覽器開發工具
- **Console**: 查看錯誤信息和調試日誌
- **Network**: 檢查資源載入情況
- **Performance**: 分析頁面性能瓶頸
- **Application**: 檢查 Session Storage 數據

#### 3. React Developer Tools
安裝 React Developer Tools 瀏覽器擴展：
- 檢查組件層次結構
- 查看組件 props 和 state
- 分析組件重渲染
- 性能分析和優化

### 技術支援

#### 1. 文檔資源
- **技術文檔**: `/docs` 目錄下的完整文檔
- **API 參考**: 本文檔的 API 參考章節
- **使用指南**: 內建 HelpManual 組件

#### 2. 聯繫方式
- **開發團隊**: ABConvert 內部開發人員
- **技術支援**: 通過內部溝通渠道
- **問題報告**: 使用內部問題追蹤系統

---

## 📋 附錄

### A. 技術規格摘要
- **框架**: Next.js 15 + React 19 + TypeScript 5
- **樣式**: Tailwind CSS 4 + ABC Color System
- **數據**: Papa Parse + Session Storage
- **圖表**: Recharts 3.x
- **部署**: Vercel 平台
- **性能**: Lighthouse 90+ 分數

### B. 瀏覽器兼容性
| 瀏覽器 | 最低版本 | 支援狀態 |
|--------|----------|----------|
| Chrome | 90+ | ✅ 完整支援 |
| Firefox | 88+ | ✅ 完整支援 |
| Safari | 14+ | ✅ 完整支援 |
| Edge | 90+ | ✅ 完整支援 |

### C. 設備支援
| 設備類型 | 最小寬度 | 支援狀態 |
|----------|----------|----------|
| 手機 | 375px | ✅ 完整支援 |
| 平板 | 768px | ✅ 完整支援 |
| 桌面 | 1440px | ✅ 最佳體驗 |

### D. 數學模型參數
| 參數 | 默認值 | 範圍 | 說明 |
|------|--------|------|------|
| μ (mu) | 100 | 50-500 | 平均願付價格 |
| σ (sigma) | 30 | 10-100 | 價格敏感度 |
| 基礎轉換率 | 50% | 1%-100% | 基準轉換率 |
| 流量 | 1000 | 100-10000 | 日均訪客數 |

---

**文件版本**: 1.0  
**最後更新**: 2025-08-28  
**維護團隊**: ABConvert Development Team  
**文件狀態**: 🟢 最新版本  

---

*此文檔為 ABConvert A/B Price Testing Tool 的完整技術參考，涵蓋了項目的所有關鍵方面。如需更新或補充，請聯繫開發團隊。*