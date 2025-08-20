'use client';

import React from 'react';

interface Step {
  id: string;
  title: string;
  description: string;
  status: 'completed' | 'current' | 'pending';
  onClick?: () => void;
}

interface StepIndicatorProps {
  steps: Step[];
}

export default function StepIndicator({ steps }: StepIndicatorProps) {
  return (
    <div className="mb-8">
      <div className="flex items-center justify-between">
        {steps.map((step, index) => (
          <div key={step.id} className="flex-1">
            <div className="flex items-center">
              {/* Step Circle */}
              <button 
                onClick={step.onClick}
                className={`
                  w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors cursor-pointer
                  ${step.status === 'completed' 
                    ? 'bg-abc-blue-primary text-white hover:bg-abc-blue-secondary' 
                    : step.status === 'current' 
                    ? 'bg-abc-blue-secondary text-white hover:bg-abc-blue-light' 
                    : 'bg-gray-600 text-gray-400 hover:bg-gray-500'
                  }
                `}
              >
                {step.status === 'completed' ? (
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                ) : (
                  index + 1
                )}
              </button>

              {/* Connection Line */}
              {index < steps.length - 1 && (
                <div className={`
                  flex-1 h-0.5 mx-4
                  ${steps[index + 1].status !== 'pending' ? 'bg-abc-blue-primary' : 'bg-gray-600'}
                `} />
              )}
            </div>

            {/* Step Content */}
            <div className="mt-2">
              <h4 className={`
                text-sm font-medium
                ${step.status === 'current' ? 'text-abc-blue-secondary' : 'text-white'}
              `}>
                {step.title}
              </h4>
              <p className="text-xs text-gray-400 mt-1">
                {step.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}