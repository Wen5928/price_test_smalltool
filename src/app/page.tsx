'use client';

import { useState } from 'react';
import InputPanel from '@/components/InputPanel';
import ResultChart from '@/components/ResultChart';
import ExplanationText from '@/components/ExplanationText';
import ComparisonTable from '@/components/ComparisonTable';
import CsvUploader, { ProductData } from '@/components/CsvUploader';
import OecSelector from '@/components/OecSelector';
import OptimalPriceConclusion from '@/components/OptimalPriceConclusion';
// import ExportSummary from '@/components/ExportSummary';  // Currently not in use
import { generateComparisonData, generateChartData, generateEnhancedChartData, OECType }  from '@/utils/math';

export default function Home() {
  const [mu, setMu] = useState(30);
  const [sigma, setSigma] = useState(10);
  const [cost, setCost] = useState(20);
  const [cogs, setCogs] = useState(0);
  const [shippingFee, setShippingFee] = useState(0);
  const [transactionFeePercent, setTransactionFeePercent] = useState(2.9);
  const [traffic, setTraffic] = useState(1000);
  const [minPrice, setMinPrice] = useState(Math.round(mu * 0.7));
  const [maxPrice, setMaxPrice] = useState(Math.round(mu * 1.3));
  const [priceA, setPriceA] = useState(25);
  const [priceB, setPriceB] = useState(35);
  const [inputMode, setInputMode] = useState<'manual' | 'csv'>('csv');
  const [oec, setOec] = useState<OECType>('profit');
  const [isProductSelected, setIsProductSelected] = useState(false);

  const chartData = generateChartData(mu, sigma, cost, traffic, minPrice, maxPrice, cogs, shippingFee, transactionFeePercent);
  const comparisonData = generateComparisonData(mu, sigma, cost, traffic, minPrice, maxPrice, priceA, priceB, cogs, shippingFee, transactionFeePercent);
  const enhancedData = generateEnhancedChartData(mu, sigma, cost, traffic, minPrice, maxPrice, oec, cogs, shippingFee, transactionFeePercent);

  const handleProductSelect = (product: ProductData) => {
    setCogs(product.costPerItem);
    setMinPrice(1);
    setMaxPrice(Math.round(product.price * 2));
    setPriceA(product.price);
    setPriceB(product.price + 5);
    setIsProductSelected(true);
  };

  // Update min/max price when mu changes
  const handleMuChange = (value: number) => {
    setMu(value);
    if (inputMode === 'manual') {
      setMinPrice(Math.round(value * 0.7));
      setMaxPrice(Math.round(value * 1.3));
    }
  };

  // Reset product selection when switching to manual mode
  const handleModeChange = (mode: 'manual' | 'csv') => {
    setInputMode(mode);
    if (mode === 'manual') {
      setIsProductSelected(true); // Always show chart in manual mode
    } else {
      setIsProductSelected(false); // Hide chart until product is selected
    }
  };

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
          {/* Left column: All inputs in one section */}
          <div>
            <section className="h-full">
              <h2 className="text-2xl font-semibold mb-4">Configuration</h2>
              <div className="border border-gray-200 rounded p-4 bg-gray-50 h-[calc(100%-2.5rem)] flex flex-col gap-6">
                
                {/* Mode selector */}
                <div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleModeChange('csv')}
                      className={`px-4 py-2 rounded ${inputMode === 'csv' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'}`}
                    >
                      Upload CSV
                    </button>
                    <button
                      onClick={() => handleModeChange('manual')}
                      className={`px-4 py-2 rounded ${inputMode === 'manual' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'}`}
                    >
                      Manual Input
                    </button>
                  </div>
                </div>

                {/* Input Parameters */}
                <div className="flex-1">
                  <h3 className="font-semibold mb-3">Input Parameters</h3>
                  {inputMode === 'csv' ? (
                    <CsvUploader 
                      onProductSelect={handleProductSelect} 
                      shippingFee={shippingFee}
                      setShippingFee={setShippingFee}
                      transactionFeePercent={transactionFeePercent}
                      setTransactionFeePercent={setTransactionFeePercent}
                    />
                  ) : (
                    <InputPanel
                      mu={mu}
                      setMu={handleMuChange}
                      sigma={sigma}
                      setSigma={setSigma}
                      cost={cost}
                      setCost={setCost}
                      cogs={cogs}
                      setCogs={setCogs}
                      shippingFee={shippingFee}
                      setShippingFee={setShippingFee}
                      transactionFeePercent={transactionFeePercent}
                      setTransactionFeePercent={setTransactionFeePercent}
                      traffic={traffic}
                      setTraffic={setTraffic}
                      minPrice={minPrice}
                      setMinPrice={setMinPrice}
                      maxPrice={maxPrice}
                      setMaxPrice={setMaxPrice}
                    />
                  )}
                </div>

                {/* OEC Selector */}
                <div className="border-t pt-4">
                  <OecSelector oec={oec} setOec={setOec} />
                </div>
              </div>
            </section>
          </div>

          {/* Right column: Chart */}
          <div>
            <section>
              <h2 className="text-2xl font-semibold mb-4">Result Chart</h2>
              <div className="border border-gray-200 rounded p-4 bg-gray-50">
                {(inputMode === 'manual' || isProductSelected) ? (
                  <ResultChart 
                    data={chartData} 
                    priceA={priceA} 
                    priceB={priceB} 
                    setPriceA={setPriceA}
                    setPriceB={setPriceB}
                    minPrice={minPrice}
                    maxPrice={maxPrice}
                    optimalPrice={enhancedData.optimalPrice}
                  />
                ) : (
                  <div className="h-[400px] flex items-center justify-center text-gray-500">
                    <div className="text-center">
                      <div className="text-4xl mb-4">📊</div>
                      <p className="text-lg font-medium">Upload CSV and select a product to see the analysis</p>
                      <p className="text-sm mt-2">The chart will appear once you choose a product from your uploaded file</p>
                    </div>
                  </div>
                )}
              </div>
            </section>
          </div>
        </div>

        {/* Analysis section: Comparison Table and Optimal Price side by side */}
        {(inputMode === 'manual' || isProductSelected) && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Comparison Table section */}
            <section className="flex flex-col">
              <h2 className="text-2xl font-semibold mb-4">Price Comparison Analysis</h2>
              <div className="border border-gray-200 rounded p-4 bg-gray-50 flex-1">
                <ComparisonTable 
                  priceA={comparisonData.priceA} 
                  priceB={comparisonData.priceB} 
                />
              </div>
            </section>

            {/* Optimal Price section */}
            <section className="flex flex-col">
              <h2 className="text-2xl font-semibold mb-4">Optimal Price Analysis</h2>
              <div className="flex-1">
                <OptimalPriceConclusion optimalPrice={enhancedData.optimalPrice} oec={oec} />
              </div>
            </section>
          </div>
        )}


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
        {(inputMode === 'manual' || isProductSelected) && (
          <section>
            <ExplanationText comparisonData={comparisonData} />
          </section>
        )}
      </main>
    </div>
  );
}
