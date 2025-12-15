import { useState, useEffect } from 'react';

function useLocalStorage(key, initialValue) {
    const [storedValue, setStoredValue] = useState(() => {
        if (typeof window === 'undefined') {
            return initialValue;
        }

        try {
            const item = window.localStorage.getItem(key);
            return item ? JSON.parse(item) : initialValue;
        } catch (error) {
            console.error(`Error reading localStorage key "${key}":`, error);
            return initialValue;
        }
    });

    const setValue = (value) => {
        try {
            const valueToStore = value instanceof Function ? value(storedValue) : value;

            setStoredValue(valueToStore);

            if (typeof window !== 'undefined') {
                window.localStorage.setItem(key, JSON.stringify(valueToStore));
            }
        } catch (error) {
            console.error(`Error setting localStorage key "${key}":`, error);
        }
    };

    useEffect(() => {
        const handleStorageChange = (e) => {
            if (e.key === key && e.newValue) {
                try {
                    const newValue = JSON.parse(e.newValue);
                    if (JSON.stringify(storedValue) !== JSON.stringify(newValue)) {
                        setStoredValue(newValue);
                    }
                } catch (error) {
                    console.error(`Error parsing localStorage change for key "${key}":`, error);
                }
            }
        };

        window.addEventListener('storage', handleStorageChange);
        return () => window.removeEventListener('storage', handleStorageChange);
    }, [key, storedValue]);

    useEffect(() => {
        if (typeof window !== 'undefined') {
            try {
                const currentValue = window.localStorage.getItem(key);
                if (currentValue && JSON.stringify(storedValue) !== currentValue) {
                    window.localStorage.setItem(key, JSON.stringify(storedValue));
                }
            } catch (error) {
                console.error(`Error syncing localStorage key "${key}":`, error);
            }
        }
    }, [key, storedValue]);

    return [storedValue, setValue];
}

export default useLocalStorage;