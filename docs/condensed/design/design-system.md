# 🎨 設計系統

## ABC 色彩系統

### 主要色彩
```css
:root {
  /* Primary Brand Colors */
  --abc-blue: #3B82F6;           /* 主品牌色 - 原始價格 */
  --abc-green: #10B981;          /* 成功/新價格 - 正面指標 */
  --abc-red: #EF4444;            /* 最佳價格/警告 - 關鍵標記 */
  --abc-yellow: #F59E0B;         /* 警告/中性 - 注意事項 */
  
  /* Neutral Colors */
  --abc-gray-50: #F9FAFB;        /* 極淺灰 */
  --abc-gray-400: #9CA3AF;       /* 中灰 - 次要文字 */
  --abc-gray-600: #4B5563;       /* 深灰 - 主要文字 */
  --abc-gray-700: #374151;       /* 深灰 - 卡片邊框 */
  --abc-gray-800: #1F2937;       /* 極深灰 - 卡片背景 */
  --abc-gray-900: #111827;       /* 黑色 - 主背景 */
}
```

### 語義化色彩
```css
/* Functional Colors */
:root {
  /* Background Layers */
  --abc-bg-primary: var(--abc-gray-900);     /* 主背景 */
  --abc-bg-secondary: var(--abc-gray-800);   /* 卡片背景 */
  --abc-bg-tertiary: var(--abc-gray-700);    /* 輸入框背景 */
  
  /* Text Colors */
  --abc-text-primary: #FFFFFF;              /* 主要文字 */
  --abc-text-secondary: var(--abc-gray-400); /* 次要文字 */
  --abc-text-muted: var(--abc-gray-600);     /* 輔助文字 */
  
  /* Interactive Colors */
  --abc-hover: var(--abc-gray-700);          /* 懸停狀態 */
  --abc-focus: var(--abc-blue);              /* 焦點狀態 */
  --abc-active: var(--abc-green);            /* 激活狀態 */
}
```

## 組件設計規範

### 1. 按鈕系統
```css
/* Primary Button */
.btn-primary {
  background: var(--abc-blue);
  color: white;
  padding: 0.75rem 1.5rem;
  border-radius: 0.5rem;
  font-weight: 600;
  transition: all 0.2s ease;
}

.btn-primary:hover {
  background: #2563EB; /* 深藍 */
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.4);
}

/* Success Button (綠色) */
.btn-success {
  background: var(--abc-green);
  color: white;
}

/* Danger Button (紅色) */  
.btn-danger {
  background: var(--abc-red);
  color: white;
}
```

### 2. 卡片組件
```css
.card {
  background: var(--abc-bg-secondary);
  border: 1px solid var(--abc-gray-700);
  border-radius: 0.75rem;
  padding: 1.5rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.card-highlight {
  border: 2px solid var(--abc-blue);
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}
```

### 3. 輸入控件
```css
/* Input Fields */
.input-field {
  background: var(--abc-bg-tertiary);
  border: 2px solid transparent;
  border-radius: 0.5rem;
  padding: 0.75rem 1rem;
  color: var(--abc-text-primary);
  font-size: 0.875rem;
  transition: all 0.2s ease;
}

.input-field:focus {
  outline: none;
  border-color: var(--abc-blue);
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

/* Range Sliders */
.slider-blue::-webkit-slider-thumb {
  appearance: none;
  height: 20px;
  width: 20px;
  background: var(--abc-blue);
  border-radius: 50%;
  cursor: pointer;
  border: 2px solid white;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

.slider-green::-webkit-slider-thumb {
  background: var(--abc-green);
}
```

## 版面佈局規範

### 1. 柵格系統
```css
/* Container Sizes */
.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
}

/* Responsive Grid */
.grid {
  display: grid;
  gap: 1.5rem;
}

.grid-cols-1 { grid-template-columns: 1fr; }
.grid-cols-2 { grid-template-columns: 1fr 1fr; }
.grid-cols-3 { grid-template-columns: 1fr 1fr 1fr; }

@media (max-width: 768px) {
  .grid-cols-2,
  .grid-cols-3 {
    grid-template-columns: 1fr;
  }
}
```

