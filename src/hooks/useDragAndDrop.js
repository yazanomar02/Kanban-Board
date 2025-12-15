import { useState, useRef, useEffect } from 'react';

const useDragAndDrop = (initialData = null) => {
    const [isDragging, setIsDragging] = useState(false);
    const [dragData, setDragData] = useState(initialData);
    const [dropTarget, setDropTarget] = useState(null);
    const dragRef = useRef(null);
    const dropRef = useRef(null);

    const handleDragStart = (e, data) => {
        setIsDragging(true);
        setDragData(data);

        if (e.dataTransfer) {
            e.dataTransfer.effectAllowed = 'move';
            e.dataTransfer.setData('application/json', JSON.stringify(data));

            if (e.target.style) {
                e.target.style.opacity = '0.5';
            }
        }
    };

    const handleDragEnd = (e) => {
        setIsDragging(false);
        setDragData(null);

        if (e.target.style) {
            e.target.style.opacity = '1';
        }
    };

    const handleDragOver = (e) => {
        e.preventDefault();
        if (e.dataTransfer) {
            e.dataTransfer.dropEffect = 'move';
        }

        if (dropRef.current && dropRef.current.style) {
            dropRef.current.style.backgroundColor = 'rgba(59, 130, 246, 0.1)';
        }
    };

    const handleDragEnter = (e) => {
        e.preventDefault();
    };

    const handleDragLeave = (e) => {
        e.preventDefault();
        if (dropRef.current && dropRef.current.style) {
            dropRef.current.style.backgroundColor = '';
        }
    };

    const handleDrop = (e, onDropCallback) => {
        e.preventDefault();
        setIsDragging(false);

        if (dropRef.current && dropRef.current.style) {
            dropRef.current.style.backgroundColor = '';
        }

        let droppedData = null;

        if (e.dataTransfer) {
            const dataString = e.dataTransfer.getData('application/json');
            if (dataString) {
                try {
                    droppedData = JSON.parse(dataString);
                } catch (error) {
                    console.error('Error parsing dropped data:', error);
                }
            }
        }

        if (!droppedData && dragData) {
            droppedData = dragData;
        }

        if (droppedData && onDropCallback) {
            onDropCallback(droppedData, e);
        }

        setDragData(null);
        setDropTarget(null);
    };

    return {
        isDragging,
        dragData,
        dropTarget,
        dragRef,
        dropRef,
        handleDragStart,
        handleDragEnd,
        handleDragOver,
        handleDragEnter,
        handleDragLeave,
        handleDrop,
        setIsDragging,
        setDragData,
        setDropTarget,
    };
};

export default useDragAndDrop;