
import React from 'react';

export const DoodleSquareIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width="24" 
    height="24" 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
  >
    <rect x="3" y="3" width="18" height="18" rx="2" ry="2" transform="rotate(4 12 12)"/>
    <path d="M8 8l3 3 3-3"/>
    <path d="M8 16l3-3 3 3"/>
  </svg>
);
