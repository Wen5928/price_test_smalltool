# ✅ TODO — Upgrade Price Test Tool (Based on Ronny Kohavi's A/B Testing Principles)

## 1️⃣ Add OEC (Overall Evaluation Criterion) Selector

> Goal: 讓使用者明確指定模擬的「實驗目標」，強化數據意義與主線故事

### ⏱️ Tasks:
- [ ] 在 UI 中加入「評估目標選擇器」，位置可放在 Input Panel 下方：
  - [ ] Maximize Revenue
  - [ ] Maximize Profit
  - [ ] Maximize Conversion Rate
- [ ] 在 `generateChartData()` 中：
  - [ ] 計算每個價格對應的三項指標
  - [ ] 找出「最佳價格（最佳 OEC 對應的最大值）」
- [ ] 在圖表上用特殊顏色標出 "Optimal Price for OEC"
- [ ] 加一段結論敘述，例如：
  ```
  Based on your selected OEC: **Maximize Revenue**,  
  the best simulated price is: **$34.20**, with an estimated revenue of **$478.20**
  ```

---

## 2️⃣ Price A vs Price B Visual + Comparison Table

> Goal: 協助使用者視覺化並比較兩個價格對應的實驗結果

### ⏱️ Tasks:
- [ ] 在 `InputPanel` 中加入兩個價格輸入欄位（可預設為 min/max 中間值）
  - [ ] Price A
  - [ ] Price B
- [ ] 在 `ResultChart` 中：
  - [ ] 用不同顏色標記兩個價格的位置（可用點／標線）
  - [ ] 加上圖表 Tooltip 上的標籤或圓點提示
- [ ] 新增一個 `ComparisonTable` 元件，顯示以下欄位：

| Metric         | Price A | Price B |
|----------------|---------|---------|
| Conversion (%) |         |         |
| Revenue ($)    |         |         |
| Profit ($)     |         |         |

- [ ] 所有資料都由 `generateChartData()` 提供，根據價格索引回傳該 row

---

## 4️⃣ Export Simulation Summary (Experiment Documentation)

> Goal: 幫助使用者將這次模擬「儲存為紀錄」，強化知識累積與後續分析

### ⏱️ Tasks:
- [ ] 新增一個 `ExportSummary` 區塊，顯示完整模擬設定與結果摘要：
  - Input Params: μ, σ, cost, traffic, price range
  - Chosen OEC
  - Optimal price
  - Price A / B 對比表
- [ ] 加一個按鈕：
  - [ ] `Copy to Clipboard`
  - [ ] `Download as .txt` 或 `.md`
- [ ] 輸出格式範例如下：

```
## 🧪 Price Test Simulation Report

- μ: 30, σ: 5
- Cost: $15
- Traffic: 1000
- Price Range: $20 ~ $40
- OEC: Maximize Profit

### ✅ Optimal Price: $33.2
- Conversion Rate: 8.7%
- Revenue: $288.34
- Profit: $152.10

### 📊 A/B Comparison:
| Metric         | Price A ($28) | Price B ($35) |
|----------------|---------------|---------------|
| Conversion (%) | 14.2%         | 4.8%          |
| Revenue        | $397.60       | $336.00       |
| Profit         | $184.80       | $144.00       |
```

---

### 🔄 後續延伸（可選）：
- 儲存模擬紀錄到 LocalStorage（或接入 ABConvert 登入帳號）
- 將匯出紀錄對接後台 API 存成真實實驗草稿

---

📌 若需要 UI/UX 元件設計建議、資料結構設計或 `generateChartData()` 函式調整，我也可以幫忙！
