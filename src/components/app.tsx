import React from 'react';
import AppContextProvider from './app-context';
import RoverController from './rover-controller/rover-controller';

export default function App(): React.JSX.Element {
    return (
        <AppContextProvider>
            <RoverController />
        </AppContextProvider>
    );
}
