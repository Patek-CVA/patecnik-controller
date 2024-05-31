import ReactDOM from 'react-dom/client';
import './index.scss';
import Page from './router';

const root: ReactDOM.Root = ReactDOM.createRoot(
    document.getElementById('root') as HTMLElement
);

root.render(<Page/>);