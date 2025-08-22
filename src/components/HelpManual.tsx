'use client';

import React, { useState } from 'react';

export default function HelpManual() {
  const [isVisible, setIsVisible] = useState(false);

  const toggleHelp = () => {
    setIsVisible(!isVisible);
  };

  return (
    <div className="relative z-50">
      {/* Help Button */}
      <div
        className={`w-12 h-12 rounded-full flex items-center justify-center cursor-pointer shadow-lg transition-all duration-200 hover:scale-110 border-2 border-white ${
          isVisible 
            ? 'bg-transparent hover:bg-gray-800' 
            : 'bg-transparent hover:bg-gray-800'
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
        <div className="absolute top-16 right-0 w-96 max-w-[90vw] bg-[var(--color-surface)] border border-[var(--color-border)] rounded-lg shadow-xl max-h-96 overflow-y-auto">
          <div className="p-4">
            <div className="flex items-center gap-2 mb-4 border-b border-[var(--color-border)] pb-2">
              <span className="text-[var(--color-primary)] text-lg">📚</span>
              <h3 className="text-lg font-semibold text-[var(--foreground)]">User Manual</h3>
            </div>

            <div className="space-y-4 text-sm text-[var(--color-text-secondary)]">
              {/* Quick Start */}
              <section>
                <h4 className="font-semibold text-[var(--color-primary)] mb-2 flex items-center gap-1">
                  🚀 Quick Start
                </h4>
                <ul className="space-y-1 pl-4">
                  <li>• Export your products from Shopify Admin as CSV</li>
                  <li>• Upload the Shopify CSV file → Filter products → Select product</li>
                  <li>• Adjust Shopify-specific settings (shipping, transaction fee, etc.)</li>
                  <li>• Analyze optimal pricing for your Shopify store</li>
                  <li>• Manual mode available for testing scenarios</li>
                </ul>
              </section>

              {/* CSV Upload */}
              <section>
                <h4 className="font-semibold text-[var(--color-secondary)] mb-2 flex items-center gap-1">
                  📁 CSV Upload
                </h4>
                <ul className="space-y-1 pl-4">
                  <li>• <strong>Only supports Shopify product CSV exports</strong></li>
                  <li>• Export from: Shopify Admin → Products → Export products</li>
                  <li>• Required Shopify fields: Handle, Title, Variant Price, Cost per item</li>
                  <li>• Drag and drop or click to upload</li>
                  <li>• Shows 3 products per row, loads 40 by default</li>
                  <li>• Supports searching by product name, vendor, variant</li>
                  <li>• Can filter by status, category, vendor</li>
                  <li>• Product cards show price, cost, profit margin</li>
                </ul>
              </section>

              {/* Product Filtering */}
              <section>
                <h4 className="font-semibold text-[var(--abc-blue-03)] mb-2 flex items-center gap-1">
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
                <h4 className="font-semibold text-[var(--abc-blue-02)] mb-2 flex items-center gap-1">
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
                <h4 className="font-semibold text-[var(--color-accent)] mb-2 flex items-center gap-1">
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
                <h4 className="font-semibold text-[var(--abc-blue-01)] mb-2 flex items-center gap-1">
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
                <h4 className="font-semibold text-[var(--color-error)] mb-2 flex items-center gap-1">
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

              
            </div>

            <div className="mt-4 pt-3 border-t border-[var(--color-border)] text-center">
              <p className="text-xs text-[var(--color-text-muted)]">
                Click the × button in the bottom right to close the manual
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}