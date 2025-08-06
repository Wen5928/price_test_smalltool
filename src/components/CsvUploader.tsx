import React, { useState, useCallback } from 'react';
import Papa from 'papaparse';

export interface ProductData {
  handle: string;
  title: string;
  price: number;
  costPerItem: number;
  requiresShipping: boolean;
}

interface CsvUploaderProps {
  onProductSelect: (product: ProductData) => void;
  shippingFee: number;
  setShippingFee: (value: number) => void;
  transactionFeePercent: number;
  setTransactionFeePercent: (value: number) => void;
  gmv: number;
  setGmv: (value: number) => void;
  sellingTraffic: number;
  setSellingTraffic: (value: number) => void;
  conversionRate: number;
  setConversionRate: (value: number) => void;
}

export default function CsvUploader({ 
  onProductSelect, 
  shippingFee, 
  setShippingFee, 
  transactionFeePercent, 
  setTransactionFeePercent, 
  gmv, 
  setGmv, 
  sellingTraffic, 
  setSellingTraffic, 
  conversionRate, 
  setConversionRate 
}: CsvUploaderProps) {
  const [products, setProducts] = useState<ProductData[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(0);
  const productsPerPage = 5;

  const handleFileUpload = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsLoading(true);
    setError(null);

    Papa.parse(file, {
      header: true,
      complete: (results) => {
        try {
          const parsedProducts: ProductData[] = [];
          
          results.data.forEach((row: any) => {
            if (row['Handle'] && row['Variant Price'] && row['Title']) {
              parsedProducts.push({
                handle: row['Handle'],
                title: row['Title'],
                price: parseFloat(row['Variant Price']) || 0,
                costPerItem: parseFloat(row['Cost per item']) || 0,
                requiresShipping: row['Variant Requires Shipping'] === 'true'
              });
            }
          });

          if (parsedProducts.length === 0) {
            setError('No valid products found in CSV file');
          } else {
            setProducts(parsedProducts);
          }
        } catch (err) {
          setError('Error parsing CSV file: ' + (err as Error).message);
        } finally {
          setIsLoading(false);
        }
      },
      error: (err) => {
        setError('Error reading CSV file: ' + err.message);
        setIsLoading(false);
      }
    });
  }, []);

  const handleDrop = useCallback((event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    const file = event.dataTransfer.files[0];
    if (file && file.type === 'text/csv') {
      const input = document.getElementById('csvFileInput') as HTMLInputElement;
      const dataTransfer = new DataTransfer();
      dataTransfer.items.add(file);
      input.files = dataTransfer.files;
      const changeEvent = new Event('change', { bubbles: true });
      input.dispatchEvent(changeEvent);
    }
  }, []);

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
  };

  const handleProductSelect = (product: ProductData) => {
    setSelectedProduct(product.handle);
    onProductSelect(product);
  };

  return (
    <div className="space-y-4">
      <div
        className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors"
        onDrop={handleDrop}
        onDragOver={handleDragOver}
      >
        <input
          id="csvFileInput"
          type="file"
          accept=".csv"
          onChange={handleFileUpload}
          className="hidden"
        />
        <label htmlFor="csvFileInput" className="cursor-pointer">
          <div className="space-y-2">
            <div className="text-gray-600">
              <svg className="mx-auto h-12 w-12" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                <path d="M28 8H12a4 4 0 00-4 4v20m0 0v4a4 4 0 004 4h24a4 4 0 004-4V24m-32 8l10.5-10.5a1.5 1.5 0 012.12 0L24 29m16-13v12m0 0l-3-3m3 3l3-3" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <p className="text-sm text-gray-600">
              Click to upload or drag and drop your Shopify product CSV file
            </p>
          </div>
        </label>
      </div>

      {isLoading && (
        <div className="text-center text-gray-600">Loading CSV file...</div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      {products.length > 0 && (
        <div className="space-y-2">
          <h3 className="font-semibold">Select a product to analyze:</h3>
          <div className="border rounded-lg">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="text-left px-3 py-2 text-sm font-semibold text-gray-700 border-b">Product</th>
                  <th className="text-right px-3 py-2 text-sm font-semibold text-gray-700 border-b">Price</th>
                  <th className="text-right px-3 py-2 text-sm font-semibold text-gray-700 border-b">COGS</th>
                  <th className="text-right px-3 py-2 text-sm font-semibold text-gray-700 border-b">Shipping</th>
                  <th className="text-right px-3 py-2 text-sm font-semibold text-gray-700 border-b">Trans. Fee</th>
                  <th className="text-right px-3 py-2 text-sm font-semibold text-gray-700 border-b">Total Cost</th>
                  <th className="text-right px-3 py-2 text-sm font-semibold text-gray-700 border-b">Margin</th>
                </tr>
              </thead>
              <tbody>
                {products.slice(currentPage * productsPerPage, (currentPage + 1) * productsPerPage).map((product) => {
                  const transactionFee = product.price * (transactionFeePercent / 100);
                  const totalCost = product.costPerItem + shippingFee + transactionFee;
                  const margin = ((product.price - totalCost) / product.price * 100);
                  
                  return (
                    <tr
                      key={product.handle}
                      onClick={() => handleProductSelect(product)}
                      className={`border-b cursor-pointer hover:bg-gray-50 transition-colors ${
                        selectedProduct === product.handle ? 'bg-blue-200 hover:bg-blue-200' : ''
                      }`}
                    >
                      <td className="px-3 py-2">
                        <div className="font-medium text-sm">{product.title}</div>
                      </td>
                      <td className="px-3 py-2 text-right text-sm">${product.price.toFixed(2)}</td>
                      <td className="px-3 py-2 text-right text-sm">${product.costPerItem.toFixed(2)}</td>
                      <td className="px-3 py-2 text-right text-sm">${shippingFee.toFixed(2)}</td>
                      <td className="px-3 py-2 text-right text-sm">${transactionFee.toFixed(2)}</td>
                      <td className="px-3 py-2 text-right text-sm font-semibold">${totalCost.toFixed(2)}</td>
                      <td className={`px-3 py-2 text-right text-sm font-semibold ${
                        margin > 0 ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {margin.toFixed(1)}%
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            
            {/* Pagination Controls */}
            {products.length > productsPerPage && (
              <div className="flex justify-between items-center px-4 py-3 bg-gray-50 border-t">
                <div className="text-sm text-gray-700">
                  Showing {currentPage * productsPerPage + 1} to {Math.min((currentPage + 1) * productsPerPage, products.length)} of {products.length} products
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => setCurrentPage(Math.max(0, currentPage - 1))}
                    disabled={currentPage === 0}
                    className="px-3 py-1 text-sm border rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100"
                  >
                    Previous
                  </button>
                  <button
                    onClick={() => setCurrentPage(Math.min(Math.ceil(products.length / productsPerPage) - 1, currentPage + 1))}
                    disabled={currentPage >= Math.ceil(products.length / productsPerPage) - 1}
                    className="px-3 py-1 text-sm border rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </div>
          
          {/* Manual Input Parameters Section */}
          <div className="mt-4 p-4 bg-gray-50 rounded-lg border">
            <h4 className="text-sm font-semibold text-gray-700 mb-3">Configuration Settings</h4>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <label className="block">
                <span className="text-xs font-medium text-gray-600">Shipping Cost ($):</span>
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
                <span className="text-xs font-medium text-gray-600">Gross Merchandise Value ($):</span>
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
                <span className="text-xs font-medium text-gray-600">Selling Traffic:</span>
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
        </div>
      )}
    </div>
  );
}