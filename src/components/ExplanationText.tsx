import React from 'react';
import { ComparisonData } from '@/utils/math';

interface ExplanationTextProps {
  comparisonData: ComparisonData;
}

export default function ExplanationText({ comparisonData }: ExplanationTextProps) {
  const { priceA, priceB } = comparisonData;
  
  const conversionDiff = Math.abs(priceA.conversionRate - priceB.conversionRate);
  const revenueDiff = Math.abs(priceA.revenue - priceB.revenue);
  const profitDiff = Math.abs(priceA.profit - priceB.profit);
  
  const betterPrice = priceA.profit > priceB.profit ? 'A' : 'B';
  const betterData = betterPrice === 'A' ? priceA : priceB;
  const worseData = betterPrice === 'A' ? priceB : priceA;
  
  const profitImprovement = ((betterData.profit - worseData.profit) / worseData.profit * 100);

  return (
    <div className="bg-gradient-to-r from-blue-50 to-green-50 p-6 rounded-lg">
      <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">
        所以，為什麼需要 A/B Testing？
      </h2>
      
      <div className="space-y-4 text-gray-700">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className="bg-blue-100 p-4 rounded border-l-4 border-blue-500">
            <h3 className="font-semibold text-blue-800">價格 A: ${priceA.price}</h3>
            <ul className="mt-2 space-y-1 text-sm">
              <li>轉換率: {priceA.conversionRate.toFixed(2)}%</li>
              <li>收益: ${priceA.revenue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</li>
              <li>利潤: ${priceA.profit.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</li>
            </ul>
          </div>
          
          <div className="bg-green-100 p-4 rounded border-l-4 border-green-500">
            <h3 className="font-semibold text-green-800">價格 B: ${priceB.price}</h3>
            <ul className="mt-2 space-y-1 text-sm">
              <li>轉換率: {priceB.conversionRate.toFixed(2)}%</li>
              <li>收益: ${priceB.revenue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</li>
              <li>利潤: ${priceB.profit.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</li>
            </ul>
          </div>
        </div>

        <div className="bg-white p-4 rounded shadow-sm">
          <h3 className="font-semibold mb-3">📊 數據分析顯示：</h3>
          <ul className="space-y-2">
            <li>• <strong>轉換率差異：</strong>{conversionDiff.toFixed(2)}% 
              （價格 {betterPrice} 的轉換率{betterData.conversionRate > worseData.conversionRate ? '更高' : '更低'}）</li>
            <li>• <strong>收益差異：</strong>${revenueDiff.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} 
              （價格 {betterPrice} 帶來更多收益）</li>
            <li>• <strong>利潤提升：</strong>{profitImprovement.toFixed(2)}% 
              （選擇價格 {betterPrice} 可提升利潤 ${profitDiff.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}）</li>
          </ul>
        </div>

        <div className="bg-yellow-50 p-4 rounded border-l-4 border-yellow-400">
          <h3 className="font-semibold text-yellow-800 mb-2">⚠️ 但是，這只是理論模擬！</h3>
          <p className="text-sm">
            真實市場中的客戶行為可能與假設的正態分佈不同，還會受到品牌認知、競爭對手、季節性等多種因素影響。
            唯有透過實際的 A/B Testing，才能獲得真實可靠的數據。
          </p>
        </div>

        <div className="bg-indigo-50 p-4 rounded border-l-4 border-indigo-400">
          <h3 className="font-semibold text-indigo-800 mb-2">🎯 A/B Testing 的價值：</h3>
          <ul className="text-sm space-y-1">
            <li>✓ 驗證理論假設與實際結果的差異</li>
            <li>✓ 降低價格調整的風險</li>
            <li>✓ 獲得統計上顯著的結果</li>
            <li>✓ 了解真實客戶的價格敏感度</li>
            <li>✓ 為未來定價策略提供數據支持</li>
          </ul>
        </div>

        <div className="text-center mt-6">
          <p className="text-lg font-medium text-gray-800">
            別讓價格猜測影響您的營收！
          </p>
          <p className="text-gray-600 mt-2">
            根據模擬結果，正確的價格選擇可能為您帶來 <strong>{profitImprovement.toFixed(2)}%</strong> 的利潤提升。
            立即開始 A/B Testing，將模擬轉化為實際收益。
          </p>
        </div>
      </div>
    </div>
  );
}