'use client';

import { useState, useEffect } from 'react';
import InputPanel from '@/components/InputPanel';
import ResultChart from '@/components/ResultChart';
import ExplanationText from '@/components/ExplanationText';
import ComparisonTable from '@/components/ComparisonTable';
import CsvUploader, { ProductData } from '@/components/CsvUploader';
import OptimalPriceConclusion from '@/components/OptimalPriceConclusion';
import HelpManual from '@/components/HelpManual';
import Tooltip from '@/components/Tooltip';
import StepIndicator from '@/components/StepIndicator';
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
  const [targetConversionRate, setTargetConversionRate] = useState<number>(3.0);
  const [showAdvanced, setShowAdvanced] = useState(false);

  // Use sellingTraffic for CSV mode, traffic for manual mode
  const effectiveTraffic = inputMode === 'csv' ? sellingTraffic : traffic;
  const effectiveConversionRate = inputMode === 'csv' && isProductSelected ? conversionRate : undefined;
  const effectiveGmv = inputMode === 'csv' && isProductSelected ? gmv : undefined;
  
  // In CSV mode, pass actual product price as originalPrice
  const originalPrice = inputMode === 'csv' && isProductSelected ? priceA : undefined;
  const chartData = generateChartData(mu, sigma, cost, effectiveTraffic, minPrice, maxPrice, cogs, shippingFee, transactionFeePercent, effectiveConversionRate, effectiveGmv, originalPrice);
  const comparisonData = generateComparisonData(mu, sigma, cost, effectiveTraffic, minPrice, maxPrice, priceA, priceB, cogs, shippingFee, transactionFeePercent, effectiveConversionRate, effectiveGmv);
  const enhancedData = generateEnhancedChartData(mu, sigma, cost, effectiveTraffic, minPrice, maxPrice, oec, cogs, shippingFee, transactionFeePercent, effectiveConversionRate, effectiveGmv, priceA, targetConversionRate);

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

  // Handle step navigation
  const handleStepClick = (stepId: string) => {
    const element = document.getElementById(stepId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  // Generate steps based on current state
  const getSteps = () => {
    const steps = [
      {
        id: 'select-mode',
        title: 'Select Input Method',
        description: 'Choose CSV upload or manual input',
        status: 'completed' as const,
        onClick: () => handleStepClick('step-select-mode')
      },
      {
        id: 'upload-data',
        title: inputMode === 'csv' ? 'Upload & Select Product' : 'Configure Parameters',
        description: inputMode === 'csv' 
          ? 'Upload Shopify CSV and choose a product' 
          : 'Enter product pricing parameters',
        status: (inputMode === 'csv' ? isProductSelected : true) ? 'completed' as const : 'current' as const,
        onClick: () => handleStepClick('step-upload-data')
      },
      {
        id: 'adjust-settings',
        title: 'Fine-tune Settings',
        description: 'Adjust shipping, fees, and traffic data',
        status: (inputMode === 'csv' ? isProductSelected : true) ? 'current' as const : 'pending' as const,
        onClick: () => handleStepClick('step-adjust-settings')
      },
      {
        id: 'analyze-results',
        title: 'View Analysis',
        description: 'Review pricing recommendations and insights',
        status: (inputMode === 'csv' ? isProductSelected : true) ? 'current' as const : 'pending' as const,
        onClick: () => handleStepClick('step-analyze-results')
      }
    ];

    return steps;
  };

  return (
    <div className="min-h-screen p-8 sm:p-16 bg-background text-foreground">
      <main className="max-w-7xl mx-auto flex flex-col gap-12">
        <header className="text-center">
          <div className="flex items-center justify-center gap-4 mb-4">
            <img 
              src="/company_icon.png" 
              alt="ABConvert Logo" 
              className="w-12 h-12"
            />
            <h1 className="text-4xl font-bold">Shopify A/B Price Testing Tool</h1>
          </div>
          <p className="text-gray-300 text-lg mb-8">
            <strong>Professional pricing analysis tool designed exclusively for Shopify merchants.</strong><br/>
            Upload your Shopify product CSV exports to analyze optimal pricing strategies.
          </p>
          
          {/* Step Indicator */}
          <StepIndicator steps={getSteps()} />
        </header>

        {/* Step 1: Input Method Selection */}
        <div id="step-select-mode" className="border border-default rounded-lg p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <button 
              onClick={() => handleStepClick('step-select-mode')}
              className="w-6 h-6 bg-abc-blue-primary text-white rounded-full flex items-center justify-center text-sm hover:bg-abc-blue-secondary transition-colors cursor-pointer"
            >
              1
            </button>
            Select Input Method
          </h2>
          <div className="flex gap-3">
            <button
              onClick={() => handleModeChange('csv')}
              className={`px-6 py-3 rounded-lg transition-colors font-medium border ${
                inputMode === 'csv' 
                  ? 'bg-abc-blue-primary text-white border-abc-blue-primary' 
                  : 'bg-transparent text-gray-300 border-gray-600 hover:border-gray-500 hover:text-gray-200'
              }`}
            >
              📊 Upload Shopify CSV
            </button>
            <button
              onClick={() => handleModeChange('manual')}
              className={`px-6 py-3 rounded-lg transition-colors font-medium border ${
                inputMode === 'manual' 
                  ? 'bg-abc-blue-primary text-white border-abc-blue-primary' 
                  : 'bg-transparent text-gray-300 border-gray-600 hover:border-gray-500 hover:text-gray-200'
              }`}
            >
              ⌨️ Manual Input
            </button>
          </div>
        </div>

        {/* CSV Mode: Two-column layout with product selection and preview */}
        <div className={`transition-all duration-500 ${inputMode === 'csv' ? 'grid grid-cols-1 xl:grid-cols-2 gap-8' : ''}`}>
          {inputMode === 'csv' && (
            <>
              {/* Step 2: Product Upload & Selection */}
              <div id="step-upload-data" className="border border-default rounded-lg p-6">
                <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                  <button 
                    onClick={() => handleStepClick('step-upload-data')}
                    className="w-6 h-6 bg-abc-blue-secondary text-white rounded-full flex items-center justify-center text-sm hover:bg-abc-blue-light transition-colors cursor-pointer"
                  >
                    2
                  </button>
                  Upload & Select Product
                </h2>
                <div className="mb-4 p-3 rounded-lg border-l-4 border-abc-blue-secondary">
                  <p className="text-sm text-gray-300">
                    <strong>💡 Tip:</strong> After uploading your Shopify CSV, select a product to see its pricing analysis on the right.
                  </p>
                </div>
                <CsvUploader 
                  onProductSelect={handleProductSelect} 
                  shippingFee={shippingFee}
                  transactionFeePercent={transactionFeePercent}
                />
              </div>

              {/* Step 3: Live Analysis & Results */}
              <div className={`border border-default rounded-lg p-6 ${isProductSelected ? 'border-abc-blue-secondary' : 'border-gray-600'}`}>
                <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                  <button 
                    onClick={() => handleStepClick('step-analyze-results')}
                    className={`w-6 h-6 rounded-full flex items-center justify-center text-sm transition-colors cursor-pointer ${
                      isProductSelected 
                        ? 'bg-abc-blue-secondary text-white hover:bg-abc-blue-light' 
                        : 'bg-gray-600 text-gray-400 hover:bg-gray-500'
                    }`}
                  >
                    3
                  </button>
                  Analysis Results
                  {isProductSelected && selectedProduct && (
                    <span className="ml-2 px-2 py-1 bg-abc-blue-secondary text-white text-xs rounded-full">
                      {selectedProduct.title || 'Product Selected'}
                    </span>
                  )}
                </h2>
                
                {!isProductSelected ? (
                  <div className="h-[400px] flex items-center justify-center">
                    <div className="text-center text-gray-400">
                      <div className="text-4xl mb-4">👈</div>
                      <p className="text-lg font-medium">Select a product from the left to see analysis</p>
                      <p className="text-sm mt-2">The chart will update automatically with your product data</p>
                    </div>
                  </div>
                ) : (
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
                    targetConversionRate={targetConversionRate}
                    setTargetConversionRate={setTargetConversionRate}
                  />
                )}
              </div>
            </>
          )}

          {/* Manual Mode: Single column layout */}
          {inputMode === 'manual' && (
            <div id="step-upload-data" className="border border-default rounded-lg p-6">
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <button 
                  onClick={() => handleStepClick('step-upload-data')}
                  className="w-6 h-6 bg-abc-blue-secondary text-white rounded-full flex items-center justify-center text-sm hover:bg-abc-blue-light transition-colors cursor-pointer"
                >
                  2
                </button>
                Configure Parameters
              </h2>
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
            </div>
          )}
        </div>

        {/* Advanced Settings (shown only when product is selected or in manual mode) */}
        {(isProductSelected || inputMode === 'manual') && (
          <div id="step-adjust-settings" className="border border-default rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <button 
                onClick={() => handleStepClick('step-adjust-settings')}
                className="w-6 h-6 bg-gray-600 text-white rounded-full flex items-center justify-center text-sm hover:bg-gray-500 transition-colors cursor-pointer"
              >
                ⚙️
              </button>
              Advanced Settings
              <button 
                onClick={() => setShowAdvanced(!showAdvanced)}
                className="ml-auto text-sm text-abc-blue-secondary hover:text-abc-blue-light"
              >
                {showAdvanced ? 'Hide' : 'Show'} Settings
              </button>
            </h2>
            
            {showAdvanced && (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-4">
                <label className="block">
                  <span className="flex items-center gap-1 text-xs font-medium text-gray-300">
                    Shipping Fee ($):
                    <Tooltip content="Shipping cost charged to customers. Auto-adjusts based on product data." preferredPosition="right">
                      <svg className="w-3 h-3 text-gray-400 hover:text-gray-300" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
                      </svg>
                    </Tooltip>
                  </span>
                  <input 
                    type="number" 
                    value={shippingFee} 
                    onChange={(e) => setShippingFee(parseFloat(e.target.value) || 0)}
                    className="form-input w-full mt-1 px-2 py-1 text-sm rounded"
                    step="0.01"
                    min="0"
                  />
                </label>
                <label className="block">
                  <span className="flex items-center gap-1 text-xs font-medium text-gray-300">
                    Transaction Fee (%):
                    <Tooltip content="Payment processing fee (2.9%-3.9%)">
                      <svg className="w-3 h-3 text-gray-400 hover:text-gray-300" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
                      </svg>
                    </Tooltip>
                  </span>
                  <input 
                    type="number" 
                    value={transactionFeePercent} 
                    onChange={(e) => setTransactionFeePercent(parseFloat(e.target.value) || 0)}
                    className="form-input w-full mt-1 px-2 py-1 text-sm rounded"
                    step="0.1"
                    min="0"
                    max="100"
                  />
                </label>
                {inputMode === 'csv' && (
                  <>
                    <label className="block">
                      <span className="flex items-center gap-1 text-xs font-medium text-gray-300">
                        Traffic:
                      </span>
                      <input 
                        type="number" 
                        value={sellingTraffic} 
                        onChange={(e) => setSellingTraffic(parseFloat(e.target.value) || 0)}
                        className="form-input w-full mt-1 px-2 py-1 text-sm rounded"
                        step="1"
                        min="1"
                      />
                    </label>
                    <label className="block">
                      <span className="flex items-center gap-1 text-xs font-medium text-gray-300">
                        Conversion Rate (%):
                      </span>
                      <input 
                        type="number" 
                        value={conversionRate} 
                        onChange={(e) => setConversionRate(parseFloat(e.target.value) || 0)}
                        className="form-input w-full mt-1 px-2 py-1 text-sm rounded"
                        step="0.01"
                        min="0"
                        max="100"
                      />
                    </label>
                  </>
                )}
              </div>
            )}
          </div>
        )}

        {/* Analysis section: Comparison Table and Optimal Price side by side */}
        {(inputMode === 'manual' || isProductSelected) && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Comparison Table section */}
            <section className="flex flex-col">
              <h2 className="text-2xl font-semibold mb-4">Price Comparison Analysis</h2>
              <div id="step-analyze-results" className="border border-default rounded p-4 flex-1">
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
