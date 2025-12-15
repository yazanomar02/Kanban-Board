import { useState, useRef, useEffect } from 'react';
import { useDroppable } from '@dnd-kit/core';
import {
    SortableContext,
    verticalListSortingStrategy
} from '@dnd-kit/sortable';
import { useKanban } from '../../contexts/KanbanContext';
import Task from '../Task/Task';
import TaskForm from '../Task/TaskForm';
import ColumnHeader from './ColumnHeader';

const Column = ({ column, index, isDraggingOver, onDelete }) => {
    const { addTask, deleteTask, updateColumn, theme } = useKanban();
    const [isAddingTask, setIsAddingTask] = useState(false);
    const [isEditingTitle, setIsEditingTitle] = useState(false);
    const [scrollPosition, setScrollPosition] = useState(0);
    const [showScrollHint, setShowScrollHint] = useState(false);

    const columnRef = useRef(null);
    const tasksContainerRef = useRef(null);

    const { setNodeRef, isOver } = useDroppable({
        id: `column-dropzone-${column.id}`,
        data: {
            type: 'column',
            columnId: column.id,
            isDropZone: true,
        },
    });

    const taskIds = column.tasks.map(task => task.id);

    useEffect(() => {
        const checkScroll = () => {
            if (tasksContainerRef.current) {
                const { scrollHeight, clientHeight } = tasksContainerRef.current;
                setShowScrollHint(scrollHeight > clientHeight);
            }
        };

        checkScroll();
        window.addEventListener('resize', checkScroll);
        return () => window.removeEventListener('resize', checkScroll);
    }, [column.tasks]);

    const handleAddTask = (taskData) => {
        console.log('Task data received:', taskData);

        if (!taskData || !taskData.title) {
            console.error('Invalid task data received');
            return;
        }

        addTask(column.id, taskData);
        setIsAddingTask(false);
    };

    const handleSaveEdit = (newTitle) => {
        if (newTitle && newTitle.trim() !== '') {
            updateColumn(column.id, { title: newTitle.trim() });
        }
        setIsEditingTitle(false);
    };

    const handleScroll = () => {
        if (tasksContainerRef.current) {
            setScrollPosition(tasksContainerRef.current.scrollTop);
        }
    };

    const getColumnColor = (title) => {
        const colors = {
            'To Do': 'border-blue-200 bg-gradient-to-b from-blue-50/80 to-blue-50/40 dark:from-blue-900/20 dark:to-blue-900/10 dark:border-blue-800/30',
            'In Progress': 'border-yellow-200 bg-gradient-to-b from-yellow-50/80 to-yellow-50/40 dark:from-yellow-900/20 dark:to-yellow-900/10 dark:border-yellow-800/30',
            'Done': 'border-green-200 bg-gradient-to-b from-green-50/80 to-green-50/40 dark:from-green-900/20 dark:to-green-900/10 dark:border-green-800/30',
            'default': 'border-gray-200 bg-gradient-to-b from-gray-50/80 to-gray-50/40 dark:from-gray-800/50 dark:to-gray-900/50 dark:border-gray-700',
        };

        return colors[title] || colors.default;
    };

    const columnColor = getColumnColor(column.title);
    const completedTasks = column.tasks.filter(t => t.completed).length;
    const progressPercentage = column.tasks.length > 0
        ? Math.round((completedTasks / column.tasks.length) * 100)
        : 0;

    const scrollToBottom = () => {
        if (tasksContainerRef.current) {
            tasksContainerRef.current.scrollTo({
                top: tasksContainerRef.current.scrollHeight,
                behavior: 'smooth'
            });
        }
    };

    const scrollToTop = () => {
        if (tasksContainerRef.current) {
            tasksContainerRef.current.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        }
    };

    return (
        <div
            ref={(node) => {
                setNodeRef(node);
                columnRef.current = node;
            }}
            className={`
                flex-shrink-0 w-full md:w-80
                ${columnColor}
                border rounded-2xl p-5
                transition-all duration-300
                ${isOver || isDraggingOver ? 'ring-2 ring-blue-400 ring-opacity-50 scale-[1.02] shadow-xl' : ''}
                hover:shadow-lg
                relative
                group/column
                flex flex-col
            `}
        >
            {(isOver || isDraggingOver) && (
                <div className="absolute inset-0 rounded-2xl bg-blue-500/5 dark:bg-blue-400/5 animate-pulse-glow"></div>
            )}

            <ColumnHeader
                column={column}
                isEditingTitle={isEditingTitle}
                onEditTitle={() => setIsEditingTitle(true)}
                onCancelEdit={() => setIsEditingTitle(false)}
                onSaveEdit={handleSaveEdit}
                onDelete={onDelete}
                taskCount={column.tasks.length}
                completedCount={completedTasks}
            />

            {/* مؤشر التقدم */}
            {column.tasks.length > 0 && (
                <div className="mt-3 mb-4">
                    <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 mb-1">
                        <span>Progress: {progressPercentage}%</span>
                        <span>{completedTasks}/{column.tasks.length} completed</span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5">
                        <div
                            className="bg-gradient-to-r from-blue-500 to-green-500 h-1.5 rounded-full transition-all duration-500"
                            style={{ width: `${progressPercentage}%` }}
                        ></div>
                    </div>
                </div>
            )}

            <div className="relative flex-1">
                {showScrollHint && scrollPosition > 50 && (
                    <button
                        onClick={scrollToTop}
                        className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 
                     w-8 h-8 bg-white dark:bg-gray-800 rounded-full shadow-lg 
                     border border-gray-200 dark:border-gray-700 flex items-center justify-center
                     text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300
                     z-10 transition-all duration-200 hover:scale-110"
                        title="Scroll to top"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 15l7-7 7 7" />
                        </svg>
                    </button>
                )}

                {showScrollHint && tasksContainerRef.current &&
                    tasksContainerRef.current.scrollHeight - tasksContainerRef.current.scrollTop - tasksContainerRef.current.clientHeight > 50 && (
                        <button
                            onClick={scrollToBottom}
                            className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2 
                     w-8 h-8 bg-white dark:bg-gray-800 rounded-full shadow-lg 
                     border border-gray-200 dark:border-gray-700 flex items-center justify-center
                     text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300
                     z-10 transition-all duration-200 hover:scale-110"
                            title="Scroll to bottom"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                            </svg>
                        </button>
                    )}

                <div
                    ref={tasksContainerRef}
                    onScroll={handleScroll}
                    className="space-y-3 max-h-[400px] overflow-y-auto scrollbar-thin pr-1"
                >
                    <SortableContext items={taskIds} strategy={verticalListSortingStrategy}>
                        {column.tasks.length > 0 ? (
                            column.tasks.map((task, taskIndex) => (
                                <Task
                                    key={task.id}
                                    task={task}
                                    columnId={column.id}
                                    index={taskIndex}
                                    onDelete={() => deleteTask(column.id, task.id)}
                                />
                            ))
                        ) : (
                            !isAddingTask && (
                                <div
                                    className={`flex flex-col items-center justify-center py-10 text-center cursor-pointer`}
                                    onClick={() => setIsAddingTask(true)}
                                >
                                    <div className={`w-20 h-20 mb-4 ${theme === 'dark' ? 'text-gray-700' : 'text-gray-300'}`}>
                                        <svg className="w-full h-full" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1"
                                                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                                        </svg>
                                    </div>
                                    <p className="text-gray-500 dark:text-gray-400 text-sm mb-1">
                                        No tasks yet
                                    </p>
                                    <p className="text-gray-400 dark:text-gray-500 text-xs">
                                        Click here to add your first task
                                    </p>
                                    <div className="mt-4 flex items-center gap-1 text-blue-500 dark:text-blue-400">
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                                        </svg>
                                        <span className="text-sm font-medium">Add Task</span>
                                    </div>
                                </div>
                            )
                        )}
                    </SortableContext>
                </div>
            </div>

            {isAddingTask && (
                <div className="mt-4 animate-fade-in sticky bottom-0 z-10 bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm rounded-xl border border-gray-200 dark:border-gray-700 p-4 shadow-lg">
                    <TaskForm
                        onSubmit={handleAddTask}
                        onCancel={() => setIsAddingTask(false)}
                        initialData={{ title: '', description: '' }}
                    />
                </div>
            )}

            {!isAddingTask && (
                <div className="mt-4">
                    <button
                        onClick={() => setIsAddingTask(true)}
                        className="w-full flex items-center justify-center gap-2 py-3 
                     text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 
                     hover:bg-gradient-to-r hover:from-blue-50 hover:to-blue-50/50 
                     dark:hover:from-blue-900/20 dark:hover:to-blue-900/10
                     rounded-xl transition-all duration-300 border-2 border-dashed 
                     border-gray-300 dark:border-gray-600 hover:border-blue-400 dark:hover:border-blue-500
                     group/button"
                    >
                        <div className="w-6 h-6 rounded-full bg-gradient-to-r from-blue-500 to-blue-600 
                          flex items-center justify-center group-hover/button:from-blue-600 group-hover/button:to-blue-700 
                          transition-all duration-300">
                            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                            </svg>
                        </div>
                        <span className="font-medium">Add New Task</span>
                    </button>
                </div>
            )}

            <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
                <div className="flex justify-between items-center">
                    <div>
                        <div className="text-sm font-medium text-gray-600 dark:text-gray-400">
                            {column.tasks.length} {column.tasks.length === 1 ? 'task' : 'tasks'}
                        </div>
                        {column.tasks.length > 0 && (
                            <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                {completedTasks} completed • {column.tasks.length - completedTasks} pending
                            </div>
                        )}
                    </div>

                    {column.tasks.length > 0 && (
                        <div className="flex items-center gap-3">
                            <div className="flex -space-x-2">
                                {column.tasks.slice(0, 3).map((task, index) => (
                                    <div
                                        key={task.id}
                                        className="w-6 h-6 rounded-full border-2 border-white dark:border-gray-800 
                             flex items-center justify-center text-xs font-medium"
                                        style={{
                                            backgroundColor: task.priority === 'high' ? '#ef4444' :
                                                task.priority === 'medium' ? '#f59e0b' : '#10b981',
                                            color: 'white',
                                            zIndex: 3 - index,
                                            transform: `translateX(${index * -8}px)`
                                        }}
                                    >
                                        {task.title.charAt(0).toUpperCase()}
                                    </div>
                                ))}
                                {column.tasks.length > 3 && (
                                    <div className="w-6 h-6 rounded-full bg-gray-200 dark:bg-gray-700 border-2 
                                border-white dark:border-gray-800 flex items-center justify-center 
                                text-xs text-gray-600 dark:text-gray-400 font-medium"
                                        style={{ transform: 'translateX(-24px)' }}>
                                        +{column.tasks.length - 3}
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </div>

            <div className="absolute bottom-0 left-0 right-0 h-4 bg-gradient-to-t from-white/50 to-transparent 
                    dark:from-gray-800/50 pointer-events-none rounded-b-2xl"></div>
        </div>
    );
};

export default Column;