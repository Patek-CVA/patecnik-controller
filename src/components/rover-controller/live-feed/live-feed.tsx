import React from 'react';
import { AppContext } from '../../app-context';
import './live-feed.scss';

export default function LiveFeed(): React.JSX.Element {
    const { webSocketManager } = React.useContext(AppContext);
    const [liveImage, setLiveImage] = React.useState<string | null>(null);

    webSocketManager.subscribe(['live-feed'], (message) => {
        setLiveImage(message.data.image);
    });

    const liveFeedInner = liveImage ? (
        <img src={liveImage} alt={'Live Feed'} className="live-feed-image" />
    ) : (
        <p className="live-feed-error">Live feed not available</p>
    );

    return <div className="live-feed">{liveFeedInner}</div>;
}
