import { useState, useEffect } from 'react';

const TaskForm = ({ onSubmit, onCancel, initialData = {}, mode = 'create' }) => {
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        priority: 'medium',
        tags: [],
        completed: false,
    });

    const [tagInput, setTagInput] = useState('');
    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        if (initialData && Object.keys(initialData).length > 0) {
            setFormData(prev => ({
                ...prev,
                title: initialData.title || '',
                description: initialData.description || '',
                priority: initialData.priority || 'medium',
                tags: initialData.tags || [],
                completed: initialData.completed || false,
            }));
        }
    }, [initialData]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        setErrors({});

        const validationErrors = {};

        const title = formData.title?.trim() || '';
        if (!title) {
            validationErrors.title = 'Title is required';
        } else if (title.length > 100) {
            validationErrors.title = 'Title must be less than 100 characters';
        }

        const description = formData.description?.trim() || '';
        if (description.length > 500) {
            validationErrors.description = 'Description must be less than 500 characters';
        }

        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            setIsSubmitting(false);
            return;
        }

        const dataToSubmit = {
            title: title,
            description: description,
            priority: formData.priority,
            tags: formData.tags,
            completed: formData.completed,
        };

        try {
            await onSubmit(dataToSubmit);
            if (mode === 'create') {
                setFormData({
                    title: '',
                    description: '',
                    priority: 'medium',
                    tags: [],
                    completed: false,
                });
                setTagInput('');
            }
        } catch (error) {
            console.error('Error submitting task:', error);
            setErrors({ submit: 'Failed to save task. Please try again.' });
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleAddTag = () => {
        const trimmedTag = tagInput.trim();
        if (trimmedTag && !formData.tags.includes(trimmedTag)) {
            if (trimmedTag.length > 20) {
                setErrors(prev => ({ ...prev, tags: 'Tag must be less than 20 characters' }));
                return;
            }
            setFormData(prev => ({
                ...prev,
                tags: [...prev.tags, trimmedTag],
            }));
            setTagInput('');
            setErrors(prev => ({ ...prev, tags: '' }));
        }
    };

    const handleRemoveTag = (tagToRemove) => {
        setFormData(prev => ({
            ...prev,
            tags: prev.tags.filter(tag => tag !== tagToRemove),
        }));
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && e.target.type !== 'textarea') {
            e.preventDefault();
            if (e.target.name === 'tagInput') {
                handleAddTag();
            } else {
                handleSubmit(e);
            }
        } else if (e.key === 'Escape') {
            if (e.target.name === 'tagInput') {
                setTagInput('');
            } else {
                onCancel();
            }
        }
    };

    const handleInputChange = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
        if (errors[field]) {
            setErrors(prev => ({ ...prev, [field]: '' }));
        }
    };

    return (
        <div className="bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 shadow-lg p-4">
            <div className="mb-4">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                    {mode === 'create' ? 'Create New Task' : 'Edit Task'}
                </h3>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    {mode === 'create' ? 'Fill in the details to create a new task' : 'Update task information'}
                </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <div className="flex items-center justify-between mb-1">
                        <label className="block text-sm font-semibold text-gray-800 dark:text-gray-200">
                            Task Title *
                        </label>
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                            {formData.title.length}/100
                        </span>
                    </div>
                    <input
                        type="text"
                        name="title"
                        value={formData.title}
                        onChange={(e) => handleInputChange('title', e.target.value)}
                        onKeyPress={handleKeyPress}
                        className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-1 transition-all duration-200 text-sm
                            ${errors.title
                                ? 'border-red-400 focus:ring-red-500 dark:border-red-600 bg-red-50/50 dark:bg-red-900/10'
                                : 'border-gray-300 focus:ring-blue-500 focus:border-blue-400 dark:border-gray-600 dark:bg-gray-800/50 dark:focus:ring-blue-400'
                            } 
                            dark:text-white placeholder-gray-400 dark:placeholder-gray-500`}
                        placeholder="Enter task title"
                        maxLength={100}
                        autoFocus
                        disabled={isSubmitting}
                    />
                    {errors.title && (
                        <div className="flex items-center gap-1 mt-1">
                            <svg className="w-3 h-3 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-2.694-.833-3.464 0L4.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                            </svg>
                            <p className="text-xs text-red-600 dark:text-red-400">{errors.title}</p>
                        </div>
                    )}
                </div>

                <div>
                    <div className="flex items-center justify-between mb-1">
                        <label className="block text-sm font-semibold text-gray-800 dark:text-gray-200">
                            Description
                        </label>
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                            {formData.description.length}/500
                        </span>
                    </div>
                    <textarea
                        name="description"
                        value={formData.description}
                        onChange={(e) => handleInputChange('description', e.target.value)}
                        onKeyPress={(e) => {
                            if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
                                handleSubmit(e);
                            }
                        }}
                        className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-1 transition-all duration-200 text-sm
                            ${errors.description
                                ? 'border-red-400 focus:ring-red-500 dark:border-red-600 bg-red-50/50 dark:bg-red-900/10'
                                : 'border-gray-300 focus:ring-blue-500 focus:border-blue-400 dark:border-gray-600 dark:bg-gray-800/50 dark:focus:ring-blue-400'
                            }
                            dark:text-white placeholder-gray-400 dark:placeholder-gray-500 resize-none`}
                        placeholder="Describe the task..."
                        rows="3"
                        maxLength={500}
                        disabled={isSubmitting}
                    />
                    {errors.description && (
                        <div className="flex items-center gap-1 mt-1">
                            <svg className="w-3 h-3 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-2.694-.833-3.464 0L4.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                            </svg>
                            <p className="text-xs text-red-600 dark:text-red-400">{errors.description}</p>
                        </div>
                    )}
                </div>

                <div>
                    <label className="block text-sm font-semibold text-gray-800 dark:text-gray-200 mb-2">
                        Priority
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                        {[
                            { value: 'low', label: 'Low', color: 'bg-gradient-to-r from-green-500 to-emerald-600', textColor: 'text-green-800 dark:text-green-300' },
                            { value: 'medium', label: 'Medium', color: 'bg-gradient-to-r from-yellow-500 to-amber-600', textColor: 'text-yellow-800 dark:text-yellow-300' },
                            { value: 'high', label: 'High', color: 'bg-gradient-to-r from-red-500 to-pink-600', textColor: 'text-red-800 dark:text-red-300' }
                        ].map(priority => (
                            <button
                                key={priority.value}
                                type="button"
                                onClick={() => handleInputChange('priority', priority.value)}
                                className={`flex flex-col items-center justify-center p-2 rounded-lg border transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] text-xs
                                    ${formData.priority === priority.value
                                        ? `${priority.color} border-transparent shadow text-white`
                                        : 'bg-gray-100 dark:bg-gray-800 border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                                    }`}
                                disabled={isSubmitting}
                            >
                                <div className={`w-2 h-2 rounded-full mb-1 ${formData.priority === priority.value ? 'bg-white' :
                                    priority.value === 'high' ? 'bg-red-500' :
                                        priority.value === 'medium' ? 'bg-yellow-500' : 'bg-green-500'
                                    }`}></div>
                                <span className={`font-semibold ${formData.priority === priority.value ? 'text-white' : priority.textColor}`}>
                                    {priority.label}
                                </span>
                            </button>
                        ))}
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-semibold text-gray-800 dark:text-gray-200 mb-2">
                        Tags
                    </label>

                    <div className="relative mb-2">
                        <div className="flex gap-2 items-center">
                            <input
                                type="text"
                                name="tagInput"
                                value={tagInput}
                                onChange={(e) => {
                                    setTagInput(e.target.value);
                                    if (errors.tags) setErrors(prev => ({ ...prev, tags: '' }));
                                }}
                                onKeyPress={handleKeyPress}
                                className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-400 dark:bg-gray-800 dark:text-white text-sm w-10"
                                placeholder="Add tag"
                                maxLength={20}
                                disabled={isSubmitting}
                            />
                            <button
                                type="button"
                                onClick={handleAddTag}
                                disabled={!tagInput.trim() || isSubmitting}
                                className="px-3 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed font-medium text-sm whitespace-nowrap min-w-[60px]"
                            >
                                Add
                            </button>
                        </div>
                        {errors.tags && (
                            <p className="mt-1 text-xs text-red-600 dark:text-red-400">{errors.tags}</p>
                        )}
                    </div>

                    {formData.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 p-2 bg-gray-50 dark:bg-gray-800/50 rounded-lg border border-gray-200 dark:border-gray-700">
                            {formData.tags.map((tag, index) => (
                                <div
                                    key={`${tag}-${index}`}
                                    className="group relative flex items-center gap-1 px-2 py-1 bg-gradient-to-r from-blue-100 to-blue-50 dark:from-blue-900/40 dark:to-blue-800/30 text-blue-800 dark:text-blue-300 rounded border border-blue-200 dark:border-blue-800"
                                >
                                    <span className="text-xs font-medium">#{tag}</span>
                                    <button
                                        type="button"
                                        onClick={() => handleRemoveTag(tag)}
                                        className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                                        title="Remove tag"
                                        disabled={isSubmitting}
                                    >
                                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                        </svg>
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {mode === 'edit' && (
                    <div className="flex items-center justify-between p-2 bg-gradient-to-r from-gray-50 to-white dark:from-gray-800/50 dark:to-gray-900/50 rounded-lg border border-gray-200 dark:border-gray-700">
                        <div className="flex items-center gap-2">
                            <div className={`w-6 h-6 rounded-full flex items-center justify-center ${formData.completed
                                ? 'bg-gradient-to-r from-green-500 to-emerald-600'
                                : 'bg-gradient-to-r from-yellow-500 to-amber-600'
                                }`}>
                                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    {formData.completed ? (
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                    ) : (
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    )}
                                </svg>
                            </div>
                            <div>
                                <div className="font-medium text-gray-900 dark:text-white text-sm">
                                    {formData.completed ? 'Completed' : 'In Progress'}
                                </div>
                            </div>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                            <input
                                type="checkbox"
                                checked={formData.completed}
                                onChange={(e) => handleInputChange('completed', e.target.checked)}
                                className="sr-only peer"
                                disabled={isSubmitting}
                            />
                            <div className={`w-9 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-gray-700 
                                peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] 
                                after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 
                                after:border after:rounded-full after:h-4 after:w-4 after:transition-all 
                                peer-checked:bg-gradient-to-r peer-checked:from-green-500 peer-checked:to-emerald-600`}>
                            </div>
                        </label>
                    </div>
                )}

                {errors.submit && (
                    <div className="p-2 bg-gradient-to-r from-red-50 to-red-100 dark:from-red-900/20 dark:to-red-800/20 border border-red-200 dark:border-red-800 rounded-lg">
                        <div className="flex items-center gap-1">
                            <svg className="w-4 h-4 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <p className="text-xs text-red-600 dark:text-red-400">{errors.submit}</p>
                        </div>
                    </div>
                )}

                {/* الأزرار */}
                <div className="flex flex-col sm:flex-row gap-2 pt-3 border-t border-gray-200 dark:border-gray-700">
                    <button
                        type="button"
                        onClick={onCancel}
                        disabled={isSubmitting}
                        className="px-1 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 
                            rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 font-medium transition-all duration-300
                            disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-1 text-sm"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                        Cancel
                    </button>
                    <button
                        type="submit"
                        disabled={isSubmitting || !formData.title.trim()}
                        className="px-3 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white 
                            rounded-lg hover:from-blue-600 hover:to-blue-700 font-medium transition-all duration-300
                            disabled:opacity-50 disabled:cursor-not-allowed shadow hover:shadow-md
                            flex items-center justify-center gap-1 text-sm"
                    >
                        {isSubmitting ? (
                            <>
                                <svg className="w-4 h-4 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                </svg>
                                {mode === 'create' ? 'Creating...' : 'Saving...'}
                            </>
                        ) : (
                            <>
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    {mode === 'create' ? (
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                                    ) : (
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                    )}
                                </svg>
                                {mode === 'create' ? 'Create Task' : 'Update Task'}
                            </>
                        )}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default TaskForm;