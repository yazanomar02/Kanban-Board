import { useRef, useCallback } from 'react';

export const useLongPress = (onLongPress, onClick, { delay = 500 } = {}) => {
    const timerRef = useRef(null);
    const isLongPressRef = useRef(false);

    const startPressTimer = useCallback(() => {
        isLongPressRef.current = false;
        timerRef.current = setTimeout(() => {
            isLongPressRef.current = true;
            onLongPress && onLongPress();
        }, delay);
    }, [onLongPress, delay]);

    const handleTouchStart = useCallback(() => {
        startPressTimer();
    }, [startPressTimer]);

    const handleTouchEnd = useCallback((e) => {
        if (timerRef.current) {
            clearTimeout(timerRef.current);
        }

        if (!isLongPressRef.current && onClick) {
            onClick(e);
        }

        isLongPressRef.current = false;
    }, [onClick]);

    const handleTouchMove = useCallback(() => {
        if (timerRef.current) {
            clearTimeout(timerRef.current);
            timerRef.current = null;
        }
    }, []);

    return {
        onTouchStart: handleTouchStart,
        onTouchEnd: handleTouchEnd,
        onTouchMove: handleTouchMove,
    };
};