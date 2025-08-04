'use client';

import { useState } from 'react';
import InputPanel from '@/components/InputPanel';
import ResultChart from '@/components/ResultChart';
import ExplanationText from '@/components/ExplanationText';
import { generateChartData, generateComparisonData }  from '@/utils/math';

export default function Home() {
  const [mu, setMu] = useState(30);
  const [sigma, setSigma] = useState(5);
  const [cost, setCost] = useState(15);
  const [traffic, setTraffic] = useState(1000);
  const [minPrice, setMinPrice] = useState(20);
  const [maxPrice, setMaxPrice] = useState(40);
  const [priceA, setPriceA] = useState(25);
  const [priceB, setPriceB] = useState(35);

  const chartData = generateChartData(mu, sigma, cost, traffic, minPrice, maxPrice);
  const comparisonData = generateComparisonData(mu, sigma, cost, traffic, minPrice, maxPrice, priceA, priceB);

  return (
    <div className="min-h-screen p-8 sm:p-16 bg-white text-gray-800">
      <main className="max-w-4xl mx-auto flex flex-col gap-12">
        <header className="text-center">
          <h1 className="text-4xl font-bold mb-2">Price Test Easy Tool</h1>
          <p className="text-gray-600 text-lg">
            Simulate how different prices impact your conversion rate, revenue, and profit.
          </p>
        </header>

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
              priceA={priceA}
              setPriceA={setPriceA}
              priceB={priceB}
              setPriceB={setPriceB}
            />
          </div>
        </section>

        {/* Output chart section */}
        <section>
          <h2 className="text-2xl font-semibold mb-4">Result Chart</h2>
          <div className="border border-gray-200 rounded p-4 bg-gray-50">
            <ResultChart data={chartData} priceA={priceA} priceB={priceB} />
          </div>
        </section>

        {/* Explanation section */}
        <section>
          <ExplanationText comparisonData={comparisonData} />
        </section>
      </main>
    </div>
  );
}
