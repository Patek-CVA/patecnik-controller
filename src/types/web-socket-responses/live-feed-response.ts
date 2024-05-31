import { WebSocketResponse } from './web-socket-response';

export type LiveFeedResponse = WebSocketResponse & {
    type: 'live-feed';
    data: {
        image: string;
    };
};
