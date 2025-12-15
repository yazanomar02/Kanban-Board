import React, { useState } from 'react';
import { useKanban } from '../../contexts/KanbanContext';

const TaskDetail = ({ task, columnId, onClose, onEdit, onDelete }) => {
    const { updateTask, toggleTaskCompletion } = useKanban();
    const [isEditingDescription, setIsEditingDescription] = useState(false);
    const [description, setDescription] = useState(task.description || '');
    const [isSaving, setIsSaving] = useState(false);

    const formatDate = (dateString) => {
        try {
            if (!dateString) return 'No date';
            const date = new Date(dateString);
            if (isNaN(date.getTime())) {
                return new Date().toLocaleDateString('en-US', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                });
            }
            return date.toLocaleDateString('en-US', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
            });
        } catch (error) {
            console.error('Error formatting date:', error);
            return 'Invalid date';
        }
    };

    const getPriorityColor = (priority) => {
        switch (priority) {
            case 'high':
                return {
                    text: 'text-red-700 dark:text-red-300',
                    bg: 'bg-red-100 dark:bg-red-900/30',
                    border: 'border-red-200 dark:border-red-700',
                };
            case 'medium':
                return {
                    text: 'text-yellow-700 dark:text-yellow-300',
                    bg: 'bg-yellow-100 dark:bg-yellow-900/30',
                    border: 'border-yellow-200 dark:border-yellow-700',
                };
            case 'low':
                return {
                    text: 'text-green-700 dark:text-green-300',
                    bg: 'bg-green-100 dark:bg-green-900/30',
                    border: 'border-green-200 dark:border-green-700',
                };
            default:
                return {
                    text: 'text-gray-700 dark:text-gray-300',
                    bg: 'bg-gray-100 dark:bg-gray-800',
                    border: 'border-gray-200 dark:border-gray-700',
                };
        }
    };

    const priorityColors = getPriorityColor(task.priority);

    const handleDescriptionSave = async () => {
        if (description !== task.description) {
            setIsSaving(true);
            try {
                await updateTask(columnId, task.id, { description: description.trim() });
            } catch (error) {
                console.error('Error saving description:', error);
            } finally {
                setIsSaving(false);
            }
        }
        setIsEditingDescription(false);
    };

    const handleDescriptionCancel = () => {
        setDescription(task.description || '');
        setIsEditingDescription(false);
    };

    const handleToggleComplete = () => {
        toggleTaskCompletion(columnId, task.id);
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
            handleDescriptionSave();
        } else if (e.key === 'Escape') {
            handleDescriptionCancel();
        }
    };

    return (
        <div className="fixed inset-0 bg-black/70 dark:bg-black/80 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
            <div
                className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-hidden flex flex-col animate-fade-in"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="flex-shrink-0 p-6 pb-4 border-b border-gray-200 dark:border-gray-700">
                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 p-2 text-gray-500 hover:text-gray-700 
                     dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-100 
                     dark:hover:bg-gray-700 rounded-full transition-colors z-10"
                        aria-label="Close"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>

                    <div className="pr-10">
                        <div className="flex flex-wrap items-center gap-3 mb-4">
                            <span className={`px-3 py-1.5 rounded-full text-sm font-semibold border ${priorityColors.bg} ${priorityColors.text} ${priorityColors.border}`}>
                                {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)} Priority
                            </span>

                            <span className={`px-3 py-1.5 rounded-full text-sm font-semibold 
                ${task.completed
                                    ? 'bg-green-100 text-green-800 border border-green-200 dark:bg-green-900/30 dark:text-green-300 dark:border-green-800'
                                    : 'bg-yellow-100 text-yellow-800 border border-yellow-200 dark:bg-yellow-900/30 dark:text-yellow-300 dark:border-yellow-800'}`}>
                                {task.completed ? 'Completed' : 'In Progress'}
                            </span>
                        </div>

                        <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-4">
                            {task.title}
                        </h2>

                        {task.tags && task.tags.length > 0 && (
                            <div className="flex flex-wrap gap-2 mt-3">
                                {task.tags.map(tag => (
                                    <span
                                        key={tag}
                                        className="px-3 py-1.5 bg-gradient-to-r from-blue-500/10 to-purple-500/10 
                             text-blue-700 dark:text-blue-300 rounded-lg text-sm font-medium
                             border border-blue-200 dark:border-blue-800/50"
                                    >
                                        #{tag}
                                    </span>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto scrollbar-thin">
                    <div className="p-6">
                        {/* الوصف */}
                        <div className="mb-8">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                                    Description
                                </h3>
                                {!isEditingDescription && (
                                    <button
                                        onClick={() => setIsEditingDescription(true)}
                                        className="text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400 
                           dark:hover:text-blue-300 flex items-center gap-1"
                                    >
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                                                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                        </svg>
                                        Edit
                                    </button>
                                )}
                            </div>

                            {isEditingDescription ? (
                                <div className="space-y-3">
                                    <textarea
                                        value={description}
                                        onChange={(e) => setDescription(e.target.value)}
                                        onKeyDown={handleKeyDown}
                                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 
                           rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 
                           dark:bg-gray-700/50 dark:text-white resize-none"
                                        rows={5}
                                        placeholder="Enter task description..."
                                        autoFocus
                                    />
                                    <div className="flex justify-end gap-2">
                                        <button
                                            onClick={handleDescriptionCancel}
                                            className="px-4 py-2 text-gray-700 dark:text-gray-300 
                             hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg font-medium"
                                            disabled={isSaving}
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            onClick={handleDescriptionSave}
                                            className="px-4 py-2 bg-blue-500 text-white rounded-lg 
                             hover:bg-blue-600 transition-colors font-medium flex items-center gap-2"
                                            disabled={isSaving || description.trim() === task.description}
                                        >
                                            {isSaving ? (
                                                <>
                                                    <svg className="w-4 h-4 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                                                            d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                                    </svg>
                                                    Saving...
                                                </>
                                            ) : 'Save Changes'}
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <div className={`bg-gradient-to-br from-gray-50 to-white dark:from-gray-800/50 dark:to-gray-900/50 
                            rounded-xl p-5 border border-gray-200 dark:border-gray-700`}>
                                    <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap leading-relaxed">
                                        {task.description || (
                                            <span className="text-gray-400 dark:text-gray-500 italic">
                                                No description provided. Click "Edit" to add one.
                                            </span>
                                        )}
                                    </p>
                                </div>
                            )}
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-4">
                                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                                    Task Information
                                </h3>

                                <div className="space-y-3">
                                    <div>
                                        <div className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1.5">
                                            Task ID
                                        </div>
                                        <div className="font-mono text-sm text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700/50 p-3 rounded-lg">
                                            {task.id}
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <div className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1.5">
                                                Status
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <div className={`w-3 h-3 rounded-full ${task.completed ? 'bg-green-500' : 'bg-yellow-500'}`}></div>
                                                <span className="font-medium text-gray-700 dark:text-gray-300">
                                                    {task.completed ? 'Completed' : 'Pending'}
                                                </span>
                                            </div>
                                        </div>

                                        <div>
                                            <div className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1.5">
                                                Priority
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <div className={`w-3 h-3 rounded-full ${task.priority === 'high' ? 'bg-red-500' :
                                                        task.priority === 'medium' ? 'bg-yellow-500' : 'bg-green-500'
                                                    }`}></div>
                                                <span className="font-medium text-gray-700 dark:text-gray-300">
                                                    {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                                    Timeline
                                </h3>

                                <div className="space-y-3">
                                    <div>
                                        <div className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1.5">
                                            Created
                                        </div>
                                        <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                                            <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                                                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                            </svg>
                                            {formatDate(task.createdAt)}
                                        </div>
                                    </div>

                                    {task.updatedAt && task.updatedAt !== task.createdAt && (
                                        <div>
                                            <div className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1.5">
                                                Last Updated
                                            </div>
                                            <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                                                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                                                        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                </svg>
                                                {formatDate(task.updatedAt)}
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {task.createdAt && (
                                    <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                                        <div className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
                                            Time Statistics
                                        </div>
                                        <div className="flex items-center gap-4">
                                            <div className="flex items-center gap-2">
                                                <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                                                <span className="text-sm text-gray-600 dark:text-gray-400">
                                                    Active
                                                </span>
                                            </div>
                                            <div className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                                {(() => {
                                                    const created = new Date(task.createdAt);
                                                    const now = new Date();
                                                    const diff = now.getTime() - created.getTime();
                                                    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
                                                    if (days === 0) return 'Today';
                                                    if (days === 1) return '1 day ago';
                                                    return `${days} days ago`;
                                                })()}
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        {task.tags && task.tags.length > 0 && (
                            <div className="mt-8">
                                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                                    Tags
                                </h3>
                                <div className="flex flex-wrap gap-2">
                                    {task.tags.map((tag, index) => (
                                        <span
                                            key={index}
                                            className="px-4 py-2 bg-gradient-to-r from-blue-500/10 to-purple-500/10 
                             text-blue-700 dark:text-blue-300 rounded-lg text-sm font-medium
                             border border-blue-200 dark:border-blue-800/50
                             hover:from-blue-500/20 hover:to-purple-500/20 transition-all duration-200"
                                        >
                                            #{tag}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )}

                        {task.completed && (
                            <div className="mt-6 p-4 bg-gradient-to-r from-green-50 to-emerald-50 
                          dark:from-green-900/20 dark:to-emerald-900/20 rounded-xl border border-green-200 dark:border-green-800/30">
                                <div className="flex items-center gap-3">
                                    <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full flex items-center justify-center">
                                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
                                        </svg>
                                    </div>
                                    <div>
                                        <div className="font-semibold text-green-800 dark:text-green-300">
                                            Task Completed
                                        </div>
                                        <div className="text-sm text-green-600 dark:text-green-400">
                                            This task has been marked as completed.
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                <div className="flex-shrink-0 p-6 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div className="flex flex-wrap gap-2">
                            <button
                                onClick={handleToggleComplete}
                                className={`px-4 py-2.5 rounded-lg font-medium transition-all duration-200 flex items-center gap-2
                  ${task.completed
                                        ? 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200 dark:bg-yellow-900/30 dark:text-yellow-300 dark:hover:bg-yellow-900/50'
                                        : 'bg-green-100 text-green-800 hover:bg-green-200 dark:bg-green-900/30 dark:text-green-300 dark:hover:bg-green-900/50'
                                    }`}
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                                        d={task.completed ? "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" : "M5 13l4 4L19 7"} />
                                </svg>
                                {task.completed ? 'Mark as Pending' : 'Mark as Completed'}
                            </button>
                        </div>

                        <div className="flex gap-3">
                            <button
                                onClick={onDelete}
                                className="px-4 py-2.5 text-red-600 hover:text-red-800 dark:text-red-400 
                         dark:hover:text-red-300 hover:bg-red-50 dark:hover:bg-red-900/20 
                         rounded-lg font-medium transition-colors flex items-center gap-2"
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                                Delete
                            </button>
                            <button
                                onClick={onEdit}
                                className="px-4 py-2.5 bg-gradient-to-r from-blue-500 to-blue-600 text-white 
                         rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all duration-200 
                         font-medium flex items-center gap-2 shadow-md hover:shadow-lg"
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                                        d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                </svg>
                                Edit Task
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TaskDetail;