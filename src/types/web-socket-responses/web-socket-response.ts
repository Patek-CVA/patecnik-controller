import { LiveFeedResponse } from './live-feed-response.js';

export type WebSocketResponses = LiveFeedResponse;

export type WebSocketResponse = {
    type: string;
    data: object;
};
