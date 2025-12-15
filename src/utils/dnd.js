export const getRelativePosition = (event, container) => {
    if (!container) return { x: 0, y: 0 };

    const rect = container.getBoundingClientRect();
    return {
        x: event.clientX - rect.left,
        y: event.clientY - rect.top,
    };
};

export const getElementUnderMouse = (x, y) => {
    return document.elementFromPoint(x, y);
};

export const isInDropZone = (element, dropZone) => {
    if (!element || !dropZone) return false;

    const elementRect = element.getBoundingClientRect();
    const dropZoneRect = dropZone.getBoundingClientRect();

    return !(
        elementRect.top > dropZoneRect.bottom ||
        elementRect.bottom < dropZoneRect.top ||
        elementRect.left > dropZoneRect.right ||
        elementRect.right < dropZoneRect.left
    );
};

export const createDragImage = (element, x, y) => {
    const dragImage = element.cloneNode(true);
    dragImage.style.position = 'absolute';
    dragImage.style.top = `${y}px`;
    dragImage.style.left = `${x}px`;
    dragImage.style.zIndex = '9999';
    dragImage.style.opacity = '0.8';
    dragImage.style.pointerEvents = 'none';
    dragImage.style.transform = 'rotate(5deg)';
    dragImage.style.boxShadow = '0 10px 40px rgba(0, 0, 0, 0.3)';

    document.body.appendChild(dragImage);
    return dragImage;
};

export const removeDragImage = (dragImage) => {
    if (dragImage && dragImage.parentNode) {
        dragImage.parentNode.removeChild(dragImage);
    }
};

export const getDragData = (event) => {
    try {
        const dataString = event.dataTransfer.getData('application/json');
        return dataString ? JSON.parse(dataString) : null;
    } catch (error) {
        console.error('Error parsing drag data:', error);
        return null;
    }
};

export const setDragData = (event, data) => {
    try {
        event.dataTransfer.setData('application/json', JSON.stringify(data));
    } catch (error) {
        console.error('Error setting drag data:', error);
    }
};

export const calculateNewPosition = (items, draggedIndex, dropIndex) => {
    const newItems = [...items];
    const [draggedItem] = newItems.splice(draggedIndex, 1);
    newItems.splice(dropIndex, 0, draggedItem);
    return newItems;
};

export const parseTransform = (transform) => {
    if (!transform || transform === 'none') return { x: 0, y: 0 };

    const matrix = transform.match(/matrix\(([^)]+)\)/);
    if (matrix) {
        const values = matrix[1].split(', ');
        return {
            x: parseFloat(values[4]) || 0,
            y: parseFloat(values[5]) || 0,
        };
    }

    const translate = transform.match(/translate\(([^)]+)\)/);
    if (translate) {
        const values = translate[1].split(', ');
        return {
            x: parseFloat(values[0]) || 0,
            y: parseFloat(values[1]) || 0,
        };
    }

    return { x: 0, y: 0 };
};

export const createDragEffects = {
    lift: (element) => {
        element.style.transform = 'scale(1.05) rotate(2deg)';
        element.style.boxShadow = '0 20px 60px rgba(0, 0, 0, 0.3)';
        element.style.zIndex = '1000';
    },

    reset: (element) => {
        element.style.transform = '';
        element.style.boxShadow = '';
        element.style.zIndex = '';
    },

    dropZoneActive: (element) => {
        element.style.border = '2px dashed #3B82F6';
        element.style.backgroundColor = 'rgba(59, 130, 246, 0.1)';
    },

    dropZoneInactive: (element) => {
        element.style.border = '';
        element.style.backgroundColor = '';
    },
};

export const checkDragDropSupport = () => {
    const div = document.createElement('div');
    return (
        'draggable' in div ||
        ('ondragstart' in div && 'ondrop' in div)
    );
};

export const initializeDraggable = (element, onDragStart, onDragEnd) => {
    element.draggable = true;

    element.addEventListener('dragstart', onDragStart);
    element.addEventListener('dragend', onDragEnd);

    return () => {
        element.removeEventListener('dragstart', onDragStart);
        element.removeEventListener('dragend', onDragEnd);
    };
};


export const initializeDroppable = (element, onDragOver, onDragEnter, onDragLeave, onDrop) => {
    element.addEventListener('dragover', onDragOver);
    element.addEventListener('dragenter', onDragEnter);
    element.addEventListener('dragleave', onDragLeave);
    element.addEventListener('drop', onDrop);

    return () => {
        element.removeEventListener('dragover', onDragOver);
        element.removeEventListener('dragenter', onDragEnter);
        element.removeEventListener('dragleave', onDragLeave);
        element.removeEventListener('drop', onDrop);
    };
};