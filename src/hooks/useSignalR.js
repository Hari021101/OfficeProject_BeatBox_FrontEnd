import { useEffect, useRef } from 'react';
import signalrService from '../services/signalrService';

/**
 * Custom hook to easily subscribe to SignalR events across components.
 * 
 * @param {string} eventName - The name of the event to listen for (e.g. "ReceiveNewOrder")
 * @param {Function} callback - The function to execute when the event fires
 */
export const useSignalR = (eventName, callback) => {
    // We use a ref for the callback so it doesn't trigger endless re-renders
    // if the user passes an inline function without wrapping it in useCallback.
    const savedCallback = useRef();

    useEffect(() => {
        savedCallback.current = callback;
    }, [callback]);

    useEffect(() => {
        const handler = (...args) => {
            if (savedCallback.current) {
                savedCallback.current(...args);
            }
        };

        const initializeSignalR = async () => {
            await signalrService.startConnection();
            signalrService.on(eventName, handler);
        };

        initializeSignalR();

        return () => {
            signalrService.off(eventName, handler);
        };
    }, [eventName]);
};
