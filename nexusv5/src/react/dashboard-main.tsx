import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router } from 'react-router';
import App from './tailadmin_layer/App';
import './tailadmin_layer/index.css'; // Import TailAdmin styles

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
    <React.StrictMode>
        {/* TailAdmin App already contains Router, but let's check App.tsx */}
        <App />
    </React.StrictMode>,
);
