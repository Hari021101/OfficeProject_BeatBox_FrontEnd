import * as signalR from '@microsoft/signalr';
import { getSignalRUrl } from '../config/api';

class SignalRService {
    constructor() {
        this.connection = null;
        this.isConnecting = false;
    }

    async startConnection() {
        // Prevent multiple connection attempts
        if (this.connection?.state === signalR.HubConnectionState.Connected || this.isConnecting) {
            return;
        }

        this.isConnecting = true;

        try {
            this.connection = new signalR.HubConnectionBuilder()
                .withUrl(getSignalRUrl('/hubs/notifications'), {
                    skipNegotiation: true,
                    transport: signalR.HttpTransportType.WebSockets
                })
                .withAutomaticReconnect()
                .configureLogging(signalR.LogLevel.Warning)
                .build();

            await this.connection.start();
            console.log('⚡ SignalR Connected: Listening for live updates.');
        } catch (err) {
            console.error('SignalR Connection Error:', err);
            // It might fail if backend is off, that's okay, withAutomaticReconnect will handle retries
        } finally {
            this.isConnecting = false;
        }
    }

    on(eventName, callback) {
        if (!this.connection) {
            console.warn('SignalR: Cannot subscribe, connection is null.');
            return;
        }
        this.connection.on(eventName, callback);
    }

    off(eventName, callback) {
        if (!this.connection) return;
        this.connection.off(eventName, callback);
    }
}

const signalrService = new SignalRService();
export default signalrService;
