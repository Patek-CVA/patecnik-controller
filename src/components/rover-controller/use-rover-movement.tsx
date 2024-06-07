import { useEffect } from 'react';
import { WebSocketManager } from '../utils/web-sockets-manager';

type Direction = {
    /** -1 to 1 */
    x: number;
    /** -1 to 1 */
    y: number;
};

const MOVEMENT_KEYS = {
    FORWARD: 'w',
    BACKWARD: 's',
    LEFT: 'a',
    RIGHT: 'd',
};

/**
 * Handles rover movement based on keyboard input.
 * - Sends the movement to the server via websockets.
 */
export const useRoverMovement = (webSocketManager: WebSocketManager) => {
    const pressedKeys = {
        [MOVEMENT_KEYS.FORWARD]: false,
        [MOVEMENT_KEYS.BACKWARD]: false,
        [MOVEMENT_KEYS.LEFT]: false,
        [MOVEMENT_KEYS.RIGHT]: false,
    };

    useEffect(() => {
        window.addEventListener('keydown', (event) => handleKeyPress(event, true));
        window.addEventListener('keyup', (event) => handleKeyPress(event, false));

        return () => {
            window.removeEventListener('keydown', (event) => handleKeyPress(event, true));
            window.removeEventListener('keyup', (event) => handleKeyPress(event, false));
        };
    });

    const handleKeyPress = (event: KeyboardEvent, isKeyDown: boolean) => {
        const isMovementKey = Object.values(MOVEMENT_KEYS).includes(event.key);
        if (!isMovementKey) return;

        const isDirectionChanged = pressedKeys[event.key] !== isKeyDown;
        if (!isDirectionChanged) return;

        pressedKeys[event.key] = isKeyDown;

        const direction = getDirection();
        sendMovement(direction);
    };

    const sendMovement = (direction: Direction) => {
        webSocketManager.sendMessage(JSON.stringify({ endpoint: 'move', direction }));
    };

    const getDirection = (): Direction => {
        const direction = { x: 0, y: 0 };

        if (pressedKeys[MOVEMENT_KEYS.FORWARD]) direction.y += 1;
        if (pressedKeys[MOVEMENT_KEYS.BACKWARD]) direction.y -= 1;
        if (pressedKeys[MOVEMENT_KEYS.LEFT]) direction.x -= 1;
        if (pressedKeys[MOVEMENT_KEYS.RIGHT]) direction.x += 1;

        return direction;
    };
};
