import React, { useState, useEffect, useRef } from 'react';
import html2canvas from 'html2canvas';
import { ComicPanel } from './ComicPanel';
import { ArrowLeftIcon } from './icons/ArrowLeftIcon';
import { ArrowRightIcon } from './icons/ArrowRightIcon';
import { DownloadIcon } from './icons/DownloadIcon';
import { SparklesIcon } from './icons/SparklesIcon';
import { ComicPanelData } from '../types';

interface ComicViewerProps {
  panels: ComicPanelData[];
  handleReset: () => void;
  isLoading: boolean;
  theme: 'light' | 'dark';
}

export const ComicViewer: React.FC<ComicViewerProps> = ({ panels, handleReset, isLoading, theme }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const comicStripRef = useRef<HTMLDivElement>(null);

  const goToPrevious = () => {
    setCurrentIndex((prevIndex) => (prevIndex === 0 ? panels.length - 1 : prevIndex - 1));
  };

  const goToNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex === panels.length - 1 ? 0 : prevIndex + 1));
  };
  
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'ArrowLeft') {
        goToPrevious();
      } else if (event.key === 'ArrowRight') {
        goToNext();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [panels.length]);

  const handleDownload = async () => {
    if (!comicStripRef.current) return;
    try {
      const canvas = await html2canvas(comicStripRef.current, { 
          useCORS: true,
          backgroundColor: theme === 'dark' ? '#111827' : '#f1f5f9' // bg-gray-900 or bg-slate-100
      });
      const image = canvas.toDataURL('image/png', 1.0);
      const link = document.createElement('a');
      link.href = image;
      link.download = 'comicskaan-strip.png';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error('Failed to download comic strip:', error);
    }
  };

  return (
    <div className="w-full max-w-5xl flex flex-col items-center justify-center p-4">
      <div className="w-full flex justify-between items-center mb-6">
        <h2 className={`text-4xl ${theme === 'dark' ? 'text-slate-200' : 'text-slate-800'}`}>Your Comic Strip</h2>
        <div className="flex gap-4">
           <button
            onClick={handleReset}
            className={`flex items-center justify-center gap-2 px-6 py-3 text-xl font-bold rounded-lg shadow-md transition-transform duration-300 ease-in-out hover:scale-105 disabled:opacity-50 ${
                theme === 'dark' 
                    ? 'bg-gray-700 text-white hover:bg-gray-600' 
                    : 'bg-slate-200 text-slate-800 hover:bg-slate-300'
            }`}
          >
            <SparklesIcon className="w-6 h-6" />
            New Story
          </button>
          <button
            onClick={handleDownload}
            disabled={isLoading || panels.some(p => !p.imageUrl)}
            className={`flex items-center justify-center gap-2 px-6 py-3 text-xl font-bold rounded-lg shadow-lg transition-transform duration-300 ease-in-out hover:scale-105 disabled:opacity-50 ${
                theme === 'dark'
                  ? 'bg-cyan-500 text-gray-900 hover:bg-cyan-400'
                  : 'bg-blue-600 text-white hover:bg-blue-700'
            }`}
          >
            <DownloadIcon className="w-6 h-6" />
            Export as Image
          </button>
        </div>
      </div>

      <div className="w-full flex items-center justify-center gap-4">
        {/* Carousel */}
        <div className="w-full max-w-lg aspect-square overflow-hidden rounded-xl">
          <div
            className="flex transition-transform duration-500 ease-in-out"
            style={{ transform: `translateX(-${currentIndex * 100}%)` }}
          >
            {panels.map((panel, index) => (
              <ComicPanel key={index} panel={panel} isCurrent={index === currentIndex} theme={theme} />
            ))}
          </div>
        </div>
      </div>
      
      {/* Navigation */}
      <div className="flex items-center gap-8 mt-4">
        <button onClick={goToPrevious} disabled={panels.length <= 1} className="p-3 rounded-full bg-black/20 hover:bg-black/40 disabled:opacity-30 transition-colors">
          <ArrowLeftIcon className="w-8 h-8 text-white" />
        </button>
        <p className={`text-2xl ${theme === 'dark' ? 'text-slate-300' : 'text-slate-600'}`}>
          {currentIndex + 1} / {panels.length}
        </p>
        <button onClick={goToNext} disabled={panels.length <= 1} className="p-3 rounded-full bg-black/20 hover:bg-black/40 disabled:opacity-30 transition-colors">
          <ArrowRightIcon className="w-8 h-8 text-white" />
        </button>
      </div>

       {isLoading && (
          <div className="mt-4 text-center">
            <p className={`animate-pulse text-lg ${theme === 'dark' ? 'text-cyan-400' : 'text-blue-600'}`}>Generating remaining images...</p>
          </div>
        )}
      
      {/* Hidden div for download */}
      <div ref={comicStripRef} className="absolute -z-10 -left-[9999px] top-0 p-4" style={{ backgroundColor: theme === 'dark' ? '#111827' : '#f1f5f9' }}>
        <div className={`grid grid-cols-2 gap-4 w-[1024px]`}>
          {panels.filter(p => p.imageUrl).map((panel, index) => (
            <div key={`export-${index}`} className="relative aspect-square border-4" style={{ borderColor: theme === 'dark' ? '#06b6d4' : '#2563eb'}}>
               <img src={panel.imageUrl} alt={panel.scene_description} className="w-full h-full object-cover" />
               {panel.dialogue && (
                  <div className="absolute bottom-2 left-2 right-2 p-2 text-center text-lg shadow-lg bg-black/70 text-white rounded-md">
                      <p>{panel.dialogue}</p>
                  </div>
                )}
                <div className="absolute top-1 left-1 bg-black/60 text-white rounded-full w-8 h-8 flex items-center justify-center text-lg">
                  {panel.panel_number}
                </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
