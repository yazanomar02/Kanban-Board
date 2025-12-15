import { useState } from 'react';
import { useKanban } from '../../contexts/KanbanContext';

const Header = () => {
    const {
        theme,
        toggleTheme,
        searchTerm,
        setSearchTerm,
        filter,
        setFilter,
        getStats,
        exportData,
        importData,
        resetData,
    } = useKanban();

    const [setShowImport] = useState(false);
    const [showSettings, setShowSettings] = useState(false);

    const stats = getStats();

    const handleImport = (event) => {
        const file = event.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const data = JSON.parse(e.target.result);
                if (importData(data)) {
                    alert('Data imported successfully!');
                    setShowImport(false);
                } else {
                    alert('Invalid data format');
                }
            } catch (error) {
                alert('Error importing data: ' + error.message);
            }
        };
        reader.readAsText(file);
        event.target.value = '';
    };

    return (
        <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700 transition-colors duration-300">
            <div className="container mx-auto px-4 py-4">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                        <div className="relative">
                            <div className={`w-10 h-10 rounded-lg flex items-center justify-center
                ${theme === 'dark'
                                    ? 'bg-gradient-to-br from-blue-600 to-purple-700'
                                    : 'bg-gradient-to-br from-blue-500 to-purple-600'}`}>
                                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                                        d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                                </svg>
                            </div>
                            <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white dark:border-gray-800"></div>
                        </div>

                        <div>
                            <h1 className="text-xl font-bold text-gray-900 dark:text-white transition-colors">
                                Kanban Board
                            </h1>
                            <p className="text-sm text-gray-500 dark:text-gray-400 transition-colors">
                                Organize your workflow efficiently
                            </p>
                        </div>
                    </div>

                    <div className="flex-1 max-w-2xl">
                        <div className="flex flex-col sm:flex-row gap-3">
                            <div className="relative flex-1">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                                            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                    </svg>
                                </div>
                                <input
                                    type="text"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    placeholder="Search tasks..."
                                    className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 
                           rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 
                           focus:border-transparent dark:bg-gray-700 dark:text-white
                           transition-colors"
                                />
                            </div>

                            <select
                                value={filter}
                                onChange={(e) => setFilter(e.target.value)}
                                className="px-4 py-2 border border-gray-300 dark:border-gray-600 
                         rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 
                         focus:border-transparent dark:bg-gray-700 dark:text-white
                         transition-colors"
                            >
                                <option value="all">All Tasks</option>
                                <option value="pending">Pending</option>
                                <option value="completed">Completed</option>
                                <option value="high">High Priority</option>
                                <option value="medium">Medium Priority</option>
                                <option value="low">Low Priority</option>
                            </select>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        <div className="hidden md:flex items-center gap-4 text-sm">
                            <div className="text-center">
                                <div className="font-semibold text-gray-900 dark:text-white transition-colors">
                                    {stats.totalTasks}
                                </div>
                                <div className="text-gray-500 dark:text-gray-400 text-xs transition-colors">
                                    Total
                                </div>
                            </div>
                            <div className="text-center">
                                <div className="font-semibold text-green-600 dark:text-green-400">
                                    {stats.completedTasks}
                                </div>
                                <div className="text-gray-500 dark:text-gray-400 text-xs transition-colors">
                                    Done
                                </div>
                            </div>
                            <div className="text-center">
                                <div className="font-semibold text-blue-600 dark:text-blue-400">
                                    {stats.pendingTasks}
                                </div>
                                <div className="text-gray-500 dark:text-gray-400 text-xs transition-colors">
                                    Pending
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center gap-2">
                            <button
                                onClick={toggleTheme}
                                className={`p-2 rounded-lg transition-all duration-300
                  ${theme === 'dark'
                                        ? 'bg-gray-700 text-yellow-400 hover:bg-gray-600'
                                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                                title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
                            >
                                {theme === 'dark' ? (
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                                            d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                                    </svg>
                                ) : (
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                                            d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                                    </svg>
                                )}
                            </button>

                            <div className="relative">
                                <button
                                    onClick={() => setShowSettings(!showSettings)}
                                    className="p-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 
                           dark:hover:bg-gray-700 rounded-lg transition-colors"
                                    title="Settings"
                                >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                                            d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                                            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                    </svg>
                                </button>

                                {showSettings && (
                                    <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 
                                rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-50">
                                        <div className="p-2">
                                            <div className="px-3 py-2 text-sm text-gray-700 dark:text-gray-300">
                                                <div className="flex items-center justify-between">
                                                    <span>Theme:</span>
                                                    <span className="font-medium">
                                                        {theme === 'dark' ? 'Dark' : 'Light'}
                                                    </span>
                                                </div>
                                            </div>

                                            <div className="border-t border-gray-200 dark:border-gray-700 my-1"></div>

                                            <button
                                                onClick={exportData}
                                                className="w-full text-left px-3 py-2 text-sm text-gray-700 
                                 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 
                                 rounded-md flex items-center gap-2"
                                            >
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                                                        d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                                </svg>
                                                Export Data
                                            </button>

                                            <label className="w-full text-left px-3 py-2 text-sm text-gray-700 
                                      dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 
                                      rounded-md flex items-center gap-2 cursor-pointer">
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                                                        d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                                                </svg>
                                                Import Data
                                                <input
                                                    type="file"
                                                    accept=".json"
                                                    onChange={handleImport}
                                                    className="hidden"
                                                />
                                            </label>

                                            <div className="border-t border-gray-200 dark:border-gray-700 my-1"></div>

                                            <button
                                                onClick={() => {
                                                    if (window.confirm('Reset all data to default?')) {
                                                        resetData();
                                                        setShowSettings(false);
                                                    }
                                                }}
                                                className="w-full text-left px-3 py-2 text-sm text-red-600 
                                 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 
                                 rounded-md flex items-center gap-2"
                                            >
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                                                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                </svg>
                                                Reset All Data
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;