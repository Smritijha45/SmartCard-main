'use client';

import React, { useState, useRef } from 'react';

interface Interactive3DCardProps {
  children: React.ReactNode;
  className?: string;
  glowColor?: string;
}

export function Interactive3DCard({ 
  children, 
  className = '', 
  glowColor = 'rgba(255, 255, 255, 0.12)' 
}: Interactive3DCardProps) {
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);
  const [shineStyle, setShineStyle] = useState<React.CSSProperties>({ opacity: 0 });
  const cardRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const card = cardRef.current;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const width = rect.width;
    const height = rect.height;

    // Subtle, elegant tilt (max ~6 degrees, restrained)
    const rx = ((y / height) - 0.5) * -7;
    const ry = ((x / width) - 0.5) * 7;

    setRotateX(rx);
    setRotateY(ry);

    const shineX = (x / width) * 100;
    const shineY = (y / height) * 100;
    setShineStyle({
      opacity: 1,
      background: `radial-gradient(circle at ${shineX}% ${shineY}%, ${glowColor} 0%, transparent 60%)`,
    });
  };

  const handleMouseLeave = () => {
    setRotateX(0);
    setRotateY(0);
    setShineStyle({ opacity: 0 });
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        transform: `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.008, 1.008, 1.008)`,
        transition: 'transform 0.2s cubic-bezier(0.2, 0.8, 0.2, 1), box-shadow 0.2s ease',
      }}
      className={`relative overflow-hidden transition-all duration-300 ${className}`}
    >
      {/* Subtle refined shine overlay */}
      <div
        className="absolute inset-0 pointer-events-none z-30 transition-opacity duration-300"
        style={shineStyle}
      />
      {children}
    </div>
  );
}
