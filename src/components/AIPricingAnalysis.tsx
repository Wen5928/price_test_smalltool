'use client';

import React, { useState } from 'react';
import { ProductVariant } from './CsvUploader';
import AIPricingAnalyzer, { BatchAnalysisResult, PricingInsight } from '@/services/aiPricingAnalyzer';

interface AIPricingAnalysisProps {
  products: ProductVariant[];
  onAnalysisComplete?: (results: BatchAnalysisResult) => void;
}

export default function AIPricingAnalysis({ 
  products, 
  onAnalysisComplete 
}: AIPricingAnalysisProps) {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResults, setAnalysisResults] = useState<BatchAnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const runAIAnalysis = async () => {
    if (products.length === 0) return;

    setIsAnalyzing(true);
    setError(null);

    try {
      const analyzer = new AIPricingAnalyzer();
      const results = await analyzer.analyzeBatch(products);
      
      setAnalysisResults(results);
      onAnalysisComplete?.(results);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'AI分析失敗');
      console.error('AI Analysis error:', err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const applyRecommendation = (productId: string, suggestedPrice: number) => {
    // 這裡可以實現應用建議價格的邏輯
    console.log(`Applying price ${suggestedPrice} to product ${productId}`);
  };

  if (products.length === 0) {
    return (
      <div className="text-center text-gray-500 py-8">
        請先上傳CSV文件以開始AI分析
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* AI分析觸發按鈕 */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-white">AI智能定價分析</h3>
          <p className="text-sm text-gray-400">
            分析 {products.length} 個產品，獲得AI驅動的定價建議
          </p>
        </div>
        
        <button
          onClick={runAIAnalysis}
          disabled={isAnalyzing}
          className={`px-6 py-3 rounded-lg font-medium transition-colors ${
            isAnalyzing
              ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
              : 'bg-blue-600 hover:bg-blue-700 text-white'
          }`}
        >
          {isAnalyzing ? (
            <>
              <span className="animate-spin inline-block w-4 h-4 border-2 border-current border-t-transparent rounded-full mr-2"></span>
              分析中...
            </>
          ) : (
            '🧠 開始AI分析'
          )}
        </button>
      </div>

      {/* 錯誤顯示 */}
      {error && (
        <div className="bg-red-900/50 border border-red-600 rounded-lg p-4">
          <h4 className="font-medium text-red-400 mb-2">分析失敗</h4>
          <p className="text-red-300 text-sm">{error}</p>
          <p className="text-xs text-gray-400 mt-2">
            提示：請確保 .env 文件中配置了 OPENAI_API_KEY
          </p>
        </div>
      )}

      {/* 分析結果 */}
      {analysisResults && (
        <div className="space-y-6">
          {/* 整體概述 */}
          <div className="bg-gray-800 rounded-lg p-6">
            <h4 className="text-lg font-semibold text-white mb-4">📊 分析概述</h4>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-400">
                  {analysisResults.insights.length}
                </div>
                <div className="text-sm text-gray-400">產品已分析</div>
              </div>
              
              <div className="text-center">
                <div className="text-2xl font-bold text-green-400">
                  {analysisResults.insights.filter(i => i.potentialImpact.profitChange > 0).length}
                </div>
                <div className="text-sm text-gray-400">利潤改善機會</div>
              </div>
              
              <div className="text-center">
                <div className="text-2xl font-bold text-yellow-400">
                  {analysisResults.categoryAnalysis.length}
                </div>
                <div className="text-sm text-gray-400">類別已分析</div>
              </div>
            </div>

            {/* 整體建議 */}
            {analysisResults.overallRecommendations.length > 0 && (
              <div className="bg-gray-700 rounded p-4">
                <h5 className="font-medium text-white mb-2">💡 關鍵建議</h5>
                <ul className="space-y-1">
                  {analysisResults.overallRecommendations.map((rec, idx) => (
                    <li key={idx} className="text-sm text-gray-300">• {rec}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* 高潛力產品 */}
          {analysisResults.insights.filter(i => Math.abs(i.potentialImpact.profitChange) > 20).length > 0 && (
            <div className="bg-green-900/30 border border-green-600 rounded-lg p-6">
              <h4 className="text-lg font-semibold text-green-400 mb-4">🚀 高潛力產品</h4>
              <div className="grid gap-4">
                {analysisResults.insights
                  .filter(i => Math.abs(i.potentialImpact.profitChange) > 20)
                  .slice(0, 5)
                  .map((insight, idx) => (
                    <PricingInsightCard 
                      key={idx} 
                      insight={insight} 
                      onApplyPrice={applyRecommendation}
                    />
                  ))}
              </div>
            </div>
          )}

          {/* 類別分析 */}
          <div className="bg-gray-800 rounded-lg p-6">
            <h4 className="text-lg font-semibold text-white mb-4">📈 類別表現</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {analysisResults.categoryAnalysis.map((category, idx) => (
                <div key={idx} className="bg-gray-700 rounded p-4">
                  <h5 className="font-medium text-white mb-2">{category.category}</h5>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-400">平均毛利率:</span>
                      <span className={`font-medium ${
                        category.averageMargin > 0.4 ? 'text-green-400' : 
                        category.averageMargin > 0.2 ? 'text-yellow-400' : 'text-red-400'
                      }`}>
                        {(category.averageMargin * 100).toFixed(1)}%
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">價格區間:</span>
                      <span className="text-white">
                        ${category.priceRange.min.toFixed(2)} - ${category.priceRange.max.toFixed(2)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">市場定位:</span>
                      <span className="text-white">{category.competitivePosition}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 市場定位分析 */}
          <div className="bg-gray-800 rounded-lg p-6">
            <h4 className="text-lg font-semibold text-white mb-4">🎯 市場定位分佈</h4>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div className="bg-blue-900/30 rounded p-4">
                <div className="text-2xl font-bold text-blue-400">
                  {analysisResults.marketPositioning.budget.length}
                </div>
                <div className="text-sm text-blue-300">經濟型產品</div>
              </div>
              <div className="bg-yellow-900/30 rounded p-4">
                <div className="text-2xl font-bold text-yellow-400">
                  {analysisResults.marketPositioning.competitive.length}
                </div>
                <div className="text-sm text-yellow-300">主流競爭型</div>
              </div>
              <div className="bg-purple-900/30 rounded p-4">
                <div className="text-2xl font-bold text-purple-400">
                  {analysisResults.marketPositioning.premium.length}
                </div>
                <div className="text-sm text-purple-300">高端產品</div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// 單個定價建議卡片組件
function PricingInsightCard({ 
  insight, 
  onApplyPrice 
}: { 
  insight: PricingInsight; 
  onApplyPrice: (productId: string, suggestedPrice: number) => void;
}) {
  const priceChange = insight.suggestedPrice - insight.currentPrice;
  const priceChangePercent = (priceChange / insight.currentPrice) * 100;

  return (
    <div className="bg-gray-700 rounded p-4">
      <div className="flex justify-between items-start mb-3">
        <div>
          <h6 className="font-medium text-white">{insight.productId}</h6>
          <div className="flex items-center gap-4 mt-1">
            <span className="text-sm text-gray-400">
              當前: ${insight.currentPrice.toFixed(2)}
            </span>
            <span className="text-sm text-green-400">
              建議: ${insight.suggestedPrice.toFixed(2)}
            </span>
            <span className={`text-sm font-medium ${
              priceChange > 0 ? 'text-green-400' : 'text-red-400'
            }`}>
              {priceChange > 0 ? '+' : ''}${priceChange.toFixed(2)} 
              ({priceChangePercent > 0 ? '+' : ''}{priceChangePercent.toFixed(1)}%)
            </span>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <div className={`px-2 py-1 rounded text-xs ${
            insight.confidence > 0.8 ? 'bg-green-900 text-green-300' :
            insight.confidence > 0.6 ? 'bg-yellow-900 text-yellow-300' :
            'bg-red-900 text-red-300'
          }`}>
            信心度 {(insight.confidence * 100).toFixed(0)}%
          </div>
          
          <button
            onClick={() => onApplyPrice(insight.productId, insight.suggestedPrice)}
            className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white text-xs rounded transition-colors"
          >
            應用
          </button>
        </div>
      </div>

      {/* 分析原因 */}
      <div className="space-y-1 mb-3">
        {insight.reasoning.slice(0, 2).map((reason, idx) => (
          <div key={idx} className="text-xs text-gray-400">• {reason}</div>
        ))}
      </div>

      {/* 預期影響 */}
      <div className="grid grid-cols-2 gap-4 text-xs">
        <div>
          <span className="text-gray-400">利潤變化: </span>
          <span className={insight.potentialImpact.profitChange > 0 ? 'text-green-400' : 'text-red-400'}>
            {insight.potentialImpact.profitChange > 0 ? '+' : ''}
            {insight.potentialImpact.profitChange.toFixed(1)}%
          </span>
        </div>
        <div>
          <span className="text-gray-400">風險等級: </span>
          <span className={`${
            insight.potentialImpact.riskLevel === 'low' ? 'text-green-400' :
            insight.potentialImpact.riskLevel === 'medium' ? 'text-yellow-400' :
            'text-red-400'
          }`}>
            {insight.potentialImpact.riskLevel === 'low' ? '低' :
             insight.potentialImpact.riskLevel === 'medium' ? '中' : '高'}
          </span>
        </div>
      </div>
    </div>
  );
}