import React from 'react';
import { ComicPanelData } from '../types';

interface ComicPanelProps {
  panel: ComicPanelData;
  isCurrent: boolean;
  theme: 'light' | 'dark';
}

export const ComicPanel: React.FC<ComicPanelProps> = ({ panel, isCurrent, theme }) => {
  return (
    <div className={`w-full flex-shrink-0 relative overflow-hidden aspect-square rounded-lg border-2 ${
        theme === 'dark' ? 'border-gray-700 shadow-lg shadow-cyan-500/10' : 'border-slate-300 shadow-lg shadow-slate-400/20'
    }`}>
      {panel.imageUrl ? (
        <img
          src={panel.imageUrl}
          alt={panel.scene_description}
          className="w-full h-full object-cover transition-transform duration-500 ease-in-out"
          style={{ transform: isCurrent ? 'scale(1.05)' : 'scale(1)' }}
        />
      ) : (
        <div className={`w-full h-full flex items-center justify-center ${theme === 'dark' ? 'bg-gray-800' : 'bg-slate-200'}`}>
          <p className={`text-2xl ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>Generating image...</p>
        </div>
      )}
      
      <div className={`absolute inset-0 ${theme === 'dark' ? 'bg-gradient-to-t from-black/70 via-black/20 to-transparent' : 'bg-gradient-to-t from-black/50 via-black/10 to-transparent'}`} />

      {panel.dialogue && (
        <div className="absolute bottom-4 left-4 right-4 p-1">
            <div className={`relative backdrop-blur-sm text-center text-xl md:text-2xl shadow-lg ${
                theme === 'dark'
                    ? 'bg-black/80 text-white p-3 rounded-lg speech-bubble-dark'
                    : 'bg-white/90 text-black p-3 rounded-lg speech-bubble-light'
            }`}>
                <p>{panel.dialogue}</p>
            </div>
        </div>
      )}

      <div className={`absolute top-2 left-2 rounded-full w-10 h-10 flex items-center justify-center text-2xl ${
        theme === 'dark' ? 'bg-black/70 text-white' : 'bg-white/80 text-black'
      }`}>
        {panel.panel_number}
      </div>
       <style>{`
        .speech-bubble-dark:after {
          content: '';
          position: absolute;
          bottom: 0;
          left: 20%;
          width: 0;
          height: 0;
          border: 15px solid transparent;
          border-top-color: rgba(0, 0, 0, 0.8);
          border-bottom: 0;
          margin-left: -15px;
          margin-bottom: -15px;
        }
        .speech-bubble-light:after {
          content: '';
          position: absolute;
          bottom: 0;
          left: 20%;
          width: 0;
          height: 0;
          border: 15px solid transparent;
          border-top-color: rgba(255, 255, 255, 0.9);
          border-bottom: 0;
          margin-left: -15px;
          margin-bottom: -15px;
        }
      `}</style>
    </div>
  );
};
