# 📊 Shopify A/B Price Testing Tool - 當前專案架構文件

## 🎯 專案概述

Shopify A/B Price Testing Tool 是一個專為 Shopify 商家設計的互動式定價分析工具。它使用真實的 Shopify 產品數據來模擬定價情境，並提供數據驅動的最佳定價策略建議。

### 🌐 線上展示
- **Live Demo**: [https://price-test-smalltool.vercel.app/](https://price-test-smalltool.vercel.app/)
- **主要功能**: 支援 Shopify CSV 匯入、即時價格分析、最佳化建議

## 🏗️ 技術架構

### 核心技術棧
- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript 5
- **Styling**: Tailwind CSS 4
- **Charts**: Recharts 3.1.0 
- **CSV Processing**: Papa Parse 5.5.3
- **UI Components**: React 19.1.0
- **Notifications**: react-hot-toast

### 開發工具
- **Package Manager**: npm
- **Build Tool**: Next.js built-in
- **Type Checking**: TypeScript
- **Linting**: ESLint (Next.js)
- **CSS**: PostCSS + Tailwind

## 🎨 設計系統

### ABC 色彩系統
- **主色調**: ABC Blue 系列 (#217BD1, #3FB4E8, #5DEFFF, #A4F6FF)
- **成功色**: ABC Green 系列 (#5A912B, #82C621, #ACFF17, #D6FF8C)  
- **警告色**: ABC Coral 系列 (#FF5F47, #FF8690, #FFABD6, #FFD4EA)
- **中性色**: 深灰 (#3C3C3C), 中灰 (#4E4E4E), 純白 (#FFFFFF)

### 主題系統
- **暗黑主題**: 純黑背景，白色文字
- **響應式設計**: 支援 375px, 768px, 1440px 斷點
- **無障礙標準**: 符合 WCAG AA 標準

## 📁 當前專案結構

```
src/
├── 📁 app/                          # Next.js App Router
│   ├── analysis/                    # 分析頁面
│   │   ├── layout.tsx              # 分析頁面佈局
│   │   └── page.tsx                # 分析頁面主體
│   ├── results/                     # 結果頁面
│   │   ├── layout.tsx              # 結果頁面佈局
│   │   └── page.tsx                # 結果頁面主體
│   ├── globals.css                  # 全域樣式 + ABC 色彩變數
│   ├── layout.tsx                   # 根佈局組件
│   ├── page.tsx                     # 首頁 (著陸頁)
│   └── sitemap.ts                   # 網站地圖
│
├── 📁 components/                   # React 組件庫
│   ├── ComparisonBarChart.tsx       # 價格比較長條圖
│   ├── ComparisonTable.tsx          # 價格比較表格 (A/B/Optimal)
│   ├── CsvUploader.tsx              # CSV 上傳與產品選擇
│   ├── DebugPanel.tsx               # 開發調試面板
│   ├── EmptyState.tsx               # 空狀態組件
│   ├── ErrorBoundary.tsx            # 錯誤邊界 (備用)
│   ├── ExplanationText.tsx          # 教育說明文字
│   ├── ExportSummary.tsx            # 匯出摘要 (備用)
│   ├── HelpManual.tsx               # 使用手冊 (懸浮按鈕)
│   ├── InputPanel.tsx               # 手動輸入面板
│   ├── InteractivePriceChart.tsx    # 互動式價格圖表 (核心)
│   ├── LoadingSkeleton.tsx          # 載入骨架
│   ├── ManualInputForm.tsx          # 手動輸入表單
│   ├── OecSelector.tsx              # 最佳化目標選擇器
│   ├── OptimalPriceConclusion.tsx   # 最佳價格結論
│   ├── PriceComparisonChart.tsx     # 價格比較圖表
│   ├── ResultChart.tsx              # 結果圖表
│   ├── StepIndicator.tsx            # 步驟指示器
│   ├── StructuredData.tsx           # 結構化數據
│   ├── ThemeToggle.tsx              # 主題切換 (備用)
│   └── Tooltip.tsx                  # 工具提示
│
└── 📁 utils/
    └── math.ts                      # 數學計算函數庫
```

## 🔄 應用程式流程

### 三頁式架構
1. **首頁 (`/`)**: 
   - 標題與說明
   - Demo 展示按鈕
   - CSV 上傳功能
   - 手動輸入選項
   - Demo 數據快速開始

2. **分析頁面 (`/analysis`)**:
   - 產品選擇 (左欄)
   - 互動式價格分析 (右欄)
   - 進階設定面板
   - 使用手冊 (右上角)
   - 繼續到結果按鈕

3. **結果頁面 (`/results`)**:
   - 價格比較顯示
   - 關鍵指標變化
   - 詳細解釋說明
   - ABConvert CTA 按鈕

### 數據流程
```
CSV/Manual Input → sessionStorage → Analysis → Results
              ↓
          Product Selection → Price Optimization → Recommendations
```

## 🧮 核心數學模型

### 價格彈性計算
```typescript
// 基於客戶支付意願 (WTP) 的價格彈性模型
const elasticityMultiplier = 
  normCDF(μ - newPrice, 0, σ) / normCDF(μ - originalPrice, 0, σ);

const predictedConversionRate = 
  actualConversionRate * elasticityMultiplier;
```

### 關鍵參數
- **μ (mu)**: 平均支付意願
- **σ (sigma)**: 價格敏感度 (標準差)
- **Base Conversion Rate**: 當前轉換率基準 (預設 50%)
- **Cost Structure**: COGS + 運費 + 交易手續費

### 最佳化目標
- **Maximize Revenue**: 最大化營收
- **Maximize Profit**: 最大化利潤  
- **Maximize Conversion**: 最大化轉換率

## 🎯 核心功能

### 1. CSV 模式 (主要)
- 支援 Shopify 產品匯出格式
- 自動解析產品數據
- 產品過濾與搜尋
- 分頁載入 (每次 40 個產品)

### 2. 手動輸入模式
- 快速測試情境
- 自定義產品參數
- 理論分析工具

### 3. 互動式分析
- 雙滑桿價格調整
- 即時計算更新
- 視覺化反饋
- 最佳價格標示

### 4. 比較分析
- A/B/Optimal 三欄比較
- 轉換率、營收、利潤分析
- 最佳表現者識別
- 關鍵洞察提供

## 🛠️ 開發指令

```bash
# 開發環境
npm run dev          # 啟動開發伺服器 (port 3000)
npm run build        # 建置生產版本
npm run start        # 啟動生產伺服器

# 程式碼品質
npm run lint         # 執行 ESLint
npm run typecheck    # TypeScript 類型檢查

# 偵錯模式
# 在任何 URL 加上 ?debug=true 查看 sessionStorage
```

## 🚀 部署資訊

### Vercel 部署
- **平台**: Vercel (推薦)
- **建置**: 自動偵測 Next.js
- **設定**: 零設定部署
- **輸出**: 靜態檔案至 `out/` 目錄

### 效能指標
- **首頁**: ~150KB
- **分析頁**: ~229KB (最大)
- **結果頁**: ~180KB
- **建置時間**: ~30 秒

## 📚 文檔結構

### docs/ 目錄
- `Current_Project_Architecture.md` - 當前架構 (本文件)
- `Architecture_Update_Summary.md` - 架構更新總結
- `Fixes_Summary.md` - 修正總結
- `Testing_Instructions.md` - 測試指南
- `Color_Palette.md` - 色彩規範
- `design-principles.md` - 設計原則
- `Architecture_Flow.md` - 流程圖

### 根目錄文檔
- `README.md` - 專案說明
- `CLAUDE.md` - Claude Code 指令

## 🔧 常見問題解決

### 導航問題
- 使用 `window.location.href` 確保可靠導航
- sessionStorage 實現狀態持久性

### 數據持久性
- CSV 內容存儲在 sessionStorage
- 分析結果快取機制
- 頁面間無縫切換

### 類型安全
- 完整 TypeScript 覆蓋
- 介面定義清楚
- 編譯時錯誤檢查

## 🎓 教育價值

### 學習目標
- **視覺化價格影響**: 直觀展示價格變化對業務的影響
- **模擬限制認知**: 展示模擬工具的局限性，強調真實 A/B 測試的必要性
- **建立價格彈性概念**: 幫助理解價格敏感度概念
- **引導專業解決方案**: 激發對系統化 A/B 測試的興趣

---

**由 ABConvert 團隊開發，為電商社群提供**  
*此工具旨在教育和啟發更好的定價決策。生產環境 A/B 測試請考慮專業平台如 ABConvert。*