'use client';

import React, { useState, TouchEvent } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface CarouselProps {
  children: React.ReactNode[];
  className?: string;
  dotClassName?: string;
  showArrows?: boolean;
}

export function Carousel({ children, className = '', dotClassName = '', showArrows = true }: CarouselProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);

  const minSwipeDistance = 50;

  const handlePrev = () => {
    setActiveIndex((prev) => (prev === 0 ? children.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setActiveIndex((prev) => (prev === children.length - 1 ? 0 : prev + 1));
  };

  const onTouchStart = (e: TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e: TouchEvent) => {
    setTouchStart(prev => prev);
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;
    
    if (isLeftSwipe) {
      handleNext();
    } else if (isRightSwipe) {
      handlePrev();
    }
  };

  return (
    <div className={`relative w-full ${className}`}>
      
      {/* Slides Viewport */}
      <div 
        className="overflow-visible"
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
      >
        <div 
          className="flex transition-transform duration-500 ease-out"
          style={{ transform: `translateX(-${activeIndex * 100}%)` }}
        >
          {children.map((child, index) => (
            <div key={index} className="w-full flex-shrink-0 flex justify-center px-2">
              {child}
            </div>
          ))}
        </div>
      </div>

      {/* Navigation Buttons (Only shown if showArrows and children length > 1) */}
      {showArrows && children.length > 1 && (
        <>
          <button 
            type="button"
            onClick={handlePrev}
            className="absolute left-[-2rem] sm:left-[-3rem] top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-gray-900/60 border border-gray-800 text-gray-400 hover:text-white flex items-center justify-center backdrop-blur-md transition-all shadow-lg z-30 cursor-pointer"
            aria-label="Previous slide"
          >
            <ChevronLeft size={16} />
          </button>
          <button 
            type="button"
            onClick={handleNext}
            className="absolute right-[-2rem] sm:right-[-3rem] top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-gray-900/60 border border-gray-800 text-gray-400 hover:text-white flex items-center justify-center backdrop-blur-md transition-all shadow-lg z-30 cursor-pointer"
            aria-label="Next slide"
          >
            <ChevronRight size={16} />
          </button>
        </>
      )}

      {/* Dots Indicator (Only shown if children length > 1) */}
      {children.length > 1 && (
        <div className={`flex justify-center gap-2 mt-6 ${dotClassName}`}>
          {children.map((_, index) => (
            <button
              key={index}
              type="button"
              onClick={() => setActiveIndex(index)}
              className={`w-1.5 h-1.5 rounded-full transition-all cursor-pointer ${index === activeIndex ? 'bg-blue-500 w-3' : 'bg-gray-700 hover:bg-gray-600'}`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
