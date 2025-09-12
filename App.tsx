import React, { useState, useEffect, useCallback } from 'react';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { ComicViewer } from './components/ComicViewer';
import { Loader } from './components/Loader';
import { AnimatedBackground } from './components/AnimatedBackground';
import { generateComicScript, generatePanelImage } from './services/geminiService';
import { ComicPanelData } from './types';
import { SparklesIcon } from './components/icons/SparklesIcon';

type AppState = 'idle' | 'loading-script' | 'generating-images' | 'viewing';

const App: React.FC = () => {
  const [theme, setTheme] = useState<'light' | 'dark'>('dark');
  const [appState, setAppState] = useState<AppState>('idle');
  const [storyIdea, setStoryIdea] = useState('');
  const [panels, setPanels] = useState<ComicPanelData[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // We set the body class directly for theme changes
    if (theme === 'dark') {
      document.body.classList.add('bg-gray-900');
      document.body.classList.remove('bg-slate-100');
    } else {
      document.body.classList.add('bg-slate-100');
      document.body.classList.remove('bg-gray-900');
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prevTheme => (prevTheme === 'dark' ? 'light' : 'dark'));
  };

  const handleGenerateComic = useCallback(async () => {
    if (!storyIdea.trim()) {
      setError("Please enter a story idea.");
      return;
    }
    setError(null);
    setAppState('loading-script');
    setPanels([]);

    try {
      const script = await generateComicScript(storyIdea);
      setPanels(script);
      setAppState('generating-images');

      const updatedPanels = [...script];
      for (let i = 0; i < script.length; i++) {
        const imageUrl = await generatePanelImage(script[i].image_prompt);
        updatedPanels[i] = { ...script[i], imageUrl };
        setPanels([...updatedPanels]);
      }
      setAppState('viewing');
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unknown error occurred.");
      setAppState('idle');
    }
  }, [storyIdea]);

  const handleReset = () => {
    setAppState('idle');
    setPanels([]);
    setStoryIdea('');
    setError(null);
  };
  
  const isLoading = appState === 'loading-script' || appState === 'generating-images';
  
  const renderContent = () => {
    switch (appState) {
      case 'loading-script':
        return <Loader theme={theme} />;
      // FIX: Show ComicViewer during image generation for better UX and to fix the TS error.
      // The comparison `appState === 'generating-images'` was always false inside the 'viewing' case.
      // By showing the viewer for both 'generating-images' and 'viewing', the check becomes meaningful
      // and the UI provides a better experience, showing panels as they load.
      case 'generating-images':
      case 'viewing':
        return <ComicViewer panels={panels} handleReset={handleReset} isLoading={appState === 'generating-images'} theme={theme} />;
      case 'idle':
      default:
        return (
          <div className="w-full max-w-2xl flex flex-col items-center gap-6">
            <textarea
              value={storyIdea}
              onChange={(e) => setStoryIdea(e.target.value)}
              placeholder="A cat astronaut discovering a planet made of yarn..."
              className={`w-full h-32 p-6 text-3xl resize-none rounded-2xl border-2 transition-all duration-300 focus:outline-none focus:ring-4 ${
                theme === 'dark'
                  ? 'bg-gray-800/80 border-cyan-500/50 text-white placeholder-gray-500 focus:border-cyan-400 focus:ring-cyan-500/30'
                  : 'bg-white/80 border-slate-300 text-slate-900 placeholder-slate-400 focus:border-blue-500 focus:ring-blue-500/30'
              }`}
              disabled={isLoading}
            />
            <button
              onClick={handleGenerateComic}
              disabled={isLoading}
              className={`flex items-center justify-center gap-4 w-full max-w-md px-8 py-5 text-4xl font-bold rounded-2xl shadow-lg transition-transform duration-300 ease-in-out hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed ${
                theme === 'dark'
                  ? 'bg-cyan-500 text-gray-900 hover:bg-cyan-400 shadow-cyan-500/30'
                  : 'bg-blue-600 text-white hover:bg-blue-700 shadow-blue-600/30'
              }`}
            >
              <SparklesIcon className="w-10 h-10" />
              Generate Comic
            </button>
            {error && <p className="text-red-400 text-2xl mt-2">{error}</p>}
          </div>
        );
    }
  };

  return (
    <div className={`relative min-h-screen flex flex-col transition-colors duration-500 overflow-x-hidden`}>
      {theme === 'dark' && <AnimatedBackground />}
      <div className={`relative z-10 flex flex-col items-center justify-center flex-grow p-4 transition-all duration-500 ${theme === 'dark' && appState === 'idle' ? 'backdrop-blur-sm bg-black/30 rounded-xl' : ''}`}>
        <Header theme={theme} toggleTheme={toggleTheme} />
        <main className="w-full flex-grow flex items-center justify-center">
            {renderContent()}
        </main>
        <Footer theme={theme} />
      </div>
    </div>
  );
};

export default App;
