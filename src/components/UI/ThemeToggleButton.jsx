import React from 'react';
import { useKanban } from '../../contexts/KanbanContext';

const ThemeToggleButton = ({ className = '' }) => {
    const { theme, toggleTheme } = useKanban();

    return (
        <button
            onClick={toggleTheme}
            className={`
        relative w-14 h-8 rounded-full p-1 transition-all duration-500
        ${theme === 'dark'
                    ? 'bg-gradient-to-r from-blue-900 to-purple-900'
                    : 'bg-gradient-to-r from-blue-400 to-purple-400'}
        hover:scale-105 active:scale-95
        focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
        ${className}
      `}
            aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
        >
            <div className="absolute inset-0 rounded-full overflow-hidden">
                {theme === 'light' && (
                    <>
                        <div className="absolute top-0 left-1/2 w-1 h-2 bg-yellow-300/50 rounded-full -translate-x-1/2"></div>
                        <div className="absolute top-1/4 right-0 w-2 h-1 bg-yellow-300/50 rounded-full -translate-y-1/2"></div>
                        <div className="absolute bottom-1/4 left-0 w-2 h-1 bg-yellow-300/50 rounded-full -translate-y-1/2"></div>
                        <div className="absolute bottom-0 left-1/2 w-1 h-2 bg-yellow-300/50 rounded-full -translate-x-1/2"></div>
                    </>
                )}

                {theme === 'dark' && (
                    <>
                        <div className="absolute top-1/4 left-1/4 w-1 h-1 bg-white/70 rounded-full"></div>
                        <div className="absolute top-1/3 right-1/3 w-0.5 h-0.5 bg-white/50 rounded-full"></div>
                        <div className="absolute bottom-1/3 left-1/3 w-0.5 h-0.5 bg-white/50 rounded-full"></div>
                    </>
                )}
            </div>

            <div
                className={`
          relative w-6 h-6 rounded-full transition-all duration-500
          transform ${theme === 'dark' ? 'translate-x-6' : 'translate-x-0'}
          ${theme === 'dark'
                        ? 'bg-gradient-to-br from-gray-900 to-gray-700'
                        : 'bg-gradient-to-br from-yellow-300 to-orange-400'}
          shadow-lg flex items-center justify-center
        `}
            >
                {theme === 'dark' ? (
                    <svg
                        className="w-4 h-4 text-gray-300"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                    >
                        <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
                    </svg>
                ) : (
                    <svg
                        className="w-4 h-4 text-orange-600"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                    >
                        <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clipRule="evenodd" />
                    </svg>
                )}
            </div>

            <div
                className={`
          absolute inset-0 rounded-full -z-10 transition-all duration-500
          ${theme === 'dark'
                        ? 'bg-blue-900/20 animate-pulse-glow'
                        : 'bg-yellow-400/20 animate-pulse-glow'}
        `}
            ></div>
        </button>
    );
};

export default ThemeToggleButton;