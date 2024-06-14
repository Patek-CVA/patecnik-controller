import { ToastOptions } from 'react-toastify';

export const WEBSOCKET_URL = 'ws://localhost:8080';

export const DEFAULT_TOAST_OPTIONS: ToastOptions = {
    position: 'top-center',
    theme: 'colored',
    type: 'info',
    closeOnClick: true,
};
