'use client';

import { useState } from 'react';
import InputPanel from '@/components/InputPanel';
import ResultChart from '@/components/ResultChart';
import ExplanationText from '@/components/ExplanationText';
import ComparisonTable from '@/components/ComparisonTable';
// import ExportSummary from '@/components/ExportSummary';  // Currently not in use
import { generateComparisonData, generateChartData }  from '@/utils/math';

export default function Home() {
  const [mu, setMu] = useState(30);
  const [sigma, setSigma] = useState(10);
  const [cost, setCost] = useState(20);
  const [traffic, setTraffic] = useState(1000);
  const [minPrice, setMinPrice] = useState(10);
  const [maxPrice, setMaxPrice] = useState(50);
  const [priceA, setPriceA] = useState(25);
  const [priceB, setPriceB] = useState(35);

  const chartData = generateChartData(mu, sigma, cost, traffic, minPrice, maxPrice);
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
                  data={chartData} 
                  priceA={priceA} 
                  priceB={priceB} 
                  setPriceA={setPriceA}
                  setPriceB={setPriceB}
                  minPrice={minPrice}
                  maxPrice={maxPrice}
                />
              </div>
            </section>
          </div>
        </div>


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
