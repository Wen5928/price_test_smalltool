'use client';

import { useState, useEffect } from 'react';
import InputPanel from '@/components/InputPanel';
import ResultChart from '@/components/ResultChart';
import ExplanationText from '@/components/ExplanationText';
import ComparisonTable from '@/components/ComparisonTable';
import CsvUploader, { ProductData } from '@/components/CsvUploader';
import OptimalPriceConclusion from '@/components/OptimalPriceConclusion';
import HelpManual from '@/components/HelpManual';
// import ExportSummary from '@/components/ExportSummary';  // Currently not in use
import { generateComparisonData, generateChartData, generateEnhancedChartData, OECType }  from '@/utils/math';

export default function Home() {
  const [mu, setMu] = useState(30);
  const [sigma, setSigma] = useState(10);
  const [cost, setCost] = useState(20);
  const [cogs, setCogs] = useState(0);
  const [shippingFee, setShippingFee] = useState(0);
  const [transactionFeePercent, setTransactionFeePercent] = useState(1.5);
  const [traffic, setTraffic] = useState(1000);
  const [minPrice, setMinPrice] = useState(Math.round(mu * 0.7));
  const [maxPrice, setMaxPrice] = useState(Math.round(mu * 1.3));
  const [priceA, setPriceA] = useState(25);
  const [priceB, setPriceB] = useState(35);
  const [inputMode, setInputMode] = useState<'manual' | 'csv'>('csv');
  const [oec, setOec] = useState<OECType>('profit');
  const [isProductSelected, setIsProductSelected] = useState(false);
  const [gmv, setGmv] = useState(0);
  const [sellingTraffic, setSellingTraffic] = useState(1000);
  const [conversionRate, setConversionRate] = useState(50);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);

  // Use sellingTraffic for CSV mode, traffic for manual mode
  const effectiveTraffic = inputMode === 'csv' ? sellingTraffic : traffic;
  const effectiveConversionRate = inputMode === 'csv' && isProductSelected ? conversionRate : undefined;
  const effectiveGmv = inputMode === 'csv' && isProductSelected ? gmv : undefined;
  
  // In CSV mode, pass actual product price as originalPrice
  const originalPrice = inputMode === 'csv' && isProductSelected ? priceA : undefined;
  const chartData = generateChartData(mu, sigma, cost, effectiveTraffic, minPrice, maxPrice, cogs, shippingFee, transactionFeePercent, effectiveConversionRate, effectiveGmv, originalPrice);
  const comparisonData = generateComparisonData(mu, sigma, cost, effectiveTraffic, minPrice, maxPrice, priceA, priceB, cogs, shippingFee, transactionFeePercent, effectiveConversionRate, effectiveGmv);
  const enhancedData = generateEnhancedChartData(mu, sigma, cost, effectiveTraffic, minPrice, maxPrice, oec, cogs, shippingFee, transactionFeePercent, effectiveConversionRate, effectiveGmv, priceA);

  // Adjust maxPrice if it's less than or equal to optimal price
  useEffect(() => {
    if (enhancedData.optimalPrice && maxPrice <= enhancedData.optimalPrice.price) {
      setMaxPrice(Math.round(enhancedData.optimalPrice.price) + 1);
    }
  }, [enhancedData.optimalPrice, maxPrice]);

  const handleProductSelect = (product: ProductData, variant: any) => {
    setCogs(product.costPerItem);
    setSelectedProduct(variant);
    
    // In CSV mode, set mu to product price so optimal price calculation will be correct
    if (inputMode === 'csv') {
      setMu(product.price);
      // cost is set to 0 in CSV mode because actual cost is already in cogs
      setCost(0);
      
      // Only adjust shipping fee when product has shipping requirements, otherwise keep default
      if (variant.requiresShipping !== undefined) {
        if (!variant.requiresShipping) {
          setShippingFee(0); // Digital products or products that don't require shipping
        }
        // If requires shipping but no more info, keep original setting
      }
      
      // If product has weight info, can adjust shipping fee based on weight
      if (variant.weight !== undefined && variant.weight > 0 && variant.requiresShipping) {
        if (variant.weight > 1000) { // Over 1kg
          setShippingFee(Math.max(shippingFee, 9.99)); // Higher shipping fee for heavy items
        }
      }
      
      // If there's product type info, can use it to determine if it's a digital product
      if (variant.type && variant.type.toLowerCase().includes('digital')) {
        setShippingFee(0);
      }
      
      // Adjust transaction fee (%) based on tariff info
      if (variant.tariff !== undefined) {
        if (variant.tariff) {
          // If there's tariff, increase transaction fee percentage
          setTransactionFeePercent(3.9); // Higher handling fee rate including tariff
        } else {
          // No tariff, use standard transaction fee
          setTransactionFeePercent(2.9); // Standard payment processing fee percentage
        }
      }
      
      // Adjust some settings based on tags (if any)
      if (variant.tags) {
        const tags = variant.tags.toLowerCase();
        if (tags.includes('free-shipping') || tags.includes('free_shipping')) {
          setShippingFee(0);
        }
        if (tags.includes('high-conversion') && !conversionRate) {
          setConversionRate(5.0);
        }
      }
    }
    
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
            <section>
              <h2 className="text-2xl font-semibold mb-4">Configuration</h2>
              <div className="border border-gray-200 rounded p-4 bg-gray-50 flex flex-col gap-6">
                
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
                      transactionFeePercent={transactionFeePercent}
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

              </div>
            </section>
          </div>

          {/* Right column: Configuration + Chart */}
          <div className="space-y-6">
            {/* Configuration Settings for CSV mode */}
            {inputMode === 'csv' && (
              <section>
                <h2 className="text-2xl font-semibold mb-4">Configuration Settings</h2>
                <div className="border border-gray-200 rounded p-4 bg-gray-50">
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    <label className="block">
                      <span className="text-xs font-medium text-gray-600">Shipping Fee ($):</span>
                      <input 
                        type="number" 
                        value={shippingFee} 
                        onChange={(e) => setShippingFee(parseFloat(e.target.value) || 0)}
                        className="w-full mt-1 px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                        step="0.01"
                        min="0"
                      />
                    </label>
                    <label className="block">
                      <span className="text-xs font-medium text-gray-600">Transaction Fee (%):</span>
                      <input 
                        type="number" 
                        value={transactionFeePercent} 
                        onChange={(e) => setTransactionFeePercent(parseFloat(e.target.value) || 0)}
                        className="w-full mt-1 px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                        step="0.1"
                        min="0"
                        max="100"
                      />
                    </label>
                    <label className="block">
                      <span className="text-xs font-medium text-gray-600">GMV ($):</span>
                      <input 
                        type="number" 
                        value={gmv} 
                        onChange={(e) => setGmv(parseFloat(e.target.value) || 0)}
                        className="w-full mt-1 px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                        step="0.01"
                        min="0"
                      />
                    </label>
                    <label className="block">
                      <span className="text-xs font-medium text-gray-600">Traffic:</span>
                      <input 
                        type="number" 
                        value={sellingTraffic} 
                        onChange={(e) => setSellingTraffic(parseFloat(e.target.value) || 0)}
                        className="w-full mt-1 px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                        step="1"
                        min="1"
                      />
                    </label>
                    <label className="block">
                      <span className="text-xs font-medium text-gray-600">Conversion Rate (%):</span>
                      <input 
                        type="number" 
                        value={conversionRate} 
                        onChange={(e) => setConversionRate(parseFloat(e.target.value) || 0)}
                        className="w-full mt-1 px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                        step="0.01"
                        min="0"
                        max="100"
                      />
                    </label>
                  </div>
                </div>
              </section>
            )}
            
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
                    oec={oec}
                    setOec={setOec}
                    isCSVMode={inputMode === 'csv'}
                    selectedProduct={selectedProduct}
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
                <OptimalPriceConclusion 
                  optimalPrice={enhancedData.optimalPrice} 
                  oec={oec}
                  inputMode={inputMode}
                  sellingTraffic={sellingTraffic}
                  conversionRate={conversionRate}
                  shippingFee={shippingFee}
                  transactionFeePercent={transactionFeePercent}
                  gmv={gmv}
                />
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
      
      {/* Help Manual - Fixed position */}
      <HelpManual />
    </div>
  );
}
