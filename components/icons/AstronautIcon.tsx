
import React from 'react';

export const AstronautIcon: React.FC<{ className?: string }> = ({ className }) => (
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
    <path d="M12 2a6 6 0 0 0-6 6v4a6 6 0 0 0 12 0V8a6 6 0 0 0-6-6z" />
    <path d="M12 12c-3.31 0-6 2.69-6 6s2.69 6 6 6 6-2.69 6-6-2.69-6-6-6z" />
    <path d="M18 8a2 2 0 1 0 0-4 2 2 0 0 0 0 4z" />
    <path d="M6 8a2 2 0 1 0 0-4 2 2 0 0 0 0 4z" />
  </svg>
);
