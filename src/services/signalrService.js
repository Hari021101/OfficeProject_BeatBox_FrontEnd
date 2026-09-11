import * as signalR from '@microsoft/signalr';
import { getSignalRUrl } from '../config/api';

class SignalRService {
    constructor() {
        this.connection = null;
        this.startPromise = null;
        this.listeners = new Map(); // eventName -> Set(callbacks)
    }

    async startConnection() {
        const token = localStorage.getItem('bb_token');
        if (!token) return;

        // Return existing in-flight start promise if currently connecting
        if (this.startPromise) {
            return this.startPromise;
        }

        // If already connected, do nothing
        if (this.connection && this.connection.state === signalR.HubConnectionState.Connected) {
            return;
        }

        // Build connection if null or disconnected
        if (!this.connection || this.connection.state === signalR.HubConnectionState.Disconnected) {
            this.connection = new signalR.HubConnectionBuilder()
                .withUrl(getSignalRUrl('/hubs/notifications'), {
                    accessTokenFactory: () => localStorage.getItem('bb_token') || ''
                })
                .configureLogging(signalR.LogLevel.Warning)
                .withAutomaticReconnect()
                .build();

            // Register all stored event listeners onto the connection
            for (const [eventName, callbacks] of this.listeners.entries()) {
                callbacks.forEach(cb => {
                    this.connection.on(eventName, cb);
                });
            }
        }

        this.startPromise = (async () => {
            try {
                await this.connection.start();
                console.log('⚡ SignalR Notification Hub Connected');
            } catch (err) {
                if (this.connection?.state !== signalR.HubConnectionState.Connected) {
                    console.error('SignalR Connection Error:', err);
                }
            } finally {
                this.startPromise = null;
            }
        })();

        return this.startPromise;
    }

    async stopConnection() {
        if (this.connection) {
            try {
                await this.connection.stop();
            } catch (e) {
                // ignore stop errors on unmount
            }
            this.connection = null;
        }
    }

    on(eventName, callback) {
        if (!this.listeners.has(eventName)) {
            this.listeners.set(eventName, new Set());
        }
        this.listeners.get(eventName).add(callback);

        if (this.connection) {
            this.connection.on(eventName, callback);
        }
    }

    off(eventName, callback) {
        if (this.listeners.has(eventName)) {
            this.listeners.get(eventName).delete(callback);
        }
        if (this.connection) {
            this.connection.off(eventName, callback);
        }
    }
}

const signalrService = new SignalRService();
export default signalrService;
