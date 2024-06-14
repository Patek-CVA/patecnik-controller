import React from 'react';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import AppContextProvider from './app-context';
import RoverController from './rover-controller/rover-controller';

export default function App(): React.JSX.Element {
    return (
        <AppContextProvider>
            <>
                <RoverController />
                <ToastContainer />
            </>
        </AppContextProvider>
    );
}
