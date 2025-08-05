'use client';

import { useState } from 'react';
import InputPanel from '@/components/InputPanel';
import ResultChart from '@/components/ResultChart';
import ExplanationText from '@/components/ExplanationText';
import ComparisonTable from '@/components/ComparisonTable';
// import ExportSummary from '@/components/ExportSummary';  // Currently not in use
import { generateComparisonData, generateEnhancedChartData, type OECType }  from '@/utils/math';

export default function Home() {
  const [mu, setMu] = useState(30);
  const [sigma, setSigma] = useState(10);
  const [cost, setCost] = useState(20);
  const [traffic, setTraffic] = useState(1000);
  const [minPrice, setMinPrice] = useState(10);
  const [maxPrice, setMaxPrice] = useState(50);
  const [priceA, setPriceA] = useState(25);
  const [priceB, setPriceB] = useState(35);
  const [oec, setOec] = useState<OECType>('profit');

  const enhancedChartData = generateEnhancedChartData(mu, sigma, cost, traffic, minPrice, maxPrice, oec);
  const comparisonData = generateComparisonData(mu, sigma, cost, traffic, minPrice, maxPrice, priceA, priceB);

  return (
    <div className="min-h-screen p-8 sm:p-16 bg-white text-gray-800">
      <main className="max-w-7xl mx-auto flex flex-col gap-12">
        <header className="text-center">
          <div className="flex items-center justify-center gap-4 mb-2">
            <img 
              src="/Logomark color@2x.png" 
              alt="ABConvert Logo" 
              className="w-12 h-12"
            />
            <h1 className="text-4xl font-bold">Price Test Easy Tool</h1>
          </div>
          <p className="text-gray-600 text-lg">
            Simulate how different prices impact your conversion rate, revenue, and profit.
          </p>
        </header>

        {/* Main content grid: Left panels + Right chart */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left column: Input + Comparison */}
          <div className="flex flex-col gap-8">
            {/* Input section */}
            <section>
              <h2 className="text-2xl font-semibold mb-4">Input Parameters</h2>
              <div className="border border-gray-200 rounded p-4 bg-gray-50">
                <InputPanel
                  mu={mu}
                  setMu={setMu}
                  sigma={sigma}
                  setSigma={setSigma}
                  cost={cost}
                  setCost={setCost}
                  traffic={traffic}
                  setTraffic={setTraffic}
                  minPrice={minPrice}
                  setMinPrice={setMinPrice}
                  maxPrice={maxPrice}
                  setMaxPrice={setMaxPrice}
                  oec={oec}
                  setOec={setOec}
                />
              </div>
            </section>

            {/* Comparison Table section */}
            <section>
              <h2 className="text-2xl font-semibold mb-4">Price Comparison Analysis</h2>
              <div className="border border-gray-200 rounded p-4 bg-gray-50">
                <ComparisonTable 
                  priceA={comparisonData.priceA} 
                  priceB={comparisonData.priceB} 
                />
              </div>
            </section>
          </div>

          {/* Right column: Chart */}
          <div>
            <section>
              <h2 className="text-2xl font-semibold mb-4">Result Chart</h2>
              <div className="border border-gray-200 rounded p-4 bg-gray-50">
                <ResultChart 
                  data={enhancedChartData.chartData} 
                  priceA={priceA} 
                  priceB={priceB} 
                  setPriceA={setPriceA}
                  setPriceB={setPriceB}
                  minPrice={minPrice}
                  maxPrice={maxPrice}
                  optimalPrice={enhancedChartData.optimalPrice}
                />
              </div>
            </section>
          </div>
        </div>

        {/* OEC Conclusion - Full width */}
        <section>
          <div className="p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border border-blue-200">
            <h3 className="text-lg font-semibold mb-2 text-center">🎯 Optimal Price Analysis</h3>
            <p className="text-center text-gray-700">
              Based on your selected OEC: <strong>Maximize {enhancedChartData.optimalPrice.metric}</strong>, 
              the best simulated price is: <strong>${enhancedChartData.optimalPrice.price}</strong>
            </p>
            <div className="mt-2 text-center text-sm text-gray-600">
              Expected {enhancedChartData.optimalPrice.metric}: <strong>
                {enhancedChartData.optimalPrice.metric === 'Revenue' ? `$${enhancedChartData.optimalPrice.revenue.toFixed(2)}` :
                 enhancedChartData.optimalPrice.metric === 'Profit' ? `$${enhancedChartData.optimalPrice.profit.toFixed(2)}` :
                 `${enhancedChartData.optimalPrice.conversionRate.toFixed(2)}%`}
              </strong>
            </div>
            
            {/* A/B Individual Data */}
            <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-blue-50 p-4 rounded border-l-4 border-blue-500">
                <h4 className="font-semibold text-blue-800">📊 Price A Details (${priceA})</h4>
                <div className="mt-2 space-y-1 text-sm text-blue-700">
                  <div>Conversion Rate: <strong>{comparisonData.priceA.conversionRate.toFixed(2)}%</strong></div>
                  <div>Revenue: <strong>${comparisonData.priceA.revenue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</strong></div>
                  <div>Profit: <strong>${comparisonData.priceA.profit.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</strong></div>
                  <div>Profit Margin: <strong>{((comparisonData.priceA.profit / comparisonData.priceA.revenue) * 100).toFixed(1)}%</strong></div>
                </div>
              </div>
              
              <div className="bg-green-50 p-4 rounded border-l-4 border-green-500">
                <h4 className="font-semibold text-green-800">📊 Price B Details (${priceB})</h4>
                <div className="mt-2 space-y-1 text-sm text-green-700">
                  <div>Conversion Rate: <strong>{comparisonData.priceB.conversionRate.toFixed(2)}%</strong></div>
                  <div>Revenue: <strong>${comparisonData.priceB.revenue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</strong></div>
                  <div>Profit: <strong>${comparisonData.priceB.profit.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</strong></div>
                  <div>Profit Margin: <strong>{((comparisonData.priceB.profit / comparisonData.priceB.revenue) * 100).toFixed(1)}%</strong></div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Export Summary section - Currently not in use */}
        {/* 
        <section>
          <ExportSummary 
            mu={mu}
            sigma={sigma}
            cost={cost}
            traffic={traffic}
            minPrice={minPrice}
            maxPrice={maxPrice}
            oec={oec}
            optimalPrice={enhancedChartData.optimalPrice}
            priceA={comparisonData.priceA}
            priceB={comparisonData.priceB}
          />
        </section>
        */}

        {/* Explanation section */}
        <section>
          <ExplanationText comparisonData={comparisonData} />
        </section>
      </main>
    </div>
  );
}
