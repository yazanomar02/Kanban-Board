export const COLUMN_COLORS = [
    { name: 'Blue', value: 'blue', bg: 'bg-blue-50', border: 'border-blue-200', text: 'text-blue-800' },
    { name: 'Green', value: 'green', bg: 'bg-green-50', border: 'border-green-200', text: 'text-green-800' },
    { name: 'Yellow', value: 'yellow', bg: 'bg-yellow-50', border: 'border-yellow-200', text: 'text-yellow-800' },
    { name: 'Red', value: 'red', bg: 'bg-red-50', border: 'border-red-200', text: 'text-red-800' },
    { name: 'Purple', value: 'purple', bg: 'bg-purple-50', border: 'border-purple-200', text: 'text-purple-800' },
    { name: 'Pink', value: 'pink', bg: 'bg-pink-50', border: 'border-pink-200', text: 'text-pink-800' },
    { name: 'Indigo', value: 'indigo', bg: 'bg-indigo-50', border: 'border-indigo-200', text: 'text-indigo-800' },
    { name: 'Gray', value: 'gray', bg: 'bg-gray-50', border: 'border-gray-200', text: 'text-gray-800' },
];

export const TASK_PRIORITIES = [
    { value: 'low', label: 'Low', color: 'green', icon: '✓' },
    { value: 'medium', label: 'Medium', color: 'yellow', icon: '⚠' },
    { value: 'high', label: 'High', color: 'red', icon: '❗' },
];

export const TASK_STATUS = [
    { value: 'pending', label: 'Pending', color: 'yellow' },
    { value: 'in-progress', label: 'In Progress', color: 'blue' },
    { value: 'completed', label: 'Completed', color: 'green' },
    { value: 'blocked', label: 'Blocked', color: 'red' },
];

export const DEFAULT_COLUMNS = [
    { id: 'backlog', title: 'Backlog', color: 'gray' },
    { id: 'todo', title: 'To Do', color: 'blue' },
    { id: 'in-progress', title: 'In Progress', color: 'yellow' },
    { id: 'review', title: 'Review', color: 'purple' },
    { id: 'done', title: 'Done', color: 'green' },
];

export const TAG_COLORS = [
    'blue', 'green', 'yellow', 'red', 'purple', 'pink', 'indigo', 'gray'
];

export const FILTER_OPTIONS = [
    { value: 'all', label: 'All Tasks' },
    { value: 'pending', label: 'Pending' },
    { value: 'completed', label: 'Completed' },
    { value: 'high', label: 'High Priority' },
    { value: 'medium', label: 'Medium Priority' },
    { value: 'low', label: 'Low Priority' },
    { value: 'today', label: 'Due Today' },
    { value: 'week', label: 'Due This Week' },
    { value: 'overdue', label: 'Overdue' },
];

export const STORAGE_KEYS = {
    KANBAN_DATA: 'kanban-board-data',
    USER_SETTINGS: 'kanban-user-settings',
    RECENT_SEARCHES: 'kanban-recent-searches',
    FAVORITES: 'kanban-favorites',
};

export const ALERT_MESSAGES = {
    TASK_ADDED: 'Task added successfully!',
    TASK_UPDATED: 'Task updated successfully!',
    TASK_DELETED: 'Task deleted successfully!',
    COLUMN_ADDED: 'Column added successfully!',
    COLUMN_DELETED: 'Column deleted successfully!',
    DATA_SAVED: 'Data saved successfully!',
    DATA_LOADED: 'Data loaded successfully!',
    DATA_EXPORTED: 'Data exported successfully!',
    DATA_IMPORTED: 'Data imported successfully!',
    DATA_RESET: 'All data has been reset!',
    CONFIRM_DELETE: 'Are you sure you want to delete this item?',
    CONFIRM_RESET: 'Are you sure you want to reset all data? This action cannot be undone.',
};

export const BREAKPOINTS = {
    SM: 640,
    MD: 768,
    LG: 1024,
    XL: 1280,
    XXL: 1536,
};

export const TIMINGS = {
    AUTO_SAVE_DELAY: 1000,
    NOTIFICATION_DURATION: 3000,
    ANIMATION_DURATION: 300,
    DEBOUNCE_DELAY: 500,
};

export const LIMITS = {
    MAX_TITLE_LENGTH: 100,
    MAX_DESCRIPTION_LENGTH: 1000,
    MAX_TAGS_PER_TASK: 10,
    MAX_COLUMNS: 20,
    MAX_TASKS_PER_COLUMN: 100,
    MAX_TAG_LENGTH: 20,
};

export const APP_VERSION = '1.0.0';
export const DATA_VERSION = '1.0.0';