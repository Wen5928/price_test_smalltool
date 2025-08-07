import React, { useState, useCallback } from 'react';
import Papa from 'papaparse';

export interface ProductVariant {
  handle: string;
  title: string;
  variantOption: string; // Option1 Value (e.g., "Default Title", "Metal Mesh", "S", etc.)
  price: number;
  compareAtPrice?: number;
  costPerItem: number;
  requiresShipping: boolean;
  vendor: string;
  category: string;
  sku?: string;
  status: string;
  uniqueId?: string; // 添加唯一ID
}

// 保持向後相容的介面
export interface ProductData {
  handle: string;
  title: string;
  price: number;
  costPerItem: number;
  requiresShipping: boolean;
}

interface CsvUploaderProps {
  onProductSelect: (product: ProductData, variant: ProductVariant) => void;
  shippingFee: number;
  transactionFeePercent: number;
}

export default function CsvUploader({ 
  onProductSelect, 
  shippingFee,
  transactionFeePercent
}: CsvUploaderProps) {
  const [variants, setVariants] = useState<ProductVariant[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedVariant, setSelectedVariant] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [displayLimit, setDisplayLimit] = useState(40); // 預設顯示40個商品
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [filterVendor, setFilterVendor] = useState<string>('all');

  const handleFileUpload = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsLoading(true);
    setError(null);

    Papa.parse(file, {
      header: true,
      complete: (results) => {
        try {
          const parsedVariants: ProductVariant[] = [];
          
          results.data.forEach((row: any, rowIndex: number) => {
            // 只處理有 Handle 和 Variant Price 的行（跳過只有圖片信息的行）
            if (row['Handle'] && row['Variant Price'] && parseFloat(row['Variant Price']) > 0) {
              const variant: ProductVariant = {
                handle: row['Handle'] || '',
                title: row['Title'] || row['Handle'], // 如果沒有 Title，使用 Handle
                variantOption: row['Option1 Value'] || 'Default Title',
                price: parseFloat(row['Variant Price']) || 0,
                compareAtPrice: row['Variant Compare At Price'] ? parseFloat(row['Variant Compare At Price']) : undefined,
                costPerItem: parseFloat(row['Cost per item']) || 0,
                requiresShipping: row['Variant Requires Shipping'] === 'true',
                vendor: row['Vendor'] || '',
                category: row['Product Category'] || 'Uncategorized',
                sku: row['Variant SKU'] || undefined,
                status: row['Status'] || 'unknown',
                uniqueId: `${row['Handle']}-${row['Option1 Value'] || 'default'}-${rowIndex}` // 添加行索引確保唯一性
              };
              
              // 過濾掉價格為 0 或負數的商品
              if (variant.price > 0) {
                parsedVariants.push(variant);
              }
            }
          });

          if (parsedVariants.length === 0) {
            setError('No valid product variants found in CSV file');
          } else {
            setVariants(parsedVariants);
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

  const handleVariantSelect = (variant: ProductVariant, event: React.MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();
    
    const variantId = `${variant.handle}-${variant.variantOption}`;
    
    // 防止重複選擇同一個商品
    if (selectedVariant === variantId) {
      return;
    }
    
    setSelectedVariant(variantId);
    
    // 轉換為舊格式以保持相容性
    const productData: ProductData = {
      handle: variant.handle,
      title: `${variant.title} - ${variant.variantOption}`,
      price: variant.price,
      costPerItem: variant.costPerItem,
      requiresShipping: variant.requiresShipping
    };
    
    onProductSelect(productData, variant);
  };

  // 過濾和搜尋邏輯
  const filteredVariants = variants.filter(variant => {
    const matchesSearch = searchTerm === '' || 
      variant.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      variant.handle.toLowerCase().includes(searchTerm.toLowerCase()) ||
      variant.variantOption.toLowerCase().includes(searchTerm.toLowerCase()) ||
      variant.vendor.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = filterStatus === 'all' || variant.status === filterStatus;
    const matchesCategory = filterCategory === 'all' || variant.category === filterCategory;
    const matchesVendor = filterVendor === 'all' || variant.vendor === filterVendor;
    
    return matchesSearch && matchesStatus && matchesCategory && matchesVendor;
  });

  // 獲取選項
  const statusOptions = ['all', ...Array.from(new Set(variants.map(v => v.status)))];
  const categoryOptions = ['all', ...Array.from(new Set(variants.map(v => v.category)))];
  const vendorOptions = ['all', ...Array.from(new Set(variants.map(v => v.vendor)))];

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

      {variants.length > 0 && (
        <div className="space-y-4">
          {/* 統計信息 */}
          <div className="bg-blue-50 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-blue-800">📊 檔案分析結果</h3>
                <p className="text-sm text-blue-600 mt-1">
                  找到 {variants.length} 個商品變體，{statusOptions.length - 1} 種狀態
                </p>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-blue-600">{filteredVariants.length}</div>
                <div className="text-xs text-blue-500">符合條件</div>
              </div>
            </div>
          </div>

          {/* 搜尋和過濾器 */}
          <div className="space-y-3">
            {/* 搜尋列 */}
            <div>
              <input
                type="text"
                placeholder="搜尋商品名稱、Handle、變體或供應商..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setDisplayLimit(40); // 重置顯示限制
                }}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            
            {/* 過濾器列 */}
            <div className="flex gap-3 flex-wrap">
              {/* 狀態過濾 */}
              <div className="flex-1 min-w-[150px]">
                <label className="block text-xs font-medium text-gray-600 mb-1">狀態</label>
                <select
                  value={filterStatus}
                  onChange={(e) => {
                    setFilterStatus(e.target.value);
                    setDisplayLimit(40); // 重置顯示限制
                  }}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="all">所有狀態</option>
                  {statusOptions.filter(s => s !== 'all').map(status => (
                    <option key={status} value={status}>
                      {status === 'active' ? '上架中' : status === 'draft' ? '草稿' : status}
                    </option>
                  ))}
                </select>
              </div>
              
              {/* 分類過濾 */}
              <div className="flex-1 min-w-[200px]">
                <label className="block text-xs font-medium text-gray-600 mb-1">產品分類</label>
                <select
                  value={filterCategory}
                  onChange={(e) => {
                    setFilterCategory(e.target.value);
                    setDisplayLimit(40); // 重置顯示限制
                  }}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="all">所有分類</option>
                  {categoryOptions.filter(c => c !== 'all').map(category => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>
              
              {/* 供應商過濾 */}
              <div className="flex-1 min-w-[150px]">
                <label className="block text-xs font-medium text-gray-600 mb-1">供應商</label>
                <select
                  value={filterVendor}
                  onChange={(e) => {
                    setFilterVendor(e.target.value);
                    setDisplayLimit(40); // 重置顯示限制
                  }}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="all">所有供應商</option>
                  {vendorOptions.filter(v => v !== 'all').map(vendor => (
                    <option key={vendor} value={vendor}>
                      {vendor}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          <div className="border rounded-lg bg-white">
            {/* 垂直滾動商品顯示 */}
            <div className="max-h-[600px] overflow-y-auto p-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredVariants.slice(0, displayLimit).map((variant, index) => {
                  const transactionFee = variant.price * (transactionFeePercent / 100);
                  const totalCost = variant.costPerItem + shippingFee + transactionFee;
                  const margin = ((variant.price - totalCost) / variant.price * 100);
                  const variantId = `${variant.handle}-${variant.variantOption}`;
                  
                  return (
                    <div
                      key={variant.uniqueId || `${variantId}-${index}`}
                      onClick={(e) => handleVariantSelect(variant, e)}
                      className={`border rounded-lg cursor-pointer transition-all duration-200 hover:shadow-lg ${
                        selectedVariant === variantId 
                          ? 'border-blue-500 bg-blue-50 ring-2 ring-blue-200' 
                          : 'border-gray-200 hover:border-blue-300'
                      }`}
                    >
                      <div className="p-4 h-full flex flex-col">
                        {/* 商品標題和狀態 */}
                        <div className="flex justify-between items-start mb-3">
                          <div className="flex-1 min-w-0">
                            <h4 className="font-medium text-sm text-gray-900 truncate">
                              {variant.title}
                            </h4>
                            {variant.variantOption !== 'Default Title' && (
                              <div className="mt-1">
                                <span className="inline-block bg-gray-100 px-2 py-1 rounded text-xs text-gray-600">
                                  {variant.variantOption}
                                </span>
                              </div>
                            )}
                          </div>
                          <span className={`ml-2 px-2 py-1 text-xs rounded-full flex-shrink-0 ${
                            variant.status === 'active' 
                              ? 'bg-green-100 text-green-800' 
                              : variant.status === 'draft'
                              ? 'bg-yellow-100 text-yellow-800'
                              : 'bg-gray-100 text-gray-800'
                          }`}>
                            {variant.status === 'active' ? '上架' : variant.status === 'draft' ? '草稿' : variant.status}
                          </span>
                        </div>

                        {/* 價格信息 */}
                        <div className="space-y-2 mb-3">
                          <div className="flex justify-between items-center">
                            <span className="text-lg font-bold text-gray-900">
                              ${variant.price.toFixed(2)}
                            </span>
                            {variant.compareAtPrice && variant.compareAtPrice > variant.price && (
                              <span className="text-sm text-red-500 line-through">
                                ${variant.compareAtPrice.toFixed(2)}
                              </span>
                            )}
                          </div>
                          {variant.vendor && (
                            <div className="text-xs text-gray-500">{variant.vendor}</div>
                          )}
                        </div>

                        {/* 成本分析 */}
                        <div className="space-y-1 text-xs text-gray-600 flex-1">
                          <div className="flex justify-between">
                            <span>成本:</span>
                            <span>${variant.costPerItem.toFixed(2)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>運費:</span>
                            <span>${shippingFee.toFixed(2)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>手續費:</span>
                            <span>${transactionFee.toFixed(2)}</span>
                          </div>
                          <div className="flex justify-between border-t pt-1 font-semibold">
                            <span>總成本:</span>
                            <span>${totalCost.toFixed(2)}</span>
                          </div>
                        </div>

                        {/* 利潤率 */}
                        <div className="mt-3 pt-3 border-t">
                          <div className="text-center">
                            <div className={`text-lg font-bold ${
                              margin > 20 ? 'text-green-600' : margin > 10 ? 'text-yellow-600' : 'text-red-600'
                            }`}>
                              {margin.toFixed(1)}%
                            </div>
                            <div className="text-xs text-gray-500">利潤率</div>
                            <div className={`mt-1 w-full h-2 rounded-full ${
                              margin > 20 ? 'bg-green-100' : margin > 10 ? 'bg-yellow-100' : 'bg-red-100'
                            }`}>
                              <div 
                                className={`h-2 rounded-full ${
                                  margin > 20 ? 'bg-green-500' : margin > 10 ? 'bg-yellow-500' : 'bg-red-500'
                                }`}
                                style={{ width: `${Math.max(0, Math.min(100, margin))}%` }}
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
              
              {/* 載入更多按鈕 */}
              {filteredVariants.length > displayLimit && (
                <div className="text-center mt-4">
                  <button
                    onClick={() => setDisplayLimit(prev => prev + 40)}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                  >
                    載入更多商品 ({filteredVariants.length - displayLimit} 個剩餘)
                  </button>
                </div>
              )}
              
              {/* 顯示統計 */}
              <div className="mt-4 text-center text-sm text-gray-500">
                顯示 {Math.min(displayLimit, filteredVariants.length)} / {filteredVariants.length} 個商品
                {filteredVariants.length < variants.length && (
                  <span> (已篩選 {variants.length - filteredVariants.length} 個)</span>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}