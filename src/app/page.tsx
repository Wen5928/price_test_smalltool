'use client';

import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

export default function Home() {
  const router = useRouter();
  const [showDemo, setShowDemo] = useState(false);

  const handleFileUpload = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.name.endsWith('.csv')) {
      toast.error('Please upload a CSV file');
      return;
    }

    // Store file in sessionStorage for the next page
    const reader = new FileReader();
    reader.onload = (e) => {
      const csvContent = e.target?.result as string;
      sessionStorage.setItem('csvContent', csvContent);
      sessionStorage.setItem('fileName', file.name);
      router.push('/analysis');
    };
    reader.readAsText(file);
  }, [router]);

  const handleManualUpload = () => {
    sessionStorage.removeItem('csvContent');
    sessionStorage.removeItem('fileName');
    router.push('/analysis');
  };

  const handleDemo = () => {
    setShowDemo(!showDemo);
  };

  const handleDemoData = () => {
    // Load demo CSV data
    const demoCSV = `Handle,Title,Option1 Value,Variant Price,Cost per item,Variant Requires Shipping,Vendor,Product Category,Variant SKU,Status,Variant Compare At Price,Variant Grams,Tags,Type,Variant Taxable,tariff (product.metafields.custom.tariff)
wireless-earbuds,Premium Wireless Earbuds,Black,79.99,25.00,true,TechCo,Electronics,WE-001-BLK,active,99.99,50,audio;wireless;premium,Electronics,true,FALSE
wireless-earbuds,Premium Wireless Earbuds,White,79.99,25.00,true,TechCo,Electronics,WE-001-WHT,active,99.99,50,audio;wireless;premium,Electronics,true,FALSE
smart-watch,Smart Fitness Watch,Small,149.99,45.00,true,TechCo,Electronics,SW-002-S,active,199.99,80,fitness;smart;watch,Wearables,true,FALSE
smart-watch,Smart Fitness Watch,Large,149.99,45.00,true,TechCo,Electronics,SW-002-L,active,199.99,85,fitness;smart;watch,Wearables,true,FALSE
yoga-mat,Premium Yoga Mat,Default Title,39.99,12.00,true,FitGear,Sports,YM-003,active,49.99,1200,yoga;fitness;mat,Sports Equipment,true,FALSE
coffee-mug,Insulated Coffee Mug,350ml,24.99,8.00,true,HomePlus,Kitchen,CM-004-350,active,29.99,300,coffee;insulated;travel,Drinkware,true,FALSE
coffee-mug,Insulated Coffee Mug,500ml,29.99,10.00,true,HomePlus,Kitchen,CM-004-500,active,34.99,400,coffee;insulated;travel,Drinkware,true,FALSE`;
    
    sessionStorage.setItem('csvContent', demoCSV);
    sessionStorage.setItem('fileName', 'demo_products.csv');
    toast.success('Demo data loaded! Navigating to analysis...');
    
    setTimeout(() => {
      router.push('/analysis');
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-[var(--background)] text-[var(--foreground)] flex flex-col items-center justify-center p-8">
      <div className="max-w-4xl w-full space-y-8 text-center">
        {/* Title and Subtitle */}
        <div className="space-y-4">
          <h1 className="text-5xl font-bold text-white">
            Shopify A/B Price Testing Tool
          </h1>
          <p className="text-xl text-gray-300">
            Optimize your pricing strategy with data-driven insights powered by ABConvert
          </p>
        </div>

        {/* Demo Button */}
        <button
          onClick={handleDemo}
          className="px-8 py-3 bg-[var(--abc-blue-primary)] text-white font-semibold rounded-lg hover:bg-[var(--abc-blue-secondary)] transition-colors duration-200"
        >
          {showDemo ? 'Hide Demo' : 'Watch 1 min Demo'}
        </button>

        {/* Demo Section */}
        {showDemo && (
          <div className="p-6 border border-gray-600 rounded-lg bg-gray-900">
            <h3 className="text-lg font-semibold mb-4">How It Works</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-left">
              <div className="p-4 border border-gray-700 rounded">
                <div className="text-3xl mb-2">1️⃣</div>
                <h4 className="font-semibold mb-1">Upload CSV</h4>
                <p className="text-sm text-gray-400">Upload your Shopify product export CSV file</p>
              </div>
              <div className="p-4 border border-gray-700 rounded">
                <div className="text-3xl mb-2">2️⃣</div>
                <h4 className="font-semibold mb-1">Analyze Pricing</h4>
                <p className="text-sm text-gray-400">Our tool analyzes optimal pricing based on your data</p>
              </div>
              <div className="p-4 border border-gray-700 rounded">
                <div className="text-3xl mb-2">3️⃣</div>
                <h4 className="font-semibold mb-1">Get Insights</h4>
                <p className="text-sm text-gray-400">Receive actionable recommendations to maximize profit</p>
              </div>
            </div>
            <div className="mt-6 text-center">
              <button
                onClick={handleDemoData}
                className="px-6 py-2 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 transition-colors duration-200"
              >
                Try with Demo Data →
              </button>
            </div>
          </div>
        )}

        {/* Upload Section */}
        <div className="space-y-4">
          <div className="p-8 border-2 border-dashed border-gray-600 rounded-lg hover:border-gray-400 transition-colors">
            <input
              id="csvFileInput"
              type="file"
              accept=".csv"
              onChange={handleFileUpload}
              className="hidden"
            />
            <label htmlFor="csvFileInput" className="cursor-pointer">
              <div className="space-y-4">
                <svg className="mx-auto h-16 w-16 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                  <path d="M28 8H12a4 4 0 00-4 4v20m0 0v4a4 4 0 004 4h24a4 4 0 004-4V24m-32 8l10.5-10.5a1.5 1.5 0 012.12 0L24 29m16-13v12m0 0l-3-3m3 3l3-3" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <p className="text-lg font-medium">
                  Upload your Shopify CSV
                </p>
                <p className="text-sm text-gray-400">
                  or drag and drop your Shopify product export file
                </p>
              </div>
            </label>
          </div>

          <div className="text-gray-400">
            <span>or</span>
          </div>

          <button
            onClick={handleManualUpload}
            className="px-6 py-2 border border-gray-600 text-white rounded-lg hover:bg-gray-800 transition-colors duration-200"
          >
            Manual Input
          </button>
        </div>

        {/* Powered by ABConvert */}
        <div className="pt-8 text-sm text-gray-400">
          <p>Powered by <a href="https://www.abconvert.io/" target="_blank" rel="noopener noreferrer" className="text-[var(--abc-blue-light)] hover:underline">ABConvert</a></p>
          <p className="mt-2">Professional A/B testing solutions for Shopify merchants</p>
        </div>
      </div>
    </div>
  );
}