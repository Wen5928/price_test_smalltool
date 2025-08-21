import React, { useState } from 'react';
import toast from 'react-hot-toast';

interface ManualInputFormProps {
  onSubmit: (productData: any) => void;
}

export default function ManualInputForm({ onSubmit }: ManualInputFormProps) {
  const [productName, setProductName] = useState('');
  const [currentPrice, setCurrentPrice] = useState('');
  const [costPerItem, setCostPerItem] = useState('');
  const [requiresShipping, setRequiresShipping] = useState(true);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!productName || !currentPrice || !costPerItem) {
      toast.error('Please fill in all required fields');
      return;
    }

    const price = parseFloat(currentPrice);
    const cost = parseFloat(costPerItem);

    if (price <= 0 || cost <= 0) {
      toast.error('Price and cost must be greater than 0');
      return;
    }

    if (cost >= price) {
      toast.error('Cost must be less than price');
      return;
    }

    const productData = {
      handle: productName.toLowerCase().replace(/\s+/g, '-'),
      title: productName,
      price: price,
      costPerItem: cost,
      requiresShipping: requiresShipping,
      variantOption: 'Default'
    };

    onSubmit(productData);
    toast.success('Product data submitted successfully');
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 p-6 border border-gray-700 rounded-lg">
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">
          Product Name *
        </label>
        <input
          type="text"
          value={productName}
          onChange={(e) => setProductName(e.target.value)}
          className="w-full px-4 py-2 bg-gray-800 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="e.g., Premium T-Shirt"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Current Price ($) *
          </label>
          <input
            type="number"
            value={currentPrice}
            onChange={(e) => setCurrentPrice(e.target.value)}
            step="0.01"
            min="0.01"
            className="w-full px-4 py-2 bg-gray-800 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="29.99"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Cost per Item ($) *
          </label>
          <input
            type="number"
            value={costPerItem}
            onChange={(e) => setCostPerItem(e.target.value)}
            step="0.01"
            min="0.01"
            className="w-full px-4 py-2 bg-gray-800 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="10.00"
          />
        </div>
      </div>

      <div>
        <label className="flex items-center gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={requiresShipping}
            onChange={(e) => setRequiresShipping(e.target.checked)}
            className="w-5 h-5 rounded border-gray-600 bg-gray-800 text-blue-500 focus:ring-blue-500"
          />
          <span className="text-sm text-gray-300">This product requires shipping</span>
        </label>
      </div>

      <button
        type="submit"
        className="w-full px-6 py-3 bg-[var(--abc-blue-primary)] text-white font-semibold rounded-lg hover:bg-[var(--abc-blue-secondary)] transition-colors duration-200"
      >
        Analyze Pricing
      </button>
    </form>
  );
}