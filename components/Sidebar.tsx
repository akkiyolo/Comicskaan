
import React from 'react';
import { HomeIcon } from './icons/HomeIcon';
import { CreateIcon } from './icons/CreateIcon';
import { LibraryIcon } from './icons/LibraryIcon';

export const Sidebar: React.FC = () => {
  const navItems = [
    { name: 'Home', icon: HomeIcon, active: false },
    { name: 'Create', icon: CreateIcon, active: true },
    { name: 'My Library', icon: LibraryIcon, active: false },
  ];

  return (
    <aside className="w-64 bg-white dark:bg-slate-800 text-gray-800 dark:text-gray-200 flex flex-col flex-shrink-0 border-r border-slate-200 dark:border-slate-700 h-full">
      <div className="h-16 flex items-center justify-center border-b border-slate-200 dark:border-slate-700">
        <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100 tracking-wider">Comicskaan</h1>
      </div>
      <nav className="flex-grow px-4 py-6">
        <ul>
          {navItems.map((item) => (
            <li key={item.name} className="mb-2">
              <a
                href="#"
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors duration-200 ${
                  item.active
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'text-gray-600 hover:bg-slate-100 dark:text-gray-400 dark:hover:bg-slate-700'
                }`}
              >
                <item.icon className="w-6 h-6" />
                <span className="font-medium text-lg">{item.name}</span>
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
};
