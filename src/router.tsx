import {HashRouter as Router, Routes, Route} from 'react-router-dom';
import React from 'react';
import App from './components/app';

export default function Page(): React.JSX.Element {
    return (
        <Router>
            <Routes>
                <Route path={'/'} element={<App/>}/>
            </Routes>
        </Router>
    );
}