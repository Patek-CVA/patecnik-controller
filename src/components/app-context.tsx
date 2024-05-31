import React, { useEffect } from 'react';
import { WEBSOCKET_URL } from '../constants';
import { AppContextType } from '../types/app-context';
import { WebSocketManager } from './utils/web-sockets-manager';

export const AppContext = React.createContext<AppContextType>({} as AppContextType);

export default function AppContextProvider({ children }: { children?: JSX.Element }): React.JSX.Element {
    const [appContextValue] = React.useState<AppContextType>({
        webSocketManager: new WebSocketManager(WEBSOCKET_URL),
    });

    useEffect(() => {
        appContextValue.webSocketManager.initialize();
    });

    return <AppContext.Provider value={appContextValue}>{children}</AppContext.Provider>;
}
