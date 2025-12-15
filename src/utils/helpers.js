export const generateId = (prefix = 'id') => {
    const timestamp = Date.now().toString(36);
    const randomStr = Math.random().toString(36).substr(2, 9);
    return `${prefix}-${timestamp}-${randomStr}`;
};


export const formatDate = (date, format = 'medium') => {
    if (!date) return 'N/A';

    const d = new Date(date);

    const formats = {
        short: {
            date: d.toLocaleDateString(),
            time: d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
        medium: {
            date: d.toLocaleDateString('en-US', {
                weekday: 'short',
                year: 'numeric',
                month: 'short',
                day: 'numeric'
            }),
            time: d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
        long: {
            date: d.toLocaleDateString('en-US', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            }),
            time: d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
        },
        relative: (() => {
            const now = new Date();
            const diffMs = now - d;
            const diffMins = Math.round(diffMs / 60000);
            const diffHours = Math.round(diffMs / 3600000);
            const diffDays = Math.round(diffMs / 86400000);

            if (diffMins < 1) return 'Just now';
            if (diffMins < 60) return `${diffMins} minute${diffMins !== 1 ? 's' : ''} ago`;
            if (diffHours < 24) return `${diffHours} hour${diffHours !== 1 ? 's' : ''} ago`;
            if (diffDays < 7) return `${diffDays} day${diffDays !== 1 ? 's' : ''} ago`;
            return d.toLocaleDateString();
        })(),
    };

    if (format === 'relative') {
        return formats.relative;
    }

    return `${formats[format].date} at ${formats[format].time}`;
};

export const truncateText = (text, maxLength = 100) => {
    if (!text) return '';
    if (text.length <= maxLength) return text;

    return text.substr(0, maxLength) + '...';
};

export const capitalize = (str) => {
    if (!str) return '';
    return str.charAt(0).toUpperCase() + str.slice(1);
};

export const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const debounce = (func, wait) => {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
};

export const throttle = (func, limit) => {
    let inThrottle;
    return function () {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
};

export const cleanObject = (obj) => {
    const newObj = {};
    Object.keys(obj).forEach(key => {
        if (obj[key] !== undefined && obj[key] !== null && obj[key] !== '') {
            newObj[key] = obj[key];
        }
    });
    return newObj;
};

export const mergeObjects = (...objects) => {
    return objects.reduce((acc, obj) => {
        return { ...acc, ...cleanObject(obj) };
    }, {});
};

export const calculateProgress = (tasks) => {
    if (!tasks || tasks.length === 0) return 0;

    const completed = tasks.filter(task => task.completed).length;
    return Math.round((completed / tasks.length) * 100);
};

export const getPriorityColor = (priority) => {
    const colors = {
        high: 'red',
        medium: 'yellow',
        low: 'green',
    };
    return colors[priority] || 'gray';
};

export const getPriorityIcon = (priority) => {
    const icons = {
        high: '❗',
        medium: '⚠️',
        low: '✓',
    };
    return icons[priority] || '○';
};

export const isValidEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
};

export const formatBytes = (bytes, decimals = 2) => {
    if (bytes === 0) return '0 Bytes';

    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB'];

    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
};

export const formatNumber = (num) => {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
};

export const getRandomColor = () => {
    const colors = [
        '#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6',
        '#EC4899', '#06B6D4', '#84CC16', '#F97316', '#6366F1'
    ];
    return colors[Math.floor(Math.random() * colors.length)];
};