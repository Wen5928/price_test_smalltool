import React, { useState, useCallback } from 'react';
import Papa from 'papaparse';
import toast from 'react-hot-toast';
import EmptyState from './EmptyState';
import LoadingSkeleton from './LoadingSkeleton';

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
  uniqueId?: string; // Add unique ID
  // Additional possible CSV fields
  weight?: number; // Variant Grams
  tags?: string; // Tags
  type?: string; // Type
  grams?: number; // Variant Grams
  taxable?: boolean; // Variant Taxable
  tariff?: boolean; // tariff (product.metafields.custom.tariff)
}

// Maintain backward compatible interface
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
  const [displayLimit, setDisplayLimit] = useState(39); // Default display 39 products (13 rows x 3)
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [filterVendor, setFilterVendor] = useState<string>('all');

  // Load CSV from sessionStorage if available
  React.useEffect(() => {
    const csvContent = sessionStorage.getItem('csvContent');
    const fileName = sessionStorage.getItem('fileName');
    
    if (csvContent && fileName) {
      // Parse the CSV content
      setIsLoading(true);
      console.log('Loading CSV from sessionStorage:', fileName);
      
      Papa.parse(csvContent, {
        header: true,
        complete: (results) => {
          try {
            const parsedVariants: ProductVariant[] = [];
            
            results.data.forEach((row: any, rowIndex: number) => {
              const price = parseFloat(row['Variant Price']) || 0;
              const costPerItem = parseFloat(row['Cost per item']) || 0;
              
              if (row['Handle'] && row['Variant Price'] && price > 0) {
                const variant: ProductVariant = {
                  handle: row['Handle'] || '',
                  title: row['Title'] || row['Handle'],
                  variantOption: row['Option1 Value'] || 'Default Title',
                  price: price,
                  compareAtPrice: row['Variant Compare At Price'] ? parseFloat(row['Variant Compare At Price']) : undefined,
                  costPerItem: costPerItem,
                  requiresShipping: row['Variant Requires Shipping'] === 'true',
                  vendor: row['Vendor'] || '',
                  category: row['Product Category'] || 'Uncategorized',
                  sku: row['Variant SKU'] || undefined,
                  status: row['Status'] || 'unknown',
                  uniqueId: `${row['Handle']}-${row['Option1 Value'] || 'default'}-${rowIndex}`,
                  weight: row['Variant Grams'] ? parseFloat(row['Variant Grams']) : undefined,
                  tags: row['Tags'] || undefined,
                  type: row['Type'] || undefined,
                  grams: row['Variant Grams'] ? parseFloat(row['Variant Grams']) : undefined,
                  taxable: row['Variant Taxable'] === 'true',
                  tariff: row['tariff (product.metafields.custom.tariff)'] === 'TRUE'
                };
                
                parsedVariants.push(variant);
              }
            });

            if (parsedVariants.length === 0) {
              setError('No valid product variants found in CSV file');
              toast.error('No valid products found in the CSV file');
            } else {
              setVariants(parsedVariants);
              toast.success(`Loaded ${parsedVariants.length} products from ${fileName}`);
            }
          } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
            setError('Error parsing CSV file: ' + errorMessage);
            toast.error('Failed to parse CSV: ' + errorMessage);
          } finally {
            setIsLoading(false);
          }
        },
        error: (err: any) => {
          const errorMessage = 'Error reading CSV file: ' + err.message;
          setError(errorMessage);
          toast.error(errorMessage);
          setIsLoading(false);
        }
      });
      
      // Keep sessionStorage for cache purposes - only clear when leaving the app
    }
  }, []);

  const handleFileUpload = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Check file type
    if (!file.name.endsWith('.csv')) {
      toast.error('Please upload a CSV file');
      return;
    }

    // Check file size (5MB limit)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('File size must be less than 5MB');
      return;
    }

    setIsLoading(true);
    setError(null);
    setVariants([]); // Clear previous data
    setSelectedVariant(null); // Clear previous selection
    
    const loadingToast = toast.loading('Uploading CSV file...');

    Papa.parse(file, {
      header: true,
      complete: (results) => {
        toast.dismiss(loadingToast); // Dismiss loading toast
        try {
          const parsedVariants: ProductVariant[] = [];
          
          results.data.forEach((row: any, rowIndex: number) => {
            // Only process rows with Handle and Variant Price (skip rows with only image info)
            const price = parseFloat(row['Variant Price']) || 0;
            const costPerItem = parseFloat(row['Cost per item']) || 0;
            
            if (row['Handle'] && row['Variant Price'] && price > 0) {
              const variant: ProductVariant = {
                handle: row['Handle'] || '',
                title: row['Title'] || row['Handle'], // If no Title, use Handle
                variantOption: row['Option1 Value'] || 'Default Title',
                price: price,
                compareAtPrice: row['Variant Compare At Price'] ? parseFloat(row['Variant Compare At Price']) : undefined,
                costPerItem: costPerItem,
                requiresShipping: row['Variant Requires Shipping'] === 'true',
                vendor: row['Vendor'] || '',
                category: row['Product Category'] || 'Uncategorized',
                sku: row['Variant SKU'] || undefined,
                status: row['Status'] || 'unknown',
                uniqueId: `${row['Handle']}-${row['Option1 Value'] || 'default'}-${rowIndex}`, // Add row index to ensure uniqueness
                // Parse additional fields
                weight: row['Variant Grams'] ? parseFloat(row['Variant Grams']) : undefined,
                tags: row['Tags'] || undefined,
                type: row['Type'] || undefined,
                grams: row['Variant Grams'] ? parseFloat(row['Variant Grams']) : undefined,
                taxable: row['Variant Taxable'] === 'true',
                tariff: row['tariff (product.metafields.custom.tariff)'] === 'TRUE'
              };
              
              // Add variant to list
              parsedVariants.push(variant);
            }
          });

          console.log(`Total rows processed: ${results.data.length}, Valid variants found: ${parsedVariants.length}`);
          
          if (parsedVariants.length === 0) {
            setError('No valid product variants found in CSV file');
            toast.error(`No valid products found. Processed ${results.data.length} rows. Please check your CSV format.`);
          } else {
            setVariants(parsedVariants);
            toast.success(`Successfully loaded ${parsedVariants.length} products`);
            
            // Automatically select the first product after successful upload
            const firstVariant = parsedVariants[0];
            const firstVariantId = `${firstVariant.handle}-${firstVariant.variantOption}`;
            setSelectedVariant(firstVariantId);
            
            // Convert to old format to maintain compatibility
            const productData: ProductData = {
              handle: firstVariant.handle,
              title: `${firstVariant.title} - ${firstVariant.variantOption}`,
              price: firstVariant.price,
              costPerItem: firstVariant.costPerItem,
              requiresShipping: firstVariant.requiresShipping
            };
            
            onProductSelect(productData, firstVariant);
            
            // Check if the automatically selected first product has extreme price
            if (firstVariant.price > 2000000) {
              // Use setTimeout to ensure the toast appears after the success message
              setTimeout(() => {
                toast.error(
                  `⚠️ Warning: Extremely high price ($${firstVariant.price.toLocaleString()}). Price elasticity calculations may be inaccurate at this price level.`,
                  { duration: 8000 }
                );
              }, 500); // Small delay to let the success message show first
              
              toast.success(`Selected: ${firstVariant.title}`, { duration: 2000 });
            } else {
              toast.success(`Selected: ${firstVariant.title}`, { duration: 2000 });
            }
            
          }
        } catch (err) {
          const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
          setError('Error parsing CSV file: ' + errorMessage);
          toast.error('Failed to parse CSV: ' + errorMessage);
        } finally {
          setIsLoading(false);
        }
      },
      error: (err) => {
        toast.dismiss(loadingToast); // Dismiss loading toast
        const errorMessage = 'Error reading CSV file: ' + err.message;
        setError(errorMessage);
        toast.error(errorMessage);
        setIsLoading(false);
      }
    });
  }, [onProductSelect]);

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
    
    // Prevent selecting the same product twice
    if (selectedVariant === variantId) {
      toast('This product is already selected', { icon: '✓' });
      return;
    }
    
    setSelectedVariant(variantId);
    
    // Convert to old format to maintain compatibility
    const productData: ProductData = {
      handle: variant.handle,
      title: `${variant.title} - ${variant.variantOption}`,
      price: variant.price,
      costPerItem: variant.costPerItem,
      requiresShipping: variant.requiresShipping
    };
    
    onProductSelect(productData, variant);
    
    // Check if selected product has extremely high price and warn user
    if (variant.price > 2000000) {
      toast.error(
        `⚠️ Warning: Extremely high price ($${variant.price.toLocaleString()}). Price elasticity calculations may be inaccurate at this price level.`,
        { duration: 8000 }
      );
    }
    
    toast.success(`Selected: ${variant.title}`, { duration: 2000 });
  };

  // Filter and search logic
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

  // Get options
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
            <p className="text-base font-medium text-gray-200">
              Click to upload or drag and drop your Shopify product CSV file
            </p>
          </div>
        </label>
      </div>

      {isLoading && (
        <div className="space-y-4">
          <div className="text-center text-gray-600">Processing CSV file...</div>
          <LoadingSkeleton count={6} />
        </div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      {variants.length > 0 && (
        <div className="space-y-4">
          {/* Statistics */}
          <div className="bg-blue-50 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-blue-800">📊 File Analysis Results</h3>
                <p className="text-sm text-blue-600 mt-1">
                  Found {variants.length} product variants, {statusOptions.length - 1} statuses
                </p>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-blue-600">{filteredVariants.length}</div>
                <div className="text-xs text-blue-500">Matching criteria</div>
              </div>
            </div>
          </div>

          {/* Search and filters */}
          <div className="space-y-3">
            {/* Search bar */}
            <div>
              <input
                type="text"
                placeholder="Search product name, handle, variant or vendor..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setDisplayLimit(39); // Reset display limit
                }}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            
            {/* Filter row */}
            <div className="flex gap-3 flex-wrap">
              {/* Status filter */}
              <div className="flex-1 min-w-[150px]">
                <label className="block text-xs font-medium text-gray-600 mb-1">Status</label>
                <select
                  value={filterStatus}
                  onChange={(e) => {
                    setFilterStatus(e.target.value);
                    setDisplayLimit(39); // Reset display limit
                  }}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="all">All statuses</option>
                  {statusOptions.filter(s => s !== 'all').map(status => (
                    <option key={status} value={status}>
                      {status === 'active' ? 'Active' : status === 'draft' ? 'Draft' : status}
                    </option>
                  ))}
                </select>
              </div>
              
              {/* Category filter */}
              <div className="flex-1 min-w-[200px]">
                <label className="block text-xs font-medium text-gray-600 mb-1">Product Category</label>
                <select
                  value={filterCategory}
                  onChange={(e) => {
                    setFilterCategory(e.target.value);
                    setDisplayLimit(39); // Reset display limit
                  }}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="all">All categories</option>
                  {categoryOptions.filter(c => c !== 'all').map(category => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>
              
              {/* Vendor filter */}
              <div className="flex-1 min-w-[150px]">
                <label className="block text-xs font-medium text-gray-600 mb-1">Vendor</label>
                <select
                  value={filterVendor}
                  onChange={(e) => {
                    setFilterVendor(e.target.value);
                    setDisplayLimit(39); // Reset display limit
                  }}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="all">All vendors</option>
                  {vendorOptions.filter(v => v !== 'all').map(vendor => (
                    <option key={vendor} value={vendor}>
                      {vendor}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          <div className="border rounded-lg">
            {/* Vertical scrolling product display */}
            <div className="max-h-[600px] overflow-y-auto p-4">
              {filteredVariants.length === 0 ? (
                <EmptyState
                  icon="🔍"
                  title="No products found"
                  description="Try adjusting your filters or search terms to find products."
                  action={{
                    label: "Clear all filters",
                    onClick: () => {
                      setSearchTerm('');
                      setFilterStatus('all');
                      setFilterCategory('all');
                      setFilterVendor('all');
                      toast.success('Filters cleared');
                    }
                  }}
                />
              ) : (
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
                        {/* Product title and status */}
                        <div className="flex justify-between items-start mb-3">
                          <div className="flex-1 min-w-0">
                            <h4 className={`font-medium text-sm truncate ${
                              selectedVariant === variantId ? 'text-gray-900' : 'text-white'
                            }`}>
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
                            {variant.status === 'active' ? 'Active' : variant.status === 'draft' ? 'Draft' : variant.status}
                          </span>
                        </div>

                        {/* Price information */}
                        <div className="space-y-2 mb-3">
                          <div className="flex justify-between items-center">
                            <span className={`text-lg font-bold ${
                              selectedVariant === variantId ? 'text-gray-900' : 'text-white'
                            }`}>
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

                        {/* Cost analysis */}
                        <div className="space-y-1 text-xs text-gray-600 flex-1">
                          <div className="flex justify-between">
                            <span>Cost:</span>
                            <span>${variant.costPerItem.toFixed(2)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Shipping:</span>
                            <span>${shippingFee.toFixed(2)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Transaction Fee:</span>
                            <span>${transactionFee.toFixed(2)}</span>
                          </div>
                          <div className="flex justify-between border-t pt-1 font-semibold">
                            <span>Total Cost:</span>
                            <span>${totalCost.toFixed(2)}</span>
                          </div>
                        </div>

                        {/* Profit margin */}
                        <div className="mt-3 pt-3 border-t">
                          <div className="text-center">
                            <div className={`text-lg font-bold ${
                              margin > 20 ? 'text-green-600' : margin > 10 ? 'text-yellow-600' : 'text-red-600'
                            }`}>
                              {margin.toFixed(1)}%
                            </div>
                            <div className="text-xs text-gray-500">Profit Margin</div>
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
              )}
              
              {/* Load more button */}
              {filteredVariants.length > 0 && filteredVariants.length > displayLimit && (
                <div className="text-center mt-4">
                  <button
                    onClick={() => setDisplayLimit(prev => prev + 39)}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                  >
                    Load more products ({filteredVariants.length - displayLimit} remaining)
                  </button>
                </div>
              )}
              
              {/* Display statistics */}
              <div className="mt-4 text-center text-sm text-gray-500">
                Showing {Math.min(displayLimit, filteredVariants.length)} / {filteredVariants.length} products
                {filteredVariants.length < variants.length && (
                  <span> ({variants.length - filteredVariants.length} filtered)</span>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}