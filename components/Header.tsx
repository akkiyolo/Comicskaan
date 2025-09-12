import React from 'react';
import { SunIcon } from './icons/SunIcon';
import { MoonIcon } from './icons/MoonIcon';

interface HeaderProps {
  theme: 'light' | 'dark';
  toggleTheme: () => void;
}

export const Header: React.FC<HeaderProps> = ({ theme, toggleTheme }) => {
  return (
    <header className="relative w-full p-8 text-center">
      <h1 className={`text-8xl font-bold transition-colors duration-500 ${
        theme === 'dark' ? 'text-white' : 'text-slate-900'
      }`} style={{ textShadow: theme === 'dark' ? '0 0 15px rgba(0, 255, 255, 0.7)' : 'none' }}>
        Comicskaan
      </h1>
      <p className={`text-4xl mt-2 transition-colors duration-500 ${
        theme === 'dark' ? 'text-slate-300' : 'text-slate-600'
      }`}>
        Turn your ideas into comic strips instantly.
      </p>
      <div className="absolute top-4 right-4">
        <button
          onClick={toggleTheme}
          className={`p-3 rounded-full transition-all duration-300 ${
              theme === 'dark' 
                  ? 'text-yellow-300 hover:bg-gray-800 hover:scale-110' 
                  : 'text-slate-700 hover:bg-slate-200 hover:scale-110'
          }`}
          aria-label="Toggle theme"
        >
          {theme === 'dark' ? <SunIcon className="w-8 h-8" /> : <MoonIcon className="w-8 h-8" />}
        </button>
      </div>
    </header>
  );
};