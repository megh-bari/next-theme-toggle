'use client';

import Link from 'next/link';
import { Twitter, Palette } from 'lucide-react';

const addedFiles = [
  { path: 'src/app/components/ThemeToggle.tsx' },
  { path: 'src/app/components/layout/Header.tsx' },
  { path: 'src/app/components/ExampleCard.tsx' },
];

const updatedFiles = [
  { path: 'src/app/layout.tsx' },
  { path: 'src/app/page.tsx' },
];


export default function ExampleCard() {
  return (
    <div className="mt-6 flex items-center justify-center p-2 sm:p-4">
      <div className="
        w-full max-w-md sm:max-w-xl 
        px-4 sm:px-6 py-6 sm:py-10 
        rounded-2xl shadow-2xl
        bg-white/80 dark:bg-black/50 backdrop-blur-lg
        border border-gray-200/50 dark:border-white/10
      ">
        <h2 className="text-lg sm:text-xl font-semibold font-mono text-center mb-4 sm:mb-6">
          Files Added &amp; Updated
        </h2>

        <div className="space-y-4 sm:space-y-6 text-xs sm:text-sm">
          <div>
            <p className="font-semibold mb-1 sm:mb-2 text-gray-700 dark:text-gray-300">
              Added:
            </p>
            <ul className="space-y-1">
              {addedFiles.map((file) => (
                <li key={file.path}>
                  <span className="font-mono bg-gray-100  dark:bg-white/5 text-gray-800 dark:text-gray-200 px-2 py-[2px] rounded">
                    {file.path}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="font-semibold mb-1 sm:mb-2 text-gray-700 dark:text-gray-300">
              Updated&nbsp;(overwritten):
            </p>
            <ul className="space-y-1">
              {updatedFiles.map((file) => (
                <li key={file.path}>
                  <span className="font-mono bg-gray-100  dark:bg-white/5 text-gray-800 dark:text-gray-200 px-2 py-[2px] rounded">
                    {file.path}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="font-semibold mb-1 sm:mb-2 text-gray-700 dark:text-gray-300">
              Updated&nbsp;(global&nbsp;CSS):
            </p>
            <ul className="space-y-1">
              <li>
                <span className="font-mono bg-gray-100  dark:bg-white/5 text-gray-800 dark:text-gray-200 px-2 py-1 rounded">
                  src/app/globals.css
                </span>
              </li>
            </ul>
          </div>
        </div>

        <p className="text-gray-600 dark:text-gray-400 mt-6 sm:mt-8 text-center text-xs sm:text-base">
          This card demonstrates how the theme affects different UI elements. The colors change smoothly when you toggle the theme.
        </p>
        <div className="mt-5 mb-6 pt-4 border-t border-gray-500/50 text-center dark:border-white/10">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Switch themes using the toggle in your navigation bar
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 w-full">
          <Link
            href="https://twitter.com/meghtrix"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto flex-1 inline-flex items-center justify-center gap-2 sm:gap-3 rounded-full
              bg-blue-500 hover:bg-blue-600 text-white
              dark:bg-white/5 dark:hover:bg-white/10 dark:text-white
              px-4 sm:px-6 py-3 sm:py-4 font-semibold shadow-md hover:shadow-xl
              transition-all duration-300"
          >
            <Twitter size={18} className="transition-transform duration-300" />
            <span className="truncate">Follow on Twitter</span>
          </Link>

          <Link
            href="https://patterncraft.megh.me/"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto flex-1 inline-flex items-center justify-center gap-2 sm:gap-3 rounded-full
              bg-purple-500 hover:bg-purple-600 text-white
              dark:bg-white/5 dark:hover:bg-white/10 dark:text-white
              px-4 sm:px-6 py-3 sm:py-4 font-semibold shadow-md hover:shadow-xl
              transition-all duration-300"
          >
            <Palette size={18} className="transition-transform duration-300" />
            <span className="truncate">Beautiful Backgrounds</span>
          </Link>
        </div>

      </div>
    </div>
  );
}
