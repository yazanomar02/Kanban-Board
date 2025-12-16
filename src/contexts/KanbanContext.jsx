import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { storageService } from '../services/storageService';

const KanbanContext = createContext();

export const useKanban = () => {
    const context = useContext(KanbanContext);
    if (!context) {
        throw new Error('useKanban must be used within KanbanProvider');
    }
    return context;
};

export const KanbanProvider = ({ children }) => {
    const [columns, setColumns] = useState(() => {
        const savedData = storageService.getData();
        if (savedData && savedData.columns) {
            return savedData.columns;
        }

        return [
            {
                id: 'todo',
                title: 'To Do',
                color: 'blue',
                tasks: [
                    {
                        id: 'task-1',
                        title: 'Design Homepage',
                        description: 'Create wireframes and mockups for the homepage',
                        createdAt: new Date('2024-01-15'),
                        priority: 'high',
                        tags: ['design', 'ui'],
                        completed: false
                    },
                    {
                        id: 'task-2',
                        title: 'Setup Database',
                        description: 'Configure PostgreSQL and run initial migrations',
                        createdAt: new Date('2024-01-16'),
                        priority: 'medium',
                        tags: ['backend', 'database'],
                        completed: false
                    },
                ],
            },
            {
                id: 'progress',
                title: 'In Progress',
                color: 'yellow',
                tasks: [
                    {
                        id: 'task-3',
                        title: 'User Authentication',
                        description: 'Implement login, signup, and password reset functionality',
                        createdAt: new Date('2024-01-14'),
                        priority: 'high',
                        tags: ['auth', 'security'],
                        completed: false
                    },
                ],
            },
            {
                id: 'done',
                title: 'Done',
                color: 'green',
                tasks: [
                    {
                        id: 'task-4',
                        title: 'Project Setup',
                        description: 'Initialize React app with Tailwind CSS and required dependencies',
                        createdAt: new Date('2024-01-10'),
                        priority: 'low',
                        tags: ['setup'],
                        completed: true
                    },
                ],
            },
        ];
    });

    const [theme, setTheme] = useState(() => {
        const savedTheme = localStorage.getItem('kanban-theme');

        if (savedTheme) {
            return savedTheme;
        }

        const systemPrefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
        return systemPrefersDark ? 'dark' : 'light';
    });

    const [searchTerm, setSearchTerm] = useState('');
    const [filter, setFilter] = useState('all');

    useEffect(() => {
        const root = document.documentElement;

        if (theme === 'dark') {
            root.classList.add('dark');
            root.style.colorScheme = 'dark';
        } else {
            root.classList.remove('dark');
            root.style.colorScheme = 'light';
        }

        localStorage.setItem('kanban-theme', theme);
    }, [theme]);

    useEffect(() => {
        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

        const handleChange = (e) => {
            if (!localStorage.getItem('kanban-theme')) {
                setTheme(e.matches ? 'dark' : 'light');
            }
        };

        mediaQuery.addEventListener('change', handleChange);
        return () => mediaQuery.removeEventListener('change', handleChange);
    }, []);

    useEffect(() => {
        const saveData = setTimeout(() => {
            storageService.saveData({ columns });
        }, 500);

        return () => clearTimeout(saveData);
    }, [columns]);

    const toggleTheme = () => {
        setTheme(prev => prev === 'light' ? 'dark' : 'light');
    };

    const searchTasks = useCallback((tasks) => {
        if (!searchTerm.trim()) return tasks;

        const term = searchTerm.toLowerCase();
        return tasks.filter(task =>
            task.title.toLowerCase().includes(term) ||
            task.description.toLowerCase().includes(term) ||
            task.tags?.some(tag => tag.toLowerCase().includes(term))
        );
    }, [searchTerm]);

    const filterTasks = useCallback((tasks) => {
        switch (filter) {
            case 'completed':
                return tasks.filter(task => task.completed);
            case 'pending':
                return tasks.filter(task => !task.completed);
            case 'high':
                return tasks.filter(task => task.priority === 'high');
            case 'medium':
                return tasks.filter(task => task.priority === 'medium');
            case 'low':
                return tasks.filter(task => task.priority === 'low');
            default:
                return tasks;
        }
    }, [filter]);

    const addColumn = (title, color = 'gray') => {
        const newColumn = {
            id: `column-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
            title: title.trim(),
            color,
            tasks: [],
            createdAt: new Date(),
        };

        setColumns(prev => [...prev, newColumn]);
        return newColumn;
    };

    const updateColumn = (columnId, updates) => {
        setColumns(prev =>
            prev.map(col =>
                col.id === columnId ? { ...col, ...updates, updatedAt: new Date() } : col
            )
        );
    };

    const deleteColumn = (columnId) => {
        setColumns(prev => prev.filter(col => col.id !== columnId));
    };

    const addTask = (columnId, taskData) => {
        if (!taskData || !taskData.title || !taskData.title.trim()) {
            console.error('Invalid task data:', taskData);
            return null;
        }

        const newTask = {
            id: `task-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
            title: taskData.title.trim(),
            description: taskData.description?.trim() || '',
            priority: taskData.priority || 'medium',
            tags: taskData.tags || [],
            completed: false,
            createdAt: new Date(),
            updatedAt: new Date(),
        };

        setColumns(prev =>
            prev.map(col =>
                col.id === columnId
                    ? { ...col, tasks: [...col.tasks, newTask] }
                    : col
            )
        );

        return newTask;
    };

    const updateTask = (columnId, taskId, updates) => {
        setColumns(prev =>
            prev.map(col => {
                if (col.id !== columnId) return col;

                return {
                    ...col,
                    tasks: col.tasks.map(task =>
                        task.id === taskId
                            ? {
                                ...task,
                                ...updates,
                                updatedAt: new Date(),
                                id: task.id,
                                createdAt: task.createdAt
                            }
                            : task
                    ),
                };
            })
        );
    };

    const deleteTask = (columnId, taskId) => {
        setColumns(prev =>
            prev.map(col => {
                if (col.id !== columnId) return col;

                return {
                    ...col,
                    tasks: col.tasks.filter(task => task.id !== taskId),
                };
            })
        );
    };

    const moveTask = (sourceColumnId, destinationColumnId, taskId, newIndex) => {
        const sourceColumn = columns.find(col => col.id === sourceColumnId);
        const destinationColumn = columns.find(col => col.id === destinationColumnId);
        const task = sourceColumn?.tasks.find(t => t.id === taskId);

        if (!task) return;

        const newSourceTasks = sourceColumn.tasks.filter(t => t.id !== taskId);

        const newDestinationTasks = [...destinationColumn.tasks];
        newDestinationTasks.splice(newIndex, 0, task);

        setColumns(prev =>
            prev.map(col => {
                if (col.id === sourceColumnId) {
                    return { ...col, tasks: newSourceTasks };
                }
                if (col.id === destinationColumnId) {
                    return { ...col, tasks: newDestinationTasks };
                }
                return col;
            })
        );
    };

    const reorderTask = (columnId, startIndex, endIndex) => {
        const column = columns.find(col => col.id === columnId);
        if (!column) return;

        const tasks = [...column.tasks];
        const [removed] = tasks.splice(startIndex, 1);
        tasks.splice(endIndex, 0, removed);

        setColumns(prev =>
            prev.map(col =>
                col.id === columnId ? { ...col, tasks } : col
            )
        );
    };

    const toggleTaskCompletion = (columnId, taskId) => {
        setColumns(prev =>
            prev.map(col => {
                if (col.id !== columnId) return col;

                return {
                    ...col,
                    tasks: col.tasks.map(task =>
                        task.id === taskId
                            ? { ...task, completed: !task.completed, updatedAt: new Date() }
                            : task
                    ),
                };
            })
        );
    };

    const getAllTasks = () => {
        return columns.flatMap(col => col.tasks.map(task => ({
            ...task,
            columnId: col.id,
            columnTitle: col.title,
        })));
    };

    const getStats = () => {
        const allTasks = getAllTasks();
        const totalTasks = allTasks.length;
        const completedTasks = allTasks.filter(task => task.completed).length;
        const pendingTasks = totalTasks - completedTasks;

        const priorityStats = {
            high: allTasks.filter(task => task.priority === 'high').length,
            medium: allTasks.filter(task => task.priority === 'medium').length,
            low: allTasks.filter(task => task.priority === 'low').length,
        };

        return {
            totalTasks,
            completedTasks,
            pendingTasks,
            completionRate: totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0,
            priorityStats,
            totalColumns: columns.length,
        };
    };

    const exportData = () => {
        const data = {
            columns,
            exportedAt: new Date().toISOString(),
            version: '1.0.0',
        };

        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `kanban-board-${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

    const importData = (data) => {
        if (data && data.columns) {
            setColumns(data.columns);
            storageService.saveData({ columns: data.columns });
            return true;
        }
        return false;
    };

    const resetData = () => {
        if (window.confirm('Are you sure you want to reset all data? This action cannot be undone.')) {
            storageService.clear();
            setColumns([]);
        }
    };

    const value = {
        columns,
        theme,
        toggleTheme,
        searchTerm,
        setSearchTerm,
        filter,
        setFilter,
        addColumn,
        updateColumn,
        deleteColumn,
        addTask,
        updateTask,
        deleteTask,
        moveTask,
        reorderTask,
        toggleTaskCompletion,
        searchTasks,
        filterTasks,
        getAllTasks,
        getStats,
        exportData,
        importData,
        resetData,
    };

    return (
        <KanbanContext.Provider value={value}>
            {children}
        </KanbanContext.Provider>
    );
};