import React from 'react';

export default function App(): React.JSX.Element {
    const [balls, setBalls] = React.useState(0);

    const WS_URL = "ws://192.168.4.1:4443";
    const socket = new WebSocket(WS_URL);

    socket.addEventListener('open', (event) => {
        console.log('Connected to server');
    });

    socket.addEventListener('message', (event) => {
        console.log('Message from server ', event.data);
        setBalls(parseInt(event.data));
    });




    return (
        <>
            <h1>Balls</h1>
            <h2 id='balls'>{ balls }</h2>

        </>
    );
}
