import React from 'react';
import ReactDOM from 'react-dom/client';
import TestApp from './App';

// We import the main styles to ensure the React app inherits the site's look
// The relative path depends on where this file is served, but imports usually resolve from root in Vite.
// However, since we are in src/react/main.jsx, we might not need to import css if the HTML does it.
// Let's just mount.

console.log('⚛️ React Hybrid Engine Starting...');

const rootElement = document.getElementById('root');
if (rootElement) {
    ReactDOM.createRoot(rootElement).render(
        <React.StrictMode>
            <TestApp />
        </React.StrictMode>
    );
    console.log('✅ React Mounted Successfully');
} else {
    console.error('❌ React Mount Point (#root) not found!');
}
