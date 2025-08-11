import React, { useState, useRef, useEffect } from 'react';

interface TooltipProps {
  content: string;
  children: React.ReactNode;
  preferredPosition?: 'left' | 'right';
}

export default function Tooltip({ content, children, preferredPosition = 'left' }: TooltipProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [position, setPosition] = useState<'left' | 'right'>(preferredPosition);
  const tooltipRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isVisible && containerRef.current) {
      const container = containerRef.current;
      const containerRect = container.getBoundingClientRect();
      
      // Estimate tooltip width (min-w-80 = 320px) + some padding
      const estimatedTooltipWidth = 320;
      
      // Check boundaries based on preferred position
      if (preferredPosition === 'left') {
        // Check if tooltip would go off screen to the left
        if (containerRect.left - estimatedTooltipWidth < 20) {
          setPosition('right');
        } else {
          setPosition('left');
        }
      } else {
        // Check if tooltip would go off screen to the right
        if (containerRect.right + estimatedTooltipWidth > window.innerWidth - 20) {
          setPosition('left');
        } else {
          setPosition('right');
        }
      }
    }
  }, [isVisible, preferredPosition]);

  return (
    <div ref={containerRef} className="relative inline-block">
      <div
        onMouseEnter={() => setIsVisible(true)}
        onMouseLeave={() => setIsVisible(false)}
        className="cursor-help"
      >
        {children}
      </div>
      {isVisible && (
        <div 
          ref={tooltipRef}
          className={`absolute z-10 px-3 py-2 text-sm bg-gray-800 text-white rounded-lg shadow-lg max-w-sm w-max min-w-80 -top-2 transform -translate-y-full ${
            position === 'left' ? 'right-6' : 'left-6'
          }`}
        >
          <div className="text-left leading-relaxed break-words">
            {content}
          </div>
          <div className={`absolute top-full w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-800 ${
            position === 'left' ? 'right-2' : 'left-2'
          }`}></div>
        </div>
      )}
    </div>
  );
}