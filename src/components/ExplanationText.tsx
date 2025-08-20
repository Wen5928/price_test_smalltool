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
  
  const betterPrice = priceA.profit > priceB.profit ? 'Original' : 'New';
  const betterData = betterPrice === 'Original' ? priceA : priceB;
  const worseData = betterPrice === 'Original' ? priceB : priceA;
  
  // Calculate profit improvement with safety checks
  let profitImprovement = 0;
  if (worseData.profit > 0) {
    profitImprovement = ((betterData.profit - worseData.profit) / worseData.profit) * 100;
  } else if (worseData.profit <= 0 && betterData.profit > 0) {
    // If worse scenario has no profit but better scenario does, it's a significant improvement
    profitImprovement = betterData.profit > worseData.profit ? 200 : 0; // Cap at 200% for readability
  } else {
    profitImprovement = 0;
  }
  
  // Cap the improvement percentage at reasonable limits
  profitImprovement = Math.min(Math.max(profitImprovement, -100), 500);

  return (
    <div className="p-6 rounded-lg border border-gray-200">
      <h2 className="text-4xl font-bold mb-6 text-center text-white ">
        So, Why We Need A/B Testing?
      </h2>
      
      <div className="space-y-4 text-white">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className="p-4 rounded border-l-4 border-blue-500">
            <h3 className="font-semibold text-blue-400">Original Price: ${priceA.price}</h3>
            <ul className="mt-2 space-y-1 text-sm text-white">
              <li>Conversion Rate: {priceA.conversionRate.toFixed(2)}%</li>
              <li>Revenue: ${priceA.revenue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</li>
              <li>Profit: ${priceA.profit.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</li>
              <li>Profit Margin: {((priceA.profit / priceA.revenue) * 100).toFixed(1)}%</li>
            </ul>
          </div>
          
          <div className="p-4 rounded border-l-4 border-green-500">
            <h3 className="font-semibold text-green-400">New Price: ${priceB.price}</h3>
            <ul className="mt-2 space-y-1 text-sm text-white">
              <li>Conversion Rate: {priceB.conversionRate.toFixed(2)}%</li>
              <li>Revenue: ${priceB.revenue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</li>
              <li>Profit: ${priceB.profit.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</li>
              <li>Profit Margin: {((priceB.profit / priceB.revenue) * 100).toFixed(1)}%</li>
            </ul>
          </div>
        </div>

        <div className="p-4 rounded border border-gray-200">
          <h3 className="font-semibold mb-3 text-white">📊 Data Analysis Shows:</h3>
          <ul className="space-y-2 text-white">
            <li>• <strong>Conversion Rate Difference:</strong> {conversionDiff.toFixed(2)}% 
              (Price {betterPrice} has {betterData.conversionRate > worseData.conversionRate ? 'higher' : 'lower'} conversion rate)</li>
            <li>• <strong>Revenue Difference:</strong> ${revenueDiff.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} 
              (Price {betterPrice} generates more revenue)</li>
            <li>• <strong>Profit Improvement:</strong> {profitImprovement.toFixed(2)}% 
              (Choosing Price {betterPrice} can increase profit by ${profitDiff.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })})</li>
          </ul>
        </div>

        <div className="p-4 rounded border-l-4 border-yellow-400">
          <h3 className="font-semibold text-yellow-400 mb-2">⚠️ However, This is Just a Theoretical Simulation!</h3>
          <p className="text-sm text-white">
            Real market customer behavior may differ from the assumed normal distribution and can be influenced by various factors such as brand perception, competitors, seasonality, and more.
            Only through actual A/B Testing can you obtain reliable, real-world data.
          </p>
        </div>

        <div className="p-4 rounded border-l-4 border-indigo-400">
          <h3 className="font-semibold text-indigo-400 mb-2">🎯 The Value of A/B Testing:</h3>
          <ul className="text-sm space-y-1 text-white">
            <li>✓ Validate the difference between theoretical assumptions and actual results</li>
            <li>✓ Reduce the risk of price adjustments</li>
            <li>✓ Obtain statistically significant results</li>
            <li>✓ Understand real customer price sensitivity</li>
            <li>✓ Provide data support for future pricing strategies</li>
          </ul>
        </div>

        <div className="text-center mt-6">
          <p className="text-lg font-medium text-white">
            Don't let price guessing impact your revenue!
          </p>
          <p className="text-white mt-2">
            According to the simulation results, the right price choice could bring you a <strong className="text-white">{profitImprovement >= 500 ? '500+' : profitImprovement.toFixed(2)}%</strong> profit improvement.
            Start A/B Testing now and turn simulation into actual revenue.
          </p>
          <p className="text-white mt-2">
            Want to learn more about A/B Testing? Check out
            <a href="https://www.abconvert.io/" target="_blank" rel="noopener noreferrer" className="text-abc-blue-light underline ml-1">ABConvert</a>
          </p>

        </div>
      </div>
    </div>
  );
}