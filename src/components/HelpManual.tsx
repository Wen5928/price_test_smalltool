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
                  <li>• CSV 模式：上傳 Shopify 產品檔案並選擇產品</li>
                  <li>• 手動模式：直接輸入產品參數</li>
                  <li>• 查看右側圖表進行價格分析</li>
                </ul>
              </section>

              {/* CSV Upload */}
              <section>
                <h4 className="font-semibold text-green-600 mb-2 flex items-center gap-1">
                  📁 CSV 上傳
                </h4>
                <ul className="space-y-1 pl-4">
                  <li>• 支援 Shopify 產品 CSV 格式</li>
                  <li>• 必要欄位：Handle, Title, Variant Price, Cost per item</li>
                  <li>• 拖拽檔案或點擊上傳</li>
                  <li>• 產品列表顯示關鍵成本資訊</li>
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
                  <li>• <strong>藍線:</strong> 轉換率曲線</li>
                  <li>• <strong>綠線:</strong> 營收曲線</li>
                  <li>• <strong>紫線:</strong> 利潤曲線</li>
                  <li>• <strong>紅點:</strong> 最佳價格點</li>
                  <li>• 拖拉滑桿調整價格範圍</li>
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
                  <li>• 定期調整參數以反映市場變化</li>
                  <li>• 比較不同產品的表現找出最佳組合</li>
                  <li>• 使用 A/B 測試驗證分析結果</li>
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