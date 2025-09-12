
import React from 'react';
import { SparklesIcon } from './icons/SparklesIcon';

interface CreateViewProps {
  storyIdea: string;
  setStoryIdea: (value: string) => void;
  handleGenerateComic: () => void;
  isLoading: boolean;
  error: string | null;
}

export const CreateView: React.FC<CreateViewProps> = ({
  storyIdea,
  setStoryIdea,
  handleGenerateComic,
  isLoading,
  error,
}) => {
  return (
    <div className="p-6 space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Creation Area */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-800 p-6 rounded-lg border border-slate-200 dark:border-slate-700">
          <h2 className="text-xl font-bold text-slate-700 dark:text-slate-200 mb-1">Trending AI Series (Demse.)</h2>
          <p className="text-slate-500 dark:text-slate-400 mb-4">Describe your comic, characters, locations, your plot & contemplate your tonners storie and your art prompts.</p>
          
          <textarea
            value={storyIdea}
            onChange={(e) => setStoryIdea(e.target.value)}
            placeholder="A cat astronaut discovering a planet made of yarn..."
            className="w-full h-32 p-4 bg-slate-50 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none text-base"
          />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 my-4">
            <div>
              <label className="font-semibold text-slate-600 dark:text-slate-300">Art Style</label>
              <select className="mt-1 w-full p-2 bg-slate-50 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option>Manga</option>
                <option>American Classic</option>
                <option>Pixel Art</option>
              </select>
            </div>
            <div>
              <label className="font-semibold text-slate-600 dark:text-slate-300">Color Palette</label>
               <input type="text" value="#FF5733, #33FF57" readOnly className="mt-1 w-full p-2 bg-slate-50 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-lg" />
            </div>
            <div>
              <label className="font-semibold text-slate-600 dark:text-slate-300">Tone</label>
              <select className="mt-1 w-full p-2 bg-slate-50 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option>Dramatic</option>
                <option>Comedic</option>
                <option>Action</option>
              </select>
            </div>
          </div>
          
          <button
            onClick={handleGenerateComic}
            disabled={isLoading}
            className="flex items-center justify-center gap-3 w-full px-8 py-4 bg-blue-600 text-white text-lg font-bold rounded-lg shadow-md hover:bg-blue-700 transition-transform duration-300 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <SparklesIcon className="w-6 h-6" />
            GENERATE COMIC
          </button>
          {error && <p className="text-red-500 text-center mt-4">{error}</p>}
        </div>

        {/* Previous Prompts */}
        <div className="bg-white dark:bg-slate-800 p-6 rounded-lg border border-slate-200 dark:border-slate-700">
          <h3 className="font-bold text-slate-700 dark:text-slate-200 mb-4">Previous Prompts</h3>
          <div className="h-full bg-slate-50 dark:bg-slate-700/50 rounded-lg border border-dashed border-slate-300 dark:border-slate-600 flex items-center justify-center">
            <p className="text-slate-400 dark:text-slate-500">Your past prompts will appear here.</p>
          </div>
        </div>
      </div>

      {/* Trending AI Series */}
      <div>
        <h2 className="text-xl font-bold text-slate-700 dark:text-slate-200 mb-4">Trending AI Series</h2>
        <div className="flex space-x-4 overflow-x-auto pb-4">
          {[1, 2, 3, 4, 5, 6].map(i => (
            <div key={i} className="flex-shrink-0 w-48 h-28 bg-slate-300 dark:bg-slate-700 rounded-lg shadow-md">
              <img src={`https://picsum.photos/seed/${i+10}/192/112`} alt="Trending Comic" className="w-full h-full object-cover rounded-lg" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
