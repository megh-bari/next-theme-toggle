'use client';

import { Zap } from 'lucide-react';
import ThemeToggle from '../ThemeToggle';

export default function Header() {
  return (
    <header className="pt-4 p-4 flex items-center justify-center overflow-hidden">
      <div className="w-full max-w-xl rounded-xl backdrop-blur-sm bg-white/60 dark:bg-black/30 
                      transition-all duration-300 border border-gray-200 dark:border-white/10">
        <div className="flex items-center justify-between px-4 py-4 sm:py-4">
          <div className="flex items-center space-x-2">
            <Zap className="h-5 w-5 text-yellow-500" />
            <span className="text-lg font-semibold text-gray-900 dark:text-white select-none">
              Logo
            </span>
          </div>

          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
