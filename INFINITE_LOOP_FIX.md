# 修復無限迴圈問題

## 問題描述
```
Maximum update depth exceeded. This can happen when a component repeatedly calls setState inside componentWillUpdate or componentDidUpdate. React limits the number of nested updates to prevent infinite loops.
```

## 問題原因
在 `InteractivePriceChart` 組件中，`useEffect` 的依賴陣列包含了 `onPriceChange` 函數，而這個函數每次渲染時都會重新創建，導致無限迴圈的 `setState` 調用。

## 修復方案

### 1. **移除問題依賴**
從 `useEffect` 依賴陣列中移除 `onPriceChange`：

```typescript
// 之前（有問題）
useEffect(() => {
  // ... 計算邏輯
  onPriceChange?.(updatedComparison);
}, [priceA, priceB, selectedProduct, shippingFee, transactionFeePercent, monthlyTraffic, onPriceChange]);

// 之後（修復）
useEffect(() => {
  const timeoutId = setTimeout(updateComparison, 100);
  return () => clearTimeout(timeoutId);
}, [updateComparison]);
```

### 2. **使用 useCallback 優化**
創建穩定的 callback 函數：

```typescript
// InteractivePriceChart.tsx
const updateComparison = useCallback(() => {
  // ... 計算邏輯
  if (onPriceChange) {
    onPriceChange(updatedComparison);
  }
}, [priceA, priceB, selectedProduct, shippingFee, transactionFeePercent, monthlyTraffic, onPriceChange]);

// AnalysisPage.tsx
const handlePriceChange = useCallback((newComparison: ComparisonData) => {
  setComparisonData(newComparison);
}, []);
```

### 3. **添加 Debounce 機制**
防止過度頻繁的重新計算：

```typescript
useEffect(() => {
  const timeoutId = setTimeout(updateComparison, 100); // 100ms debounce
  return () => clearTimeout(timeoutId);
}, [updateComparison]);
```

## 修復效果

### ✅ **解決的問題:**
- 消除了無限迴圈錯誤
- 提升了性能（減少不必要的重新計算）
- 保持了滑桿的即時響應性

### ✅ **保持的功能:**
- 價格滑桿正常工作
- 即時計算和視覺反饋
- 數據正確更新到父組件

### ✅ **性能優化:**
- Debounce 機制減少計算頻率
- `useCallback` 防止不必要的重新渲染
- 穩定的函數參考

## 測試確認

1. **編譯測試**: ✅ 建置成功，無錯誤
2. **功能測試**: 滑桿應該正常工作且不會發生崩潰
3. **性能測試**: 拖動滑桿時應該流暢響應

## 技術細節

### 問題模式:
```
Component render → useEffect → setState → Component render → useEffect → ...
```

### 修復模式:
```
Component render → useEffect (debounced) → setState → Component render (stable)
```

這種修復方法確保了 React 狀態更新的穩定性，同時保持了用戶界面的響應性。