import { Subscriber } from '../../types/web-socket-manager';
import { WebSocketResponses } from '../../types/web-socket-responses/web-socket-response';

export class WebSocketManager {
    private lastId = 0;
    private subscribers: { [id: number]: Subscriber } = {};
    private socket: WebSocket | null = null;

    constructor(private URL: string) {
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
        if (!this.socket) throw new Error('Socket not initialized');

        this.socket.send(message);
    };

    private unsubscribe = (id: number) => {
        delete this.subscribers[id];
    };

    private initializeSocket = () => {
        if (this.socket) throw new Error('Socket already initialized');

        const ws = new WebSocket(this.URL);
        ws.onopen = () => {
            this.socket = ws;
        };
        ws.onmessage = (event) => {
            this.handleMessage(event);
        };
        ws.onclose = () => {
            this.socket = null;
        };
    };

    private handleMessage = (event: MessageEvent) => {
        const data = this.tryParseJson(event.data);
        if (!data) return;

        const { endpoint } = data;
        if (!endpoint) console.error('No endpoint in message:', data);

        const endpointSubscribers = Object.values(this.subscribers).filter((subscriber) =>
            subscriber.endpoints.includes(endpoint)
        );

        endpointSubscribers.forEach((subscriber) => subscriber.callback(data));
    };

    private tryParseJson = (data: string) => {
        try {
            return JSON.parse(data);
        } catch (error) {
            console.error('Error parsing websocket message JSON:', error);
            return null;
        }
    };
}
