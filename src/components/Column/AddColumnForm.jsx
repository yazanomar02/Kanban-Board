import { useState } from 'react';

const AddColumnForm = ({ onAdd }) => {
    const [isAdding, setIsAdding] = useState(false);
    const [columnName, setColumnName] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!columnName.trim()) {
            setError('Column name is required');
            return;
        }

        if (columnName.length > 50) {
            setError('Column name must be less than 50 characters');
            return;
        }

        onAdd(columnName.trim());
        setColumnName('');
        setIsAdding(false);
        setError('');
    };

    const handleCancel = () => {
        setIsAdding(false);
        setColumnName('');
        setError('');
    };

    if (!isAdding) {
        return (
            <button
                onClick={() => setIsAdding(true)}
                className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 
                   text-white rounded-lg hover:from-blue-600 hover:to-blue-700 
                   transition-all duration-200 shadow-md hover:shadow-lg font-medium"
            >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                </svg>
                Add Column
            </button>
        );
    }

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl max-w-md w-full p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                    Create New Column
                </h3>

                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Column Name
                        </label>
                        <input
                            type="text"
                            value={columnName}
                            onChange={(e) => {
                                setColumnName(e.target.value);
                                setError('');
                            }}
                            placeholder="e.g., Backlog, Review, Testing"
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 
                       rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 
                       focus:border-transparent dark:bg-gray-700 dark:text-white"
                            autoFocus
                            maxLength={50}
                        />
                        {error && (
                            <p className="mt-1 text-sm text-red-600 dark:text-red-400">{error}</p>
                        )}
                        <div className="mt-1 text-xs text-gray-500 dark:text-gray-400 text-right">
                            {columnName.length}/50
                        </div>
                    </div>

                    <div className="flex justify-end gap-3">
                        <button
                            type="button"
                            onClick={handleCancel}
                            className="px-4 py-2 text-gray-700 dark:text-gray-300 
                       hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg font-medium"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 bg-blue-500 text-white rounded-lg 
                       hover:bg-blue-600 transition-colors font-medium"
                        >
                            Create Column
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddColumnForm;