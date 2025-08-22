'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import ExplanationText from '@/components/ExplanationText';
import { ComparisonData } from '@/utils/math';
import toast from 'react-hot-toast';

export default function ResultsPage() {
  const router = useRouter();
  const [comparisonData, setComparisonData] = useState<ComparisonData | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);

  useEffect(() => {
    // Retrieve data from sessionStorage
    const storedComparison = sessionStorage.getItem('comparisonData');
    const storedProduct = sessionStorage.getItem('selectedProduct');

    if (storedComparison && storedProduct) {
      setComparisonData(JSON.parse(storedComparison));
      setSelectedProduct(JSON.parse(storedProduct));
    } else {
      // If no data, redirect back to analysis
      toast.error('No analysis data found. Please complete the analysis first.');
      router.push('/analysis');
    }
  }, [router]);

  const handleBackClick = () => {
    // Use window.location for more reliable navigation
    if (typeof window !== 'undefined') {
      window.location.href = '/analysis';
    }
  };

  const handleLearnMore = () => {
    window.open('https://www.abconvert.io/', '_blank');
  };

  if (!comparisonData || !selectedProduct) {
    return (
      <div className="min-h-screen bg-[var(--background)] flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    );
  }

  const profitDiff = Math.abs(comparisonData.priceA.profit - comparisonData.priceB.profit);
  const profitImprovement = comparisonData.priceA.profit > 0 
    ? ((Math.max(comparisonData.priceA.profit, comparisonData.priceB.profit) - Math.min(comparisonData.priceA.profit, comparisonData.priceB.profit)) / comparisonData.priceA.profit * 100)
    : 0;

  return (
    <div className="min-h-screen bg-[var(--background)] text-[var(--foreground)]">
      {/* Header with Logo and Back Button */}
      <header className="p-6 flex items-center justify-between border-b border-gray-700 relative">
        <button
          onClick={handleBackClick}
          className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back
        </button>
        
        <div className="absolute left-1/2 transform -translate-x-1/2 flex items-center gap-2">
          <Image
            src="/company_icon.png"
            alt="ABConvert Logo"
            width={32}
            height={32}
            className="w-8 h-8"
          />
          <span className="font-semibold text-lg">ABConvert</span>
        </div>

        <div></div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-8 max-w-4xl">
        {/* Price Comparison Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-4">Price Analysis Results</h1>
          <div className="flex justify-center items-center gap-8">
            <div className="text-center">
              <div className="text-sm text-gray-400 mb-1">Original Price</div>
              <div className="text-4xl font-bold text-blue-400">${comparisonData.priceA.price}</div>
            </div>
            <div className="text-2xl text-gray-600">→</div>
            <div className="text-center">
              <div className="text-sm text-gray-400 mb-1">Recommended Price</div>
              <div className="text-4xl font-bold text-green-400">${comparisonData.priceB.price}</div>
            </div>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="p-6 border border-gray-700 rounded-lg text-center">
            <div className="text-3xl font-bold text-blue-400 mb-2">
              {comparisonData.priceB.conversionRate > comparisonData.priceA.conversionRate ? '+' : '-'}
              {Math.abs(comparisonData.priceB.conversionRate - comparisonData.priceA.conversionRate).toFixed(2)}%
            </div>
            <div className="text-sm text-gray-400">Conversion Rate Change</div>
          </div>
          
          <div className="p-6 border border-gray-700 rounded-lg text-center">
            <div className="text-3xl font-bold text-green-400 mb-2">
              ${Math.abs(comparisonData.priceB.revenue - comparisonData.priceA.revenue).toFixed(0)}
            </div>
            <div className="text-sm text-gray-400">Revenue Difference</div>
          </div>
          
          <div className="p-6 border border-gray-700 rounded-lg text-center">
            <div className="text-3xl font-bold text-yellow-400 mb-2">
              +{profitImprovement.toFixed(1)}%
            </div>
            <div className="text-sm text-gray-400">Profit Improvement</div>
          </div>
        </div>

        {/* Detailed Explanation */}
        <ExplanationText comparisonData={comparisonData} />

        {/* CTA Section */}
        <div className="mt-12 text-center space-y-6">
          <div className="p-8 bg-gradient-to-r from-blue-900/20 to-green-900/20 border border-gray-700 rounded-lg">
            <h2 className="text-2xl font-bold mb-4 text-white">
              Don't let price guessing impact your revenue!
            </h2>
            <p className="text-lg text-gray-300 mb-6">
              The right price choice could bring you a <strong className="text-green-400">${profitDiff.toFixed(0)}</strong> profit improvement.
            </p>
            <button
              onClick={handleLearnMore}
              className="px-8 py-3 bg-[var(--abc-blue-primary)] text-white font-semibold rounded-lg hover:bg-[var(--abc-blue-secondary)] transition-colors duration-200 inline-flex items-center gap-2"
            >
              Learn More on ABConvert
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </button>
          </div>

          <p className="text-sm text-gray-500">
            Ready to implement A/B testing for your Shopify store? 
            <a href="https://www.abconvert.io/" target="_blank" rel="noopener noreferrer" className="text-[var(--abc-blue-light)] hover:underline ml-1">
              Get started with ABConvert today
            </a>
          </p>
        </div>
      </main>
    </div>
  );
}