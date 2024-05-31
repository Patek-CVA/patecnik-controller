import { WebSocketResponses } from './web-socket-responses/web-socket-response';

export type Subscriber = {
    endpoints: string[];
    callback: <ResponseType extends WebSocketResponses>(data: ResponseType) => void;
};
