import { useState, useRef, useEffect } from 'react';
import {
  DndContext,
  DragOverlay,
  closestCorners,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  MeasuringStrategy,
} from '@dnd-kit/core';
import {
  SortableContext,
  arrayMove,
  horizontalListSortingStrategy,
} from '@dnd-kit/sortable';
import { useKanban } from '../../contexts/KanbanContext';
import Column from '../Column/Column';
import Task from '../Task/Task';
import AddColumnForm from '../Column/AddColumnForm';

const KanbanBoard = () => {
  const {
    columns,
    theme,
    addColumn,
    updateColumn,
    deleteColumn,
    moveTask,
    reorderTask,
    searchTerm,
    filter,
    searchTasks,
    filterTasks,
    getStats,
  } = useKanban();

  const [activeId, setActiveId] = useState(null);
  const [activeType, setActiveType] = useState(null);
  const [activeData, setActiveData] = useState(null);
  const [overColumnId, setOverColumnId] = useState(null);
  const [isDragging, setIsDragging] = useState(false);

  const [showQuickStats, setShowQuickStats] = useState(true);
  const [showEmptyState, setShowEmptyState] = useState(false);
  const [viewMode, setViewMode] = useState('board');

  const boardRef = useRef(null);
  const scrollContainerRef = useRef(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8, 
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: (event, args) => {
        return args.initialCoordinates;
      },
    })
  );

  useEffect(() => {
    const hasTasks = columns.some(col => col.tasks.length > 0);
    setShowEmptyState(!hasTasks && columns.length === 0);
  }, [columns]);

  useEffect(() => {
    const handleGlobalMouseUp = () => {
      if (isDragging) {
        setIsDragging(false);
      }
    };

    document.addEventListener('mouseup', handleGlobalMouseUp);
    return () => document.removeEventListener('mouseup', handleGlobalMouseUp);
  }, [isDragging]);

  const handleDragStart = (event) => {
    const { active } = event;
    setActiveId(active.id);
    setActiveType(active.data.current?.type);
    setActiveData(active.data.current);
    setIsDragging(true);

    if (active.data.current?.type === 'task') {
      document.body.style.cursor = 'grabbing';
    }
  };

  const handleDragOver = (event) => {
    const { over } = event;

    if (over?.data.current?.type === 'column') {
      setOverColumnId(over.id);
    } else {
      setOverColumnId(null);
    }
  };

  const handleDragEnd = (event) => {
    const { active, over } = event;

    resetDragState();

    if (!over) return;

    const activeId = active.id;
    const overId = over.id;

    if (activeId === overId) return;

    const activeDataType = active.data.current?.type;
    const overDataType = over.data.current?.type;

    if (activeDataType === 'column' && overDataType === 'column') {
      const oldIndex = columns.findIndex(col => col.id === activeId);
      const newIndex = columns.findIndex(col => col.id === overId);

      if (oldIndex !== -1 && newIndex !== -1 && oldIndex !== newIndex) {
        const newColumns = arrayMove(columns, oldIndex, newIndex);
      }
    }

    else if (activeDataType === 'task' && overDataType === 'column') {
      const sourceColumn = findColumnByTaskId(activeId);
      const targetColumn = columns.find(col => col.id === overId);

      if (sourceColumn && targetColumn && sourceColumn.id !== targetColumn.id) {
        const task = sourceColumn.tasks.find(t => t.id === activeId);
        if (task) {
          moveTask(sourceColumn.id, targetColumn.id, task.id, targetColumn.tasks.length);
        }
      }
    }

    else if (activeDataType === 'task' && overDataType === 'task') {
      const sourceColumn = findColumnByTaskId(activeId);
      const targetColumn = findColumnByTaskId(overId);

      if (sourceColumn && targetColumn) {
        const sourceIndex = sourceColumn.tasks.findIndex(t => t.id === activeId);
        const overIndex = targetColumn.tasks.findIndex(t => t.id === overId);

        if (sourceColumn.id === targetColumn.id) {
          if (sourceIndex !== overIndex) {
            reorderTask(sourceColumn.id, sourceIndex, overIndex);
          }
        } else {
          moveTask(sourceColumn.id, targetColumn.id, activeId, overIndex);
        }
      }
    }

    else if (activeDataType === 'task' && over.data.current?.isDropZone) {
      const sourceColumn = findColumnByTaskId(activeId);
      const targetColumnId = over.data.current.columnId;
      const targetColumn = columns.find(col => col.id === targetColumnId);

      if (sourceColumn && targetColumn) {
        const task = sourceColumn.tasks.find(t => t.id === activeId);
        if (task) {
          moveTask(sourceColumn.id, targetColumn.id, task.id, targetColumn.tasks.length);
        }
      }
    }
  };

  const handleDragCancel = () => {
    resetDragState();
  };

  const resetDragState = () => {
    setActiveId(null);
    setActiveType(null);
    setActiveData(null);
    setOverColumnId(null);
    setIsDragging(false);
    document.body.style.cursor = '';
  };

  const findColumnByTaskId = (taskId) => {
    return columns.find(column =>
      column.tasks.some(task => task.id === taskId)
    );
  };

  const handleAddColumn = (title) => {
    const newColumn = addColumn(title);

    if (scrollContainerRef.current) {
      setTimeout(() => {
        scrollContainerRef.current.scrollTo({
          left: scrollContainerRef.current.scrollWidth,
          behavior: 'smooth'
        });
      }, 100);
    }

    return newColumn;
  };

  const handleDeleteColumn = (columnId) => {
    if (window.confirm('Are you sure you want to delete this column and all its tasks?')) {
      deleteColumn(columnId);
    }
  };

  const stats = getStats();

  const getFilteredColumns = () => {
    if (!searchTerm && filter === 'all') {
      return columns;
    }

    return columns.map(column => ({
      ...column,
      tasks: filterTasks(searchTasks(column.tasks))
    })).filter(column => column.tasks.length > 0 || !searchTerm);
  };

  const filteredColumns = getFilteredColumns();

  const allTaskIds = columns.flatMap(column =>
    column.tasks.map(task => task.id)
  );

  const columnIds = columns.map(col => col.id);

  const getCompletionPercentage = () => {
    const total = stats.totalTasks;
    const completed = stats.completedTasks;
    return total > 0 ? Math.round((completed / total) * 100) : 0;
  };

  const getProgressColor = (percentage) => {
    if (percentage >= 75) return 'bg-gradient-to-r from-green-500 to-emerald-600';
    if (percentage >= 50) return 'bg-gradient-to-r from-yellow-500 to-amber-600';
    if (percentage >= 25) return 'bg-gradient-to-r from-orange-500 to-red-500';
    return 'bg-gradient-to-r from-red-500 to-pink-600';
  };

  return (
    <div
      ref={boardRef}
      className="kanban-board min-h-screen transition-all duration-500"
    >
      <div className="mb-8 px-4 md:px-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-6">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
                Kanban Board
              </h1>

              <span className={`px-3 py-1 rounded-full text-xs font-semibold
                ${theme === 'dark'
                  ? 'bg-gradient-to-r from-blue-900/30 to-purple-900/30 text-blue-300 border border-blue-800/30'
                  : 'bg-gradient-to-r from-blue-100 to-purple-100 text-blue-700 border border-blue-200'}`}>
                {viewMode === 'board' ? 'Board View' : viewMode === 'list' ? 'List View' : 'Calendar View'}
              </span>
            </div>

            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Drag and drop tasks to organize your workflow
            </p>

            {showQuickStats && stats.totalTasks > 0 && (
              <div className="mt-4 max-w-2xl">
                <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400 mb-2">
                  <span>Overall Progress</span>
                  <span className="font-semibold">{getCompletionPercentage()}%</span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                  <div
                    className={`h-2.5 rounded-full transition-all duration-500 ${getProgressColor(getCompletionPercentage())}`}
                    style={{ width: `${getCompletionPercentage()}%` }}
                  ></div>
                </div>
              </div>
            )}
          </div>

          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <div className="flex items-center gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900 dark:text-white">
                  {stats.totalTasks}
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400">Total</div>
              </div>

              <div className="hidden md:block h-8 w-px bg-gray-300 dark:bg-gray-600"></div>

              <div className="text-center">
                <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                  {stats.completedTasks}
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400">Done</div>
              </div>

              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                  {stats.pendingTasks}
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400">Pending</div>
              </div>
            </div>

            <div className="flex-shrink-0">
              <AddColumnForm onAdd={handleAddColumn} />
            </div>
          </div>
        </div>

        {(searchTerm || filter !== 'all') && (
          <div className={`mb-4 p-3 rounded-lg ${theme === 'dark' ? 'bg-gray-800/50' : 'bg-blue-50'} border ${theme === 'dark' ? 'border-gray-700' : 'border-blue-100'}`}>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <svg className="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="text-sm text-gray-700 dark:text-gray-300">
                  {searchTerm ? `Showing results for "${searchTerm}"` : `Filtered by: ${filter}`}
                </span>
              </div>
              <div className="text-sm text-gray-500 dark:text-gray-400">
                Found {filteredColumns.reduce((acc, col) => acc + col.tasks.length, 0)} tasks
              </div>
            </div>
          </div>
        )}
      </div>

      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        measuring={{
          droppable: {
            strategy: MeasuringStrategy.Always,
          },
        }}
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDragEnd={handleDragEnd}
        onDragCancel={handleDragCancel}
      >
        <div
          ref={scrollContainerRef}
          className={`relative px-4 md:px-6 pb-8 ${isDragging ? 'cursor-grabbing' : ''}`}
        >
          <div className="flex flex-col md:flex-row gap-4 md:gap-6 overflow-x-auto pb-6 scrollbar-thin">
            {filteredColumns.length > 0 ? (
              <>
                <SortableContext items={columnIds} strategy={horizontalListSortingStrategy}>
                  {filteredColumns.map((column, index) => (
                    <Column
                      key={column.id}
                      column={column}
                      index={index}
                      isDraggingOver={overColumnId === column.id}
                      onDelete={() => handleDeleteColumn(column.id)}
                      onUpdate={(updates) => updateColumn(column.id, updates)}
                    />
                  ))}
                </SortableContext>

                <div className="flex-shrink-0 w-8 md:w-12"></div>
              </>
            ) : showEmptyState ? (
              <div className="w-full flex flex-col items-center justify-center py-16 px-4 text-center">
                <div className={`w-32 h-32 mb-6 ${theme === 'dark' ? 'text-gray-700' : 'text-gray-300'}`}>
                  <svg className="w-full h-full" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1"
                      d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-gray-700 dark:text-gray-300 mb-3">
                  Welcome to Kanban Board!
                </h3>
                <p className="text-gray-500 dark:text-gray-400 mb-8 max-w-md">
                  Get started by creating your first column to organize your tasks.
                  You can add tasks, drag and drop them between columns, and track your progress.
                </p>
                <div className="flex flex-col sm:flex-row gap-3">
                  <AddColumnForm onAdd={handleAddColumn} />
                  <button
                    onClick={() => {
                      addColumn('To Do');
                      addColumn('In Progress');
                      addColumn('Done');
                    }}
                    className="px-4 py-2 border border-gray-300 dark:border-gray-600 
                             text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 
                             dark:hover:bg-gray-800 transition-colors font-medium"
                  >
                    Add Sample Columns
                  </button>
                </div>
              </div>
            ) : (
              <div className="w-full flex flex-col items-center justify-center py-16 px-4 text-center">
                <div className={`w-24 h-24 mb-6 ${theme === 'dark' ? 'text-gray-700' : 'text-gray-300'}`}>
                  <svg className="w-full h-full" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1"
                      d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  No tasks found
                </h3>
                <p className="text-gray-500 dark:text-gray-400 mb-6 max-w-sm">
                  {searchTerm
                    ? `No tasks match "${searchTerm}". Try a different search term.`
                    : `No tasks match the selected filter. Try changing the filter.`}
                </p>
                <button
                  onClick={() => {
                    window.location.reload();
                  }}
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 
                           transition-colors font-medium"
                >
                  Clear Filters
                </button>
              </div>
            )}
          </div>

          {filteredColumns.length > 0 && !isDragging && (
            <div className={`fixed bottom-6 left-1/2 transform -translate-x-1/2 px-4 py-2 
                          rounded-full ${theme === 'dark' ? 'bg-gray-800/90' : 'bg-white/90'} 
                          border ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'} 
                          shadow-lg backdrop-blur-sm text-sm text-gray-600 dark:text-gray-300 
                          flex items-center gap-2 z-30 transition-opacity duration-300`}>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                  d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
              </svg>
              Drag and drop tasks between columns
            </div>
          )}
        </div>

        <DragOverlay dropAnimation={null}>
          {activeId && activeType === 'task' && activeData?.task ? (
            <div className="transform rotate-3 shadow-2xl opacity-95">
              <Task
                task={activeData.task}
                columnId={activeData.columnId}
                isDragging={true}
              />
            </div>
          ) : activeId && activeType === 'column' && activeData?.column ? (
            <div className="transform rotate-1 shadow-2xl opacity-90">
              <div className={`w-80 rounded-xl p-4 ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} 
                            border ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'} 
                            shadow-lg`}>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center
                      ${activeData.column.color === 'blue' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300' :
                        activeData.column.color === 'green' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300' :
                          activeData.column.color === 'yellow' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300' :
                            'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300'}`}>
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                          d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                      </svg>
                    </div>
                    <h3 className="font-semibold text-gray-900 dark:text-white">
                      {activeData.column.title}
                    </h3>
                  </div>
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  {activeData.column.tasks.length} tasks
                </div>
              </div>
            </div>
          ) : null}
        </DragOverlay>
      </DndContext>

      {showQuickStats && stats.totalTasks > 0 && (
        <div className={`mt-8 mx-4 md:mx-6 p-6 rounded-xl border transition-all duration-500
          ${theme === 'dark'
            ? 'bg-gradient-to-br from-gray-800/50 to-gray-900/50 border-gray-700'
            : 'bg-gradient-to-br from-white to-gray-50 border-gray-200'}`}>
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Project Statistics
            </h3>
            <button
              onClick={() => setShowQuickStats(!showQuickStats)}
              className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 
                       dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 
                       rounded-lg transition-colors"
              title={showQuickStats ? "Hide statistics" : "Show statistics"}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                  d={showQuickStats ? "M5 15l7-7 7 7" : "M19 9l-7 7-7-7"} />
              </svg>
            </button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <div className={`p-4 rounded-lg border transition-all duration-300 hover:scale-[1.02]
              ${theme === 'dark'
                ? 'bg-gray-800/30 border-gray-700'
                : 'bg-white border-gray-200'}`}>
              <div className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
                {stats.totalColumns}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Columns</div>
            </div>

            <div className={`p-4 rounded-lg border transition-all duration-300 hover:scale-[1.02]
              ${theme === 'dark'
                ? 'bg-gray-800/30 border-gray-700'
                : 'bg-white border-gray-200'}`}>
              <div className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
                {stats.totalTasks}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Total Tasks</div>
            </div>

            <div className={`p-4 rounded-lg border transition-all duration-300 hover:scale-[1.02]
              ${theme === 'dark'
                ? 'bg-gray-800/30 border-gray-700'
                : 'bg-white border-gray-200'}`}>
              <div className="text-2xl font-bold text-green-600 dark:text-green-400 mb-1">
                {stats.completedTasks}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Completed</div>
            </div>

            <div className={`p-4 rounded-lg border transition-all duration-300 hover:scale-[1.02]
              ${theme === 'dark'
                ? 'bg-gray-800/30 border-gray-700'
                : 'bg-white border-gray-200'}`}>
              <div className="text-2xl font-bold text-blue-600 dark:text-blue-400 mb-1">
                {stats.pendingTasks}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Pending</div>
            </div>

            <div className={`p-4 rounded-lg border transition-all duration-300 hover:scale-[1.02]
              ${theme === 'dark'
                ? 'bg-gray-800/30 border-gray-700'
                : 'bg-white border-gray-200'}`}>
              <div className="text-2xl font-bold text-purple-600 dark:text-purple-400 mb-1">
                {stats.completionRate}%
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Completion</div>
            </div>
          </div>

          {Object.values(stats.priorityStats).some(count => count > 0) && (
            <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
              <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-4">
                Tasks by Priority
              </h4>
              <div className="grid grid-cols-3 gap-3">
                <div className={`p-3 rounded-lg border ${theme === 'dark' ? 'border-red-800/30' : 'border-red-200'} 
                              ${theme === 'dark' ? 'bg-red-900/10' : 'bg-red-50'}`}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium text-red-700 dark:text-red-300">High</span>
                    <div className="w-2 h-2 rounded-full bg-red-500"></div>
                  </div>
                  <div className="text-xl font-bold text-red-600 dark:text-red-400">
                    {stats.priorityStats.high}
                  </div>
                </div>

                <div className={`p-3 rounded-lg border ${theme === 'dark' ? 'border-yellow-800/30' : 'border-yellow-200'} 
                              ${theme === 'dark' ? 'bg-yellow-900/10' : 'bg-yellow-50'}`}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium text-yellow-700 dark:text-yellow-300">Medium</span>
                    <div className="w-2 h-2 rounded-full bg-yellow-500"></div>
                  </div>
                  <div className="text-xl font-bold text-yellow-600 dark:text-yellow-400">
                    {stats.priorityStats.medium}
                  </div>
                </div>

                <div className={`p-3 rounded-lg border ${theme === 'dark' ? 'border-green-800/30' : 'border-green-200'} 
                              ${theme === 'dark' ? 'bg-green-900/10' : 'bg-green-50'}`}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium text-green-700 dark:text-green-300">Low</span>
                    <div className="w-2 h-2 rounded-full bg-green-500"></div>
                  </div>
                  <div className="text-xl font-bold text-green-600 dark:text-green-400">
                    {stats.priorityStats.low}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      <div className="mt-8 px-4 md:px-6 pb-8">
        <div className={`text-center text-sm text-gray-500 dark:text-gray-400 
                      ${theme === 'dark' ? 'bg-gray-800/30' : 'bg-gray-50'} 
                      p-4 rounded-lg border ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'}`}>
          <div className="flex flex-wrap justify-center gap-6">
            <div className="flex items-center gap-2">
              <kbd className={`px-2 py-1 text-xs rounded ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-200'} 
                           ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                Drag
              </kbd>
              <span>Move tasks</span>
            </div>
            <div className="flex items-center gap-2">
              <kbd className={`px-2 py-1 text-xs rounded ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-200'} 
                           ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                Click
              </kbd>
              <span>View details</span>
            </div>
            <div className="flex items-center gap-2">
              <kbd className={`px-2 py-1 text-xs rounded ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-200'} 
                           ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                Double-click
              </kbd>
              <span>Edit task</span>
            </div>
          </div>
        </div>
      </div>

      {theme === 'dark' && (
        <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden">
          <div className="absolute inset-0 star-effect opacity-30"></div>

          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-900/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-900/10 rounded-full blur-3xl"></div>
        </div>
      )}

      {theme === 'light' && (
        <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden">
          <div className="absolute top-1/3 right-1/3 w-96 h-96 bg-blue-100/30 rounded-full blur-3xl"></div>
          <div className="absolute bottom-1/3 left-1/3 w-96 h-96 bg-purple-100/30 rounded-full blur-3xl"></div>
        </div>
      )}
    </div>
  );
};

export default KanbanBoard;