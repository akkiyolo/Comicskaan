
import React from 'react';

export const DoodleTriangleIcon: React.FC<{ className?: string }> = ({ className }) => (
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
    <path d="M12 2L2 22h20L12 2z" transform="rotate(10 12 12)"/>
    <path d="M12 8v8"/>
    <path d="M9 14l3 3 3-3"/>
  </svg>
);
