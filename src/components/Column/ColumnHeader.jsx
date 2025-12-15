import { useState } from 'react';
import { useKanban } from '../../contexts/KanbanContext';

const ColumnHeader = ({ column, isEditingTitle, onEditTitle, onCancelEdit, onSaveEdit }) => {
    const { deleteColumn } = useKanban();
    const [newTitle, setNewTitle] = useState(column.title);
    const [showActions, setShowActions] = useState(false);

    const handleSave = () => {
        if (newTitle.trim() && newTitle.trim() !== column.title) {
            onSaveEdit(newTitle.trim());
        } else {
            onCancelEdit();
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            handleSave();
        } else if (e.key === 'Escape') {
            onCancelEdit();
        }
    };

    const getColumnIcon = (title) => {
        switch (title.toLowerCase()) {
            case 'to do':
            case 'todo':
                return (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                            d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                );
            case 'in progress':
                return (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                            d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                );
            case 'done':
                return (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                );
            default:
                return (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                            d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                    </svg>
                );
        }
    };

    const getColumnColor = (title) => {
        const colors = {
            'To Do': 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300',
            'In Progress': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300',
            'Done': 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300',
            'default': 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300',
        };

        return colors[title] || colors.default;
    };

    if (isEditingTitle) {
        return (
            <div className="flex items-center justify-between mb-4">
                <div className="flex-1">
                    <input
                        type="text"
                        value={newTitle}
                        onChange={(e) => setNewTitle(e.target.value)}
                        onKeyDown={handleKeyPress}
                        autoFocus
                        className="w-full px-3 py-2 border border-blue-300 dark:border-blue-600 
                     rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 
                     focus:border-transparent dark:bg-gray-700 dark:text-white"
                    />
                </div>
                <div className="flex gap-2 ml-2">
                    <button
                        onClick={handleSave}
                        className="p-2 text-green-600 hover:bg-green-50 dark:hover:bg-green-900/20 rounded-lg"
                        title="Save"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                        </svg>
                    </button>
                    <button
                        onClick={onCancelEdit}
                        className="p-2 text-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
                        title="Cancel"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg ${getColumnColor(column.title)}`}>
                    {getColumnIcon(column.title)}
                </div>
                <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white">
                        {column.title}
                    </h3>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                        {column.tasks.length} task{column.tasks.length !== 1 ? 's' : ''}
                    </p>
                </div>
            </div>

            <div className="relative">
                <button
                    onClick={() => setShowActions(!showActions)}
                    className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 
                   dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 
                   rounded-lg transition-colors"
                    title="Column actions"
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                            d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                    </svg>
                </button>

                {showActions && (
                    <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 
                        rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-10">
                        <div className="p-2">
                            <button
                                onClick={() => {
                                    onEditTitle();
                                    setShowActions(false);
                                }}
                                className="w-full text-left px-3 py-2 text-sm text-gray-700 
                         dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 
                         rounded-md flex items-center gap-2"
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                                        d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                </svg>
                                Rename Column
                            </button>

                            <button
                                onClick={() => {
                                    if (window.confirm(`Are you sure you want to delete "${column.title}" column? This will also delete all tasks in it.`)) {
                                        deleteColumn(column.id);
                                    }
                                    setShowActions(false);
                                }}
                                className="w-full text-left px-3 py-2 text-sm text-red-600 
                         dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 
                         rounded-md flex items-center gap-2"
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                                Delete Column
                            </button>

                            <div className="border-t border-gray-200 dark:border-gray-700 my-1"></div>

                            <div className="px-3 py-2 text-xs text-gray-500 dark:text-gray-400">
                                Created: {new Date(column.createdAt).toLocaleDateString()}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ColumnHeader;