import React from 'react';

interface FooterProps {
  theme: 'light' | 'dark';
}

export const Footer: React.FC<FooterProps> = ({ theme }) => {
  return (
    <footer className="text-center py-4 px-4">
      <p className={`text-lg transition-colors duration-500 ${theme === 'dark' ? 'text-slate-500' : 'text-slate-400'}`}>
        Powered by AI. Created with creativity.
      </p>
    </footer>
  );
};
