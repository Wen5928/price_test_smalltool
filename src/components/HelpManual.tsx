'use client';

import React, { useState } from 'react';

export default function HelpManual() {
  const [isVisible, setIsVisible] = useState(false);

  const toggleHelp = () => {
    setIsVisible(!isVisible);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Help Button */}
      <div
        className={`w-12 h-12 rounded-full flex items-center justify-center cursor-pointer shadow-lg transition-all duration-200 hover:scale-110 ${
          isVisible 
            ? 'bg-red-600 hover:bg-red-700' 
            : 'bg-blue-600 hover:bg-blue-700'
        }`}
        onClick={toggleHelp}
        title={isVisible ? "關閉說明" : "開啟使用手冊"}
      >
        <span className="text-white text-xl font-bold">
          {isVisible ? '×' : '?'}
        </span>
      </div>

      {/* Help Panel */}
      {isVisible && (
        <div className="absolute bottom-16 right-0 w-96 bg-white border border-gray-200 rounded-lg shadow-xl max-h-96 overflow-y-auto">
          <div className="p-4">
            <div className="flex items-center gap-2 mb-4 border-b border-gray-200 pb-2">
              <span className="text-blue-600 text-lg">📚</span>
              <h3 className="text-lg font-semibold text-gray-800">使用手冊</h3>
            </div>

            <div className="space-y-4 text-sm text-gray-700">
              {/* Quick Start */}
              <section>
                <h4 className="font-semibold text-blue-600 mb-2 flex items-center gap-1">
                  🚀 快速開始
                </h4>
                <ul className="space-y-1 pl-4">
                  <li>• 選擇「上傳 CSV」或「手動輸入」模式</li>
                  <li>• CSV 模式：上傳 Shopify 檔案 → 篩選商品 → 點擊選擇</li>
                  <li>• 手動模式：直接輸入產品參數</li>
                  <li>• 調整配置設定（運費、手續費等）</li>
                  <li>• 查看圖表和選中商品卡片進行分析</li>
                </ul>
              </section>

              {/* CSV Upload */}
              <section>
                <h4 className="font-semibold text-green-600 mb-2 flex items-center gap-1">
                  📁 CSV 上傳
                </h4>
                <ul className="space-y-1 pl-4">
                  <li>• 支援 Shopify 產品 CSV 格式（含變體）</li>
                  <li>• 必要欄位：Handle, Title, Variant Price, Cost per item</li>
                  <li>• 拖拽檔案或點擊上傳</li>
                  <li>• 一排顯示 3 個商品，預設載入 40 個</li>
                  <li>• 支援搜尋商品名稱、供應商、變體</li>
                  <li>• 可按狀態、分類、供應商篩選</li>
                  <li>• 產品卡片顯示價格、成本、利潤率</li>
                </ul>
              </section>

              {/* Product Filtering */}
              <section>
                <h4 className="font-semibold text-teal-600 mb-2 flex items-center gap-1">
                  🔍 商品篩選
                </h4>
                <ul className="space-y-1 pl-4">
                  <li>• <strong>搜尋欄:</strong> 輸入商品名、供應商、變體名稱</li>
                  <li>• <strong>狀態篩選:</strong> 上架中、草稿等狀態</li>
                  <li>• <strong>分類篩選:</strong> 按產品分類快速定位</li>
                  <li>• <strong>供應商篩選:</strong> 按供應商品牌篩選</li>
                  <li>• 篩選會自動重置載入數量至 40 個</li>
                </ul>
              </section>

              {/* Understanding Metrics */}
              <section>
                <h4 className="font-semibold text-purple-600 mb-2 flex items-center gap-1">
                  📊 指標說明
                </h4>
                <ul className="space-y-1 pl-4">
                  <li>• <strong>COGS:</strong> 成本價格（製造/採購成本）</li>
                  <li>• <strong>Shipping:</strong> 運費成本</li>
                  <li>• <strong>Trans. Fee:</strong> 交易手續費（%）</li>
                  <li>• <strong>Total Cost:</strong> 總成本</li>
                  <li>• <strong>Margin:</strong> 利潤率 = (價格-總成本)/價格×100%</li>
                </ul>
              </section>

              {/* Chart Features */}
              <section>
                <h4 className="font-semibold text-orange-600 mb-2 flex items-center gap-1">
                  📈 圖表功能
                </h4>
                <ul className="space-y-1 pl-4">
                  <li>• <strong>藍色實線:</strong> 轉換率曲線（主要分析線）</li>
                  <li>• <strong>藍色虛線:</strong> Original Price 參考線</li>
                  <li>• <strong>綠色虛線:</strong> New Price 參考線</li>
                  <li>• <strong>紅色實線:</strong> 最佳價格標記</li>
                  <li>• <strong>已選商品卡片:</strong> 顯示當前分析的商品信息</li>
                  <li>• CSV 模式：Original Price 固定，只調整 New Price</li>
                </ul>
              </section>

              {/* Analysis Types */}
              <section>
                <h4 className="font-semibold text-indigo-600 mb-2 flex items-center gap-1">
                  🎯 分析模式
                </h4>
                <ul className="space-y-1 pl-4">
                  <li>• <strong>最大化營收:</strong> 找出營收最高的價格點</li>
                  <li>• <strong>最大化利潤:</strong> 找出利潤最高的價格點</li>
                  <li>• <strong>最大化轉換率:</strong> 找出轉換率最高的價格點</li>
                </ul>
              </section>

              {/* Configuration */}
              <section>
                <h4 className="font-semibold text-red-600 mb-2 flex items-center gap-1">
                  ⚙️ 參數設定
                </h4>
                <ul className="space-y-1 pl-4">
                  <li>• <strong>μ (Mu):</strong> 市場願付價格平均值</li>
                  <li>• <strong>σ (Sigma):</strong> 價格敏感度標準差</li>
                  <li>• <strong>運費:</strong> 每筆訂單運送成本</li>
                  <li>• <strong>手續費:</strong> 金流/平台手續費百分比</li>
                  <li>• <strong>流量:</strong> 預估每月訪客數</li>
                </ul>
              </section>

              {/* Tips */}
              <section className="bg-yellow-50 p-3 rounded">
                <h4 className="font-semibold text-yellow-700 mb-2 flex items-center gap-1">
                  💡 小秘訣
                </h4>
                <ul className="space-y-1 pl-4 text-yellow-800">
                  <li>• 利潤率建議保持在 20% 以上</li>
                  <li>• 使用搜尋功能快速找到特定商品</li>
                  <li>• 善用分類和供應商篩選器縮小範圍</li>
                  <li>• 載入更多商品按鈕一次顯示 40 個</li>
                  <li>• CSV 模式下原價固定，專注調整新價格</li>
                  <li>• 比較不同商品找出最佳價格策略</li>
                </ul>
              </section>
            </div>

            <div className="mt-4 pt-3 border-t border-gray-200 text-center">
              <p className="text-xs text-gray-500">
                點擊右下角 × 按鈕可關閉手冊
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}