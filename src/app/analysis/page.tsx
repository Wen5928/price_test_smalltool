'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import CsvUploader, { ProductData } from '@/components/CsvUploader';
import InteractivePriceChart from '@/components/InteractivePriceChart';
import ComparisonTable from '@/components/ComparisonTable';
import ManualInputForm from '@/components/ManualInputForm';
import { calculateOptimalPrice, ComparisonData } from '@/utils/math';
import toast from 'react-hot-toast';

export default function AnalysisPage() {
  const router = useRouter();
  const [isCSVMode, setIsCSVMode] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [comparisonData, setComparisonData] = useState<ComparisonData | null>(null);
  const [isProductSelected, setIsProductSelected] = useState(false);
  
  // Advanced settings
  const [shippingFee, setShippingFee] = useState(8);
  const [transactionFeePercent, setTransactionFeePercent] = useState(2.9);
  const [monthlyTraffic, setMonthlyTraffic] = useState(20000);
  const [targetOec] = useState<'revenue' | 'profit' | 'conversion'>('profit');
  const [targetConversionRate] = useState<number | undefined>(undefined);

  useEffect(() => {
    // Check if we have CSV content from the landing page
    const csvContent = sessionStorage.getItem('csvContent');
    const fileName = sessionStorage.getItem('fileName');
    
    // Check if we're returning from results page with cached data
    const cachedComparisonData = sessionStorage.getItem('comparisonData');
    const cachedSelectedProduct = sessionStorage.getItem('selectedProduct');
    
    if (cachedComparisonData && cachedSelectedProduct) {
      // Restore cached state
      setComparisonData(JSON.parse(cachedComparisonData));
      setSelectedProduct(JSON.parse(cachedSelectedProduct));
      setIsProductSelected(true);
    }
    
    if (csvContent && fileName) {
      setIsCSVMode(true);
      // The CsvUploader will handle the CSV parsing
      // Note: Don't clear sessionStorage here, let CsvUploader read it first
    } else {
      setIsCSVMode(false);
    }
  }, []);

  const handleBackClick = () => {
    console.log('Back button clicked');
    // Use window.location for more reliable navigation
    if (typeof window !== 'undefined') {
      window.location.href = '/';
    }
  };

  const handleContinueToResults = () => {
    if (!comparisonData) {
      toast.error('Please complete the analysis first');
      return;
    }

    // Store comparison data for results page
    sessionStorage.setItem('comparisonData', JSON.stringify(comparisonData));
    sessionStorage.setItem('selectedProduct', JSON.stringify(selectedProduct));
    router.push('/results');
  };

  const handleProductSelect = (productData: ProductData, variant?: any) => {
    setSelectedProduct(variant || productData);
    setIsProductSelected(true);
    
    const optimalPriceResult = calculateOptimalPrice({
      currentPrice: productData.price,
      costPerItem: productData.costPerItem,
      shippingFee: productData.requiresShipping ? shippingFee : 0,
      transactionFeePercent,
      monthlyTraffic,
      oec: targetOec,
      targetConversionRate
    });

    setComparisonData(optimalPriceResult.comparison);
  };

  const handlePriceChange = useCallback((newComparison: ComparisonData) => {
    setComparisonData(newComparison);
  }, []);

  const handleManualSubmit = (productData: any) => {
    setSelectedProduct(productData);
    setIsProductSelected(true);
    
    const optimalPriceResult = calculateOptimalPrice({
      currentPrice: productData.price,
      costPerItem: productData.costPerItem,
      shippingFee: productData.requiresShipping ? shippingFee : 0,
      transactionFeePercent,
      monthlyTraffic,
      oec: targetOec,
      targetConversionRate
    });

    setComparisonData(optimalPriceResult.comparison);
  };

  const recalculate = () => {
    if (!selectedProduct) return;

    const optimalPriceResult = calculateOptimalPrice({
      currentPrice: selectedProduct.price,
      costPerItem: selectedProduct.costPerItem,
      shippingFee: selectedProduct.requiresShipping ? shippingFee : 0,
      transactionFeePercent,
      monthlyTraffic,
      oec: targetOec,
      targetConversionRate
    });

    setComparisonData(optimalPriceResult.comparison);
  };

  useEffect(() => {
    if (isProductSelected && selectedProduct) {
      recalculate();
    }
  }, [shippingFee, transactionFeePercent, monthlyTraffic, targetOec, targetConversionRate]);

  return (
    <div className="min-h-screen bg-[var(--background)] text-[var(--foreground)]">
      {/* Header with Logo and Back Button */}
      <header className="p-6 flex items-center justify-between border-b border-gray-700">
        <button
          onClick={handleBackClick}
          className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back
        </button>
        
        <div className="flex items-center gap-2">
          <Image
            src="/company_icon.png"
            alt="ABConvert Logo"
            width={32}
            height={32}
            className="w-8 h-8"
          />
          <span className="font-semibold text-lg">ABConvert</span>
        </div>

        <div className="w-20"></div> {/* Spacer for centering */}
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column - Input/Selection */}
          <div className="space-y-6">
            <h2 className="text-2xl font-bold">
              {isCSVMode ? 'Select Product' : 'Enter Product Details'}
            </h2>

            {isCSVMode ? (
              <CsvUploader
                onProductSelect={handleProductSelect}
                shippingFee={shippingFee}
                transactionFeePercent={transactionFeePercent}
              />
            ) : (
              <ManualInputForm onSubmit={handleManualSubmit} />
            )}

            {/* Advanced Settings */}
            {isProductSelected && (
              <div className="p-6 border border-gray-700 rounded-lg space-y-4">
                <h3 className="text-lg font-semibold">Advanced Settings</h3>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-gray-400 mb-1">Shipping Fee ($)</label>
                    <input
                      type="number"
                      value={shippingFee}
                      onChange={(e) => setShippingFee(parseFloat(e.target.value) || 0)}
                      className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-md text-white"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm text-gray-400 mb-1">Transaction Fee (%)</label>
                    <input
                      type="number"
                      value={transactionFeePercent}
                      onChange={(e) => setTransactionFeePercent(parseFloat(e.target.value) || 0)}
                      className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-md text-white"
                    />
                  </div>
                  
                  <div className="col-span-2">
                    <label className="block text-sm text-gray-400 mb-1">Monthly Traffic</label>
                    <input
                      type="number"
                      value={monthlyTraffic}
                      onChange={(e) => setMonthlyTraffic(parseInt(e.target.value) || 0)}
                      className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-md text-white"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Right Column - Visualization */}
          <div className="space-y-6">
            {comparisonData ? (
              <>
                <InteractivePriceChart
                  comparisonData={comparisonData}
                  selectedProduct={selectedProduct}
                  shippingFee={shippingFee}
                  transactionFeePercent={transactionFeePercent}
                  monthlyTraffic={monthlyTraffic}
                  onPriceChange={handlePriceChange}
                />
                
                <ComparisonTable
                  priceA={comparisonData.priceA}
                  priceB={comparisonData.priceB}
                />

                <div className="mt-6 pt-4 border-t border-gray-700">
                  <button
                    onClick={handleContinueToResults}
                    className="w-full px-6 py-3 bg-[var(--abc-blue-primary)] text-white font-semibold rounded-lg hover:bg-[var(--abc-blue-secondary)] transition-colors duration-200"
                  >
                    Continue to Results →
                  </button>
                </div>
              </>
            ) : (
              <div className="h-96 flex items-center justify-center border border-gray-700 rounded-lg">
                <p className="text-gray-400">
                  {isCSVMode ? 'Select a product to see analysis' : 'Enter product details to see analysis'}
                </p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}