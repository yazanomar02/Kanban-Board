import { useState, useRef, useEffect } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { useKanban } from '../../contexts/KanbanContext';
import TaskDetail from './TaskDetail';
import TaskForm from './TaskForm';

const Task = ({ task, columnId, index, onDelete }) => {
    const { updateTask, toggleTaskCompletion } = useKanban();
    const [isEditing, setIsEditing] = useState(false);
    const [showDetail, setShowDetail] = useState(false);
    const [showMenu, setShowMenu] = useState(false);
    const [isHovering, setIsHovering] = useState(false);
    const menuRef = useRef(null);
    const taskRef = useRef(null);
    const longPressTimer = useRef(null);
    const isLongPress = useRef(false);

    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({
        id: task.id,
        data: {
            type: 'task',
            task,
            columnId,
            index,
        },
    });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
    };

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setShowMenu(false);
            }
        };

        if (showMenu) {
            document.addEventListener('mousedown', handleClickOutside);
            document.addEventListener('touchstart', handleClickOutside);
            return () => {
                document.removeEventListener('mousedown', handleClickOutside);
                document.removeEventListener('touchstart', handleClickOutside);
            };
        }
    }, [showMenu]);

    useEffect(() => {
        if (isDragging) {
            document.body.style.cursor = 'grabbing';
        } else {
            document.body.style.cursor = '';
        }

        return () => {
            document.body.style.cursor = '';
        };
    }, [isDragging]);

    const handleEdit = (updatedTask) => {
        updateTask(columnId, task.id, updatedTask);
        setIsEditing(false);
        setShowMenu(false);
    };

    const handleToggleCompletion = () => {
        toggleTaskCompletion(columnId, task.id);
        setShowMenu(false);
    };

    const handleTouchStart = (e) => {
        isLongPress.current = false;
        longPressTimer.current = setTimeout(() => {
            isLongPress.current = true;
            if (listeners && listeners.onPointerDown) {
                e.preventDefault();
                const event = new MouseEvent('mousedown', {
                    view: window,
                    bubbles: true,
                    cancelable: true,
                });
                e.target.dispatchEvent(event);
            }
        }, 500);
    };

    const handleTouchEnd = (e) => {
        if (longPressTimer.current) {
            clearTimeout(longPressTimer.current);
            longPressTimer.current = null;
        }

        if (!isLongPress.current) {
            setShowDetail(true);
        }

        isLongPress.current = false;
    };

    const handleTouchMove = () => {
        if (longPressTimer.current) {
            clearTimeout(longPressTimer.current);
            longPressTimer.current = null;
        }
    };

    useEffect(() => {
        return () => {
            if (longPressTimer.current) {
                clearTimeout(longPressTimer.current);
            }
        };
    }, []);

    const formatDate = (dateString) => {
        try {
            if (!dateString) return 'No date';

            const date = new Date(dateString);

            if (isNaN(date.getTime())) {
                return new Date().toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric'
                });
            }

            return date.toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric'
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
                    bg: 'bg-red-50 dark:bg-red-900/20',
                    border: 'border-red-200 dark:border-red-800/30'
                };
            case 'medium':
                return {
                    text: 'text-yellow-700 dark:text-yellow-300',
                    bg: 'bg-yellow-50 dark:bg-yellow-900/20',
                    border: 'border-yellow-200 dark:border-yellow-800/30'
                };
            case 'low':
                return {
                    text: 'text-green-700 dark:text-green-300',
                    bg: 'bg-green-50 dark:bg-green-900/20',
                    border: 'border-green-200 dark:border-green-800/30'
                };
            default:
                return {
                    text: 'text-gray-700 dark:text-gray-300',
                    bg: 'bg-gray-50 dark:bg-gray-800/50',
                    border: 'border-gray-200 dark:border-gray-700'
                };
        }
    };

    const priorityColors = getPriorityColor(task.priority);

    if (isEditing) {
        return (
            <div
                className="mb-3 animate-fade-in"
                ref={setNodeRef}
                style={style}
            >
                <TaskForm
                    onSubmit={handleEdit}
                    onCancel={() => setIsEditing(false)}
                    initialData={task}
                    mode="edit"
                />
            </div>
        );
    }

    return (
        <>
            <div
                ref={(node) => {
                    setNodeRef(node);
                    taskRef.current = node;
                }}
                style={style}
                className={`
                    relative
                    bg-white dark:bg-gray-800
                    rounded-xl border ${priorityColors.border}
                    p-4 shadow-sm hover:shadow-lg
                    transition-all duration-300 ease-out
                    cursor-grab active:cursor-grabbing
                    ${isDragging ? 'opacity-60 scale-105 shadow-2xl z-50 rotate-2' : ''}
                    ${task.completed ? 'opacity-80' : ''}
                    ${showMenu ? 'z-30' : ''}
                    hover:-translate-y-1
                    group
                    select-none
                    -webkit-tap-highlight-color: transparent
                `}
                onMouseEnter={() => setIsHovering(true)}
                onMouseLeave={() => setIsHovering(false)}
                onTouchStart={handleTouchStart}
                onTouchEnd={handleTouchEnd}
                onTouchMove={handleTouchMove}
                {...attributes}
                {...listeners}
            >
                <div className="absolute top-2 right-2 md:hidden">
                    <div className="flex items-center gap-1 text-blue-500 dark:text-blue-400">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                                d="M4 8h16M4 16h16" />
                        </svg>
                        <span className="text-xs font-medium">Hold</span>
                    </div>
                </div>

                {task.completed && (
                    <div className="absolute -top-2 -right-2 z-10">
                        <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center shadow-lg">
                            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
                            </svg>
                        </div>
                    </div>
                )}

                <div className="absolute top-0 left-0 w-1.5 h-full">
                    <div className={`w-full h-full rounded-l ${task.priority === 'high' ? 'bg-gradient-to-b from-red-500 to-red-600' :
                        task.priority === 'medium' ? 'bg-gradient-to-b from-yellow-500 to-yellow-600' :
                            'bg-gradient-to-b from-green-500 to-green-600'
                        }`}></div>
                </div>

                <div
                    className="relative"
                    ref={menuRef}
                    onClick={(e) => e.stopPropagation()}
                >
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            e.preventDefault();
                            setShowMenu(!showMenu);
                        }}
                        onTouchStart={(e) => {
                            e.stopPropagation();
                            e.preventDefault();
                            setShowMenu(!showMenu);
                        }}
                        className={`
                            absolute top-0 right-0 p-2 rounded-lg
                            transition-all duration-200 z-40
                            ${isHovering || showMenu
                                ? 'opacity-100 transform translate-x-0'
                                : 'opacity-0 transform translate-x-2'}
                            ${showMenu
                                ? 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                                : 'text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300'}
                            hover:bg-gray-100 dark:hover:bg-gray-700
                        `}
                        title="Task actions"
                        aria-label="Task actions"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                                d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                        </svg>
                    </button>

                    {showMenu && (
                        <div
                            className="absolute right-0 top-10 w-56 bg-white dark:bg-gray-800 
                           rounded-xl shadow-2xl border border-gray-200 dark:border-gray-700 
                           z-[9999] animate-fade-in"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="py-2">
                                <div className="px-4 py-3 border-b border-gray-100 dark:border-gray-700">
                                    <div className="text-sm font-medium text-gray-900 dark:text-white">
                                        Task Actions
                                    </div>
                                    <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                        {task.title}
                                    </div>
                                </div>

                                <div className="py-1">
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setIsEditing(true);
                                            setShowMenu(false);
                                        }}
                                        className="w-full text-left px-4 py-3 text-sm text-gray-700 
                                         dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-blue-900/20 
                                         flex items-center gap-3 group/option"
                                    >
                                        <div className="w-8 h-8 rounded-lg bg-blue-100 dark:bg-blue-900/30 
                                              flex items-center justify-center group-hover/option:bg-blue-200 
                                              dark:group-hover/option:bg-blue-800/40">
                                            <svg className="w-4 h-4 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                                                    d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                            </svg>
                                        </div>
                                        <div>
                                            <div className="font-medium">Edit Task</div>
                                            <div className="text-xs text-gray-500 dark:text-gray-400">Modify task details</div>
                                        </div>
                                    </button>

                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleToggleCompletion();
                                        }}
                                        className="w-full text-left px-4 py-3 text-sm text-gray-700 
                                         dark:text-gray-300 hover:bg-green-50 dark:hover:bg-green-900/20 
                                         flex items-center gap-3 group/option"
                                    >
                                        <div className="w-8 h-8 rounded-lg bg-green-100 dark:bg-green-900/30 
                                              flex items-center justify-center group-hover/option:bg-green-200 
                                              dark:group-hover/option:bg-green-800/40">
                                            <svg className="w-4 h-4 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                                                    d={task.completed ? "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" : "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"} />
                                            </svg>
                                        </div>
                                        <div>
                                            <div className="font-medium">
                                                {task.completed ? 'Mark as Pending' : 'Mark as Completed'}
                                            </div>
                                            <div className="text-xs text-gray-500 dark:text-gray-400">
                                                {task.completed ? 'Move back to pending' : 'Mark task as done'}
                                            </div>
                                        </div>
                                    </button>

                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setShowDetail(true);
                                            setShowMenu(false);
                                        }}
                                        className="w-full text-left px-4 py-3 text-sm text-gray-700 
                                         dark:text-gray-300 hover:bg-purple-50 dark:hover:bg-purple-900/20 
                                         flex items-center gap-3 group/option"
                                    >
                                        <div className="w-8 h-8 rounded-lg bg-purple-100 dark:bg-purple-900/30 
                                              flex items-center justify-center group-hover/option:bg-purple-200 
                                              dark:group-hover/option:bg-purple-800/40">
                                            <svg className="w-4 h-4 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                                                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                        </div>
                                        <div>
                                            <div className="font-medium">View Details</div>
                                            <div className="text-xs text-gray-500 dark:text-gray-400">See full task information</div>
                                        </div>
                                    </button>

                                    <div className="border-t border-gray-100 dark:border-gray-700 my-2"></div>

                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            if (window.confirm('Are you sure you want to delete this task?\nThis action cannot be undone.')) {
                                                onDelete();
                                            }
                                            setShowMenu(false);
                                        }}
                                        className="w-full text-left px-4 py-3 text-sm text-red-600 
                                         dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 
                                         flex items-center gap-3 group/option"
                                    >
                                        <div className="w-8 h-8 rounded-lg bg-red-100 dark:bg-red-900/30 
                                              flex items-center justify-center group-hover/option:bg-red-200 
                                              dark:group-hover/option:bg-red-800/40">
                                            <svg className="w-4 h-4 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                                                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                            </svg>
                                        </div>
                                        <div>
                                            <div className="font-medium">Delete Task</div>
                                            <div className="text-xs text-gray-500 dark:text-gray-400">Permanently remove task</div>
                                        </div>
                                    </button>
                                </div>

                                <div className="px-4 py-2 border-t border-gray-100 dark:border-gray-700">
                                    <div className="text-xs text-gray-500 dark:text-gray-400">
                                        Created: {formatDate(task.createdAt)}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                <div
                    className="cursor-pointer pr-12"
                    onClick={() => setShowDetail(true)}
                    onDoubleClick={() => setIsEditing(true)}
                >
                    <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-2 flex-wrap">
                            <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${priorityColors.bg} ${priorityColors.text}`}>
                                {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)} Priority
                            </span>

                            {task.tags && task.tags.length > 0 && (
                                <span className="text-xs text-gray-500 dark:text-gray-400">
                                    • {task.tags.length} tag{task.tags.length !== 1 ? 's' : ''}
                                </span>
                            )}
                        </div>
                    </div>

                    <h4 className={`
                        font-semibold text-lg mb-3 pr-4
                        ${task.completed
                            ? 'line-through text-gray-500 dark:text-gray-500'
                            : 'text-gray-900 dark:text-white'}
                    `}>
                        {task.title}
                    </h4>

                    {task.description && (
                        <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2 mb-4 leading-relaxed">
                            {task.description}
                        </p>
                    )}

                    {task.tags && task.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 mb-4">
                            {task.tags.slice(0, 3).map(tag => (
                                <span
                                    key={tag}
                                    className="px-2.5 py-1 bg-blue-100 text-blue-800 dark:bg-blue-900/30 
                                       dark:text-blue-300 rounded-lg text-xs font-medium"
                                >
                                    #{tag}
                                </span>
                            ))}
                            {task.tags.length > 3 && (
                                <span className="px-2.5 py-1 bg-gray-100 text-gray-600 dark:bg-gray-700 
                                           dark:text-gray-400 rounded-lg text-xs font-medium">
                                    +{task.tags.length - 3} more
                                </span>
                            )}
                        </div>
                    )}

                    <div className="flex items-center justify-between pt-3 border-t border-gray-100 dark:border-gray-700">
                        <div className="flex items-center gap-3">
                            <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                                        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <span>{formatDate(task.createdAt)}</span>
                            </div>

                            <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                                        d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                                </svg>
                                <span className="font-mono">ID: {task.id.slice(-6)}</span>
                            </div>
                        </div>

                        <div className={`flex items-center gap-1 text-gray-400 dark:text-gray-600 
                              transition-opacity duration-200 ${isHovering ? 'opacity-100' : 'opacity-0'}`}>
                            <div className="w-1 h-1 rounded-full bg-current"></div>
                            <div className="w-1 h-1 rounded-full bg-current"></div>
                            <div className="w-1 h-1 rounded-full bg-current"></div>
                        </div>
                    </div>
                </div>

                <div className={`
                    absolute inset-0 rounded-xl pointer-events-none
                    transition-all duration-300
                    ${isHovering ? 'ring-2 ring-blue-500/20 dark:ring-blue-400/20' : ''}
                `}></div>
            </div>

            {showDetail && (
                <TaskDetail
                    task={task}
                    columnId={columnId}
                    onClose={() => setShowDetail(false)}
                    onEdit={() => {
                        setShowDetail(false);
                        setIsEditing(true);
                    }}
                    onDelete={() => {
                        if (window.confirm('Are you sure you want to delete this task?')) {
                            onDelete();
                            setShowDetail(false);
                        }
                    }}
                />
            )}
        </>
    );
};

export default Task;