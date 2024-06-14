import { toast } from 'react-toastify';
import { DEFAULT_TOAST_OPTIONS } from '../../constants';
import { Subscriber } from '../../types/web-socket-manager';
import { WebSocketResponses } from '../../types/web-socket-responses/web-socket-response';

export class WebSocketManager {
    private lastId = 0;
    private subscribers: { [id: number]: Subscriber } = {};
    private socket: WebSocket | null = null;

    constructor(private url: string) {
        this.initialize();
    }

    initialize = () => {
        this.initializeSocket();
    };

    subscribe = (
        endpoints: string[],
        callback: <ResponseType extends WebSocketResponses>(message: ResponseType) => void
    ) => {
        const id = this.lastId++;

        this.subscribers[id] = { endpoints, callback };

        return () => this.unsubscribe(id);
    };

    sendMessage = (message: string) => {
        if (!this.socket) return this.logErrorMessage('Socket not initialized');

        this.socket.send(message);
    };

    private unsubscribe = (id: number) => {
        delete this.subscribers[id];
    };

    private initializeSocket = () => {
        if (this.socket) return this.logErrorMessage('Socket already initialized');

        const ws = new WebSocket(this.url);
        ws.onopen = () => {
            this.socket = ws;
            toast('Initialized connection', { ...DEFAULT_TOAST_OPTIONS, hideProgressBar: true, autoClose: 1000 });
        };
        ws.onmessage = (event) => {
            this.handleMessage(event);
        };
        ws.onclose = () => {
            toast('Connection closed', { ...DEFAULT_TOAST_OPTIONS, type: 'warning' });
            this.socket = null;
        };
    };

    private handleMessage = (event: MessageEvent) => {
        const data = this.tryParseJson(event.data);
        if (!data) return;

        const { endpoint } = data;
        if (!endpoint) return this.logErrorMessage('No endpoint in WS message', data);

        const endpointSubscribers = Object.values(this.subscribers).filter((subscriber) =>
            subscriber.endpoints.includes(endpoint)
        );

        endpointSubscribers.forEach((subscriber) => subscriber.callback(data));
    };

    private tryParseJson = (data: string) => {
        try {
            return JSON.parse(data);
        } catch (error) {
            this.logErrorMessage('Error parsing websocket message JSON', error);
            return null;
        }
    };

    private logErrorMessage = (errorMessage: string, additionalData?: unknown) => {
        console.error(errorMessage, additionalData);
        toast(errorMessage, { ...DEFAULT_TOAST_OPTIONS, type: 'error' });
    };
}
