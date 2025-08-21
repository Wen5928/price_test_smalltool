'use client';

import React, { useState, useEffect } from 'react';

export default function DebugPanel() {
  const [isVisible, setIsVisible] = useState(false);
  const [sessionData, setSessionData] = useState<Record<string, string>>({});

  useEffect(() => {
    // Check for debug mode in URL
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('debug') === 'true') {
      setIsVisible(true);
    }
  }, []);

  useEffect(() => {
    if (isVisible) {
      const interval = setInterval(() => {
        const data: Record<string, string> = {};
        for (let i = 0; i < sessionStorage.length; i++) {
          const key = sessionStorage.key(i);
          if (key) {
            const value = sessionStorage.getItem(key) || '';
            data[key] = value.length > 100 ? value.substring(0, 100) + '...' : value;
          }
        }
        setSessionData(data);
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [isVisible]);

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-4 right-4 w-96 bg-gray-900 border border-gray-700 rounded-lg p-4 shadow-lg z-50">
      <div className="flex justify-between items-center mb-3">
        <h3 className="text-sm font-semibold text-white">Debug Panel</h3>
        <button
          onClick={() => setIsVisible(false)}
          className="text-gray-400 hover:text-white"
        >
          ×
        </button>
      </div>
      
      <div className="space-y-2">
        <div className="text-xs text-gray-400">
          <div className="font-semibold mb-1">SessionStorage:</div>
          {Object.keys(sessionData).length === 0 ? (
            <div className="text-red-400">Empty</div>
          ) : (
            Object.entries(sessionData).map(([key, value]) => (
              <div key={key} className="mb-2">
                <div className="font-medium text-blue-400">{key}:</div>
                <div className="text-gray-300 break-all">{value}</div>
              </div>
            ))
          )}
        </div>
        
        <div className="text-xs text-gray-400 mt-3">
          <div className="font-semibold">Current Page:</div>
          <div className="text-gray-300">{window.location.pathname}</div>
        </div>
      </div>
    </div>
  );
}