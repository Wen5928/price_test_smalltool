# 價格測試工具改進計畫 - 第二階段

## 已完成功能（第一階段）
✅ 新增 COGS、運費、交易手續費三個成本欄位
✅ 支援 CSV 檔案上傳功能
✅ 加入 OEC (Overall Evaluation Criterion) 選擇器
✅ 自動計算並顯示最佳價格

## 新需求（第二階段）

### 1. 命名更新
- **目標**：將 "Price A" 改為 "Original Price"，讓使用者更容易理解
- **影響範圍**：
  - ResultChart 組件（圖表標示和滑桿）
  - ComparisonTable 組件（表格標題）
  - 所有相關的文字標籤和提示

### 2. 版面配置優化
- **目標**：將 "Price Comparison Analysis" 和 "Optimal Price Analysis" 並排顯示
- **實作方式**：
  - 使用 grid 佈局（grid-cols-2）
  - 在較小螢幕上自動轉為垂直排列
  - 確保兩個區塊高度一致，視覺平衡

### 3. CSV 產品資訊擴充
- **目標**：在產品選擇列表中顯示更多資訊
- **新增顯示欄位**：
  - Price（售價）
  - Cost（成本）
  - Shipping Fee（運費）- 需要使用者在設定中預設
  - Transaction Fee（交易手續費）- 根據預設百分比計算
- **實作細節**：
  - 修改 CsvUploader 組件的產品顯示格式
  - 使用表格或卡片形式呈現完整資訊
  - 加入計算後的總成本預覽

## 實作步驟

### 步驟 1：更新命名（Price A → Original Price）
1. **更新變數名稱**（保持向後相容）：
   - 保留 `priceA` 作為內部變數名
   - 更新所有使用者介面的顯示文字

2. **需要修改的檔案**：
   - `ResultChart.tsx`：滑桿標籤、圖表標記
   - `ComparisonTable.tsx`：表格欄位標題
   - `ExplanationText.tsx`：說明文字中的引用

### 步驟 2：重新配置版面
1. **修改主頁面佈局**：
   ```tsx
   <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
     <ComparisonTable />
     <OptimalPriceConclusion />
   </div>
   ```

2. **調整組件樣式**：
   - 確保兩個組件有相同的內邊距和邊框樣式
   - 加入響應式設計考量

### 步驟 3：擴充 CSV 顯示資訊
1. **修改資料結構**：
   ```tsx
   interface ProductDisplayData {
     handle: string;
     title: string;
     price: number;
     costPerItem: number;
     shippingFee: number;      // 從全域設定取得
     transactionFee: number;    // 根據價格計算
     totalCost: number;         // 計算總成本
   }
   ```

2. **更新 CsvUploader 組件**：
   - 接收 shippingFee 和 transactionFeePercent 作為 props
   - 計算每個產品的實際成本
   - 使用更豐富的視覺呈現方式

3. **改進產品選擇介面**：
   - 使用表格形式顯示所有成本明細
   - 加入排序功能（按價格、成本、利潤等）
   - 顯示預估利潤率

## 預期成果
1. 更直觀的使用者介面，"Original Price" 更容易理解
2. 並排顯示的分析結果，方便比較和查看
3. CSV 上傳後能看到完整的成本結構，幫助做出更好的定價決策

## 技術考量
- 保持程式碼的向後相容性（內部變數名不變）
- 確保響應式設計在各種裝置上都能正常顯示
- 考慮未來可能的擴充需求（如批次分析多個產品）