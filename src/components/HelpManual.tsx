'use client';

import React, { useState } from 'react';

export default function HelpManual() {
  const [isVisible, setIsVisible] = useState(false);

  const toggleHelp = () => {
    setIsVisible(!isVisible);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Help Button */}
      <div
        className={`w-12 h-12 rounded-full flex items-center justify-center cursor-pointer shadow-lg transition-all duration-200 hover:scale-110 ${
          isVisible 
            ? 'bg-red-600 hover:bg-red-700' 
            : 'bg-blue-600 hover:bg-blue-700'
        }`}
        onClick={toggleHelp}
        title={isVisible ? "Close Help" : "Open Manual"}
      >
        <span className="text-white text-xl font-bold">
          {isVisible ? '×' : '?'}
        </span>
      </div>

      {/* Help Panel */}
      {isVisible && (
        <div className="absolute bottom-16 right-0 w-96 bg-white border border-gray-200 rounded-lg shadow-xl max-h-96 overflow-y-auto">
          <div className="p-4">
            <div className="flex items-center gap-2 mb-4 border-b border-gray-200 pb-2">
              <span className="text-blue-600 text-lg">📚</span>
              <h3 className="text-lg font-semibold text-gray-800">User Manual</h3>
            </div>

            <div className="space-y-4 text-sm text-gray-700">
              {/* Quick Start */}
              <section>
                <h4 className="font-semibold text-blue-600 mb-2 flex items-center gap-1">
                  🚀 Quick Start
                </h4>
                <ul className="space-y-1 pl-4">
                  <li>• Choose "Upload CSV" or "Manual Input" mode</li>
                  <li>• CSV mode: Upload Shopify file → Filter products → Click to select</li>
                  <li>• Manual mode: Enter product parameters directly</li>
                  <li>• Adjust configuration settings (shipping, transaction fee, etc.)</li>
                  <li>• View charts and selected product cards for analysis</li>
                </ul>
              </section>

              {/* CSV Upload */}
              <section>
                <h4 className="font-semibold text-green-600 mb-2 flex items-center gap-1">
                  📁 CSV Upload
                </h4>
                <ul className="space-y-1 pl-4">
                  <li>• Supports Shopify product CSV format (with variants)</li>
                  <li>• Required fields: Handle, Title, Variant Price, Cost per item</li>
                  <li>• Drag and drop or click to upload</li>
                  <li>• Shows 3 products per row, loads 40 by default</li>
                  <li>• Supports searching by product name, vendor, variant</li>
                  <li>• Can filter by status, category, vendor</li>
                  <li>• Product cards show price, cost, profit margin</li>
                </ul>
              </section>

              {/* Product Filtering */}
              <section>
                <h4 className="font-semibold text-teal-600 mb-2 flex items-center gap-1">
                  🔍 Product Filtering
                </h4>
                <ul className="space-y-1 pl-4">
                  <li>• <strong>Search bar:</strong> Enter product name, vendor, variant name</li>
                  <li>• <strong>Status filter:</strong> Active, draft, and other statuses</li>
                  <li>• <strong>Category filter:</strong> Quick location by product category</li>
                  <li>• <strong>Vendor filter:</strong> Filter by vendor brand</li>
                  <li>• Filtering automatically resets load count to 40</li>
                </ul>
              </section>

              {/* Understanding Metrics */}
              <section>
                <h4 className="font-semibold text-purple-600 mb-2 flex items-center gap-1">
                  📊 Metrics Explained
                </h4>
                <ul className="space-y-1 pl-4">
                  <li>• <strong>COGS:</strong> Cost of goods sold (manufacturing/procurement cost)</li>
                  <li>• <strong>Shipping:</strong> Shipping cost</li>
                  <li>• <strong>Trans. Fee:</strong> Transaction fee (%)</li>
                  <li>• <strong>Total Cost:</strong> Total cost</li>
                  <li>• <strong>Margin:</strong> Profit margin = (Price-Total Cost)/Price×100%</li>
                </ul>
              </section>

              {/* Chart Features */}
              <section>
                <h4 className="font-semibold text-orange-600 mb-2 flex items-center gap-1">
                  📈 Chart Features
                </h4>
                <ul className="space-y-1 pl-4">
                  <li>• <strong>Blue solid line:</strong> Conversion rate curve (main analysis line)</li>
                  <li>• <strong>Blue dashed line:</strong> Original Price reference line</li>
                  <li>• <strong>Green dashed line:</strong> New Price reference line</li>
                  <li>• <strong>Red solid line:</strong> Optimal price marker</li>
                  <li>• <strong>Selected product card:</strong> Shows current product info being analyzed</li>
                  <li>• CSV mode: Original Price is fixed, only adjust New Price</li>
                </ul>
              </section>

              {/* Analysis Types */}
              <section>
                <h4 className="font-semibold text-indigo-600 mb-2 flex items-center gap-1">
                  🎯 Analysis Modes
                </h4>
                <ul className="space-y-1 pl-4">
                  <li>• <strong>Maximize Revenue:</strong> Find the price point with highest revenue</li>
                  <li>• <strong>Maximize Profit:</strong> Find the price point with highest profit</li>
                  <li>• <strong>Maximize Conversion:</strong> Find the price point with highest conversion rate</li>
                </ul>
              </section>

              {/* Configuration */}
              <section>
                <h4 className="font-semibold text-red-600 mb-2 flex items-center gap-1">
                  ⚙️ Parameter Settings
                </h4>
                <ul className="space-y-1 pl-4">
                  <li>• <strong>μ (Mu):</strong> Market willingness to pay average</li>
                  <li>• <strong>σ (Sigma):</strong> Price sensitivity standard deviation</li>
                  <li>• <strong>Shipping:</strong> Shipping cost per order</li>
                  <li>• <strong>Transaction Fee:</strong> Payment/platform fee percentage</li>
                  <li>• <strong>Traffic:</strong> Estimated monthly visitors</li>
                </ul>
              </section>

              {/* Tips */}
              <section className="bg-yellow-50 p-3 rounded">
                <h4 className="font-semibold text-yellow-700 mb-2 flex items-center gap-1">
                  💡 Tips
                </h4>
                <ul className="space-y-1 pl-4 text-yellow-800">
                  <li>• Keep profit margin above 20%</li>
                  <li>• Use search function to quickly find specific products</li>
                  <li>• Use category and vendor filters to narrow down scope</li>
                  <li>• Load more products button shows 40 at a time</li>
                  <li>• In CSV mode, original price is fixed, focus on adjusting new price</li>
                  <li>• Compare different products to find optimal pricing strategy</li>
                </ul>
              </section>
            </div>

            <div className="mt-4 pt-3 border-t border-gray-200 text-center">
              <p className="text-xs text-gray-500">
                Click the × button in the bottom right to close the manual
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}