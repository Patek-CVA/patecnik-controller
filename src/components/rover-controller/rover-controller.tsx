import React from 'react';
import { AppContext } from '../app-context';
import LiveFeed from './live-feed/live-feed';
import { useRoverMovement } from './use-rover-movement';

export default function RoverController(): React.JSX.Element {
    const { webSocketManager } = React.useContext(AppContext);

    useRoverMovement(webSocketManager);

    return <LiveFeed />;
}