### 2. 間距系統
```css
/* Spacing Scale */
:root {
  --spacing-xs: 0.25rem;   /* 4px */
  --spacing-sm: 0.5rem;    /* 8px */
  --spacing-md: 1rem;      /* 16px */
  --spacing-lg: 1.5rem;    /* 24px */
  --spacing-xl: 2rem;      /* 32px */
  --spacing-2xl: 3rem;     /* 48px */
}
```

### 3. 響應式斷點
```css
/* Mobile First Breakpoints */
@media (min-width: 375px) { /* Mobile */ }
@media (min-width: 768px) { /* Tablet */ }
@media (min-width: 1024px) { /* Laptop */ }
@media (min-width: 1440px) { /* Desktop */ }
```

## 圖表視覺化規範

### 1. 圖表色彩映射
```typescript
const chartColors = {
  original: '#3B82F6',        // 原始價格 - 藍色
  new: '#10B981',            // 新價格 - 綠色  
  optimal: '#EF4444',        // 最佳價格 - 紅色
  background: '#1F2937',     // 圖表背景
  grid: '#374151',           // 網格線
  text: '#9CA3AF'            // 標籤文字
};
```

### 2. 滑桿視覺化
```css
/* Price Range Visualization */
.price-range-bar {
  height: 8px;
  background: var(--abc-gray-700);
  border-radius: 4px;
  position: relative;
  overflow: hidden;
}

/* Price Markers */
.price-marker {
  position: absolute;
  top: 0;
  width: 2px;
  height: 100%;
  z-index: 10;
}

.price-marker-original { background: var(--abc-blue); }
.price-marker-new { background: var(--abc-green); }
.price-marker-optimal { background: var(--abc-red); }
```

## 動效系統

### 1. 過渡動畫
```css
/* Standard Transitions */
.transition-fast { transition: all 0.15s ease; }
.transition-base { transition: all 0.2s ease; }
.transition-slow { transition: all 0.3s ease; }

/* Specific Animations */
.fade-in {
  animation: fadeIn 0.3s ease forwards;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

.slide-up {
  animation: slideUp 0.4s cubic-bezier(0.4, 0, 0.2, 1) forwards;
}

@keyframes slideUp {
  from { transform: translateY(20px); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
}
```

### 2. 載入動畫
```css
/* Skeleton Loading */
.skeleton {
  background: linear-gradient(
    90deg,
    var(--abc-gray-800) 25%,
    var(--abc-gray-700) 50%,
    var(--abc-gray-800) 75%
  );
  background-size: 200% 100%;
  animation: loading 1.5s infinite;
}

@keyframes loading {
  0% { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}

/* Spinner */
.spinner {
  border: 2px solid var(--abc-gray-700);
  border-top: 2px solid var(--abc-blue);
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
```

## 無障礙設計

### 1. 色彩對比
```css
/* WCAG AA Compliance */
.text-high-contrast { color: #FFFFFF; } /* 21:1 對比度 */
.text-medium-contrast { color: #D1D5DB; } /* 7:1 對比度 */
.text-low-contrast { color: #9CA3AF; } /* 4.5:1 對比度 */
```

### 2. 鍵盤導航
```css
/* Focus Indicators */
.focusable:focus {
  outline: 2px solid var(--abc-blue);
  outline-offset: 2px;
}

.focus-ring:focus {
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.5);
}
```

### 3. 螢幕閱讀器支援
```html
<!-- Semantic HTML Examples -->
<button aria-label="設置為最佳價格">Set to Optimal</button>
<input aria-describedby="price-help" />
<div id="price-help">輸入產品的當前售價</div>
<div role="status" aria-live="polite">分析完成</div>
```